'use strict'

const inspect = require('inspect.js')
const TypeInspect = require('../')

const is = require('is-supported')

describe('TypeInspect', () => {
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
        const ts = new TypeInspect()
        inspect(ts.getType(t.value)).isEql(t.type)
      })
    })
  })

  describe('inspectValue', () => {
    it('inspects a single value of type string', () => {
      const val = 'bla'
      const ts = new TypeInspect()
      inspect(ts.inspectValue(val)).isEql({
        type: 'string',
        kind: 'string',
        value: 'bla'
      })
    })

    it('inspects a single value of type null', () => {
      const val = null
        const ts = new TypeInspect()
      inspect(ts.inspectValue(val)).isEql({
        type: 'object',
        kind: 'null',
        value: null
      })
    })
  })

  describe('inspectObject()', () => {
    it('inspects an object', () => {
      const obj = {
        type: 'object',
        kind: 'object',
        value: {
          foo: 'Foo',
          bar: {
            bla: 123
          }
        }
      }

      const ts = new TypeInspect()
      const inspected = ts.inspectObject(obj)
      inspect(inspected).isObject()
      inspect(inspected).isEql({
        type: 'object',
        kind: 'object',
        value: {
          foo: { type: 'string', kind: 'string', value: 'Foo' },
          bar: { type: 'object', kind: 'object', value: {
            bla: { type: 'number', kind: 'number', value: 123 }
          }}
        }
      })
    })

    it('inspects an object with an array', () => {
      const obj = {
        type: 'object',
        kind: 'object',
        value: {
          foo: 'Foo',
          bar: [
            'Foo',
            123,
            null
          ]
        }
      }

      const ts = new TypeInspect()
      const inspected = ts.inspectObject(obj)
      inspect(inspected).isObject()
      inspect(inspected).isEql({
        type: 'object',
        kind: 'object',
        value: {
          foo: { type: 'string', kind: 'string', value: 'Foo' },
          bar: { type: 'object', kind: 'array', value: [
            { type: 'string', kind: 'string', value: 'Foo' },
            { type: 'number', kind: 'number', value: 123 },
            { type: 'object', kind: 'null', value: null }
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

      const ts = new TypeInspect()
      const inspected = ts.inspectArray(arr)
      inspect(inspected).isObject()
      inspect(inspected).hasProps({
        type: 'object',
        kind: 'array',
        value: [
          { type: 'string', kind: 'string', value: 'foo'},
          { type: 'number', kind: 'number', value: 123},
          { type: 'object', kind: 'null', value: null},
          { type: 'function', kind: 'function', value: () => {}},
          { type: 'object', kind: 'object', value: {
            bla: { type: 'string', kind: 'string', value: 'Blubb' }}
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
        kind: 'map',
        size: 3,
        name: 'Map',
        value: map,
      }

      const ts = new TypeInspect()
      const inspected = ts.inspectMap(obj)
      inspect(inspected).isObject()
      inspect(inspected).hasProps({
        type: 'object',
        kind: 'map',
        value: [
          [ 'one', { type: 'string', kind: 'string', value: 'two'} ],
          [ 'two', { type: 'number', kind: 'number', value: 2} ],
          [ 'three', { type: 'object', kind: 'null', value: { num: {
            type: 'number',
            kind: 'number',
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
        kind: 'set',
        size: 3,
        name: 'Set',
        value: set,
      }

      const ts = new TypeInspect()
      const inspected = ts.inspectMap(obj)
      inspect(inspected).isObject()
      inspect(inspected).hasProps({
        type: 'object',
        kind: 'set',
        value: [
          { type: 'string', kind: 'string', value: 'two'},
          { type: 'number', kind: 'number', value: 2},
          { type: 'object', kind: 'null', value: { num: {
            type: 'number',
            kind: 'number',
            value: 3
          } }}
        ]
      })
    })
  })
})
