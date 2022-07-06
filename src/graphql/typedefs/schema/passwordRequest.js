const { gql } = require('apollo-server-express');

module.exports.PasswordRequest = gql`
  type PasswordRequest {
    id: ID
    email: String
  }
`;
