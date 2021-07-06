'use strict';

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const jwtToken = req.get('Authorization') || req.query.token || req.body.token || req.headers['x-access-token'];

  // comprobar que tengo token
  if (!jwtToken) {
    const error = new Error('No token provided');
    error.status = 401;
    next(error);
    return;
  }

  // Verifies secret and checks exp
  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
    const decodedToken = jwt.decode(jwtToken)
    if (err) {
      //Verifies if error is expired token or incorrect format
    
      if (Date.now() >= decodedToken.exp * 1000) {
        err.message = `Expired token - ${err.message}`
        err.status = 401;
        next(err);
        return;
      }
      err.message = `Invalid token - ${err.message}`
      err.status = 401;
      next(err);
      return;
    }
    req.apiAuthUserId = payload._id;
    req.apiAuthUserRole = payload.role;
    next();
  });
  
};