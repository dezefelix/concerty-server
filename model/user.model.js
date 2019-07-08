const mongoose = require('mongoose');

const MeasurementSchema = require('./measurement.model');

const Schema = mongoose.Schema;
const regEx = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|kpn|jobs|ziggo|nl)\b/);

const UserSchema = new Schema({
    firstName: { type: String, required: [true, 'First name is required.'] },
    lastName: { type: String, required: [true, 'Last name is required.'] },
    email: { type: String, required: [true, 'Last name is required.'], unique: true,
             validate: {
                 validator: (value) => regEx.test(value),
                 message: "Please enter a valid e-mail."
                }
             },
    password: { type: String, required: [true, 'Password is required.'],
        min: [6, 'Password should have at least 6 characters.'],
        max: [32, 'Password should have a maximum of 32 characters.']
    },
    measurements: [MeasurementSchema],
    targets: [{
        type: Schema.Types.ObjectId,
        ref: 'target'
    }]
    }, {
    timestamps: true
});

//age is always equal to the age that was inserted in the most recent measurement
UserSchema.virtual('age').get(function() {
    return (this.measurements.length > 0) ? this.measurements[this.measurements.length-1] : null
});

UserSchema.virtual('weight').get(function() {
    return (this.measurements.length > 0) ? this.measurements[this.measurements.length-1] : null
});

//DOES NOT WORK YET
//MUST BE IMPLEMENTED, BECAUSE IT WILL CAUSE ERRORS WHEN A USER
//HAS REFERENCES TO TARGETS THAT DO NOT EXIST
//
//prior to removing the user, remove all associated targets
UserSchema.pre('remove', function(next) {
    const Target = mongoose.model('target');

    Target.remove({ _id: { $in: this.targets }})
        .then(() => next());
});

const User = mongoose.model('user', UserSchema);

//--
//create a dummy user
User.findOne({})
    .then((user) => {
        if(user === null){
            const user = new User({
                firstName: 'Felix',
                lastName: 'Boons',
                email: 'admin@alisvetmeting.nl',
                password: '$2a$10$y5DHXseizQq1yuSsOXj3F.gqgU196DeiArdznhU9ZFZlC9xT9rcuC',
                measurements: [
                    { triceps: 5, biceps: 3, back: 9, abdomen: 5, age: 22, weight: 86.5,
                        createdAt: Date.UTC(2017, 6, 29, 12) },
                    { triceps: 4, biceps: 3, back: 8, abdomen: 5, age: 22, weight: 84,
                        createdAt: Date.UTC(2017, 11, 17, 13)},
                    { triceps: 4, biceps: 3, back: 8, abdomen: 4, age: 22, weight: 84 },
                ]
            });
            user.save()
                .then(() => console.log({ success: 'INITIAL USER CREATED' }))
                .catch((error) => console.log(error));
        }
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = User;