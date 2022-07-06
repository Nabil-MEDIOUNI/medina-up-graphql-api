const { gql } = require('apollo-server-express');

module.exports.PersonType = gql`

  type Manager {
    id: ID
    full_name: String
    cover_photo: PhotoType
  }
  type PositionType {
    position_name: String
    function: FunctionType
  }
  type FunctionType {
    name: String
    function_short_name: String
  }
  type ContactType {
    email: String
    phone: String
  }
  type PersonProfile {
    gender: String
    current_positions: String
    programm: String
    team_responsible: String
  }
  type PhotoType {
    url: String
    public_id: String
  }

  type Person {
    id: ID
    first_name: String
    last_name: String
    full_name: String
    cover_photo: PhotoType
    email: String
    gender: String
    dob: String
    is_admin: Boolean
    is_connected: Boolean
    connected_once: Boolean
    No_login: Int
    is_verified: Boolean
    is_eb: Boolean
    is_tl: Boolean
    is_member: Boolean
    is_manager: Boolean
    is_deleted: Boolean
    is_lcp: Boolean
    is_alumni: Boolean
    can_vote: Boolean
    createdPosts: [Post]
    contact_detail: ContactType
    current_positions: PositionType
    manager: Person
    person_profile: PersonProfile
  }

  input PersonInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    dob: String
    can_vote: Boolean
    is_admin: Boolean
    is_verified: Boolean
    contact_detail: ContactInput
    current_positions: PositionInput
    manager: String
  }

  input ContactInput {
    email: String
    phone: String
  }

  input PositionInput {
    position_name: String
    function: FunctionInput
  }

  input FunctionInput {
    name: String
    function_short_name: String
  }

  input PeopleFilter {
    gender: [String]
    current_positions: [String]
    product: [String]
    function: [String]
    team_responsible: [String]
  }
`;
