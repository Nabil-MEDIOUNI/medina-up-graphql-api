/* eslint-disable camelcase */
const Opportunity = require('../../../models/opportunity');
const { filterArray } = require('../../../helpers/filterArray');
const isAuth = require('../../../middleware/is-auth');

module.exports.OpportunityQueries = {
  getOpportunity: (_, { id }) => Opportunity.findById(id),

  allOpportunities: async (_, { filters }, { req }) => {
    const opportunities = await Opportunity.find({});

    return filterArray(opportunities, filters, true);
  },
};
