/* eslint-disable */

const QueryParam = require('./queryparam');

test('parameter_parsing', () => {
  const TESTS = {
    '': {},
    'abc': {},
    '?abc': {
      'abc': [undefined]
    }
  };

  for (const [key, value] of Object.entries(TESTS)) {
    const qp = new QueryParam(key);
    expect(qp.params).toStrictEqual(value);
  }
});
