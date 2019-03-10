const inspect = require('inspect.js')
const DiffItem = require('../src/DiffItem').DiffItem

describe('DiffItem', () => {
  describe('setType()', () => {
    it('set matching type', () => {
      const diffItem = new DiffItem()
      diffItem.setType('object', 'object')

      inspect(diffItem).hasKey('type')
      inspect(diffItem).hasNotKey('typeAdded')
      inspect(diffItem).hasNotKey('typeRemoved')
      inspect(diffItem.type).isEql('object')
    })

    it('set different types', () => {
      const diffItem = new DiffItem()
      diffItem.setType('object', 'string')

      inspect(diffItem).hasNotKey('type')
      inspect(diffItem).hasKey('typeAdded')
      inspect(diffItem).hasKey('typeRemoved')
      inspect(diffItem.typeAdded).isEql('object')
      inspect(diffItem.typeRemoved).isEql('string')
    })
  })

  describe('setKind()', () => {
    it('set matching kind', () => {
      const diffItem = new DiffItem()
      diffItem.setKind('object', 'object')

      inspect(diffItem).hasKey('kind')
      inspect(diffItem).hasNotKey('kindAdded')
      inspect(diffItem).hasNotKey('kindRemoved')
      inspect(diffItem.kind).isEql('object')
    })

    it('set different kinds', () => {
      const diffItem = new DiffItem()
      diffItem.setKind('object', 'string')

      inspect(diffItem).hasNotKey('kind')
      inspect(diffItem).hasKey('kindAdded')
      inspect(diffItem).hasKey('kindRemoved')
      inspect(diffItem.kindAdded).isEql('object')
      inspect(diffItem.kindRemoved).isEql('string')
    })
  })

  describe('setKey()', () => {
    it('set matching key', () => {
      const diffItem = new DiffItem()
      diffItem.setKey('foo', 'foo')

      inspect(diffItem).hasKey('key')
      inspect(diffItem).hasNotKey('keyAdded')
      inspect(diffItem).hasNotKey('keyRemoved')
      inspect(diffItem.key).isEql('foo')
    })

    it('set different keys', () => {
      const diffItem = new DiffItem()
      diffItem.setKey('foo', 'bar')

      inspect(diffItem).hasNotKey('key')
      inspect(diffItem).hasKey('keyAdded')
      inspect(diffItem).hasKey('keyRemoved')
      inspect(diffItem.keyAdded).isEql('foo')
      inspect(diffItem.keyRemoved).isEql('bar')
    })
  })

  describe('isSameType', () => {
    it('is set to true if type and kind matches', () => {
      const diffItem = new DiffItem()
      diffItem.setType('object', 'object')
      diffItem.setKind('object', 'object')
      inspect(diffItem.isSameType).isTrue()
    })

    it('is set to false if type doesnt match', () => {
      const diffItem = new DiffItem()
      diffItem.setType('object', 'string')
      diffItem.setKind('object', 'object')
      inspect(diffItem.isSameType).isFalse()
    })

    it('is set to false if kind doesnt match', () => {
      const diffItem = new DiffItem()
      diffItem.setType('object', 'object')
      diffItem.setKind('object', 'date')
      inspect(diffItem.isSameType).isFalse()
    })

    it('is set to false if type and kind doesnt match', () => {
      const diffItem = new DiffItem()
      diffItem.setType('object', 'string')
      diffItem.setKind('object', 'string')
      inspect(diffItem.isSameType).isFalse()
    })
  })

  describe('set values', () => {
    it('set matching strings', () => {
      const diffItem = new DiffItem()
      diffItem.setType('string', 'string')
      diffItem.setKind('string', 'string')
      diffItem.setValues('foo', 'foo')

      inspect(diffItem.value).isEql('foo')
    })

    it('set non matching strings', () => {
      const diffItem = new DiffItem()
      diffItem.setType('string', 'string')
      diffItem.setKind('string', 'string')
      diffItem.setValues('foo', 'bar')

      inspect(diffItem).hasNotKey('value')
      inspect(diffItem.valueAdded).isEql('foo')
      inspect(diffItem.valueRemoved).isEql('bar')
    })

    it('set matching numbers', () => {
      const diffItem = new DiffItem()
      diffItem.setType('number', 'number')
      diffItem.setKind('number', 'number')
      diffItem.setValues(123, 123)

      inspect(diffItem.value).isEql(123)
    })

    it('set non matching numbers', () => {
      const diffItem = new DiffItem()
      diffItem.setType('number', 'number')
      diffItem.setKind('number', 'number')
      diffItem.setValues(123, 333)

      inspect(diffItem).hasNotKey('value')
      inspect(diffItem.valueAdded).isEql(123)
      inspect(diffItem.valueRemoved).isEql(333)
    })

    it('set matching objects', () => {
      const diffItem = new DiffItem()
      diffItem.setType('object', 'object')
      diffItem.setKind('object', 'object')
      diffItem.setValues({
        foo: {
          type: 'string',
          kind: 'string',
          value: 'Foo'
        }
      }, {
        foo: {
          type: 'string',
          kind: 'string',
          value: 'Foo'
        }
      })

      inspect(diffItem).isEql({
        type: 'object',
        kind: 'object',
        values: [{
          key: 'foo',
          type: 'string',
          kind: 'string',
          value: 'Foo'
        }]
      })
    })

    it('set non matching objects', () => {
      const diffItem = new DiffItem()
      diffItem.setType('object', 'object')
      diffItem.setKind('object', 'object')
      diffItem.setValues({
        foo: {
          type: 'string',
          kind: 'string',
          value: 'Foo'
        }
      }, {
        foo: {
          type: 'string',
          kind: 'string',
          value: 'Bar'
        }
      })

      inspect(diffItem).isEql({
        type: 'object',
        kind: 'object',
        values: [{
          key: 'foo',
          type: 'string',
          kind: 'string',
          valueAdded: 'Foo',
          valueRemoved: 'Bar'
        }]
      })
    })
  })
})
