'use strict';

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // check header or url parameters or post parameters for token
  let jwtToken = ''
  jwtToken = req.get('Authorization') || req.query.token || req.body.token || req.headers['x-access-token'] || req.get('authorization');
  let jwtTokenFinal
  // comprobar que tengo token

  if (!jwtToken) {
    req.apiAuthUserId = '';
    req.apiAuthUserRole = -1;

    next();
    return ;
    
  } else {

    jwtTokenFinal = jwtToken.replace('Bearer ','')
  
  }

  

  // Verifies secret and checks exp
  jwt.verify(jwtTokenFinal, process.env.JWT_SECRET, (err, payload) => {

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