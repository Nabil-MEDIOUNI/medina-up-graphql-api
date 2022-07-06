const { PersonQueries } = require('./person/queries');
const { PersonMutations } = require('./person/mutations');

const { CurrentPersonQueries } = require('./currentPerson/queries');
const { CurrentPersonMutations } = require('./currentPerson/mutations');

const { EPQueries } = require('./ep/queries');
const { EPMutations } = require('./ep/mutations');

const { PostQueries } = require('./post/queries');
const { PostMutations } = require('./post/mutations');

const { VoteQueries } = require('./vote/queries');
const { VoteMutations } = require('./vote/mutations');

const { NotificationQueries } = require('./notification/queries');
const { NotificationMutations } = require('./notification/mutations');

const { OpportunityQueries } = require('./opportunity/queries');
const { OpportunityMutations } = require('./opportunity/mutations');

const resolvers = {
  Query: {
    ...PersonQueries,
    ...CurrentPersonQueries,
    ...EPQueries,
    ...OpportunityQueries,
    ...PostQueries,
    ...VoteQueries,
    ...NotificationQueries,
  },
  Mutation: {
    ...PersonMutations,
    ...CurrentPersonMutations,
    ...EPMutations,
    ...OpportunityMutations,
    ...PostMutations,
    ...VoteMutations,
    ...NotificationMutations,
  },
};

module.exports = resolvers;
