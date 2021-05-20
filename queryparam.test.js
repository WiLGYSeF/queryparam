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
      params: '?abc=123&def=g&abc=a',
      modifiers: [
        ['invalid', 'abc', 'b'],
      ],
      result: {
        'abc': ['123', 'a'],
        'def': ['g'],
      }
    },
    {
      params: '?abc=123&def=g&abc=a',
      modifiers: [
        ['+', 'abc', 'b'],
        ['+', 'new', 'a'],
        ['+$', 'def', 'last'],
        ['+$', 'new_last', 'a'],
        ['+^', 'def', 'first'],
        ['+^', 'new_first', 'a'],
      ],
      result: {
        'abc': ['b'],
        'def': ['first', 'g', 'last'],
        'new': ['a'],
        'new_first': ['a'],
        'new_last': ['a'],
      }
    },
    {
      params: '?abc=123&def=a',
      modifiers: [
        ['+=', 'abc', undefined],
        ['+=', 'abc', '4'],
        ['+=', 'abc', 'invalid'],
        ['+=', 'def', undefined],
        ['+=', 'new', undefined],
        ['+=', 'new', '2'],
      ],
      result: {
        'abc': ['128'],
        'def': ['a'],
        'new': ['3'],
      }
    },
    {
      params: '?abc=123&def=g&abc=a',
      modifiers: [
        ['-', 'abc', undefined],
        ['-', 'new', undefined],
      ],
      result: {
        'def': ['g'],
      }
    },
    {
      params: '?abc=123&def=g&abc=a&abc=end&ghi=j',
      modifiers: [
        ['-$', 'abc', undefined],
        ['-$', 'def', undefined],
        ['-$', 'new', undefined],
        ['-^', 'abc', undefined],
        ['-^', 'ghi', undefined],
        ['-^', 'new', undefined],
      ],
      result: {
        'abc': ['a'],
      }
    },
    {
      params: '?abc=123&def',
      modifiers: [
        ['-=', 'abc', undefined],
        ['-=', 'abc', '4'],
        ['-=', 'abc', 'invalid'],
        ['-=', 'def', '2'],
        ['-=', 'new', undefined],
        ['-=', 'new', '2'],
        ['-=', 'new', '-13'],
      ],
      result: {
        'abc': ['118'],
        'def': [undefined],
        'new': ['10'],
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
