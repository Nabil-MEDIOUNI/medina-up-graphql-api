/* eslint-disable camelcase */
const User = require('../../../models/user');
const { filterArray } = require('../../../helpers/filterArray');
const isAuth = require('../../../middleware/is-auth');

module.exports.PersonQueries = {
  getPerson: (_, args) => User.findById(args.id).populate('manager'),

  allPeople: async (_, { filters }, { req }) => {
    const user = await User.findById(isAuth(req));
    const users = await User.find().populate('manager');
    const allUsers = users.filter((u) => !u.is_deleted).reverse();

    const isAdmin = user.is_admin;
    const isAlumni = user.is_alumni;
    const usersFct = user.current_positions.function.name;

    const canViewAll = ['IM', 'TM'];

    if (isAdmin || canViewAll.includes(usersFct)) {
      const allPeople = allUsers.filter((u) => u.id !== user.id);
      const filteredData = filterArray(allPeople, filters, true);
      return filteredData;
    }

    if (isAlumni) {
      const allPeople = allUsers.filter(
        (u) => (u.is_alumni || u.is_admin || u.lcp) && u.id !== user.id,
      );
      return filterArray(allPeople, filters, true);
    }

    const allPeople = allUsers.filter(
      (u) => u.current_positions.function.name.includes(usersFct)
        && u.id !== user.id,
    );
    return filterArray(allPeople, filters, true);
  },

  allTeamLeaders: async () => {
    const users = await User.find({});
    const allUsers = users.filter((u) => !u.is_deleted);

    return allUsers.filter((u) => u.is_tl);
  },

};
