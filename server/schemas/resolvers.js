const { User, HighScore } = require("../models");

// Above, we import our models

const { signToken, AuthenticationError } = require("../utils/auth");
// Above we import our signed token

const resolvers = {
  Query: {
    users: async () => {
      return await User.find({}).populate("highScore");
    },

    // Above is our users query that returns all users with .find and populates the highscores using "highscore"  name in our schema.
    highScores: async () => {
      return await HighScore.find({}).sort({ highScoreTotal: -1 });
    },
    // Above, is our highscores query that populates all the highscores in our db.

    user: async (parent, args, context, info) => {
      const { id } = args;

      try {
        const user = await User.findById(id).populate("highScore").exec(); // Replace with your data fetching logic
        // Above, we try and find the user by id

        if (!user) {
          throw new Error("User not found");
        }
        // Above, is our error handeler if a user is not found

        return user;

        // Above we return the user.
      } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
    },
    // Above is our query to get one user by id and thier highscores as well.

    usersSortedByMostRecentHighScore: async () => {
      try {
        const users = await User.find({}).populate("highScore");
        // Above, we fetch all users from the database

        const usersWithRecentHighScores = users.map((user) => {
          if (!Array.isArray(user.highScore)) {
            return {
              ...user._doc,
              mostRecentHighScore: null,
            };
          }



          const mostRecentHighScore =
            user.highScore.sort(
              (a, b) => b.highScoreTotal - a.highScoreTotal
            )[0] || null;
          // Above, we Sort highScores by highScoreTotal in descending order and get the highest one

          return {
            ...user._doc,
            mostRecentHighScore,
          };
          // Above, we add the most recent high score to the user object
        });

        // Above, we map over users to find their most recent high score

        const sortedUsers = usersWithRecentHighScores.sort((a, b) => {
          const scoreA = a.mostRecentHighScore
            ? a.mostRecentHighScore.highScoreTotal
            : 0;
          const scoreB = b.mostRecentHighScore
            ? b.mostRecentHighScore.highScoreTotal
            : 0;
          return scoreB - scoreA;
        });
        //  Above, we sort users by their most recent high score in descending order
        // Note * Above, is our sort function that compares the values in a array.
        return sortedUsers;

        // ABove we return our sorted users
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },

    // Above is our query for sorted highscores.

    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('highScore');;
      }
      throw AuthenticationError;
    },
  },

  // Define the functions that will fulfill the mutations
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      // Create and return the new School object
      try {
        const newUser = await User.create({ username, email, password });
        const token = signToken(newUser);
        return { token, user : newUser };
      } catch (error) {
        console.error("Error adding user:", error);
        throw new Error("Failed to add user");
      }
    },
    // Above, is our resolver to add a new user.
    // We also attach a token whenever a new user is added

    addHighScore: async (
      parent,
      { highScoreTotal, highScoreName },
      context
    ) => {
      try {
        if (!context.user) {
          throw AuthenticationError;
        }
        // Above is to check if user is logged in before making request

        // Above, is our create a new high score mutation
        const user = await User.findOne({ username: highScoreName });
        if (!user) {
          throw new Error("User not found");
        }

        const newHighScore = await HighScore.create({
          highScoreTotal,
          highScoreName,
        });

        // Update the user's highScores array
        await User.findOneAndUpdate(
          { username: highScoreName }, // Filter to find the user by username
          { $push: { highScore: newHighScore._id } }, // Push the new high score ID to the user's highScores array
          { new: true } // Option to return the updated user document
        );

        return newHighScore;
      } catch (error) {
        console.error("Error adding high score:", error);
        throw new Error("Failed to add high score");
      }
    },
    // Above is our resolver to add a highscore and attach it to its respective user.

    deleteUser: async (parent, { username }, context) => {
      try {
        if (!context.user) {
          throw AuthenticationError
        }
        // Above is to check if user is logged in before making request

        const user = await User.findOne({ username });
        // Above, we find a user by username

        if (!user) {
          throw new Error("User not found");
        }
        // Above is our error to handle if a user is not found

        await HighScore.deleteMany({ _id: { $in: user.highScore } });
        // Above, delete the associated high scores

        const deletedUser = await User.findOneAndDelete({ username });
        //  Above, we find the user by username and delete them

        if (!deletedUser) {
          throw new Error("User not found");
        }
        // Above, is our error to handle if a user is deleted.

        return `User ${username} & highscores successfully deleted.`;
      } catch (error) {
        console.error("Error deleting user & high scores:", error);
        throw new Error("Failed to delete use & high scores");
      }
    },
    // Above is our resolver to delete a user and thier highscores

    login: async (parent, { email, password }) => {
      try {
        const profile = await User.findOne({ email });
        // Above, we find the the user by email

        if (!profile) {
          throw AuthenticationError;
        }

        const correctPw = await profile.comparePassword(password);

        if (!correctPw) {
          throw AuthenticationError;
        }

        const token = signToken(profile);
        return { token, profile };
      } catch (error) {
        console.error("Error logging user in:", error);
        throw new Error("Failed to Log in!");
      }
    },
  },
};

//Above, we create our resolvers with our queries in them.

module.exports = resolvers;
