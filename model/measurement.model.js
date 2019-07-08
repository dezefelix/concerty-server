const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const MeasurementSchema = new Schema({
    triceps: { type: Number, required: true },
    biceps: { type: Number, required: true },
    back: { type: Number, required: true },
    abdomen: { type: Number, required: true },
    age: { type: Number, required: true },
    weight: { type: SchemaTypes.Double, required: true },
    createdAt: { type: Date, default: Date.now }
});

//total is the sum of triceps/biceps/back/abdomen
MeasurementSchema.virtual('total').get(function() {
    return (this.triceps + this.biceps + this.back + this.abdomen);
});

module.exports = MeasurementSchema;