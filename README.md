# 🌈 Nyan CSS

**Best of both worlds**. Nyan CSS lets you write plain CSS while riping
benifits of CSS-in-JS.

**Write universal design system**. You can reuse the same code anywhere starting
from static HTML+CSS and ending with React and Vue.js without actually
changing the CSS.

**Minimalistic**. BEM-inspired Nyan CSS convention consists just of 3 rules but
it as bulletproof as BEM.

**Use modern CSS**. CoffeeScript has gone from the radars yet we all loved it.
Stick to the platform to ensure the longevity of your code.

[**Jump to How to install**](#how-to-install)

## Demo

### CSS

```css
.Header,
.Text {
  font-family: monospace;
}

.Header {
  font-size: 2rem;
}

.Header-size-large {
  font-size: 2.2rem;
}

.Text-italic {
  font-style: italic;
}
```

### React code

See other options:

- [Plain HTML](#plain-html)
- [Vue.js](#vuejs)
- [Preact](#preact)
- [Classnames](#Classnames)

```jsx
import React from 'react'
import { Header, Text } from './style.css'

function Announcement() {
  return (
    <>
      <Header tag="h1" size="large">
        Welcome Nyan CSS!
      </Header>
      <Text tag="marquee" italic>
        Please, welcome Nyan CSS!
      </Text>
    </>
  )
}
```

### Result

![A page in a browser with large "Welcome Nyan CSS" and moving italic "Please, welcome Nyan CSS!"](./docs/demo.gif)

### Other options

#### Plain HTML

```html
<h1 class="Header Header-size-large">
  Welcome Nyan CSS!
</h1>

<marquee class="Text Text-italic">
  Please, welcome Nyan CSS!
</marquee>
```

#### Vue.js

```js
import Vue from 'vue'
import { Header, Text } from './style.css'

const Announcement = {
  components: {
    'custom-header': Header,
    'custom-text': Text
  },

  template: `
    <main>
      <custom-header tag='h1' size='large'>Welcome Nyan CSS!!</custom-header>
      <custom-text tag='marquee' italic='true'>Please, welcome Nyan CSS!</custom-text>
    </main>
  `
}
```

#### Preact

```jsx
import { h } from 'preact'
import { Header, Text } from './style.css'

function Announcement() {
  return (
    <>
      <Header tag="h1" size="large">
        Welcome Nyan CSS!
      </Header>
      <Text tag="marquee" italic>
        Please, welcome Nyan CSS!
      </Text>
    </>
  )
}
```

#### Classnames

```js
import { Header, Text } from './style.css'

function Announcement() {
  return `
<h1 class='${Header({ size: 'large' })}'>Welcome Nyan CSS!</h1>
<marquee class='${Text({
    italic: true
  })}'>Please, welcome Nyan CSS!</marquee>
`
}
```

## How to install

You don't need to install anything if you use plain HTML, but if want to use
Nyan CSS with React or say Vue.js you need a loader for your bundler.
At the moment only wepack is supported but Rollup is in progress.

### Installing with React/Preact

### Installing with Vue.js

### Installing with Classnames
