/* eslint-disable */

const QueryParam = require('./queryparam');

test('parameter_parsing', () => {
  const TESTS = {
    '': {},
    'abc': {},
    '?abc': {
      'abc': [undefined]
    },
    '?abc=123&def=': {
      'abc': ['123'],
      'def': ['']
    },
    '?abc=123&def=&abc=a': {
      'abc': ['123', 'a'],
      'def': ['']
    },
  };

  for (const [key, value] of Object.entries(TESTS)) {
    const qp = new QueryParam(key);
    expect(qp.params).toStrictEqual(value);
  }
});
