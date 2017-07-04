# decss

**decss** converts [CSS modules] into React/Preact components. Thanks to
simple CSS class naming convention it generates enum and boolean props 
for the component automatically so you can keep your code clean and tidy.

![](https://d3vv6lp55qjaqc.cloudfront.net/items/3K0o2q351y0i0N3R3Q1Y/decss.png)

## Installation

If you want to use decss with **webpack**, install [decss-loader]:

```bash
npm install decss-loader --save-dev
# or
yarn add --dev decss-loader
```

To use the low-level API, or to manage the core library version, install `decss`:

```bash
npm install decss --save
# or
yarn add decss
```

## Configuration

```js
// ...
{
  test: /\.css$/,
  use: [
    'style',
    'decss/react', // 👈 Add loader (use 'decss/preact' for Preact)
    {
      loader: 'css',
      options: {
        modules: true, // 👈 You must enable modules to make it work
        importLoaders: 1,
        localIdentName: '[local]-[hash:base64:5]',
      }
    },
    'postcss'
  ],

  // or if you prefer classic:

  loader: 'style!decss/preact!css?modules&importLoaders=1&localIdentName=[local]-[hash:base64:5]&!postcss'
},
// ...
```

## Usage

See [low-level API docs](https://github.com/kossnocorp/decss/blob/master/index.js) for more implementation details.

### React

```javascript
import React from 'react'
import { Button } from './style.css'

function PanicButton ({ alreadyPanicking }) {
  return (
    <Button tag='button' color='red' disabled={alreadyPanicking}>
      Panic
    </Button>
  )
}
```

### Preact

```javascript
import { h } from 'preact'
import { Button } from './style.css'

function PanicButton ({ alreadyPanicking }) {
  return (
    <Button tag='button' color='red' disabled={alreadyPanicking}>
      Panic
    </Button>
  )
}
```

## Convention

### Component (`.Component`)

`.Component` is a component 🤡 The name must be in class-case, e.g. `.FormInput`, `.UI`.

In this example, `.Button` represents `<Button />`.

```css
.Button {
  color: white;
}
```

### Boolean Prop (`.Component-propName`)

`.*-disabled` is a boolean prop.

```css
.Button-disabled {
  opacity: .5;
}
```

In the example, `.Button-disabled` is applied to the component when its `disabled` prop is truthy:

```javascript
<Button disabled>
  Whatever
</Button>
```

### Enum Prop (`.Component-propName-option`)

`.*-color-gray` is an enum prop.

```css
.Button-color-red {
  background: red;
}

.Button-color-green {
  background: green;
}
```

`.Button-color-red` is applied to the component when its `color` prop equals `"red"`:

```jsx
<Button color='red'>
  Click Me
</Button>
```

### Setting Default Value

To set the default value to certain enum option, use good ol' CSS:

```css
.Button,
.Button-color-green {
  background: green;
}
```

## Related

- [styled-components]: source of inspiration.
- [React CSS components]: similar project.
- [decss-loader]: decss webpack loader source code.

## License

[MIT © Sasha Koss](https://kossnocorp.mit-license.org/)

[styled-components]: https://www.styled-components.com/
[CSS Modules]: https://github.com/css-modules/css-modules
[React CSS components]: https://github.com/andreypopp/react-css-components
[desvg]: https://github.com/kossnocorp/desvg
[desvg-loader]: https://github.com/kossnocorp/desvg
[decss-loader]: https://github.com/kossnocorp/decss-loader
