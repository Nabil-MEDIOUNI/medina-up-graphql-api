const mongoose = require('mongoose');

const { Schema } = mongoose;

const VoteSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    location: { type: String },
    open: { type: Boolean, default: true },
    show_result: { type: Boolean, default: false },
    candidates: [
      {
        full_name: { type: String },
        cover_photo: { type: String },
        short_bio: { type: String },
        location: { type: String },
        points: {
          with: { type: Number, default: 0 },
          vs: { type: Number, default: 0 },
        },
      },
    ],
    room: {
      id: { type: String },
      name: { type: String },
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    poll_voters: [
      {
        voter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        voted: { type: Boolean, default: false },
        can_vote: { type: Boolean, default: true },
        vote_hashed: [{ type: String, default: [] }],
        voting_count: { type: Number, default: 0 },
        votes:
          {
            candidates: [{ type: String, default: [] }],
          },
        default: [],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Vote', VoteSchema);
