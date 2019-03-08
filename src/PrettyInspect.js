'use strict'

const TypeInspect = require('./TypeInspect')
const colorfy = require('colorfy')

// 🅾🅰🅽🆄🅸🅽🆂🅳🆁 🅲🅵🅰🅶
// ➊➋➌➍➎➏➐➑➒➓⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴

const TYPESET = {
  'object': '🅾',
  'null': '🅾',
  'array': '🅰',
  'string': '🆂',
  'number': '🅽',
  'boolean': '🅱',
  'undefined': '🆄',
  'date': '🅳',
  'regexp': '🆁',
  'function': '🅵',
  'unknown': '?'
}

const COLORSET = {
  'object': 11,
  // 'null': '',
  // 'array': '🅰',
  // 'string': '🆂',
  // 'number': '🅽',
  // 'boolean': '🅱',
  // 'undefined': '🆄',
  // 'date': '🅳',
  // 'regexp': '🆁',
  // 'function': '🅵',
  // 'unknown': '?'
  'default': 100
}

class PrettyInspect {
  constructor (opts) {
    opts = opts || {}
    this.indention = 0
    this.indentionStr = '  '
    this.colorsEnabled = opts.colors || process.stdout.isTTY
    if (this.colorsEnabled) {
      this.cf = colorfy()
    }
  }

  prettify (val) {
    const ts = new TypeInspect()
    const inspected = ts.inspect(val)
    const str = this.prettifyValue(inspected)
    const typeSymbol = TYPESET[inspected.subType] || TYPESET[inspected.type] || TYPESET.unknown
    if (this.colorsEnabled) {
      const color = COLORSET[inspected.subType] || COLORSET.default
      return this.cf.ddgrey(typeSymbol).ansi(color, str).colorfy()
    }

    return `${typeSymbol}${str}`
  }

  prettifyValue (inspected) {
    if (inspected.type === 'object') {
      if (inspected.subType === 'null') {
        return `null`
      }

      if (inspected.subType === 'array') {
        return `${this.prettifyArray(inspected)}`
      }

      if (inspected.subType === 'date') {
        return `${this.prettifyDate(inspected)}`
      }

      // console.log('VAL', inspected)
      if (inspected.subType === 'regexp') {
        return `${this.prettifyRegExp(inspected)}`
      }

      if (inspected.subType === 'map') {
        return `${this.prettifyMap(inspected)}`
      }

      if (inspected.subType === 'set') {
        return `${this.prettifySet(inspected)}`
      }

      const val = this.prettifyObject(inspected)
      return `${val}`
    }

    if (inspected.type === 'string') {
      return `${this.prettifyString(inspected)}`
    }

    return `${inspected.value}`
  }

  prettifyObject (obj) {
    const keys = Object.keys(obj.value)
    let prittyfied = []
    let indentStr = this.indent(1)
    keys.forEach((key) => {
      const val = this.prettifyValue(obj.value[key])
      prittyfied.push(`${indentStr}${key}: ${val}`)
    })

    indentStr = this.indent(-1)
    return `{\n${prittyfied.join(',\n')}\n${indentStr}}`
  }

  prettifyArray (arr) {
    const indentStr = this.indent(1)
    const prettified = arr.value.map((item) => {
      return `${indentStr}${this.prettifyValue(item)}`
    }).join(',\n')

    return `[\n${prettified}\n${this.indent(-1)}]`
  }

  prettifyString (str) {
    return `'${str.value}'`
  }

  prettifyDate (date) {
    return `${date.value.toString()}`
  }

  prettifyRegExp (reg) {
    return `${reg.value.toString()}`
  }

  prettifyMap (map) {
    const prettified = []
    const str = `Map {\n`
    this.indent(1)
    map.value.forEach((item) => {
      prettified.push(`${this.indent()}${item[0]}: ${this.prettifyValue(item[1])}`)
    })
    return `${str}${prettified.join(',\n')}\n${this.indent(-1)}}`
  }

  prettifySet (set) {
    const prettified = []
    const str = `Set {\n`
    this.indent(1)
    set.value.forEach((item) => {
      prettified.push(`${this.indent()}${this.prettifyValue(item)}`)
    })
    return `${str}${prettified.join(',\n')}\n${this.indent(-1)}}`
  }

  indent (size) {
    if (size) {
      this.indention += size
    }

    return this.indentionStr.repeat(this.indention)
  }
}

module.exports = PrettyInspect
module.exports.prettify = (val) => {
  const prettyInspect = new PrettyInspect()
  return prettyInspect.prettify(val)
}
