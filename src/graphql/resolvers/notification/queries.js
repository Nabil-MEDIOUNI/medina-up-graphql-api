const isAuth = require('../../../middleware/is-auth');
const Notification = require('../../../models/notification');
const User = require('../../../models/user');

module.exports.NotificationQueries = {
  neverSeenNotifications: async (_, args, { req }) => {
    const user = await User.findById(isAuth(req)).populate('manager');
    const userFunction = user.current_positions.function.function_short_name;
    const isMember = user.is_member;
    const isAlumni = user.is_alumni;
    const notifications = await Notification.find({})
      .populate('notified_by')
      .populate('seen_by._id')
      .populate('deleted_by._id')
      .populate({
        path: 'post',
        populate: {
          path: 'creator',
        },
      });

    const NEVER_SEEN = notifications.filter(
      ({ seen_by }) => !seen_by.includes(isAuth(req)),
    );

    const NOT_DELETED = NEVER_SEEN.filter(
      ({ deleted_by }) => !deleted_by.includes(isAuth(req)),
    );

    if (isAlumni) {
      return NOT_DELETED.filter(
        (notif) => notif.notified_to.can_view === 'All Alumni'
          || notif.notified_to.can_view === isAuth(req)
          || (notif.notified_by.id === isAuth(req) && notif.type === 'new_post'),
      ).reverse();
    }

    if (!isMember) {
      return NOT_DELETED.filter(
        (notif) => notif.notified_to.can_view === isAuth(req)
          || notif.notified_to.can_view === 'Local Committee'
          || (notif.notified_to.can_view === 'Only EB' && user.is_eb)
          || (notif.notified_to.can_view === 'All Alumni'
            && (user.is_admin || user.is_lcp))
          || (notif.notified_to.can_view === 'My Department'
            && notif.notified_to.department === userFunction)
          || (notif.notified_by.id === isAuth(req) && notif.type === 'new_post'),
      ).reverse();
    }

    return NOT_DELETED.filter(
      (notif) => (notif.post
          && notif.post.creator.id === user.manager
          && user.manager.id)
        || notif.notified_to.can_view === 'Local Committee'
        || notif.notified_to.can_view === isAuth(req)
        || (notif.notified_by.id === isAuth(req) && notif.type === 'new_post'),
    ).reverse();
  },

  allNotifications: async (_, args, { req }) => {
    const user = await User.findById(isAuth(req)).populate('manager');
    const userFunction = user.current_positions.function.function_short_name;
    const isMember = user.is_member;
    const isAlumni = user.is_alumni;

    const notifications = await Notification.find({})
      .populate('notified_by')
      .populate('seen_by')
      .populate('deleted_by._id')
      .populate({
        path: 'post',
        populate: {
          path: 'creator',
        },
      });

    const NOT_DELETED = notifications.filter(
      ({ deleted_by }) => !deleted_by.includes(isAuth(req)),
    );

    if (isAlumni) {
      return NOT_DELETED.filter(
        (notif) => notif.notified_to.can_view === 'All Alumni'
          || notif.notified_to.can_view === isAuth(req)
          || (notif.notified_by.id === isAuth(req) && notif.type === 'new_post'),
      ).reverse();
    }
    if (!isMember) {
      return NOT_DELETED.filter(
        (notif) => notif.notified_to.can_view === isAuth(req)
          || notif.notified_to.can_view === 'Local Committee'
          || (notif.notified_to.can_view === 'Only EB' && user.is_eb)
          || (notif.notified_to.can_view === 'All Alumni' && (user.is_admin || user.is_lcp))
          || (notif.notified_to.can_view === 'My Department' && notif.notified_to.department === userFunction)
          || (notif.notified_by.id === isAuth(req) && notif.type === 'new_post'),
      ).reverse();
    }

    return NOT_DELETED.filter(
      (notif) => (notif.post && notif.post.creator.id === user.manager && user.manager.id)
        || notif.notified_to.can_view === 'Local Committee'
        || notif.notified_to.can_view === isAuth(req)
        || (notif.notified_by.id === isAuth(req) && notif.type === 'new_post'),
    ).reverse();
  },

  getNotification: (_, { id }) => Notification.findById(id)
    .populate('notified_by')
    .populate('seen_by')
    .populate('post'),
};
