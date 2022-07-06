const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary');

const User = require('../../../models/user');
const { getArgumentInput } = require('../../../helpers/workWithObjects');
const { uploadFile } = require('../../../helpers/uploadFile');
const isAuth = require('../../../middleware/is-auth');

module.exports.CurrentPersonMutations = {
  currentPersonUpdate: async (_, { person }, { req }) => {
    User.findByIdAndUpdate(
      isAuth(req),
      { $set: getArgumentInput(person) },
      { new: true },
    ).exec((err) => {
      if (err) throw new Error(err);
    });
    const user = await User.findById(isAuth(req));
    return user;
  },

  cahnge_user_connectivity: async (_, { connectivity }, { req }) => {
    const user = await User.findById(isAuth(req));
    if (!user.connected_once) {
      user.connected_once = true;
    }

    user.is_connected = connectivity;

    user.save();

    return user;
  },

  currentPersonUpdatePassword: async (_, { oldPassword, newPassword }, { req }) => {
    const user = await User.findById(isAuth(req));
    const valid = await bcrypt.compare(oldPassword, user.password);

    if (!valid) {
      throw new Error('Incorrect password setted');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.save();
    return user;
  },

  changeCoverPhoto: async (_, { file }, { req }) => {
    const user = await User.findById(isAuth(req));
    if (user.cover_photo.public_id) {
      await cloudinary.uploader.destroy(user.cover_photo.public_id, async (result) => result);
    }

    const { filename } = await file;
    const { createReadStream } = await file;
    const { public_id: id, url } = await uploadFile(filename, createReadStream);

    User.findByIdAndUpdate(
      isAuth(req),
      { $set: { cover_photo: { public_id: id, url } } },
      { new: true },
    ).exec((err) => {
      if (err) throw new Error(err);
    });
    return user;
  },
};
