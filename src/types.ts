type NyanCSSPropsType = 'enum' | 'boolean'

export type NyanCSSBooleanProp = {
  propName: string
  type: 'boolean'
  className: string
}

export type NyanCSSEnumProp = {
  propName: string
  type: 'enum'
  values: (string | true)[]
  classNames: { [value: string]: string } & { true?: string }
}

export type NyanCSSProp = NyanCSSBooleanProp | NyanCSSEnumProp

export type NyanCSSComponent = {
  tag: string | undefined
  className: string
  props: {
    [propName: string]: NyanCSSProp
  }
}

export type NyanCSSMap = {
  [componentName: string]: NyanCSSComponent
}

export type NyanCSSParseResult = {
  map: NyanCSSMap
}
