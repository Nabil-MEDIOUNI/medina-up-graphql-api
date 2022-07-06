const mongoose = require('mongoose');

const { Schema } = mongoose;

const EPSchema = new Schema(
  {
    Product: { type: String },
    Dispatch: { type: String },
    ExpaID: { type: String },
    EPName: { type: String },
    EPEmail: { type: String },
    EPPhone: { type: String },
    FacebookLink: { type: String },
    CV: { type: String },
    EPUniversity: { type: String },
    Gender: { type: String },
    EPAge: { type: String },
    EPYear: { type: String },
    CommunicationPrefrences: { type: String },
    TeamResponsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    EPManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    Status: { type: String },
    Note: { type: String },
    FinanceCorner: { type: String },
    proofOfPaiment: { type: String },
    OpportunityLink: { type: String },
    SubProduct: { type: String },
    HostLC: { type: String },
    Country: { type: String },
    AccDate: { type: String },
    APDDate: { type: String },
    REDate: { type: String },
    FinDate: { type: String },
    Travel: { type: String },
    Obstacles: { type: String },
    Prioritization: { type: String },
    Expectation: { type: String },
    is_ICX: { type: String },
    is_OGX: { type: String },
    Sent_lns: { type: String },
    Is_sign_up: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('EP', EPSchema);
