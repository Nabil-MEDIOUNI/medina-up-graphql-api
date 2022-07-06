/* eslint-disable camelcase */
const cloudinary = require('cloudinary');

const Opportunity = require('../../../models/opportunity');
const { getArgumentInput } = require('../../../helpers/workWithObjects');

module.exports.OpportunityMutations = {
  createOpportunity: async (_, { opportunity }, { req }) => {
    const newOpportunity = await Opportunity.create({
      ...getArgumentInput(opportunity),
    });

    return newOpportunity;
  },

  updateOpportunity: async (_, { id, opportunity }) => {
    const getOpportunity = await Opportunity.findById(id);

    Opportunity.findByIdAndUpdate(
      id,
      {
        $set: {
          ...getArgumentInput(opportunity),
        },
      },
      { new: true },
    ).exec(async (err) => {
      if (err) throw new Error(err);
      return getOpportunity;
    });
  },

  deleteOpportunity: async (_, { id }) => {
    const deletedOpportunity = await Opportunity.findById(id);

    if (deletedOpportunity.cover_photo.public_id) {
      await cloudinary.uploader.destroy(
        deletedOpportunity.cover_photo.public_id,
        async (result) => result,
      );
    }

    deletedOpportunity.deleteOne((err, res) => res);
  },
};
