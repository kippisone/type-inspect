'use strict'

const inspect = require('inspect.js')
const PrettyInspect = require('../src/PrettyInspect')

describe('PrettyInspect', () => {
  describe('indent()', () => {
    const prettyInspect = new PrettyInspect()

    it('Should return default indention on first call', () => {
      inspect(prettyInspect.indent()).isEql('')
    })

    it('Should set and return a indention of one', () => {
      inspect(prettyInspect.indent(1)).isEql('  ')
    })

    it('Should set and return a indention of two', () => {
      inspect(prettyInspect.indent(1)).isEql('    ')
    })

    it('Should return a indention of two', () => {
      inspect(prettyInspect.indent()).isEql('    ')
    })

    it('Should set and return a indention of one again', () => {
      inspect(prettyInspect.indent(-1)).isEql('  ')
    })

    it('Should return a indention of one', () => {
      inspect(prettyInspect.indent()).isEql('  ')
    })
  })
})
