const Colorfy = require('./Colorfy').Colorfy

class InspectItem {
  constructor (data) {
    Object.assign(this, data)
  }

  convertItem (val) {
    const obj = {
      type: val.type,
      kind: val.kind
    }

    if (val.kind === 'array') {
      obj.values = val.value.map((item) => this.convertItem(item))
    } else if (val.kind === 'map') {
      obj.values = []
      val.value.forEach(([key, entry]) => {
        const item = this.convertItem(entry)
        item.key = key
        obj.values.push(item)
      })
    } else if (val.kind === 'set') {
      obj.values = []
      val.value.forEach((entry) => {
        const item = this.convertItem(entry)
        obj.values.push(item)
      })
    } else if (val.kind === 'object') {
      obj.values = Object.keys(val.value).map((key) => {
        const item = this.convertItem(val.value[key])
        item.key = key
        return item
      })
    } else {
      obj.value = val.value
    }

    return obj
  }

  print (isTTY) {
    const colorfy = new Colorfy()
    return colorfy.print(this.convertItem(this), isTTY)
  }

  parse (isTTY) {
    const colorfy = new Colorfy()
    return colorfy.parse(this.convertItem(this), isTTY)
  }

  toJSON () {
    return {
      type: this.type,
      kind: this.kind,
      value: this.value
    }
  }
}

module.exports.InspectItem = InspectItem
