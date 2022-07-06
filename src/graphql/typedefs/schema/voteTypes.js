const { gql } = require('apollo-server-express');

module.exports.VoteType = gql`
  type VoteType {
    id: ID
    title: String
    description: String
    candidates: [CandidateType]
    room: RoomType
    location: String
    creator: Person
    open: Boolean
    show_result: Boolean
    createdAt: String
    poll_voters: [VoterType]
  }

  type VoterType {
    voter: Person
    votes: VotesType
    voted: Boolean
    can_vote: Boolean
  }

  type VotesType {
    candidates: [String]
  }

  type CandidateType {
    full_name: String
    cover_photo: String
    short_bio: String
    location: String
    points: PointsType
  }

  type PointsType {
    with: Int
    vs: Int
  }

  type RoomType {
    id: String
    name: String
  }

  input VoteInput {
    title: String
    description: String
    candidates: [CandidateInput]
    room: RoomInput
    location: String
  }

  input CandidateInput {
    full_name: String
    cover_photo: String
    short_bio: String
    key: Int
    location: String
  }

  input RoomInput {
    name: String
  }
`;
