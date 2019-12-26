const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;

const TicketItem = new Schema({
  type: {
    type: String, required: [true, 'Type is required']
  },
  price: {
    type: mongoose.Schema.Types.Double, required: [true, 'Price is required']
  },
  amount: {
    type: Number, required: [true, 'Amount is required']
  }
});

module.exports = TicketItem;
