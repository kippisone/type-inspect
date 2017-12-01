'use strict'

const TypeInspector = require('./TypeInspector')

// 🅾🅰🅽🆄🅸🅽🆂🅳🆁
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
  'unknown': '?'
}

class PrettyInspect {
  constructor () {
    this.indention = 0
    this.indentionStr = '  '
  }

  prettify (val) {
    const ts = new TypeInspector()
    const inspected = ts.inspect(val)
    return this.prettifyValue(inspected)
  }

  prettifyValue (inspected) {
    const typeSymbol = TYPESET[inspected.subType] || TYPESET[inspected.type] || TYPESET.unknown

    if (inspected.type === 'object') {
      if (inspected.subType === 'null') {
        return `${typeSymbol}null`
      }

      if (inspected.subType === 'array') {
        return `${typeSymbol}${this.prettifyArray(inspected)}`
      }

      if (inspected.subType === 'date') {
        return `${typeSymbol}${this.prettifyDate(inspected)}`
      }

      // console.log('VAL', inspected)
      if (inspected.subType === 'regexp') {
        return `${typeSymbol}${this.prettifyRegExp(inspected)}`
      }

      if (inspected.subType === 'map') {
        return `${typeSymbol}${this.prettifyMap(inspected)}`
      }

      if (inspected.subType === 'set') {
        return `${typeSymbol}${this.prettifySet(inspected)}`
      }

      const val = this.prettifyObject(inspected)
      return `${typeSymbol}${val}`
    }

    if (inspected.type === 'string') {
      return `${typeSymbol}${this.prettifyString(inspected)}`
    }

    return `${typeSymbol}${inspected.value}`
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

  prettifyRegExp (date) {
    return `${date.value.toString()}`
  }

  prettifyMap (map) {
    const prettified = []
    const str = ` Map {\n`
    this.indent(1)
    map.value.forEach((item) => {
      prettified.push(`${this.indent()}${item[0]}: ${this.prettifyValue(item[1])}`)
    })
    return `${str}${prettified.join(',\n')}\n${this.indent(-1)}}`
  }

  prettifySet (set) {
    const prettified = []
    const str = ` Set {\n`
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
