Type Inspeonector
==============

Inspects a ECMAScript object type

```js
import TypeInspect from 'type-inspect'

const inspected = TypeInspect.inspect('foo')

// inspected === {
//   type: 'string',
//   subType: 'string',
//   value: 'foo'
// }


const inspected = TypeInspect.inspect({ bla: 'blubb' })

// inspected === {
//   type: 'object',
//   subType: 'object',
//   value: {
//      bla: {
//        type: 'string',
//        subType: 'string'
//        value: 'blubb'
//      }
//   }
// }


const inspected = TypeInspect.inspect(['one', 2])

// inspected === {
//   type: 'object',
//   subType: 'array',
//   value: [
//     { type: 'string', subType: 'string', value: 'one' },
//     { type: 'number', subType: 'number', value: 2 }
//   ]
// }
```
