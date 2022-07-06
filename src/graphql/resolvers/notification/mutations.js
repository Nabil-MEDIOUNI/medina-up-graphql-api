const { toLower } = require('lodash');

const { getArgumentInput } = require('../../../helpers/workWithObjects');
const isAuth = require('../../../middleware/is-auth');
const Notification = require('../../../models/notification');
const User = require('../../../models/user');

module.exports.NotificationMutations = {
  sendNotification: async (_, { notification }, { req }) => {
    const { personal_notification, ep_id, type } = getArgumentInput(
      notification,
    );

    if (type === 'new_post') {
      const newNotification = await new Notification({
        notified_by: isAuth(req),
        ...getArgumentInput(notification),
      }).save();

      return newNotification;
    }

    if (type === 'new_ep') {
      const notifiedTo = await User.findById(personal_notification);

      const newNotification = await new Notification({
        ...getArgumentInput(notification),
        notified_by: isAuth(req),
        notified_to: {
          can_view: notifiedTo.id,
        },
        ep: {
          id: ep_id,
        },
      }).save();

      return newNotification;
    }

    if (type === 'like_comment') {
      const newNotification = await new Notification({
        ...getArgumentInput(notification),
        notified_by: isAuth(req),
        notified_to: {
          can_view: personal_notification,
        },
      }).save();

      return newNotification;
    }
  },

  seeNotification: async (_, { id }, { req }) => {
    const notification = await Notification.findById(id).populate('seen_by');
    const DEJA_VU = notification.seen_by.find(({ id }) => id === isAuth(req));

    if (!DEJA_VU) {
      notification.seen_by.push(isAuth(req));
      notification.save();
    }

    return notification;
  },

  deleteNotification: async (_, { id }, { req }) => {
    const notification = await Notification.findById(id).populate('deleted_by');
    const ALREADY_DELETED = notification.deleted_by.find(
      ({ id }) => id === isAuth(req),
    );

    if (!ALREADY_DELETED) {
      notification.deleted_by.push(isAuth(req));
      notification.save();
    }

    return notification;
  },

  seeMultipleNotifications: async (_, { ids }, { req }) => {
    const notifications = await Notification.find({}).populate('seen_by');
    const tab = [];

    for (let i = 0; i < notifications.length; i++) {
      for (let j = 0; j < notifications[i].seen_by.length; j++) {
        tab.push(notifications[i].id);
      }
    }

    for (let i = 0; i < ids.length; i++) {
      tab.push(ids[i]);
    }

    for (let i = 0; i < tab.length; i++) {
      const getNotification = await Notification.findById(tab[i]);
      getNotification.seen_by.push(isAuth(req));
      getNotification.save();
    }
  },

  deleteMultipleNotifications: async (_, { ids }, { req }) => {
    const notifications = await Notification.find({}).populate('deleted_by');
    const tab = [];

    for (let i = 0; i < notifications.length; i++) {
      for (let j = 0; j < notifications[i].deleted_by.length; j++) {
        tab.push(notifications[i].id);
      }
    }

    for (let i = 0; i < ids.length; i++) {
      tab.push(ids[i]);
    }

    for (let i = 0; i < tab.length; i++) {
      const getNotification = await Notification.findById(tab[i]);
      getNotification.deleted_by.push(isAuth(req));
      getNotification.save();
    }
  },
};
