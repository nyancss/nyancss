import test from 'ava'
import decss from '.'

const pass = (...whatever) => whatever

test('it generates simple components', t => {
  const { Component } = decss(pass, { Component: 'component-class' })
  const [tag, props, children] = Component({ children: 42 })
  t.true(tag === 'div')
  t.deepEqual(props, { className: 'component-class' })
  t.true(children === 42)
})

test('it generates components with bool props', t => {
  const { Component } = decss(pass, {
    Component: 'component-class',
    'Component-disabled': 'component-disabled'
  })
  const defaultArgs = Component({ children: 42 })
  t.deepEqual(defaultArgs, ['div', { className: 'component-class' }, 42])
  const disabledArgs = Component({ children: 42, disabled: true })
  t.deepEqual(disabledArgs, [
    'div',
    { className: 'component-class component-disabled' },
    42
  ])
})

test('it generates components with enum props', t => {
  const { Component } = decss(pass, {
    Component: 'component-class',
    'Component-color-red': 'component-red',
    'Component-color-green': 'component-green'
  })
  const defaultArgs = Component({ children: 42 })
  t.deepEqual(defaultArgs, ['div', { className: 'component-class' }, 42])
  const redArgs = Component({ children: 42, color: 'red' })
  t.deepEqual(redArgs, [
    'div',
    { className: 'component-class component-red' },
    42
  ])
})

test('it allows to override the tag using props', t => {
  const { Component } = decss(pass, {
    Component: 'component-class'
  })
  const args = Component({ tag: 'span', children: 42 })
  t.deepEqual(args, ['span', { className: 'component-class' }, 42])
})

test('it allows to override the default props', t => {
  const { Component } = decss(pass, {
    Component: 'component-class',
    'Component-color-red': 'component-red',
    'Component-color-green': 'component-green',
    'Component-disabled': 'component-disabled'
  }, {
    Component: {tag: 'main', disabled: true, color: 'green'}
  })
  const args = Component({ children: 42 })
  t.deepEqual(args, ['main', { className: 'component-class component-disabled component-green' }, 42])
})

test('it allows to override the tag using default props', t => {
  const { Component } = decss(pass, {
    Component: 'component-class'
  }, {
    Component: {tag: 'span'}
  })
  const args = Component({ children: 42 })
  t.deepEqual(args, ['span', { className: 'component-class' }, 42])
})
