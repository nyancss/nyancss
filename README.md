# Nyan CSS

**Best of both worlds**. Nyan CSS lets you write plain CSS while riping
benifits of CSS-in-JS.

**Write universal design system**. You can reuse the same code anywhere starting
from static HTML+CSS and ending with React and Vue.js without actually
changing the CSS.

**Minimalistic**. Nyan CSS convention consists just of

**Use modern CSS**. CoffeeScript has gone from the radars yet we all loved it.
Stick to the platform to ensure the longevity of your code.

**See it in action:**

CSS:

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

React:

```js
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

Result:

![A page in a browser with large "Welcome Nyan CSS" and moving italic "Please, welcome Nyan CSS!"](./doc/demo.gif)

## What is Nyan CSS?

Nyan CSS is a class naming convention and family of libraries that

Write plain CSS and get benifits of CSS-in-JS.

**What is Nyan CSS?** It's not a CSS-in-JS solution, but it provides
benifits of CSS-in-JS.

Nyan CSS is a convention that allows writing plain CSS and import it as
React/Preact components (via webpack loader). Unlike CSS-in-JS, you can also use
it in static websites without any changes. It also doesn't require slowish
runtime or precompilation step.
