module.exports = decss

function decss (style) {
  const blocks = getBlocks(style)

  return Object.keys(blocks).reduce((acc, blockName) => {
    acc[blockName] = ({ children, ...props }) => {
      return (
        <div class={getClass(blocks, blockName, props)}>
          {children}
        </div>
      )
    }
    return acc
  }, {})
}

function getBlocks (style) {
  const classes = Object.keys(style)
  return classes.reduce((acc, className) => {
    const isModifier = className.includes('-')
    if (isModifier) {
      const [, blockClass, modifierPart] = className.match(/([^-]+)-(.+)/)
      ensureBlock(blockClass)
      const isEnum = modifierPart.includes('-')

      if (isEnum) {
        const [, propName, element] = modifierPart.match(/^(.+)-(.+)$/)

        acc[blockClass].modifiers[propName] = acc[blockClass].modifiers[
          propName
        ] || {
          type: 'enum',
          elements: {}
        }

        acc[blockClass].modifiers[propName].elements[element] = style[className]
      } else {
        // is bool
        const propName = modifierPart
        acc[blockClass].modifiers[propName] = {
          type: 'bool',
          class: style[className]
        }
      }
    } else {
      ensureBlock()
    }

    function ensureBlock (blockClass = className) {
      acc[blockClass] = acc[blockClass] || { class: style[blockClass], modifiers: {} }
    }

    return acc
  }, {})
}

function getClass (blocks, blockName, props) {
  const blockClass = blocks[blockName].class
  const modifierClasses = Object.keys(props).reduce((acc, propName) => {
    const modifier = blocks[blockName].modifiers[propName]
    const propValue = props[propName]
    if (modifier) {
      switch (modifier.type) {
        case 'bool':
          if (propValue) {
            return acc.concat(modifier.class)
          }
          break
        case 'enum':
          return acc.concat(modifier.elements[propValue])
        default:
          break
      }
    }
    return acc
  }, [])
  return classesToString([blockClass].concat(modifierClasses))
}

function classesToString (classes) {
  return classes.filter(c => c).join(' ')
}
