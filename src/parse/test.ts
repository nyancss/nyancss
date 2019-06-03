import parse from '.'

describe('parseCSS', () => {
  it('parses simple isolated CSS selectors', () => {
    expect(
      parse(`
.Button {
  color: red;
}

.Input {
  color: green;
}
`)
    ).toEqual({
      Button: {
        tag: undefined,
        className: 'Button',
        props: {}
      },

      Input: {
        tag: undefined,
        className: 'Input',
        props: {}
      }
    })
  })

  it('parses "or" CSS selectors', () => {
    expect(
      parse(`
.Button, .Input {
  color: red;
}
`)
    ).toEqual({
      Button: {
        tag: undefined,
        className: 'Button',
        props: {}
      },

      Input: {
        tag: undefined,
        className: 'Input',
        props: {}
      }
    })
  })

  it('parses "and" CSS selectors', () => {
    expect(
      parse(`
.Button.Input {
  color: red;
}
`)
    ).toEqual({
      Button: {
        tag: undefined,
        className: 'Button',
        props: {}
      },

      Input: {
        tag: undefined,
        className: 'Input',
        props: {}
      }
    })
  })

  it('parses modifier selectors', () => {
    expect(
      parse(`
.Button {
  color: red;
}

.Button-active {
  background: red;
  color: white;
}
`)
    ).toEqual({
      Button: {
        tag: undefined,
        className: 'Button',
        props: {
          active: {
            propName: 'active',
            type: 'boolean',
            className: 'Button-active'
          }
        }
      }
    })
  })

  it('does not overwrite props placed before the component definition', () => {
    expect(
      parse(`
.Button-active {
  background: red;
  color: white;
}

.Button {
  color: red;
}
`)
    ).toEqual({
      Button: {
        tag: undefined,
        className: 'Button',
        props: {
          active: {
            propName: 'active',
            type: 'boolean',
            className: 'Button-active'
          }
        }
      }
    })
  })

  it('parses enum selectors', () => {
    expect(
      parse(`
.Text {
  color: black;
}

.Text-color-red {
  color: red;
}

.Text-color-green {
  color: green;
}
`)
    ).toEqual({
      Text: {
        tag: undefined,
        className: 'Text',
        props: {
          color: {
            propName: 'color',
            type: 'enum',
            values: ['red', 'green'],
            classNames: {
              red: 'Text-color-red',
              green: 'Text-color-green'
            }
          }
        }
      }
    })
  })

  it('allows to pass boolean value to enum props', () => {
    expect(
      parse(`
.Spacing-padded {
  padding: 1rem;
}

.Spacing-padded-small {
  padding: .5rem;
}

.Spacing-padded-large {
  padding: 2rem;
}

.Link-active-red {
  color: red;
}

.Link-active-green {
  color: green;
}

.Link-active {
  color: blue;
}
`)
    ).toEqual({
      Spacing: {
        tag: undefined,
        className: 'Spacing',
        props: {
          padded: {
            propName: 'padded',
            type: 'enum',
            values: [true, 'small', 'large'],
            classNames: {
              true: 'Spacing-padded',
              small: 'Spacing-padded-small',
              large: 'Spacing-padded-large'
            }
          }
        }
      },

      Link: {
        tag: undefined,
        className: 'Link',
        props: {
          active: {
            propName: 'active',
            type: 'enum',
            values: ['red', 'green', true],
            classNames: {
              red: 'Link-active-red',
              green: 'Link-active-green',
              true: 'Link-active'
            }
          }
        }
      }
    })
  })
})
