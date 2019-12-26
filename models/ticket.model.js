const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketItems = require('./ticket-item.model');

const TicketSchema = new Schema({
  customerName: {
    type: String, required: [true, 'Customer name is required']
  },
  items: [TicketItems],
  concert: {
    type: Schema.Types.ObjectId, ref: 'Concert', required: [true, 'Concert is required']
  }
}, {
  timestamps: true
}, {strict: true});

module.exports = TicketSchema;
