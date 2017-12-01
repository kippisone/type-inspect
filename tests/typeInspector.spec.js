'use strict'

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
        { type: 'async', name: 'Async function', value: eval('(async function () {})') },
        { type: 'async', name: 'Async function', value: eval('(async () => {})') }
      )
    }

    types.forEach((t) => {
      it(`returns type ${t.type} if input is ${t.name}`, () => {
        const ts = new TypeInspector()
        inspect(ts.getType(t.value)).isEql(t.type)
      })
    })
  })

  describe('inspectValue', () => {
    it('inspects a single value of type string', () => {
      const val = 'bla'
      const ts = new TypeInspector()
      inspect(ts.inspectValue(val)).isEql({
        type: 'string',
        subType: 'string',
        value: 'bla'
      })
    })

    it('inspects a single value of type null', () => {
      const val = null
        const ts = new TypeInspector()
      inspect(ts.inspectValue(val)).isEql({
        type: 'object',
        subType: 'null',
        value: null
      })
    })
  })

  describe('inspectObject()', () => {
    it('inspects an object', () => {
      const obj = {
        type: 'object',
        subType: 'object',
        value: {
          foo: 'Foo',
          bar: {
            bla: 123
          }
        }
      }

      const ts = new TypeInspector()
      const inspected = ts.inspectObject(obj)
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
        type: 'object',
        subType: 'object',
        value: {
          foo: 'Foo',
          bar: [
            'Foo',
            123,
            null
          ]
        }
      }

      const ts = new TypeInspector()
      const inspected = ts.inspectObject(obj)
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

  describe('inspectArray()', () => {
    it('inspects an object', () => {
      const arr = [
        'foo',
        123,
        null,
        () => {},
        { bla: 'Blubb' }
      ]

      const ts = new TypeInspector()
      const inspected = ts.inspectArray(arr)
      inspect(inspected).isObject()
      inspect(inspected).hasProps({
        type: 'object',
        subType: 'array',
        value: [
          { type: 'string', subType: 'string', value: 'foo'},
          { type: 'number', subType: 'number', value: 123},
          { type: 'object', subType: 'null', value: null},
          { type: 'function', subType: 'function', value: () => {}},
          { type: 'object', subType: 'object', value: {
            bla: { type: 'string', subType: 'string', value: 'Blubb' }}
          }
        ]
      })
    })
  })

  describe('inspectMap()', () => {
    it('inspects an object', () => {
      const map = new Map()
      map.set('one', 'One')
      map.set('two, 2')
      map.set('three', { num: 'three' })

      const obj = {
        type: 'object',
        subType: 'map',
        size: 3,
        name: 'Map',
        value: map,
      }

      const ts = new TypeInspector()
      const inspected = ts.inspectMap(obj)
      inspect(inspected).isObject()
      inspect(inspected).hasProps({
        type: 'object',
        subType: 'map',
        value: [
          [ 'one', { type: 'string', subType: 'string', value: 'two'} ],
          [ 'two', { type: 'number', subType: 'number', value: 2} ],
          [ 'three', { type: 'object', subType: 'null', value: { num: {
            type: 'number',
            subType: 'number',
            value: 3
          } }} ]
        ]
      })
    })
  })

  describe('inspectSet()', () => {
    it('inspects an object', () => {
      const set = new Set()
      set.add('One')
      set.add('2')
      set.add({ num: 'three' })

      const obj = {
        type: 'object',
        subType: 'set',
        size: 3,
        name: 'Set',
        value: set,
      }

      const ts = new TypeInspector()
      const inspected = ts.inspectMap(obj)
      inspect(inspected).isObject()
      inspect(inspected).hasProps({
        type: 'object',
        subType: 'set',
        value: [
          { type: 'string', subType: 'string', value: 'two'},
          { type: 'number', subType: 'number', value: 2},
          { type: 'object', subType: 'null', value: { num: {
            type: 'number',
            subType: 'number',
            value: 3
          } }}
        ]
      })
    })
  })
})
