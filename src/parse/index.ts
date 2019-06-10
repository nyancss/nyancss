import { NyanCSSMap } from '@nyancss/types'
import {
  applyComponent,
  tryApplyBooleanProp,
  tryApplyEnumProp
} from '@nyancss/utils'
import { parse as parseCSS } from 'postcss'
import parser from 'postcss-selector-parser'

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
              applyComponent(map, className, className)
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
