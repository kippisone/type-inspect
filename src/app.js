const TypeInspect = require('./TypeInspect').TypeInspect
const TypeDiff = require('./TypeDiff').TypeDiff

const moduleExport = {
  TypeInspect: TypeInspect,
  TypeDiff: TypeDiff,
  inspect(val) {
    const typeInspect = new TypeInspect()
    return typeInspect.inspect(val)
  },
  diff (left, right) {
    const typeDiff = new TypeDiff()
    return typeDiff.diff(left, right)
  }
}

module.exports = moduleExport
module.exports.default = moduleExport
