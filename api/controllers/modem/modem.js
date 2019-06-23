
const pdu = require('node-gsm2/pdu');
module.exports = {

  handleUSSD: function (m, modem) {
  m = this.parse(m).map(function(e) { return e.trim(); });
  m = {
    type: Number(m[0]),
    str: m[1],
    dcs: Number(m[2])
  };

  m.str = m.dcs == 72 ? pdu.decode16Bit(m.str) : pdu.decode7Bit(m.str);
  m.str = m.str.substr(0,m.str.indexOf('\0')).substr(0,m.str.indexOf('\n')).split('+');
    if (typeof m.str !== 'undefined' && m.str.length > 1) {
      m.str = m.str[1];
    }else{
      m.str = 'Error';
    }
    return m;
},

  parse: function(s) {
  var quoted = false;
  var item = '';
  var items = [];

  for (var i = 0; i < s.length; i++) {
    var valid = false;

    switch (s[i]) {
      case '"':
        quoted = !quoted;
        break;

      case ',':
        valid = quoted;
        if (!quoted) {
          items.push(item);
          item = '';
        }
        break;

      default:
        valid = true;
    }

    if (valid) item += s[i];
  }

  if (item) {
    items.push(item);
  }

  return items;
}

};

