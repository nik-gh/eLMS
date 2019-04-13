const mongoose = require('mongoose');

// Student Schema
const studentSchema = mongoose.Schema({
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

const Student = (module.exports = mongoose.model('Student', studentSchema));

// Fetch Single Class
module.exports.getStudentByUsername = (username, callback) => {
  const query = { username };
  Student.findOne(query, callback);
};

// Register Student for Class
module.exports.register = (info, callback) => {
  const { student_username, class_id, class_title } = info;

  const query = { username: student_username };

  Student.findOneAndUpdate(
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
