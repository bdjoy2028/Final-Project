const { User, HighScore } = require("../models");
const mongoose = require("mongoose");
const { seedHighScoreData } = require("./highscore");
const argon2 = require("argon2");

// Above, we import our models , mongoose, argon2 for hashing and our seedHighScoreData function

const userData = require("../utils/userSeeds.json");
const highScoreData = require("../utils/highScoreSeeds.json");

// Above we import our json data that we created for our seeds.

const hashPasswords = async (users) => {
  // Map through user data and return an array of promises
  const usersPwHash = await Promise.all(
    users.map(async (user) => {
      // Hash the password
      const hashedPassword = await argon2.hash(user.password);

      // Return the user object with hashed password
      return {
        ...user,
        password: hashedPassword,
      };
    })
  );

  return usersPwHash;
};

// Above is our function to has the passwords in our seeds.
// Our async function accepts a array and and uses promise.all and map to has the password and return a new hashed password and new object array with hashed passwords.

const seedUserData = async () => {
  try {
    const hashPWForUsers = await hashPasswords(userData);

    // Above, we use our hash password function and pass in our userdata!

    const usersWithIds = hashPWForUsers.map((user) => {
      return {
        ...user,
        _id: new mongoose.Types.ObjectId(),
      };
    });

    const highScoreWithids = highScoreData.map((highScore) => {
      return {
        ...highScore,
        _id: new mongoose.Types.ObjectId(),
      };
    });

    // Above, we add id's to both our json datas.
    // This is needed because a _id field is required in mongoose.

    const newUsers = await User.insertMany(usersWithIds);
    console.log("Added users to database!");

    // Above we create new users in our db with insert many.

    const newHighScores = await HighScore.insertMany(highScoreWithids);
    console.log("Added HighScores to database!");

    // Above, we create highscores in our db with insert many.

    const newUsersWithHighScores = await seedHighScoreData(
      newUsers,
      newHighScores
    );
    console.log("Added users with highscores to database!");

    // Above, we use our seedHighScoreData fucntion to match our users with their high scores.
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error; // Propagate the error for further handling
  }
};

module.exports = seedUserData;
