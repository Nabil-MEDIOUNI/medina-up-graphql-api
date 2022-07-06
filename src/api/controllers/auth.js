/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid');
const { toLower } = require('lodash');

const generateAccessToken = require('../../helpers/others/generateAccessToken');
const { sendResetLink } = require('../../helpers/sendEmail');

const User = require('../../models/user');
const Requests = require('../../models/passwordRequest');


exports.login = async (req, res) => {
  const { email, password, remember } = req.body;
  const lowerEmail = toLower(email).replace(/\s/g, '');

  const getUser = await User.findOne({ email: lowerEmail }).select(
    'id email password is_verified is_deleted connected_once No_login',
  );

  if (!getUser || getUser.is_deleted) {
    return res.status(403).json({
      error: 'No user with that email!',
    });
  }

  const valid = await bcrypt.compare(password, getUser.password);
  if (!valid) {
    return res.status(403).json({
      error: 'Incorrect password!',
    });
  }

  if (!getUser.is_verified) {
    return res.status(403).json({
      error: 'Your account is not verified!',
    });
  }

  if (!getUser.connected_once) {
    getUser.connected_once = true;
  }
  
  const maxAge = remember ? '1y' : '12h';
  const token = generateAccessToken(getUser, maxAge);
  
  getUser.No_login++;
  getUser.save();
  
  res.json(token);
};

exports.specialLogin = async (req, res) => {
  const { email } = req.body;
  const lowerEmail = toLower(email).replace(/\s/g, '');

  const getUser = await User.findOne({ email: lowerEmail }).select(
    'id email is_verified is_deleted connected_once',
  );

  if (!getUser || getUser.is_deleted) {
    return res.status(403).json({
      error: 'No user with that email!',
    });
  }

  if (!getUser.is_verified) {
    return res.status(403).json({
      error: 'Your account is not verified!',
    });
  }

  if (!getUser.connected_once) {
    getUser.connected_once = true;
    getUser.save();
  }

  const token = generateAccessToken(getUser, '12h');

  res.json(token);
};

exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  const lowerEmail = toLower(email).replace(/\s/g, '');

  const thisUser = await User.findOne({ email: lowerEmail });

  if (!thisUser || thisUser.is_deleted) {
    return res.status(403).json({
      error: 'No user with that email!',
    });
  }

  const id = uuidv1.v1();
  const request = {
    id,
    email: thisUser.email,
  };
  Requests.create(request);
  sendResetLink(thisUser.email, id);

  res.json(request);
};

exports.changePassword = async (req, res) => {
  const { email, password, id } = req.body;
  const lowerEmail = toLower(email).replace(/\s/g, '');
  const getRequest = await Requests.findOne({ email: lowerEmail, id });

  if (getRequest) {
    const user = await User.findOne({ email: lowerEmail });
    user.password = await bcrypt.hash(password, 10);
    user.save();
    await Requests.findOneAndRemove({ id });

    res.json(user);
  }

  return res.status(403).json({
    error: 'User / Request does not exist!',
  });
};
