const { Schema, model } = require("mongoose");
const dateFormat = require('../utils/dateFormat');
// Above, we import our custom date format utility.


const highScoreSchema = new Schema(
  {
    highScoreTotal: {
      type: Number,
      trim: true,
    },
    highScoreName: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp)
      // Above, we use our date format with get and also set the default to Date.now
    },
  },

  // Above, is our schema for the highscores.
  {
    // Mongoose supports two Schema options to transform Objects after querying MongoDb: toJSON and toObject.
    // Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
    versionKey: false,
    toJSON: {
      virtuals: true,
    },

    id: false,
  }
);

const highScore = model("highScore", highScoreSchema);

// Above, we name our model and give our schema as reference. 

module.exports = highScore;

// Above, we export our schema.