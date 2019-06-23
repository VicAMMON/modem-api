/**
 * Module dependencies
 */

// ...
const co  = require('co');
const gsm = require('node-gsm2');
const helper = require('./modem');

module.exports = async function getNumber(req, res) {
  var busy = false;
  const port = "COM4";
  const modem = new gsm.Modem(
    port , {
      retry: 1000,
      autoOpen: false
    }
  );

  modem.on('+CUSD', async (message, m,) => {
    var resp_data = await helper.handleUSSD(message, modem)
  resp_data.port = port
  /*await modem.close(()=>{
    return res.send(resp_data)
  })*/
});
  modem.on('+CMTI', (msg) => {
    console.log('Incoming Message', msg);
  //modem.sms_delete_all()
  //modem.sms_list()
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
  });
};
