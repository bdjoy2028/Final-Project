const connection = require("../config/connection");

const seedUserData = require("./user");

// Above, we import our connection , and seedUserData function.

connection.on("error", (err) => err);

// Above we check if our connection is on.

connection.on("connected", () => {
  console.log("Mongoose connected to tech-friends_db");
});

// Above, we make sure our connection is connected

connection.once("open", async () => {
  try {
    let userCheck = await connection.db
      .listCollections({ name: "users" })
      .toArray();

    let highScoreCheck = await connection.db
      .listCollections({ name: "highscores" })
      .toArray();

    if (userCheck.length) {
      await connection.dropCollection("users");
    }

    if (highScoreCheck.length) {
      await connection.dropCollection("highscores");
    }

    // Above, once our connection is open we check if our user and high score model exists.
    // If either exist, we drop them.

    await seedUserData();

    // Above, we seed the db using our seedUserData function

    console.info("Seeding complete! 🌱");
    process.exit(0);

    // Above, we log seeding complete and exit our current process.
  } catch (error) {
    console.error("Error seeding db:", error);
    throw error; // Propagate the error for further handling
  }
});
