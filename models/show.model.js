const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const SchemaTypes = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const ShowSchema = new Schema(
//     startDate: { type: Date, default: nextFullDay,
//         validate: {
//             validator: function(v) {
//                 return v >= Date.now();
//             },
//             message: 'Start date value must be in the future.'
//         }},
//     endDate: { type: Date, default: dateIn4Weeks,
//         validate: {
//             validator: function(v) {
//                 return v >= Date.now();
//             },
//             message: 'End date value must be in the future.'
//         }},
//     targetWeight: { type: Number },
//     targetPercentage: { type: SchemaTypes.Double }
//     },
//     { timestamps: true }
);

const Target = mongoose.model('Show', ShowSchema);

module.exports = Target;
