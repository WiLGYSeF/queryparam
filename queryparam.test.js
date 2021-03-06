const QueryParam = require('./queryparam');

test('parameter_parsing', () => {
  const TESTS = {
    '': {},
    abc: {},
    '?abc': {
      abc: [undefined],
    },
    '?abc=123&def=': {
      abc: ['123'],
      def: [''],
    },
    '?abc=123&def=&abc=a': {
      abc: ['123', 'a'],
      def: [''],
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
        abc: ['123', 'a'],
        def: ['g'],
      },
    },
    {
      params: '?abc=123&def=g&abc=a',
      modifiers: [
        ['+', 'abc', 'b'],
        ['+', 'new', 'a'],
        ['+^', 'def', 'first'],
        ['+^', 'new_first', 'a'],
        ['+$', 'def', 'last'],
        ['+$', 'new_last', 'a'],
      ],
      result: {
        abc: ['b'],
        def: ['first', 'g', 'last'],
        new: ['a'],
        new_first: ['a'],
        new_last: ['a'],
      },
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
        abc: ['128'],
        def: ['a'],
        new: ['3'],
      },
    },
    {
      params: '?abc=123&def=g&abc=a',
      modifiers: [
        ['-', 'abc', undefined],
        ['-', 'new', undefined],
      ],
      result: {
        def: ['g'],
      },
    },
    {
      params: '?abc=123&def=g&abc=a&abc=end&ghi=j',
      modifiers: [
        ['-^', 'abc', undefined],
        ['-^', 'ghi', undefined],
        ['-^', 'new', undefined],
        ['-$', 'abc', undefined],
        ['-$', 'def', undefined],
        ['-$', 'new', undefined],
      ],
      result: {
        abc: ['a'],
      },
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
        abc: ['118'],
        def: [undefined],
        new: ['10'],
      },
    },
    {
      params: '?abc=123&def=g&abc=a&def=gg&123=a&123=b',
      modifiers: [
        ['=', 'def', 'h'],
        ['=', 'new', 'a'],
        ['=^', 'abc', undefined],
        ['=^', 'new', undefined],
        ['=$', '123', undefined],
        ['=$', 'new', undefined],
      ],
      result: {
        abc: ['123'],
        def: ['h'],
        123: ['b'],
      },
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

test('join_and_toString', () => {
  const TESTS = [
    {
      params: {
        abc: ['123', '456'],
        def: ['abc'],
        ghi: [undefined],
      },
      keep: QueryParam.JOIN_ALL,
      result: 'abc=123&abc=456&def=abc&ghi',
    },
    {
      params: {
        abc: ['123', '456'],
        def: ['abc'],
        ghi: [undefined],
      },
      keep: QueryParam.JOIN_FIRST,
      result: 'abc=123&def=abc&ghi',
    },
    {
      params: {
        abc: ['123', '456'],
        def: ['abc'],
        ghi: [undefined],
      },
      keep: QueryParam.JOIN_LAST,
      result: 'abc=456&def=abc&ghi',
    },
  ];

  for (const entry of TESTS) {
    const qp = new QueryParam();
    qp.params = entry.params;

    expect(qp.join(entry.keep)).toStrictEqual(entry.result);
    if (entry.keep === QueryParam.JOIN_ALL) {
      expect(qp.toString()).toStrictEqual(entry.result);
    }
  }
});

test('convertHref', () => {
  const TESTS = [
    {
      location: {
        search: '',
        hash: '',
      },
      hrefs: [
        '##+abc=123##',
        '##+def=456&+ghi=789##',
      ],
      results: [
        'http://localhost/?abc=123',
        'http://localhost/?def=456&ghi=789',
      ],
    },
    {
      location: {
        search: '?page=2&sort=title',
        hash: '',
      },
      hrefs: [
        '##+=page##',
        '##+=page=5##',
      ],
      results: [
        'http://localhost/?page=3&sort=title',
        'http://localhost/?page=7&sort=title',
      ],
    },
    {
      location: {
        search: '?first=1',
        hash: 'header',
      },
      hrefs: [
        '##-first##',
      ],
      results: [
        'http://localhost/',
      ],
    },
    {
      location: {
        search: '?first=1',
        hash: '#header',
      },
      hrefs: [
        '##-first##h',
      ],
      results: [
        'http://localhost/#header',
      ],
    },
    {
      location: {
        search: '?page=1&sort=title',
        hash: '',
      },
      hrefs: [
        '##+=page##r',
      ],
      results: [
        'http://localhost/?page=2',
      ],
    },
    {
      location: {
        search: '?page=1&sort=title',
        hash: '',
      },
      hrefs: [
        '/test',
        undefined,
      ],
      results: [
        'http://localhost/test',
        '',
      ],
    },
    {
      location: {
        search: '?page=1&sort=title',
        hash: '',
      },
      classList: 'noquery',
      hrefs: [
        '##+=page##r',
      ],
      results: [
        'http://localhost/##+=page##r',
      ],
    },
  ];

  for (const entry of TESTS) {
    const eleContainer = document.createElement('div');
    for (const href of entry.hrefs) {
      const eleA = document.createElement('a');
      if ('classList' in entry) {
        eleA.classList = entry.classList;
      }
      if (href !== undefined) {
        eleA.href = href;
      }
      eleContainer.appendChild(eleA);
    }

    QueryParam.convertHrefs(eleContainer, entry.location);

    let idx = 0;
    for (const eleA of eleContainer.getElementsByTagName('a')) {
      expect(eleA.href).toStrictEqual(entry.results[idx++]);
    }
  }
});
