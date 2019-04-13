const mongoose = require('mongoose');

// Instructor Schema
const instructorSchema = mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  address: [
    {
      street_address: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
    },
  ],
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  classes: [
    {
      class_id: { type: [mongoose.Schema.Types.ObjectId] },
      class_title: { type: String },
    },
  ],
});

const Instructor = (module.exports = mongoose.model(
  'Instructor',
  instructorSchema,
));

// Fetch Single Class
module.exports.getInstructorByUsername = (username, callback) => {
  const query = { username };
  Instructor.findOne(query, callback);
};

// Register Instructor for Class
module.exports.register = (info, callback) => {
  const { instructor_username, class_id, class_title } = info;

  const query = { username: instructor_username };

  Instructor.findOneAndUpdate(
    query,
    {
      $push: {
        classes: {
          class_id,
          class_title,
        },
      },
    },
    { save: true, upsert: true },
    callback,
  );
};
