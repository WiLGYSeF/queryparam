function toNum(x) {
  const val = parseInt(x, 10);
  return Number.isNaN(val) ? 0 : val;
}

class QueryParam {
  constructor(url) {
    this.params = {};

    const regex = /[?&]+([^=&]+)(?:=([^&]*))?/g;
    let match;

    /* eslint-disable-next-line no-cond-assign */
    while ((match = regex.exec(url)) !== null) {
      if (!(match[1] in this.params)) {
        this.params[match[1]] = [];
      }
      this.params[match[1]].push(match[2]);
    }
  }

  modify(mode, key, value) {
    switch (mode) {
      case '+': // add query parameter, override value if it exists
        this.params[key] = [value];
        break;
      case '+^': // add parameter to start even if it already exists
        if (key in this.params) {
          for (let i = this.params[key].length; i !== 0; i--) {
            this.params[key][i] = this.params[key][i - 1];
          }
          this.params[key][0] = value;
        } else {
          this.params[key] = [value];
        }
        break;
      case '+$': // add parameter to end even if it already exists
        if (key in this.params) {
          this.params[key].push(value);
        } else {
          this.params[key] = [value];
        }
        break;
      case '+=': // increment parameter
      {
        const incr = value !== undefined ? toNum(value) : 1;
        if (key in this.params) {
          const paramVal = this.params[key][this.params[key].length - 1];
          /* eslint-disable-next-line no-restricted-globals */
          if (paramVal !== undefined && !isNaN(paramVal)) {
            this.params[key] = [(parseInt(paramVal, 10) + incr).toString()];
          }
        } else {
          this.params[key] = [incr.toString()];
        }
        break;
      }
      case '-': // remove parameter
        delete this.params[key];
        break;
      case '-^': // remove first parameter
        if (key in this.params) {
          if (this.params[key].length === 1) {
            delete this.params[key];
          } else {
            this.params[key].splice(0, 1);
          }
        }
        break;
      case '-$': // remove last parameter
        if (key in this.params) {
          if (this.params[key].length === 1) {
            delete this.params[key];
          } else {
            this.params[key].pop();
          }
        }
        break;
      case '-=': // decrement parameter
        if (value !== undefined) {
          if (value[0] === '-') {
            this.modify('+=', key, value.slice(1));
          } else {
            this.modify('+=', key, '-' + value);
          }
        } else {
          this.modify('+=', key, '-1');
        }
        break;
      case '=': // set parameter if exists
        if (key in this.params) {
          this.params[key] = [value];
        }
        break;
      case '=^': // keep first parameter
        if (key in this.params) {
          this.params[key] = [this.params[key][0]];
        }
        break;
      case '=$': // keep last parameter
        if (key in this.params) {
          this.params[key] = [this.params[key].pop()];
        }
        break;
      default:
        break;
    }
  }

  join(keep = QueryParam.JOIN_ALL) {
    let query = '';

    const entries = Object.entries(this.params);
    for (let idx = 0; idx < entries.length; idx++) {
      const [key, value] = entries[idx];
      const length = keep === QueryParam.JOIN_FIRST ? 1 : value.length;

      for (let i = keep === QueryParam.JOIN_LAST ? length - 1 : 0; i < length; i++) {
        query += key;
        if (value[i] !== undefined) {
          query += '=' + value[i];
        }

        if (i !== length - 1) {
          query += '&';
        }
      }

      if (idx !== entries.length - 1) {
        query += '&';
      }
    }

    return query;
  }

  toString() {
    return this.join(QueryParam.JOIN_ALL);
  }

  static convertHrefs(root = document, location = window.location) {
    for (const eleA of root.getElementsByTagName('a')) {
      if (eleA.classList.contains('noquery')) {
        continue;
      }

      let href = eleA.getAttribute('href');
      if (href === null) {
        continue;
      }

      const match = href.match(/^##(.*)##([a-z]*)$/);
      if (match === null) {
        continue;
      }

      const [, hspecial, hmode] = match;

      const qp = new QueryParam(location.search);

      const regex = /&?([^A-Za-z0-9]+)([A-Za-z0-9\-._~]+)(?:=([^&]*))?/g;
      const keyset = new Set();
      let m;

      /* eslint-disable-next-line no-cond-assign */
      while ((m = regex.exec(hspecial)) !== null) {
        qp.modify(m[1], m[2], m[3]);
        keyset.add(m[2]);
      }

      if (hmode.includes('r')) {
        for (const key of Object.keys(qp.params)) {
          if (!keyset.has(key)) {
            delete qp.params[key];
          }
        }
      }

      href = '?' + qp.toString();
      if (href.length === 1) {
        href = '';
      }

      if (hmode.includes('h')) {
        href += location.hash;
      }

      eleA.href = href;
    }
  }
}

QueryParam.JOIN_ALL = 'join-all';
QueryParam.JOIN_FIRST = 'join-first';
QueryParam.JOIN_LAST = 'join-last';

if (typeof module !== typeof undefined) {
  module.exports = QueryParam;
}
