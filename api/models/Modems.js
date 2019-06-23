/**
 * Modems.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    port: {
      type: 'string',
      unique: true,
      required: true
    },
    phone: {
      type: 'string'
    },
    sms: {
      collection: 'sms',
      via: 'modem'
    }
  },

};

