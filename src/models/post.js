const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    post_components: [
      {
        component_attachment: {
          filename: { type: String },
          file: { type: String },
          filesize: { type: Number },
          type: { type: String },
          id: { type: String },
        },
      },
    ],
    posted_to: {
      can_view: { type: String },
      department: { type: String },
    },
    post_type: { type: String },
    likes: {
      count: { type: Number, default: 0 },
      liked_by: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: [],
        },
      ],
    },
    comments: [
      {
        comment: { type: String },
        createdAt: { type: String },
        likes: {
          count: { type: Number, default: 0 },
          liked_by: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
              default: [],
            },
          ],
        },
        replies: [{
          comment: { type: String },
          commenter:
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
        }],
        commenter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    seen_by: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    }],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    is_approved:  {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Post', PostSchema);
