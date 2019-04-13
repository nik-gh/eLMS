const mongoose = require('mongoose');

// Class Schema

const classSchema = mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  instructor: {
    type: String,
  },
  lessons: [
    {
      lesson_number: { type: Number },
      lesson_title: { type: String },
      lesson_body: { type: String },
    },
  ],
});

const Class = (module.exports = mongoose.model('Class', classSchema));

// Fetch All Classes
module.exports.getClasses = (callback, limit) => {
  Class.find(callback).limit(limit);
};

// Fetch Single Class
module.exports.getClassById = (id, callback) => {
  Class.findById(id, callback);
};

module.exports.addLesson = (info, callback) => {
  // class_id = info.class_id;
  // lesson_number = info.lesson_number;
  // lesson_title = info.lesson_title;
  // lesson_body = info.lesson_body;
  const { class_id, lesson_number, lesson_title, lesson_body } = info;

  Class.findByIdAndUpdate(
    class_id,
    {
      $push: {
        lessons: {
          lesson_number,
          lesson_title,
          lesson_body,
        },
      },
    },
    {
      safe: true,
      upsert: true,
    },
    callback,
  );
};
