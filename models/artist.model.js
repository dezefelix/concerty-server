const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const ArtistSchema = new Schema({}, {

  timestamps: true
}, {strict: true});

const Artist = mongoose.model('Show', ArtistSchema);

module.exports = ArtistSchema;
