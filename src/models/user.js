const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    full_name: {
      type: String,
      default: '',
      unique: true,
    },
    contact_detail: {
      email: { type: String },
      phone: { type: String, maxlength: 9 },
    },
    cover_photo: {
      url: { type: String },
      public_id: { type: String },
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      default: '',
    },
    dob: {
      type: String,
      default: new Date().toISOString(),
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    is_lcp: {
      type: Boolean,
      default: false,
    },
    is_eb: {
      type: Boolean,
      default: false,
    },
    is_alumni: {
      type: Boolean,
      default: false,
    },
    is_tl: {
      type: Boolean,
      default: false,
    },
    is_member: {
      type: Boolean,
      default: false,
    },
    is_manager: {
      type: Boolean,
      default: false,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    connected_once: {
      type: Boolean,
      default: false,
    },
    is_connected: {
      type: Boolean,
      default: false,
    },
    No_login: {
      type: Number,
      default: 0,
    },
    can_vote: {
      type: Boolean,
      default: false,
    },
    current_positions: {
      position_name: {
        type: String,
      },
      function: {
        name: { type: String },
        function_short_name: { type: String },
      },
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    createdVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote',
      },
    ],
    person_profile: {
      gender: { type: String },
      current_positions: { type: String },
      function: { type: String },
      product: { type: String },
      team_responsible: { type: String },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
