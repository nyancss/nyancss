import { parse as parseCSS } from 'postcss'
import parser from 'postcss-selector-parser'
import { NyanCSSMap } from '../types'

export default function parse(css: string) {
  const root = parseCSS(css)
  return (
    root.nodes &&
    root.nodes.reduce(
      (map, node) => {
        if (node.type === 'rule') {
          extractClasses(node.selector).forEach(className => {
            tryApplyBooleanProp(map, className) ||
              tryApplyEnumProp(map, className) ||
              applyComponent(map, className)
          })
        }
        return map
      },
      {} as NyanCSSMap
    )
  )
}

function extractClasses(selector: string) {
  const classNames: string[] = []
  parser(selectors => {
    selectors.walkClasses(classNode => {
      classNode.value && classNames.push(classNode.value)
    })
  }).processSync(selector)
  return classNames
}

const booleanPropRegEx = /^(\w+)-(\w+)$/

function tryApplyBooleanProp(map: NyanCSSMap, className: string) {
  const booleanPropCaptures = className.match(booleanPropRegEx)
  if (booleanPropCaptures) {
    const [, componentName, propName] = booleanPropCaptures
    applyComponent(map, componentName)

    const prop = map[componentName].props[propName]
    if (!prop) {
      map[componentName].props[propName] = {
        propName,
        type: 'boolean',
        className
      }
    } else if (prop && prop.type === 'enum') {
      prop.values.push(true)
      prop.classNames.true = className
    }
    return true
  }
  return false
}

const enumPropRegEx = /^(\w+)-(\w+)-(\w+)$/

function tryApplyEnumProp(map: NyanCSSMap, className: string) {
  const enumPropCaptures = className.match(enumPropRegEx)
  if (enumPropCaptures) {
    const [, componentName, propName, value] = enumPropCaptures
    applyComponent(map, componentName)

    let prop = map[componentName].props[propName]
    if (!prop) {
      prop = map[componentName].props[propName] = {
        propName,
        type: 'enum',
        values: [],
        classNames: {}
      }
    } else if (prop.type === 'boolean') {
      prop = map[componentName].props[propName] = {
        propName,
        type: 'enum',
        values: [true],
        classNames: {
          true: prop.className
        }
      }
    }

    prop.values.push(value)
    prop.classNames[value] = className
    return true
  }
  return false
}

function applyComponent(map: NyanCSSMap, className: string) {
  map[className] = map[className] || emptyComponent(className)
}

function emptyComponent(className: string) {
  return {
    tag: undefined,
    className,
    props: {}
  }
}
