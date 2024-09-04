import { gql } from "@apollo/client";

export const QUERY_HIGHSCORE = gql`
  {
    highScores {
      _id
      createdAt
      highScoreName
      highScoreTotal
    }
  }
`;

// Above is a query to recieve the highscores 

export const QUERY_ORDERED_HIGHSCORE = gql`
  {
    usersSortedByMostRecentHighScore {
      _id
      username
      mostRecentHighScore {
        _id
        highScoreTotal
        createdAt
      }
    }
  }
`;

// Above is a query to recieve the highscores ordered

export const QUERY_SINGLE_USER = gql`
query User($userId: ID!) {
  user(id: $userId) {
    _id
    username
    email
    highScore {
      _id
      highScoreTotal
      highScoreName
      createdAt
    }
  }
}


  
`;

// Above is a query to recieve a single User and their highscores.






export const QUERY_ME = gql`
query Me {
  me {
    _id
    username
    email
    password
    highScore {
      _id
      highScoreTotal
      highScoreName
      createdAt
    }
  }
}


  
`;