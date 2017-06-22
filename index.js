module.exports = decss

function decss (h, style, options) {
  options = options || {}
  var blocks = getBlocks(style)

  return Object.keys(blocks).reduce(function (acc, blockName) {
    acc[blockName] = function (props) {
      const tag = (options[blockName] || {}).tag || 'div'
      return h(
        tag,
        { className: getClass(blocks, blockName, props, options) },
        props && props.children
      )
    }
    return acc
  }, {})
}

function getBlocks (style) {
  var classes = Object.keys(style)
  return classes.reduce(function (acc, className) {
    var isModifier = className.includes('-')
    if (isModifier) {
      var classNameCaptures = className.match(/([^-]+)-(.+)/)
      var blockClass = classNameCaptures[1]
      var modifierPart = classNameCaptures[2]
      ensureBlock(blockClass)
      var isEnum = modifierPart.includes('-')

      if (isEnum) {
        var modifierCaptures = modifierPart.match(/^(.+)-(.+)$/)
        var propName = modifierCaptures[1]
        var element = modifierCaptures[2]

        acc[blockClass].modifiers[propName] = acc[blockClass].modifiers[
          propName
        ] || {
          type: 'enum',
          elements: {}
        }

        acc[blockClass].modifiers[propName].elements[element] = style[className]
      } else {
        // is bool
        var propName = modifierPart
        acc[blockClass].modifiers[propName] = {
          type: 'bool',
          class: style[className]
        }
      }
    } else {
      ensureBlock()
    }

    function ensureBlock (blockClass = className) {
      acc[blockClass] = acc[blockClass] || {
        class: style[blockClass],
        modifiers: {}
      }
    }

    return acc
  }, {})
}

function getClass (blocks, blockName, props, options) {
  options = options || {}
  var blockClass = blocks[blockName].class
  var modifiers = blocks[blockName].modifiers

  var modifierClasses = Object.keys(modifiers).reduce(function (acc, modifierName) {
    var blockOptions = options[blockName] || {}
    var defaultPropValue = blockOptions.props && blockOptions.props[modifierName]
    var modifier = blocks[blockName].modifiers[modifierName]
    var propValue = props[modifierName]
    if (modifier) {
      switch (modifier.type) {
        case 'bool':
          if (typeof propValue === 'boolean' ? propValue : defaultPropValue) {
            return acc.concat(modifier.class)
          }
          break
        case 'enum':
          return acc.concat(modifier.elements[propValue || defaultPropValue])
      }
    }
    return acc
  }, [])

  return classesToString([blockClass].concat(modifierClasses))
}

function classesToString (classes) {
  return classes
    .filter(function (c) {
      return c
    })
    .sort()
    .join(' ')
}
