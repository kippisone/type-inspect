'use strict'

const TypeInspect = require('./TypeInspect').TypeInspect
const Colorfy = require('./Colorfy').Colorfy
const DiffItem = require('./DiffItem').DiffItem

class TypeDiff {
  diff (left, right) {
    const leftInspected = new TypeInspect().inspect(left)
    const rightInspected = new TypeInspect().inspect(right)

    this.diffResult = this.diffItem(leftInspected, rightInspected)
    return this
  }

  diffItem (left, right) {
    const diffItem = new DiffItem()

    diffItem.setType(left.type, right.type)
    diffItem.setKind(left.kind, right.kind)
    diffItem.setValues(left.value, right.value)

    return diffItem
  }

  print (isTTY) {
    const colorfy = new Colorfy()
    return colorfy.print(this.diffResult, isTTY)
  }

  parse (isTTY) {
    const colorfy = new Colorfy()
    return colorfy.parse(this.diffResult, isTTY)
  }
}

module.exports.TypeDiff = TypeDiff
