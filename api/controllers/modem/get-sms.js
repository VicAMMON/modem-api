/**
 * Module dependencies
 */

// ...
const co  = require('co');
const gsm = require('node-gsm2');
const helper = require('./modem');

module.exports = async function getSms(req, res) {

  var port = req.param('port');
  if (!port) {
    return res.badRequest(new Error('No Port specified!'));
  }
  var busy = false;
  const modem = new gsm.Modem(
    req.param('port'), {
      retry: 1000,
      autoOpen: false
    }
  );

  modem.on('message', (message, m) => {
    console.log(message);
  });

  modem.on('open', () => {
    busy = true
  });

  modem.on('close', ()=>{
    busy = false
  });

  if(busy) return res.send('busy');
  modem.open(async ()=>{
    await modem.reset()
    await modem.sms_mode(0)
    var sms_list = await modem.sms_list(4)
    await modem.close(()=>{
    var sms_data = gsm.PDU.parse(sms_list)
    sms_data.text = sms_data.text.substr(0,sms_data.text.indexOf('\0'))
    return res.send(sms_data)
    })
    //var sms = await modem.sms_read(2)
    /*await modem.close(()=>{
      //var sms_data = gsm.PDU.parse(sms)
      //sms_data.text = sms_data.text.substr(0,sms_data.text.indexOf('\0'))
      //return res.send(sms_data)
  })*/
  });

};
