const mongoose = require('mongoose');

const { Schema } = mongoose;

const OpportunitySchema = new Schema(
  {
    expaID: { type: String },
    title: { type: String },
    status: { type: String },
    sdg_number: { type: Number },
    product: { type: String },
    remote_opportunity: { type: Boolean, default: false },
    organization: {
      name: { type: String },
      description: { type: String },
      location: { type: String },
    },
    home_lc: { type: String },
    home_mc: { type: String },
    host_lc: { type: String },
    cover_photo: {
      url: { type: String },
      public_id: { type: String },
    },
    project_fee: {
      currency: { type: String },
      fee: { type: Number },
    },
    specifics_info: {
      alphabetic_code: { type: String },
      salary: { type: Number },
    },
    transparent_details: {
      covers_accomodation: { type: String },
      covers_administrative_costs: { type: String },
      covers_leadership_spaces: { type: String },
      covers_pickup: { type: String },
    },
    applicants_count: { type: Number, default: 0 },
    slots: [
      {
        title: { type: String },
        status: { type: String },
        openings: { type: Number },
        available_openings: { type: Number },
        start_date: { type: String },
        end_date: { type: String },
      },
    ],
    managers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: '',
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Opportunity', OpportunitySchema);
