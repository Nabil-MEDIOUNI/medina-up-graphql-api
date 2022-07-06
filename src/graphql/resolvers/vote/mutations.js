const { toLower } = require('lodash');
const bcrypt = require('bcrypt');
const { ObjectID } = require('mongodb');
const generatePassword = require('../../../helpers/others/generatePassword');
const { getArgumentInput } = require('../../../helpers/workWithObjects');
const User = require('../../../models/user');
const Vote = require('../../../models/vote');
const isAuth = require('../../../middleware/is-auth');

module.exports.VoteMutations = {
  createVote: async (_, { vote }, { req }) => {
    const creator = await User.findById(isAuth(req));
    if (!creator.is_admin) {
      throw new Error("You're not allowed to create a vote!");
    }

    const { candidates } = getArgumentInput(vote);
    const newVote = new Vote({
      ...getArgumentInput(vote),
      creator: isAuth(req),
      candidates,
      room: {
        id: generatePassword(),
        name: toLower(getArgumentInput(vote).room.name)
          .replace(/\s/g, '')
          .replace(',', '')
          .replace('.', '')
          .replace('/', ''),
      },
    });

    try {
      await newVote.save();

      const result = await Vote.findById(newVote._id).populate('creator');

      creator.createdVotes.push(newVote);
      await creator.save();
      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  joinVoteRoom: async (_, { id, name }, { req }) => {
    const user = await User.findById(isAuth(req));
    // const canVote = voters.map((voter) => toLower(voter)).includes(toLower(user.email)) || user.can_vote;
    const canVote = user.can_vote;

    const vote = await Vote.findOne({ room: { id, name } }).populate('poll_voters.voter');
    const alreadyJoined = vote.poll_voters
      .map(({ voter }) => voter.id)
      .includes(isAuth(req));

    if (!canVote) {
      throw new Error("You're are not allowed to join!");
    }
    if (!vote.open) {
      throw new Error('Room is closed!');
    }
    if (!alreadyJoined) {
      vote.poll_voters.push({
        voter: ObjectID(isAuth(req)),
      });
      vote.save();
    }

    return vote;
  },

  dismissVoter: async (_, { id, name, voterId }, { req }) => {
    const creator = await User.findById(isAuth(req));

    if (!creator.is_admin) {
      throw new Error('Youre not allowed to do this action');
    }

    const vote = await Vote.findOne({ room: { id, name } }).populate('poll_voters.voter', 'id');
    const findVoter = vote.poll_voters.find(({ voter }) => voter.id === voterId);

    if (findVoter.voter.id === isAuth(req)) {
      throw new Error("You can't dismiss yourself!");
    }
    if (!findVoter.can_vote) {
      throw new Error('Voter is already dismissed!');
    }
    if (findVoter) {
      const findUser = await User.findById(isAuth(req));

      findUser.can_vote = false;
      findVoter.can_vote = false;
      vote.save();
      findUser.save();

      return findVoter;
    }
    throw new Error('No such Voter in this room!');
  },

  closeRoom: async (_, { id, name }, { req }) => {
    const user = await User.findById(isAuth(req));
    const vote = await Vote.findOne({ room: { id, name } });
    if (!user.is_admin) {
      throw new Error('Youre not allowed to do this action');
    }
    if (!vote.open) {
      throw new Error('Room is closed!');
    }
    vote.open = false;
    vote.save();

    return vote;
  },

  showVoteResult: async (_, { id, name }, { req }) => {
    const user = await User.findById(isAuth(req));
    const vote = await Vote.findOne({ room: { id, name } });
    if (!user.is_admin) {
      throw new Error('Youre not allowed to do this action');
    }
    vote.show_result = true;
    vote.save();

    return vote;
  },

  vote: async (_, {
    id, name, candidate, vote,
  }, { req }) => {
    const getVote = await Vote.findOne({ room: { id, name: toLower(name) } }).populate('poll_voters.voter', 'id');
    const user = await User.findById(isAuth(req));
    // const canVote = voters.map((voter) => toLower(voter)).includes(toLower(user.email)) || user.can_vote;
    const canVote = user.can_vote;
    const getVoter = getVote.poll_voters.find(
      ({ voter }) => voter.id === isAuth(req),
    );

    if (!getVoter) {
      throw new Error('You need to join the poll room first!');
    }

    if (!canVote || !getVoter.can_vote) {
      throw new Error("You're are not allowed to vote!");
    }

    const candidates = getVote.candidates.map(({ full_name }) => full_name);
    if (!candidates.includes(candidate)) {
      throw new Error('Candidate does not exist in this poll!');
    }

    const alreadyVotedCandidate = getVoter.votes.candidates.includes(candidate);

    if (alreadyVotedCandidate) {
      throw new Error("You've already voted this candidate!");
    }

    const hashedVote = await bcrypt.hash(vote, 10);
    const getChoices = getVoter.vote_hashed;

    const VotedPour = async () => {
      let votedPour = false;
      for (let index = 0; index < getChoices.length; index++) {
        const checkVote = await bcrypt.compare(vote, getChoices[index]);
        if (checkVote) {
          votedPour = true;
        }
      }
      return votedPour;
    };

    if (vote === 'pour') {
      if (await VotedPour()) {
        throw new Error("You've already voted POUR in this poll!");
      } else {
        getVote.candidates.find(
          ({ full_name }) => full_name === candidate,
        ).points.with += 1;
        getVoter.voting_count += 1;

        getVoter.vote_hashed.push(hashedVote);
        getVoter.votes.candidates.push(candidate);
      }
    }

    if (vote === 'contre') {
      getVote.candidates.find(
        ({ full_name }) => full_name === candidate,
      ).points.vs += 1;
      getVoter.voting_count += 1;
      getVoter.vote_hashed.push(hashedVote);
      getVoter.votes.candidates.push(candidate);
    }

    if (getVoter.voted) {
      throw new Error("You've already voted for this poll!");
    }

    if (getVoter.voting_count === candidates.length) {
      getVoter.voted = true;
    }

    getVote.save();

    return getVote;
  },
};
