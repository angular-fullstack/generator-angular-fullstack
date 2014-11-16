```js
var wrap = require('word-wrap');

var str = 'A project without documentation is like a project that doesn\'t exist. Verb solves this by making it dead simple to generate project documentation, using simple markdown templates, with zero configuration required.';

console.log(wrap(str));
```
Resulting in:

```
  A project without documentation is like a project
  that doesn't exist. Verb solves this by making it
  dead simple to generate project documentation,
  using simple markdown templates, with zero
  configuration required.
```


### width

Type: `Number`

Default: `50`

The width of the text before wrapping to a new line.

Example:

```js
wrap(str, {width: 60})
```

### indent

Type: `String`

Default: `  ` (two spaces)

The string to use at the beginning of each line.

Example:

```js
wrap(str, {indent: '      '})
```

### newline

Type: `String`

Default: `\n`

The string to use at the end of each line.

Example:

```js
wrap(str, {newline: '\n\n'})
```