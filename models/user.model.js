const mongoose = require('mongoose');
const hasher = require('../helpers/hasher');
const Role = require('../helpers/role');

const Schema = mongoose.Schema;
const regEx = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|kpn|jobs|ziggo|nl)\b/);

const UserSchema = new Schema({
  firstName: {
    type: String, required: [true, 'First name is required.']
  },
  lastName: {
    type: String, required: [true, 'Last name is required.']
  },
  email: {
    type: String, required: [true, 'Last name is required.'], unique: true,
    validate: {
      validator: (value) => regEx.test(value),
      message: "Please enter a valid e-mail."
    }
  },
  birthdate: {
    type: String, required: false
  },
  password: {
    type: String, required: [true, 'Password is required.'],
    min: [6, 'Password should have at least 6 characters.'],
    max: [32, 'Password should have a maximum of 32 characters.']
  },
  role: {
    type: String,
    required: false,
    default: Role.USER
  },
  tickets: [{
    type: Schema.Types.ObjectId, ref: 'Ticket', required: false
  }]
}, {
  timestamps: true
}, {strict: true});

const User = mongoose.model('User', UserSchema);

// Create initial user.
hasher.hash('admin', (hash) => [
  User.findOne({})
    .then((user) => {
      if (!user) {
        const user = new User({
          firstName: 'John',
          lastName: 'Doe',
          email: 'admin@mail.com',
          password: hash,
          role: Role.ADMIN
        });
        user.save()
          .then(() => console.log({success: 'INITIAL USER CREATED'}))
          .catch((error) => console.log(error));
      }
    })
    .catch((error) => {
      console.log(error);
    })
]);

module.exports = User;
