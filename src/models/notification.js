const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    type: {
      type: String,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    ep: {
      id: { type: String },
    },
    notified_to: {
      can_view: { type: String },
      department: { type: String },
    },
    notified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    seen_by: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    }],
    deleted_by: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    }],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Notification', NotificationSchema);
