const inspect = require('inspect.js')
const TypeInspector = require('../')

const is = require('is-supported')

describe('TypeInspector', () => {
  describe('getType()', () => {
    const types = [
      { type: 'null', name: 'Null', value: null },
      { type: 'undefined', name: 'Undefined', value: undefined },
      { type: 'number', name: '123', value: 123 },
      { type: 'number', name: '-123', value: -123 },
      { type: 'number', name: '0', value: 0 },
      { type: 'string', name: '\'foo\'', value: 'foo' },
      { type: 'string', name: '"foo""', value: "foo" },
      { type: 'string', name: '`foo`', value: `foo` },
      { type: 'object', name: '{}', value: {} },
      { type: 'array', name: '[]', value: [] },
      { type: 'date', name: 'Undefined', value: new Date() },
      { type: 'regexp', name: 'Undefined', value: /foo/ },
      { type: 'map', name: 'Undefined', value: new Map() },
      { type: 'set', name: 'Undefined', value: new Set() },
      { type: 'promise', name: 'Promise', value: new Promise(() => {}) },
      { type: 'function', name: 'Function', value: function () {} },
      { type: 'function', name: 'Function', value: () => {} },
      { type: 'generator', name: 'Generator', value: function * () {} },
      { type: 'class', name: 'Class', value: class {} },
      { type: 'nan', name: 'NaN', value: NaN }
    ]


    if (is.asyncSupported) {
      types.push(
        { type: 'async-function', name: 'Async function', value: eval('(async function () {})') },
        { type: 'async-function', name: 'Async function', value: eval('(async () => {})') }
      )
    }

    types.forEach((t) => {
      it(`returns type ${t.type} if input is ${t.name}`, () => {
        inspect(TypeInspector.getType(t.value)).isEql(t.type)
      })
    })
  })

  describe('inspectValue', () => {
    it('inspects a single value of type string', () => {
      const val = 'bla'
      inspect(TypeInspector.inspectValue(val)).isEql({
        type: 'string',
        subType: 'string',
        value: 'bla'
      })
    })

    it('inspects a single value of type null', () => {
      const val = null
      inspect(TypeInspector.inspectValue(val)).isEql({
        type: 'object',
        subType: 'null',
        value: null
      })
    })
  })

  describe('inspectObject()', () => {
    it('inspects an object', () => {
      const obj = {
        foo: 'Foo',
        bar: {
          bla: 123
        }
      }

      const inspected = TypeInspector.inspectObject(obj)
      inspect(inspected).isObject()
      inspect(inspected).isEql({
        type: 'object',
        subType: 'object',
        value: {
          foo: { type: 'string', subType: 'string', value: 'Foo' },
          bar: { type: 'object', subType: 'object', value: {
            bla: { type: 'number', subType: 'number', value: 123 }
          }}
        }
      })
    })

    it('inspects an object with an array', () => {
      const obj = {
        foo: 'Foo',
        bar: [
          'Foo',
          123,
          null
        ]
      }

      const inspected = TypeInspector.inspectObject(obj)
      inspect(inspected).isObject()
      inspect(inspected).isEql({
        type: 'object',
        subType: 'object',
        value: {
          foo: { type: 'string', subType: 'string', value: 'Foo' },
          bar: { type: 'object', subType: 'array', value: [
            { type: 'string', subType: 'string', value: 'Foo' },
            { type: 'number', subType: 'number', value: 123 },
            { type: 'object', subType: 'null', value: null }
          ]}
        }
      })
    })
  })
})
