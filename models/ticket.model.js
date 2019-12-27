const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketItemSchema = require('./ticket-item.model');

const TicketSchema = new Schema({
  customerName: {
    type: String, required: [true, 'Customer name is required']
  },
  items: [TicketItemSchema],
  concert: {
    type: Schema.Types.ObjectId, ref: 'Concert', required: [true, 'Concert is required']
  }
}, {
  timestamps: true
}, {strict: true});

module.exports = TicketSchema;
