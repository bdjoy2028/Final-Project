const { Schema, model } = require("mongoose");

// Above, we import schema and model from mongoose 

const argon2 = require('argon2');

// Above,we use argon2 for hashing 

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+@.+\..+/, "Must match an email address!"],
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    highScore: [
      {
        type: Schema.Types.ObjectId,
        ref: "highScore",
      },
    ],
  },

  // Above, is our schema for users.
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






userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Only hash if password was modified
  try {
    const hashedPassword = await argon2.hash(this.password);
    this.password = hashedPassword; // Replace plain text password with hashed one
    next();
  } catch (err) {
    next(err);
  }
});

// Above, Middleware to hash password before saving

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (err) {
    throw err;
  }
};


// Above is a method to compare password.


const User = model("User", userSchema);

// Above, we name our model and pass our schema as reference. 

module.exports = User;

// Above, we export our user schema.
