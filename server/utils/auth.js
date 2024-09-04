const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const secret = 'WhosSecretmysecretssshhhhhhh';
const expiration = '1h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  authMiddleware: function ({ req }) {
    
    if (!req) {
      return req;
    }



    let token = req.body?.token || req.query.token || req.headers.authorization;
      // Above,  allows the  token to be sent via req.body, req.query, or headers
    
    



    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    // We split the token string into an array and return actual token
    // Note* headers.authoriazition is coming from our set up in App.js

    if (!token) {
      return req;
    }

    // is if the token does not exist

   
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      // Note this is where the variable for our context is set.
    } catch {
      console.log('Invalid token');
    }
      // Above,if token can be verified, add the decoded user's data to the request so it can be accessed in the resolver


    return req;
    //Above, we  return the request object so it can be passed to the resolver as `context`
  },
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};