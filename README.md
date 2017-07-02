# decss

CSS components

## Syntax


### Basic component 

CSS:
``` css
.Loader {
  background: blue;
  height: 4px;
}
```

React:
``` js
import { Loader } from './style.css'

render () {
  return <Loader />
}
```


### Boolean properties

CSS:
``` css
.Loader-isDisabled {
  opacity: 0.5;
}
```

React:
``` js
import { Loader } from './style.css'

render () {
  return <Loader isDisabled />
}
```

### Enum properties

CSS:
``` css
.Loader-color-green {
  background: green;
}
```

React:
``` js
import { Loader } from './style.css'

render () {
  return <Loader color='green' />
}
```

### Default properties

CSS:
``` css
.Loader, 
.Loader-color-green {
  background: green;
}
```

React (Loder is green by default):
``` js
import { Loader } from './style.css'

render () {
  return <Loader /> 
}
```
