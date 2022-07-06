/* eslint-disable no-inner-declarations */
/* eslint-disable camelcase */
const { toLower } = require('lodash');

const User = require('../../../models/user');
const EP = require('../../../models/ep');

const { unnecessaryData } = require('../../../helpers/workWithObjects');
const { filterArray } = require('../../../helpers/filterArray');
const {
  ConcatICXSheets,
  SwitchICXSheets,
} = require('../../../helpers/handleSheets/handleICXSheets');
const isAuth = require('../../../middleware/is-auth');

module.exports.EPQueries = {
  allEPs: async (_, { filters, product }, { req }) => {
    const allEPs = await EP.find({}).populate('EPManager').populate('TeamResponsible');

    const user = await User.findById(isAuth(req));
    const FunctionName = user.current_positions.function.function_short_name;
    const canViewAll = ['IM', 'MKT', 'F&L'];

    if (user.is_eb || canViewAll.includes(FunctionName)) {
      if (FunctionName === 'F&L') {
        return filterArray(
          allEPs.filter(({ Dispatch, Status }) => Dispatch === product && Status === 'Approved'),
          filters,
        ).reverse();
      }

      return filterArray(
        allEPs.filter(({ Dispatch }) => Dispatch === product),
        filters,
      ).reverse();
    }

    if (user.is_tl) {
      return filterArray(
        allEPs.filter(
          ({ Dispatch, TeamResponsible, EPManager }) => Dispatch === product
            && ((TeamResponsible && TeamResponsible.id) === user.id || (EPManager && EPManager.id) === user.id),
        ),
        filters,
      ).reverse();
    }

    return filterArray(
      allEPs.filter(
        ({ Dispatch, EPManager }) => Dispatch === product && EPManager && EPManager.id === user.id,
      ),
      filters,
    ).reverse();
  },

  getSingleEP: (_, { id }) => EP.findById(id).populate('EPManager').populate('TeamResponsible'),

  allICXEPs: async (_, { product, filters }, { req }) => {
    const user = await User.findById(isAuth(req));
    const FunctionName = user.current_positions.function.function_short_name;
    const isAlumni = user.is_alumni;

    if (user.is_eb || isAlumni || FunctionName === 'IM') {
      const getEps = SwitchICXSheets(product);
      const eps = await unnecessaryData(
        getEps.then((res) => res.filter((ep) => ep.EPName)),
        'Test',
      );

      return filterArray(eps, filters);
    }
    const getEps = SwitchICXSheets(product);
    const eps = await unnecessaryData(
      getEps.then((res) => res.filter((ep) => ep.EPName)),
      'Test',
    );

    const allEps = eps.filter(
      (e) => toLower(e.MemberResponsible).replace(/\s/g, '')
        === toLower(user.full_name).replace(/\s/g, ''),
    );

    return filterArray(allEps, filters);
  },

  getSingleICXEP: async (_, { product, name }, { req }) => {
    const user = await User.findById(isAuth(req));
    const FunctionName = user.current_positions.function.function_short_name;
    const isAlumni = user.is_alumni;

    if (user.is_admin || isAlumni || FunctionName === 'IM') {
      const eps = await ConcatICXSheets();
      return eps.find(
        (ep) => toLower(ep.EPName).replace(/\s/g, '')
          === toLower(name).replace(/\s/g, ''),
      );
    }

    const getEps = SwitchICXSheets(product);
    const eps = await unnecessaryData(
      getEps.then((res) => res.filter((ep) => ep.EPName)),
      'Test',
    );

    return eps.find(
      (ep) => toLower(ep.EPName).replace(/\s/g, '')
        === toLower(name).replace(/\s/g, ''),
    );
  },

  EPsIManage: async (_, { filters }, { req }) => {
    const findEps = await EP.find({}).populate('EPManager').populate('TeamResponsible');
    const myEPs = findEps.filter(({ EPManager }) => EPManager && (EPManager.id === isAuth(req)));

    return filterArray(myEPs, filters).reverse();
  },

  allManagers: async (_, { product }, { req }) => {
    const user = await User.findById(isAuth(req));
    const users = await User.find({}).populate('manager');
    const allUsers = users.filter((u) => !u.is_deleted);
    const userFct = user.current_positions.function.function_short_name;
    const canViewAll = ['IM', 'MKT', 'F&L'];

    if (user.is_eb || canViewAll.includes(userFct)) {
      return allUsers.filter(
        (u) => (u.is_tl || u.is_member || u.is_eb)
          && u.current_positions.function.function_short_name === product,
      );
    }

    return allUsers.filter(
      (u) => u.current_positions.function.function_short_name === userFct
        && ((u.manager && u.manager.id) === user.id || u.id === user.id),
    );
  },

  allTeamResponsible: async (_, { product }, { req }) => {
    const user = await User.findById(isAuth(req));
    const users = await User.find({});
    const allUsers = users.filter((u) => !u.is_deleted);
    const isAdmin = user.is_admin;
    const isAlumni = user.is_alumni;
    const canViewAll = ['IM', 'MKT', 'F&L'];
    const usersFct = user.current_positions.function.name;

    if (isAdmin || isAlumni || canViewAll.includes(usersFct)) {
      return allUsers.filter((u) => (u.is_eb || u.is_tl) && u.current_positions.function.function_short_name === product);
    }

    if (user.is_eb) {
      return allUsers.filter(
        (u) => u.current_positions.function.name.includes(usersFct) && (u.is_eb || u.is_tl),
      );
    }

    return allUsers.filter(
      (u) => u.id === isAuth(req),
    );
  },
};
