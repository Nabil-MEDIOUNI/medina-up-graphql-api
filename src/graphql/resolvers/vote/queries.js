const isAuth = require('../../../middleware/is-auth');
const Vote = require('../../../models/vote');

module.exports.VoteQueries = {
  allVotes: () => Vote.find().populate('creator', 'full_name cover_photo'),

  getVoters: async (_, { id, name }) => {
    const voters = await Vote.findOne({ room: { id, name } });

    return voters.poll_voters;
  },

  getSingleVoter: async (_, { id, name }, { req }) => {
    const singleVote = await Vote.findOne({ room: { id, name } }).populate('poll_voters.voter');
    const singleVoter = singleVote.poll_voters.find(
      ({ voter }) => voter.id === isAuth(req),
    );

    return singleVoter;
  },

  getRoom: async (_, { id, name }) => {
    const vote = await Vote.findOne({ room: { id, name } }).populate(
      'creator',
      'full_name cover_photo current_positions',
    ).populate('poll_voters.voter');

    return vote;
  },

  getCandidate: async (_, { id, name, candidate }) => {
    const vote = await Vote.findOne({ room: { id, name } });
    const getCandidate = vote.candidates.find(
      ({ full_name }) => full_name === candidate,
    );

    return getCandidate;
  },
};
