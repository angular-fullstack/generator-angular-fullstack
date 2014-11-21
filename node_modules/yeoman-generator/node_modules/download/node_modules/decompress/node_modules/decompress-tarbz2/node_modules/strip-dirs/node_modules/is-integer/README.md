# is-integer

Polyfill for [ES6 isInteger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger).

# Example
```js
var isInteger = require("is-integer");
isInteger("hello") // -> false
isInteger(4) // -> true
isInteger(4.0) // -> true
isInteger(4.1) // -> false
```

# Installation
```
npm install is-integer
```
