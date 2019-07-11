const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  title: {
    type: String, required: [true, 'Name is required']
  },
  show: {
    type: Schema.Types.ObjectId, ref: 'Show', required: [true, 'Show is required']
  },
  customerName: {
    type: String, required: [true, 'Customer name is required']
  },
  type: {
    type: String, required: [true, 'Type is required'], default: 'Regular'
  },
  purchaseDate: {
    type: String, required: false, default: new Date().toString()
  }
}, {
  timestamps: true
}, {strict: true});

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;
