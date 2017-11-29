'use strict'

const PrettyInspect = require('../src/PrettyInspect');

const testMap = new Map()
testMap.set('one', 'One');
testMap.set('one', 'One');
testMap.set('two', 2);
testMap.set('thre', { num: 3 });

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
  [ 'Map', testMap ]
]

fixtures.forEach((item) => {
  console.log(`${item[0]} ----------------------------`)
  console.log(PrettyInspect.prettify(item[1]))
  console.log('')
  console.log('')
})
