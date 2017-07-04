module.exports = decss

/**
 * @name decss
 * @summary It generates components using passed CSS modules object.
 *
 * @description
 * The function generates components using passed CSS modules object.
 * It's optionally accepting default props object that allows binding
 * individual props values.
 *
 * @param {Function} h
 * The helper function (e.g. `React.createElement` or Preact's `h`).
 *
 * @param {Object} style
 * The CSS modules object with original (local) class names as keys
 * and unique names as values.
 *
 * @param {Object} [defaultProps]
 * The object with the default props.
 *
 * @returns {Object}
 * The object with component names as keys and components as values.
 *
 * @example
 * import { createElement } from 'react'
 * import style from './style.css'
 * import decss from 'decss'

 * // Basic usage
 * const { Button, Icon } = decss(createElement, style)
 * <Button tag='button' type='button'>
 *   <Icon type='close' />
 *   Close
 * </Button>

 * // Usage with default props
 * const { Button, Icon } = decss(createElement, style, {
 *   Button: {tag: 'button', type: 'button'},
 *   Icon: {type: 'close'}
 * })
 * <Button><Icon />Close</Button>
 */
function decss (h, style, defaultProps) {
  defaultProps = defaultProps || {}
  var blocks = getBlocks(style)

  return Object.keys(blocks).reduce(function (acc, blockName) {
    var component = function (props) {
      var tag = props.tag || (defaultProps[blockName] || {}).tag || 'div'
      return h(
        tag,
        Object.assign(
          { className: getClass(blocks, blockName, props, defaultProps) },
          without(
            props,
            ['tag', 'children'].concat(Object.keys(blocks[blockName].modifiers))
          )
        ),
        props && props.children
      )
    }
    component.displayName = blockName
    acc[blockName] = component
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

function getClass (blocks, blockName, props, defaultProps) {
  defaultProps = defaultProps || {}
  var blockClass = blocks[blockName].class
  var modifiers = blocks[blockName].modifiers

  var modifierClasses = Object.keys(modifiers).reduce(function (
    acc,
    modifierName
  ) {
    var blockDefaultProps = defaultProps[blockName] || {}
    var defaultPropValue = blockDefaultProps[modifierName]
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

function without (obj, excludeKeys) {
  return Object.keys(obj).reduce((acc, currentKey) => {
    if (!excludeKeys.includes(currentKey)) {
      acc[currentKey] = obj[currentKey]
    }
    return acc
  }, {})
}
