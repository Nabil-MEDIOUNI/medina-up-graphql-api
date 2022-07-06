const { allTypeDefs } = require('./allTypeDefs');
const { PersonType } = require('./schema/personTypes');
const { PasswordRequest } = require('./schema/passwordRequest');
const { EPType } = require('./schema/epTypes');
const { OpportunityType } = require('./schema/opportunityTypes');
const { PostTypes } = require('./schema/postTypes');
const { VoteType } = require('./schema/voteTypes');
const { NotificationType } = require('./schema/notificationTypes');

const typedef = [
  PersonType,
  EPType,
  OpportunityType,
  PostTypes,
  NotificationType,
  VoteType,
  PasswordRequest,
  allTypeDefs,
];

module.exports = typedef;
