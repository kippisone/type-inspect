TypeInspect
===========

Inspects a Javascript type and returns informations about the type

```js
import TypeInspect from 'type-inspect'

const inspected = TypeInspect.inspect('foo')

// inspected === {
//   type: 'string',
//   kind: 'string',
//   value: 'foo'
// }


const inspected = TypeInspect.inspect({ bla: 'blubb' })

// inspected === {
//   type: 'object',
//   kind: 'object',
//   value: {
//      bla: {
//        type: 'string',
//        kind: 'string'
//        value: 'blubb'
//      }
//   }
// }


const inspected = TypeInspect.inspect(['one', 2])

// inspected === {
//   type: 'object',
//   kind: 'array',
//   value: [
//     { type: 'string', kind: 'string', value: 'one' },
//     { type: 'number', kind: 'number', value: 2 }
//   ]
// }
```
