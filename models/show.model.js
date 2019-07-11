const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const SchemaTypes = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const ShowSchema = new Schema({
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

ShowSchema.post('save', async (doc) => {
  const show = new Show(doc);
  if (show.ticketsRemaining === null || show.ticketsRemaining === undefined) {
    await initializeTicketsRemaining(doc);
  }
});

function initializeTicketsRemaining(show) {
  show.ticketsRemaining = show.ticketsTotal;
  show.save()
    .then(() => {
      console.log(`Set {ticketsRemaining} for show ${show._id}`)
    })
    .catch((err) => {
      console.log(err);
    })
}

const Show = mongoose.model('Show', ShowSchema);

// Create initial show.
Show.findOne({})
  .then((show) => {
    if (!show) {
      const show = new Show({
        title: "De Jeugd van Tegenwoordig",
        venue: "Ziggo Dome",
        city: "Amsterdam",
        price: 129.50,
        ticketsTotal: 10000,
        ticketsRemaining: 9001,
      });
      show.save()
        .then(() => console.log({success: 'INITIAL SHOW CREATED'}))
        .catch((error) => console.log(error));
    }
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = Show;
