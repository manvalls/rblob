# RBlob [![Build Status][ci-img]][ci-url] [![Coverage Status][cover-img]][cover-url]

## Sample usage

```javascript
var b = new RBlob(new Blob([new Uint8Array([0,1,2,3,4,5,6,7,8])]));

b.read(0,3).then(arr => console.log(arr)); // [0,1,2]
b.read().then(arr => console.log(arr)); // [0,1,2,3,4,5,6,7,8]

```

[ci-img]: https://circleci.com/gh/manvalls/rblob.svg?style=shield
[ci-url]: https://circleci.com/gh/manvalls/rblob
[cover-img]: https://coveralls.io/repos/manvalls/rblob/badge.svg?branch=master&service=github
[cover-url]: https://coveralls.io/github/manvalls/rblob?branch=master
