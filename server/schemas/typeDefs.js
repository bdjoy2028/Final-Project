// Above we require gql because we are using apollo-server-express

const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    highScore: [HighScore]
    mostRecentHighScore: HighScore
  }

  # Above, we also have a self created field " usersSortedByMostRecentHighScore "

  type HighScore {
    _id: ID
    highScoreTotal: Int
    highScoreName: String
    createdAt: String
  }

  # Above, defines our Schema


  type Auth {
    token: ID!
    user: User
  }

  #Above, is our auth we will pass to mutations 






  type Query {
    users: [User]
    highScores: [HighScore]
    user(id: ID!): User
    usersSortedByMostRecentHighScore: [User]
    # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
    me: User
  }

  # Above, defines our queries
  # we also add a me to get the logged in user info.
  

  type Mutation {
    # Set the required fields for new schools
    addUser(username: String!, email: String!, password: String!): Auth
    addHighScore(highScoreTotal: String!, highScoreName: String!): HighScore
    deleteUser(username: String!): String
    login(email: String!, password: String!): Auth
  }
  # Above, defines which mutations the client is allowed to make
`;

// Above are our typedefs.
// Note : type def and resolvers must be made before able to view in graphql

module.exports = typeDefs;
