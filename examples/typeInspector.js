'use strict'

const TypeInspect = require('../');

const testMap = new Map()
testMap.set('one', 'One');
testMap.set('two', 2);
testMap.set('thre', { num: 3 });

const testSet = new Set()
testSet.add('One');
testSet.add(2);
testSet.add({ num: 3 });

const fixtures = [
  [ 'Object', { bla: 'Bla', blubb: 'Blubb' } ],
  [ 'Array', [ 'bla', 'blubb' ] ],
  [ 'Number', 123 ],
  [ 'Null', null ],
  [ 'Undefined', undefined ],
  [ 'Bool (true)', true ],
  [ 'Bool (false)', false ],
  [ 'NaN', NaN ],
  [ 'Function', function() {} ],
  [ 'Class', class {} ],
  [ 'Date', new Date() ],
  [ 'RegExp', /^foo/ ],
  [ 'Map', testMap ],
  [ 'Set', testSet ]
]

fixtures.forEach((item) => {
  console.log(`${item[0]} ----------------------------`)
  const inspected = TypeInspect.inspect(item[1])
  console.log('')
  inspected.print()
  console.log('')
  console.log('')
})
