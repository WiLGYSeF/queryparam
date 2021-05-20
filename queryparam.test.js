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

test('modify', () => {
  const TESTS = [
    {
      params: '?abc=123&def=&abc=a',
      modifiers: [
        ['+', 'abc', 'b']
      ],
      result: {
        'abc': ['b'],
        'def': ['']
      }
    },
  ];

  for (const entry of TESTS) {
    const qp = new QueryParam(entry.params);
    for (const mod of entry.modifiers) {
      qp.modify(mod[0], mod[1], mod[2]);
    }
    expect(qp.params).toStrictEqual(entry.result);
  }
});
