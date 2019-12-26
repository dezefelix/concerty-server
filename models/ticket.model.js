const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  customerName: {
    type: String, required: [true, 'Customer name is required']
  },
  type: {
    type: String, required: [true, 'Type is required']
  },
  concert: {
    type: Schema.Types.ObjectId, ref: 'Concert', required: [true, 'Concert is required']
  }
}, {
  timestamps: true
}, {strict: true});

module.exports = TicketSchema;
