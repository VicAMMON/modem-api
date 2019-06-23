/**
 * Module dependencies
 */

// ...
const co  = require('co');
const gsm = require('node-gsm2');
const helper = require('../modem/modem');
/**
 * sms/list.js
 *
 * List sms.
 */
module.exports = async function list(req, res) {

  var port = req.param('port');
  var phone = req.param('phone');
  if (!port) {
    return res.badRequest(new Error('No ID specified!'));
  }
  var busy = false;
  const modem = new gsm.Modem(
    "COM4", {
      retry: 1000,
      autoOpen: false
    }
  );
  modem.on('+CRING', console.log.bind('Ringing'))
  modem.on('+CLIP', (number) => {
    console.log('Incoming Call', number);
})
  modem.on('+CMTI', (msg) => {
    console.log('Incoming Message', msg);
    //modem.sms_delete_all()
    //modem.sms_list()
});
  modem.on('+CMGL', (message, m,) => {
    var m_arr = message.replace('(','').replace(')','').split(',');
    console.log(m_arr[m_arr.length-1]);
});

  modem.on('+CUSD', async (message, m,) => {
    var resp_data = await helper.handleUSSD(message, modem)
    await modem.close(()=>{
      return res.send(resp_data)
    })
});

  modem.on('message', (message, m) => {
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
    await modem.getNumber()
    //var sms = await modem.sms_read(2)
    /*await modem.close(()=>{
      //var sms_data = gsm.PDU.parse(sms)
      //sms_data.text = sms_data.text.substr(0,sms_data.text.indexOf('\0'))
      //return res.send(sms_data)
  })*/
  });

};


/*
Modem.prototype.balance = function(){
  return this.send(`AT+CUSD=1,"*111#"`)
};
Modem.prototype.getNumber = function(){
  return this.send(`AT+CUSD=1,"*161#"`)
};*/
