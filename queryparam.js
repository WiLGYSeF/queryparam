class QueryParam {
  constructor(url) {
    this.params = {};

    if (url === undefined) {
      return;
    }

    const regex = /[?&]+([^=&]+)(?:=([^&]*))?/g;
    let match;

    /* eslint-disable-next-line no-cond-assign */
    while ((match = regex.exec(url)) !== null) {
      if (match[1] in this.params && !this.unique) {
        this.params[match[1]].push(match[2]);
      } else {
        this.params[match[1]] = [match[2]];
      }
    }
  }

  modify(mode, key, value) {
    switch (mode) {
      case '+': // add query parameter, override value if it exists
        this.params[key] = [value];
        break;
      case '+^': // add query parameter to start even if it already exists
        if (key in this.params) {
          for (let i = this.params[key].length - 1; i !== 0; i--) {
            this.params[key][i] = this.params[key][i + 1];
          }
        } else {
          this.params[key] = [value];
        }
        break;
      case '+$': // add query parameter to end even if it already exists
        if (key in this.params) {
          this.params[key].push(value);
        } else {
          this.params[key] = [value];
        }
        break;
      default:
        break;
    }
  }
}

module.exports = QueryParam;
