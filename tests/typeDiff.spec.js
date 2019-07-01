const inspect = require('inspect.js')
const TypeDiff = require('../').TypeDiff
const typeInspect = require('../').inspect

describe('TypeDiff', () => {
  describe('module', () => {
    it('returns a typeDiff module', () => {
      inspect(TypeDiff).isClass()
    })
  })

  describe('diffItem()', () => {
    let typeDiff

    beforeEach(() => {
      typeDiff = new TypeDiff()
    })

    it('diffs two inspected values', () => {
      const left = typeInspect({
        bla: 'Bla'
      })

      const right = typeInspect({
        bla: 'Blubb'
      })

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        type: 'object',
        kind: 'object',
        values: [
          {
            key: 'bla',
            valueAdded: 'Bla',
            valueRemoved: 'Blubb',
            type: 'string',
            kind: 'string'
          }
        ]
      })
    })

    it('diffs two inspected values with falsy values', () => {
      const left = typeInspect({
        bla: false,
        blub: null
      })

      const right = typeInspect({
        bla: false,
        blub: null
      })

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        type: 'object',
        kind: 'object',
        values: [
          {
            key: 'bla',
            value: false,
            type: 'boolean',
            kind: 'boolean'
          }, {
            key: 'blub',
            value: null,
            type: 'object',
            kind: 'null'
          }
        ]
      })
    })

    it('diffs two objects with different keys', () => {
      const left = typeInspect({
        bla: 'Bal'
      })

      const right = typeInspect({
        blubb: 'Bla'
      })

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        type: 'object',
        kind: 'object',
        values: [
          {
            type: 'string',
            typeAdded: 'string',
            kind: 'string',
            kindAdded: 'string',
            keyAdded: 'bla',
            valueAdded: 'Bal',
          }, {
            type: 'string',
            typeRemoved: 'string',
            kind: 'string',
            kindRemoved: 'string',
            keyRemoved: 'blubb',
            valueRemoved: 'Bla',
          }
        ]
      })
    })

    it('diffs two arrays with different values', () => {
      const left = typeInspect([ 'foo', 'bar', 123 ])
      const right = typeInspect([ 'foo', 'bla', 123 ])

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        type: 'object',
        kind: 'array',
        values: [
          {
            type: 'string',
            kind: 'string',
            value: 'foo'
          }, {
            type: 'string',
            kind: 'string',
            valueAdded: 'bar',
            valueRemoved: 'bla'
          }, {
            type: 'number',
            kind: 'number',
            value: 123
          }
        ]
      })
    })

    it('diffs two different numbers', () => {
      const left = typeInspect(123)
      const right = typeInspect(456)

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        type: 'number',
        kind: 'number',
        valueAdded: 123,
        valueRemoved: 456
      })
    })

    it('diffs left missing number', () => {
      const left = typeInspect(undefined)
      const right = typeInspect(456)

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        type: 'number',
        typeRemoved: 'number',
        kind: 'number',
        kindRemoved: 'number',
        valueRemoved: 456
      })
    })

    it('diffs right missing number', () => {
      const left = typeInspect(123)
      const right = typeInspect(undefined)

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        type: 'number',
        kind: 'number',
        typeAdded: 'number',
        kindAdded: 'number',
        valueAdded: 123,
      })
    })

    it('diffs two different strings', () => {
      const left = typeInspect('Banana')
      const right = typeInspect('Coconut')

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        type: 'string',
        kind: 'string',
        valueAdded: 'Banana',
        valueRemoved: 'Coconut'
      })
    })

    it('diffs two different booleans', () => {
      const left = typeInspect(true)
      const right = typeInspect(false)

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        type: 'boolean',
        kind: 'boolean',
        valueAdded: true,
        valueRemoved: false
      })
    })

    it('diffs left boolean right str', () => {
      const left = typeInspect(true)
      const right = typeInspect('true')

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        typeAdded: 'boolean',
        typeRemoved: 'string',
        kindAdded: 'boolean',
        kindRemoved: 'string',
        valueAdded: true,
        valueRemoved: 'true'
      })
    })

    it('diffs left str right boolean', () => {
      const left = typeInspect('true')
      const right = typeInspect(true)

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        typeAdded: 'string',
        typeRemoved: 'boolean',
        kindAdded: 'string',
        kindRemoved: 'boolean',
        valueAdded: 'true',
        valueRemoved: true
      })
    })

    it('diffs left boolean right str (falsy)', () => {
      const left = typeInspect(false)
      const right = typeInspect('false')

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        typeAdded: 'boolean',
        typeRemoved: 'string',
        kindAdded: 'boolean',
        kindRemoved: 'string',
        valueAdded: false,
        valueRemoved: 'false'
      })
    })

    it('diffs left str right boolean (falsy)', () => {
      const left = typeInspect('false')
      const right = typeInspect(false)

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        typeAdded: 'string',
        typeRemoved: 'boolean',
        kindAdded: 'string',
        kindRemoved: 'boolean',
        valueAdded: 'false',
        valueRemoved: false
      })
    })

    it('diffs left boolean right number', () => {
      const left = typeInspect(true)
      const right = typeInspect(1)

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        typeAdded: 'boolean',
        typeRemoved: 'number',
        kindAdded: 'boolean',
        kindRemoved: 'number',
        valueAdded: true,
        valueRemoved: 1
      })
    })

    it('diffs left number right boolean', () => {
      const left = typeInspect(1)
      const right = typeInspect(true)

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        typeAdded: 'number',
        typeRemoved: 'boolean',
        kindAdded: 'number',
        kindRemoved: 'boolean',
        valueAdded: 1,
        valueRemoved: true
      })
    })

    it('diffs left boolean right number (falsy)', () => {
      const left = typeInspect(false)
      const right = typeInspect(0)

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        typeAdded: 'boolean',
        typeRemoved: 'number',
        kindAdded: 'boolean',
        kindRemoved: 'number',
        valueAdded: false,
        valueRemoved: 0
      })
    })

    it('diffs left number right boolean (falsy)', () => {
      const left = typeInspect(0)
      const right = typeInspect(false)

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        typeAdded: 'number',
        typeRemoved: 'boolean',
        kindAdded: 'number',
        kindRemoved: 'boolean',
        valueAdded: 0,
        valueRemoved: false
      })
    })

    it('diffs two different types', () => {
      const left = typeInspect('Banana')
      const right = typeInspect(123)

      const diff = typeDiff.diffItem(left, right)
      inspect(diff).isEql({
        typeAdded: 'string',
        typeRemoved: 'number',
        kindAdded: 'string',
        kindRemoved: 'number',
        valueAdded: 'Banana',
        valueRemoved: 123
      })
    })
  })

  describe('diff()', () => {
    let typeDiff

    beforeEach(() => {
      typeDiff = new TypeDiff()
    })

    it('diffs 2 objects', () => {
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

      typeDiff.diff(left, right)

      inspect(typeDiff.print).isFunction()
      inspect(typeDiff.diffResult).isObject()
      inspect(typeDiff.parse(false)).isEql('{\n  bla: "Bla",\n  blub: "BlubbBlobb",\n  blob: undefined,\n  blab: undefinednull\n}')
    })

    it('diffs two inspected values', () => {
      const left = {
        bla: 'Bla'
      }

      const right = {
        bla: 'Blubb'
      }

      typeDiff.diff(left, right)
      inspect(typeDiff.diffResult).isEql({
        type: 'object',
        kind: 'object',
        values: [
          {
            key: 'bla',
            valueAdded: 'Bla',
            valueRemoved: 'Blubb',
            type: 'string',
            kind: 'string'
          }
        ]
      })
    })

    it('diffs two inspected values with falsy values', () => {
      const left = {
        bla: false,
        blub: null
      }

      const right = {
        bla: false,
        blub: null
      }

      typeDiff.diff(left, right)
      inspect(typeDiff.diffResult).isEql({
        type: 'object',
        kind: 'object',
        values: [
          {
            key: 'bla',
            value: false,
            type: 'boolean',
            kind: 'boolean'
          }, {
            key: 'blub',
            value: null,
            type: 'object',
            kind: 'null'
          }
        ]
      })
    })

    it('diffs two objects with different keys', () => {
      const left = {
        bla: 'Bal'
      }

      const right = {
        blubb: 'Bla'
      }

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('{\n  bla: "Bal",\n  blubb: "Bla"\n}')
    })

    it('diffs two different numbers', () => {
      const left = 123
      const right = 456

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('123456')
    })

    it('diffs left missing number', () => {
      const left = undefined
      const right = 456

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('456')
    })

    it('diffs right missing number', () => {
      const left = 123
      const right = undefined

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('123')
    })

    it('diffs two different strings', () => {
      const left = 'Banana'
      const right = 'Coconut'

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('"BananaCoconut"')
    })

    it('diffs two different booleans', () => {
      const left = true
      const right = false

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('truefalse')
    })

    it('diffs left boolean right str', () => {
      const left = true
      const right = 'true'

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('(bool) true <> (str) true')
    })

    it('diffs left str right boolean', () => {
      const left = 'true'
      const right = true

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('(str) true <> (bool) true')
    })

    it('diffs left boolean right str (falsy)', () => {
      const left = false
      const right = 'false'

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('(bool) false <> (str) false')
    })

    it('diffs left str right boolean (falsy)', () => {
      const left = 'false'
      const right = false

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('(str) false <> (bool) false')
    })

    it('diffs left boolean right number', () => {
      const left = true
      const right = 1

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('(bool) true <> (num) 1')
    })

    it('diffs left number right boolean', () => {
      const left = 1
      const right = true

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('(num) 1 <> (bool) true')
    })

    it('diffs left boolean right number (falsy)', () => {
      const left = false
      const right = 0

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('(bool) false <> (num) 0')
    })

    it('diffs left number right boolean (falsy)', () => {
      const left = 0
      const right = false

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('(num) 0 <> (bool) false')
    })

    it('diffs two different types', () => {
      const left = 'Banana'
      const right = 123

      typeDiff.diff(left, right)
      inspect(typeDiff.parse(false)).isEql('(str) Banana <> (num) 123')
    })
  })
})
