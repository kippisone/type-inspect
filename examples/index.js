const TypeInspect = require('../')

const left = {
  bla: 'Bla',
  blub: 'Blubb',
  blob: undefined
}

const right = {
  bla: 'Bla',
  blub: 'Blobb',
  blab: null
}

const diff = TypeInspect.diff(left, right)
console.log(diff.diffResult)
diff.print()
