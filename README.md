TypeInspect
===========

The TypeInspect module returns information about the data type of a Javascript object. It inspects any supported datatype and returns an object with the `type`, which is a typeof call, `kind` the real data type and the `value`.

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



##### Supported datatypes:

| Input       | Type      | Kind      | Description                      |
| ----------- | --------- | --------- | -------------------------------- |
| `undefined` | undefined | undefined | Javascripts `undefined` property |
| `null`      | object    | null      | Javascripts `null` object        |
| `number`    | number    | number    | Number object                    |
| `NaN`       | number    | nan       | NaN object                       |
| `string`    | string    | string    | String object                    |
| `boolean`   | boolean   | boolean   | Boolean object                   |
| `object`    | object    | object    | Object object                    |
| `regexp`    | object    | regexp    | Reguler expression object        |
| `array`     | object    | array     | Array Object                     |
| `date`      | object    | date      | Date object                      |
| `map`       | object    | map       | Map object                       |
| `set`       | object    | set       | Set object                       |
| `promise`   | object    | promise   | Promise object                   |
| `function`  | function  | function  | Function Object                  |
| `generator` | function  | generator | Generator function object        |
| `async`     | function  | async     | Async function object            |
| `class`     | function  | class     | Class object                     |


## Methods

### diff(*any* left, *any* right)

The diff method goes recursive through two input values and calculetes the difference. It returns an instance of **TypeDiff**

```js
const left = {
  bla: 'Bla',
  blub: 'Blubb',
  blob: undefined
}

const right = {
  bla: 'Bla',
  blub: 'Blobb',
  blab: null
}

const diff = TypeInspect.diff(left, right)
diff.print()
```

## TypeDiff object

### Properties

** *obj* diffResult**

Holds the diff result.

```js
{
  type: 'object',
  kind: 'object',
  values:
    [{
      type: 'string',
      kind: 'string',
      value: 'Bla',
      key: 'bla'
    }, {
      type: 'string',
      kind: 'string',
      valueAdded: 'Blubb',
      valueRemoved: 'Blobb',
      key: 'blub'
    }, {
      type: 'undefined',
      typeAdded: 'undefined',
      kind: 'undefined',
      kindAdded: 'undefined',
      value: undefined,
      key: 'blob',
      keyAdded: 'blob'
    }, {
      type: 'object',
      typeRemoved: 'object',
      kind: 'null',
      kindRemoved: 'null',
      valueAdded: undefined,
      valueRemoved: null,
      key: 'blab',
      keyRemoved: 'blab'
    }]
  }
```

### Methods

**diff(*any* left, *any* right)**

Compares two datatypes and returns a TypeDiff instance.

**print([*bool* printColors])**

Print diff result.

**parse([*bool* printColors])**

Parse a diff result and returns value as string.
