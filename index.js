module.exports = decss

function decss (h, style) {
  var blocks = getBlocks(style)

  return Object.keys(blocks).reduce(function (acc, blockName) {
    acc[blockName] = function (props) {
      return h('div', {className: getClass(blocks, blockName, props)}, props.children)
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
      acc[blockClass] = acc[blockClass] || { class: style[blockClass], modifiers: {} }
    }

    return acc
  }, {})
}

function getClass (blocks, blockName, props) {
  var blockClass = blocks[blockName].class
  var modifierClasses = Object.keys(props).reduce(function (acc, propName) {
    var modifier = blocks[blockName].modifiers[propName]
    var propValue = props[propName]
    if (modifier) {
      switch (modifier.type) {
        case 'bool':
          if (propValue) {
            return acc.concat(modifier.class)
          }
          break
        case 'enum':
          return acc.concat(modifier.elements[propValue])
      }
    }
    return acc
  }, [])
  return classesToString([blockClass].concat(modifierClasses))
}

function classesToString (classes) {
  return classes.filter(function (c) { return c }).join(' ')
}
