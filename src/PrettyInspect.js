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
    this.indention += 1
    let indentStr = this.indentionStr.repeat(this.indention)
    keys.forEach((key) => {
      const val = this.prettifyValue(obj.value[key])
      prittyfied.push(`${indentStr}${key}: ${val}`)
    })

    this.indention -= 1
    indentStr = this.indentionStr.repeat(this.indention)
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
    map.value.forEach((val, key) => {
      prettified.push(`${this.indent()}${key}: ${this.prettifyValue(val)}`)
    })
    return ` Map {\n${this.indent(1)}${prettified.join(',\n')}\n${this.indent(-1)}}`
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
