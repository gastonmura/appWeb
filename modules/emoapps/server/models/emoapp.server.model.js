'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Emoapp Schema
 */
var EmoappSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Emoapp name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Emoapp', EmoappSchema);
