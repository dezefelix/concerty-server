const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const SchemaTypes = mongoose.Schema.Types;
const Schema = mongoose.Schema;
const nextFullDay =  new Date(new Date().setDate(new Date().getDate()+1));
const dateIn4Weeks =  new Date(new Date().setDate(new Date().getDate()+28));

const TargetSchema = new Schema({
    startDate: { type: Date, default: nextFullDay,
        validate: {
            validator: function(v) {
                return v >= Date.now();
            },
            message: 'Start date value must be in the future.'
        }},
    endDate: { type: Date, default: dateIn4Weeks,
        validate: {
            validator: function(v) {
                return v >= Date.now();
            },
            message: 'End date value must be in the future.'
        }},
    targetWeight: { type: Number },
    targetPercentage: { type: SchemaTypes.Double },
    createdAt: { type: Date, default: Date.now }
});

TargetSchema.virtual('deadlinePassed').get(function() {
    return this.endDate >= Date.now();
});

//DOES NOT WORK YET
//MUST BE IMPLEMENTED, BECAUSE IT WILL CAUSE ERRORS WHEN A USER
//HAS REFERENCES TO TARGETS THAT DO NOT EXIST
//prior to removing the user, remove all associated targets

//prior to removing the user, remove all associated targets
TargetSchema.pre('remove', function(next) {
    const User = mongoose.model('user');

    User.remove({ _id: { $in: this.targets }})
        .then(() => next());
});

const Target = mongoose.model('target', TargetSchema);

//--
//create a dummy target
Target.findOne({})
    .then((target) => {
        if(target === null){
            const target = new Target({
                targetWeight: 88,
                targetPercentage: 9.5
            });
            target.save()
                .then(() => console.log({ success: 'INITIAL TARGET CREATED' }))
                .catch((error) => console.log(error));
        }
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = Target;