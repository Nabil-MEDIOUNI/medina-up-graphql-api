const isAuth = require('../../../middleware/is-auth');
const User = require('../../../models/user');

module.exports.CurrentPersonQueries = {
  currentPerson: (_, args, { req }) => User.findById(isAuth(req)).populate('manager'),
};
