const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  name: { type: String, required: [true, 'Name is required'] },
  biography: { type: String, required: [true, 'Biography is required'] },
  imageUrl: { type: String, required: false,
    default: "https://via.placeholder.com/150?text=PLACEHOLDER" }
}, {timestamps: true
}, {strict: true});

const Artist = mongoose.model('Artist', ArtistSchema);

// Create initial show.
Artist.findOne({})
  .then((artist) => {
    if (!artist) {
      const artist = new Artist({
        name: "De Jeugd van Tegenwoordig",
        biography: "Quid ei reliquisti, nisi te, quoquo modo loqueretur, intellegere, quid diceret? Tum Quintus:" +
          "Est plane, Piso, ut dicis, inquit. Hoc dixerit potius Ennius: Nimium boni est, cui nihil est mali. Omnes" +
          " enim iucundum motum, quo sensus hilaretur."
      });
      artist.save()
        .then(() => console.log({ success: 'INITIAL ARTIST CREATED' }))
        .catch((error) => console.log(error));
    }
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = Artist;
