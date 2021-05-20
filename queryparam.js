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
            /* eslint-disable-next-line prefer-template */
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
}

module.exports = QueryParam;
