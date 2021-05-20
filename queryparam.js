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
        let incr = 1;
        if (value !== undefined && !Number.isNaN(value)) {
          incr = parseInt(value, 10);
        }

        if (key in this.params) {
          const paramVal = this.params[key][this.params[key].length - 1];
          if (paramVal !== undefined && !Number.isNaN(paramVal)) {
            this.params[key] = [(parseInt(paramVal, 10) + incr).toString()];
          }
        } else {
          this.params[key] = [incr.toString()];
        }
        break;
      }
      default:
        break;
    }
  }
}

module.exports = QueryParam;
