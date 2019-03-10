const colorfy = require('colorfy')

const TYPESET = {
  'number': 'num',
  'string': 'str',
  'boolean': 'bool',
  'array': 'arr',
  'regexp': 'reg'
}

class Colorfy {
  constructor () {
    this.cf = colorfy({
      trim: true,
      indent: 0
    })
  }

  colorfy (diff, isTTY) {
    this.colorfyItem(diff)
    return this.cf.colorfy(isTTY)
  }

  colorfyItem (diff) {
    // console.log('DIFF', diff)
    if (diff.type === 'object') {
      if (diff.kind === 'null') {
        this.colorfyBoolean(diff)
        return
      }

      if (diff.kind === 'array') {
        this.colorfyArray(diff)
        return
      }

      if (diff.kind === 'date') {
        this.colorfyDate(diff)
        return
      }

      if (diff.kind === 'regexp') {
        this.colorfyRegExp(diff)
        return
      }

      if (diff.kind === 'map') {
        this.colorfyMap(diff)
        return
      }

      if (diff.kind === 'set') {
        this.colorfySet(diff)
        return
      }

      if (diff.kind === 'object') {
        this.colorfyObject(diff)
        return
      }
    }

    if (diff.type === 'string') {
      this.colorfyString(diff)
      return
    }

    if (diff.type === 'number') {
      this.colorfyNumber(diff)
      return
    }

    if (diff.type === 'boolean') {
      this.colorfyBoolean(diff)
      return
    }

    if (diff.type === 'undefined') {
      this.colorfyBoolean(diff)
      return
    }

    if (diff.type === 'function') {
      this.colorfyFunction(diff)
      return
    }

    if (diff.typeAdded !== diff.typeRemoved) {
      this.colorfyDifferentTypes(diff)
      return
    }

    throw new Error('Unsupported diff value: ' + diff.type + ' kind: ' + diff.kind)
  }

  colorfyObject (obj) {
    this.cf.txt('{').indent(2)
    obj.values.forEach((diffItem, index) => {
      if (diffItem.key) {
        this.cf.grey(diffItem.key)
      } else {
        if (diffItem.keyAdded) {
          this.cf.green(diffItem.keyAdded)
        }

        if (diffItem.keyRemoved) {
          this.cf.red(diffItem.keyRemoved)
        }
      }

      this.cf.dgrey(': ')

      this.colorfyItem(diffItem)
      if (obj.values.length - 1 > index) {
        this.cf.txt(',').nl()
      }
    })

    this.cf.indent(-2).txt('}')
  }

  colorfyArray (item) {
    this.cf.txt('[').indent(2)
    item.values.forEach((diffItem, index) => {
      this.colorfyItem(diffItem)
      if (item.values.length - 1 > index) {
        this.cf.txt(',').nl()
      }
    })

    this.cf.indent(-2).txt(']')
  }

  colorfyString (str) {
    this.cf.txt('"')
    if (str.value) {
      this.cf.txt(str.value)
    } else {
      if (str.valueAdded) {
        this.cf.green(str.valueAdded)
      }

      if (str.valueRemoved) {
        this.cf.red(str.valueRemoved)
      }
    }

    this.cf.txt('"')
  }

  colorfyNumber (item) {
    if (item.hasOwnProperty('value')) {
      this.cf.txt(isNaN(item.value) && item.value !== undefined ? 'NaN' : `${item.value}`)
    } else {
      if (item.hasOwnProperty('valueAdded')) {
        this.cf.green(isNaN(item.valueAdded) && item.valueAdded !== undefined ? 'NaN' : `${item.valueAdded}`)
      }

      if (item.hasOwnProperty('valueRemoved')) {
        this.cf.red(isNaN(item.valueRemoved) && item.valueRemoved !== undefined ? 'NaN' : `${item.valueRemoved}`)
      }
    }
  }

  colorfyBoolean (item) {
    if (item.hasOwnProperty('value')) {
      this.cf.txt(`${item.value}`)
    } else {
      if (item.hasOwnProperty('valueAdded')) {
        this.cf.green(`${item.valueAdded}`)
      }

      if (item.hasOwnProperty('valueRemoved')) {
        this.cf.red(`${item.valueRemoved}`)
      }
    }
  }

  colorfyFunction (item) {
    if (item.hasOwnProperty('value')) {
      this.cf.txt(`${item.value}`)
    } else {
      if (item.hasOwnProperty('valueAdded')) {
        this.cf.green(`${item.valueAdded}`)
      }

      if (item.hasOwnProperty('valueRemoved')) {
        this.cf.red(`${item.valueRemoved}`)
      }
    }
  }

  colorfyDate (item) {
    if (item.hasOwnProperty('value')) {
      this.cf.txt(`Date(${item.value})`)
    } else {
      if (item.hasOwnProperty('valueAdded')) {
        this.cf.green(`Date(${item.valueAdded})`)
      }

      if (item.hasOwnProperty('valueRemoved')) {
        this.cf.red(`Date(${item.valueRemoved})`)
      }
    }
  }

  colorfyRegExp (item) {
    if (item.hasOwnProperty('value')) {
      this.cf.txt(`${item.value}`)
    } else {
      if (item.hasOwnProperty('valueAdded')) {
        this.cf.green(`${item.valueAdded}`)
      }

      if (item.hasOwnProperty('valueRemoved')) {
        this.cf.red(`${item.valueRemoved}`)
      }
    }
  }

  colorfyMap (item) {
    this.cf.txt('Map ')
    this.colorfyObject(item)
  }

  colorfySet (item) {
    this.cf.txt('Set ')
    this.colorfyArray(item)
  }

  colorfyDifferentTypes (item) {
    const typeAdded = (item.typeAdded in TYPESET) ? TYPESET[item.typeAdded] : `${item.typeAdded}`
    const typeRemoved = (item.typeRemoved in TYPESET) ? TYPESET[item.typeRemoved] : `${item.typeRemoved}`

    this.cf.ddgrey(`(${typeAdded}) `).green(`${item.valueAdded}`).txt(' <> ').ddgrey(`(${typeRemoved}) `).red(`${item.valueRemoved}`)
  }

  print (diff, isTTY) {
    const str = this.colorfy(diff, isTTY)
    console.log(str) // eslint-disable-line no-console
  }

  parse (diff, isTTY) {
    const str = this.colorfy(diff, isTTY)
    return str
  }
}

module.exports.Colorfy = Colorfy
