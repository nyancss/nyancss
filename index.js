module.exports = decss

/**
 * @name decss
 * @summary Generate components using passed CSS modules object.
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
  var components = getComponents(style)

  return Object.keys(components).reduce(function (acc, componentName) {
    acc[componentName] = createComponent(
      h,
      components[componentName],
      componentName,
      defaultProps[componentName] || {}
    )
    return acc
  }, {})
}

function createComponent (h, componentObj, componentName, defaultProps) {
  var component = function (props) {
    var tag = props.tag || defaultProps.tag || 'div'
    var className = getClassName(
      componentObj.class,
      componentObj.modifiers,
      Object.assign({}, props, defaultProps)
    )
    var tagProps = without(
      props,
      ['tag', 'children'].concat(Object.keys(componentObj.modifiers))
    )
    var compoundProps = Object.assign({ className: className }, tagProps)
    var helperArgs = [tag, compoundProps].concat(
      (props && props.children) || []
    )
    return h.apply(null, helperArgs)
  }
  component.displayName = componentName
  return component
}

function getComponents (style) {
  var classes = Object.keys(style)
  return classes.reduce(function (acc, className) {
    var isModifier = /-/.test(className)
    if (isModifier) {
      var classNameCaptures = className.match(/([^-]+)-(.+)/)
      var componentClass = classNameCaptures[1]
      var modifierPart = classNameCaptures[2]
      var isEnum = /-/.test(modifierPart)

      ensureComponentMap(componentClass)
      var modifiers = acc[componentClass].modifiers

      if (isEnum) {
        var modifierCaptures = modifierPart.match(/^(.+)-(.+)$/)
        var propName = modifierCaptures[1]
        var element = modifierCaptures[2]
        var modifier = (modifiers[propName] = modifiers[propName] || {
          type: 'enum',
          elements: {}
        })

        modifier.elements[element] = style[className]
      } else {
        // is bool
        var propName = modifierPart
        modifiers[propName] = {
          type: 'bool',
          class: style[className]
        }
      }
    } else {
      ensureComponentMap(className)
    }

    function ensureComponentMap (className) {
      acc[className] = acc[className] || {
        class: style[className],
        modifiers: {}
      }
    }

    return acc
  }, {})
}

function getClassName (componentClass, modifiers, props) {
  var modifierNames = Object.keys(modifiers)
  var modifierClasses = modifierNames.reduce(function (acc, modifierName) {
    var modifier = modifiers[modifierName]
    var propValue = props[modifierName]
    return acc.concat(findModifierClassName(modifier, propValue) || [])
  }, [])
  return classesToString([componentClass].concat(modifierClasses))
}

function findModifierClassName (modifier, propValue) {
  if (modifier) {
    switch (modifier.type) {
      case 'bool':
        if (propValue) {
          return modifier.class
        }
        break
      case 'enum':
        return modifier.elements[propValue]
    }
  }
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
  return Object.keys(obj).reduce(function (acc, currentKey) {
    if (excludeKeys.indexOf(currentKey) === -1) {
      acc[currentKey] = obj[currentKey]
    }
    return acc
  }, {})
}
