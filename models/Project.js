const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  percentDone: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  image: {
    data: Buffer,
    contentType: String
  },
  imageData: {
    type: Buffer, // Store image data as Buffer
  },
 
  imgExt: { 
    type: String, // Store image extension (e.g., 'jpg', 'png')
  },
  owner: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    username: {
      type: String,
      required: true
    },
  },
  contributors: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    username: {
      type: String,
      required: true
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
 
});

module.exports = mongoose.model('Project', projectSchema);
