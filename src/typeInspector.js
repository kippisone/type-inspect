'use strict'

class TypeInspector {
  constructor (opts) {
    opts = opts || {}
    this.dept = opts.dept || 3
    this.toStringFn = opts.toString
  }

  getType (value) {
    const type = typeof value
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (type === 'object') {
      if (Array.isArray(value)) {
        return 'array'
      }

      if (value instanceof RegExp) return 'regexp'
      if (value instanceof Date) return 'date'
      if (value instanceof Promise) return 'promise'
      if (value instanceof Map) return 'map'
      if (value instanceof Set) return 'set'
      return 'object'
    }

    if (type === 'function') {
      if (this.isAsyncFunction(value)) return 'async'
      if (this.isGeneratorFunction(value)) return 'generator'
      if (this.isClass(value)) return 'class'
      return 'function'
    }

    if (type === 'number') {
      if (isNaN(value)) return 'nan'
      return 'number'
    }

    return type
  }

  inspect (value) {
    const type = typeof value;
    if (type === 'object') {
      return this.inspectObject(value)
    }

    return this.inspectValue(value)
  }

  inspectObject (obj, dept) {
    if (!typeof obj === 'object' && obj !== null) return null
    dept = dept || 3

    const keys = Object.keys(obj)
    const inspected = {}

    const inspectedValue = {
      type: typeof obj,
      subType: this.getType(obj)
    }

    if (this.toStringFn) {
      inspectedValue.toString = this.toStringFn
    }

    keys.forEach((key) => {
      let val = obj[key]
      if (Array.isArray(val)) {
        val = this.inspectArray(val, dept - 1)
      } else if (typeof val === 'object' && val !== null) {
        val = this.inspectObject(val, dept - 1)
      } else {
        val = this.inspectValue(val)
      }

      inspected[key] = val
    })

    inspectedValue.value = inspected
    return inspectedValue
  }

  inspectArray (arr, dept) {
    const inspectedValue = {
      type: typeof arr,
      subType: this.getType(arr)
    }

    if (this.toStringFn) {
      inspectedValue.toString = this.toStringFn
    }

    inspectedValue.value = arr.map((item) => {
      if (Array.isArray(item)) {
        return this.inspectArray(item, dept - 1)
      } else if (typeof item === 'object' && item !== null) {
        return this.inspectObject(item, dept - 1)
      }

      return this.inspectValue(item, dept - 1)
    })

    return inspectedValue
  }

  inspectValue (val, dept) {
    const inspectedValue = {
      type: typeof val,
      subType: this.getType(val)
    }

    if (this.toStringFn) {
      inspectedValue.toString = this.toStringFn
    }

    inspectedValue.value = val
    return inspectedValue
  }

  isGeneratorFunction (fn) {
    try {
      return eval('Object.getPrototypeOf(fn).constructor === Object.getPrototypeOf(function* () { yield;}).constructor')
    } catch(err) {
      return false;
    }
  }

  isAsyncFunction (fn) {
    try {
      return eval('Object.getPrototypeOf(fn).constructor === Object.getPrototypeOf(async function(){}).constructor')
    } catch(err) {
      return false;
    }
  }

  isClass (fn) {
    try {
      return /^class/.test(fn.toString())
    } catch(err) {
      return false;
    }
  }
}

module.exports = TypeInspector
module.exports.inspect = (val) => {
  const typeInspector = new TypeInspector()
  return typeInspector.inspect(val)
}
