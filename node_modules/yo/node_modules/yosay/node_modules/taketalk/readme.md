# taketalk
> ever wanted a bin for your node module?

## Installation & Usage
```sh
$ npm install --save taketalk
```

```js
#!/usr/bin/env node

require('taketalk')({
  init: function (input, options) {
    console.log('This is the input from the CLI:', input);
    console.log('These are the options passed:', options);
  },

  help: 'Help yaself!' || function () {
    console.log('Print this when a user wants help.');
  },

  version: '0.1.1' || function () {
    console.log('Print this when a user asks for the version.');
  }
});
```

## License
[MIT](http://opensource.org/licenses/MIT) © Stephen Sawchuk
