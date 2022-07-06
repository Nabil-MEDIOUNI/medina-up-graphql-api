const jwt = require('jsonwebtoken');

module.exports = (WSreq) => {
  const authHeader = WSreq.request.headers.authorization;

  if (!authHeader) {
    throw new Error('Error: Unauthenticated!');
  }

  const tokenAuthPart = authHeader.split(' ');
  let encodedPayload = tokenAuthPart[1];

  jwt.verify(tokenAuthPart[1], process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      console.log('Error: Unauthenticated!');
    } else {
      encodedPayload = data._id;
    }
  });

  return encodedPayload;
};
