const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const SchemaTypes = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const ConcertSchema = new Schema({
  title: {
    type: String, required: [true, 'Title is required.']
  },
  venue: {
    type: String, required: [true, 'Venue is required.']
  },
  city: {
    type: String, required: [true, 'City is required']
  },
  date: {
    type: String, required: false, default: new Date().toString()
  },
  price: {
    type: SchemaTypes.Double, required: [true, 'Price is required']
  },
  ticketsTotal: {
    type: Number, required: [true, 'The total ticket amount is required']
  },
  ticketsRemaining: {
    type: Number, required: false
  },
  artists: [{
    type: Schema.Types.ObjectId, ref: 'Artist', required: false
  }]
}, {
  timestamps: true
}, {strict: true});

ConcertSchema.post('save', async (doc) => {
  const concert = new Concert(doc);
  if (concert.ticketsRemaining === null || concert.ticketsRemaining === undefined) {
    await initializeTicketsRemaining(doc);
  }
});

function initializeTicketsRemaining(concert) {
  concert.ticketsRemaining = concert.ticketsTotal;
  concert.save()
    .then(() => {
      console.log(`Set {ticketsRemaining} for concert ${concert._id}`)
    })
    .catch((err) => {
      console.log(err);
    })
}

const Concert = mongoose.model('Concert', ConcertSchema);

// Create initial concert.
Concert.findOne({})
  .then((concert) => {
    if (!concert) {
      const concert = new Concert({
        title: "De Jeugd van Tegenwoordig",
        venue: "Ziggo Dome",
        city: "Amsterdam",
        price: 129.50,
        ticketsTotal: 10000,
        ticketsRemaining: 9001,
      });
      concert.save()
        .then(() => console.log({success: 'INITIAL CONCERT CREATED'}))
        .catch((error) => console.log(error));
    }
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = Concert;
