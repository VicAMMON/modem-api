/**
 * Sms.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    text: {
      type: 'string'
    },
    from: {
      type: 'string'
    },
    additional: {
      type: 'string'
    },
    modem_id: {
      type: 'number',
      required: true
    },

    modem: {
      model: 'modems',
      required: true
    }

  },

};

