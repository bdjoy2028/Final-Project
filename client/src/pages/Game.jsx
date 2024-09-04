import Keypad from "../components/Board";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import image0 from "../assets/0.jpg";
import image1 from "../assets/1.png";
import image2 from "../assets/2.png";
import image3 from "../assets/3.png";
import image4 from "../assets/4.png";
import image5 from "../assets/5.png";
import image6 from "../assets/6.png";
import { useMutation } from "@apollo/client";

import { useQuery, gql } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth"; // Import AuthService
import { ADD_HIGH_SCORE } from "../utils/mutations"; // Import the mutation

let words = [
  "music",
  "basketball",
  "football",
  "youtube",
  "fire",
  "mid",
  "goat",
  "vibes",
  "adhd",
  "drip",
  "batman",
  "avengers",
  "spiderman",
  "wolverine",
  "moneyheist",
  "narcos",
  "stranger",
  "things",
  "software",
  "coding",
  "graduation",
];

function getRandomWord() {
  const randomW = words[Math.floor(Math.random() * words.length)];
  //console.log(`Random Word: ${randomW}`)
  return randomW;
}

function HangManGame() {
  const [word, setWord] = useState(getRandomWord()); // The word to guess
  const [guessedLetters, setGuessedLetters] = useState([]); // Letters guessed so far
  const [mistakes, setMistakes] = useState(0); // Number of wrong guesses
  const [gameStatus, setGameStatus] = useState(null);
  const [isKeypadDisabled, setIsKeypadDisabled] = useState(false);
  const maxMistakes = 6; // Maximum allowed mistakes

  const [addHighScore] = useMutation(ADD_HIGH_SCORE);

  // Above are all our state values

  const handleGuess = (letter) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters((prevGuessedLetters) => {
        const updatedGuessedLetters = [...prevGuessedLetters, letter];
        //console.log(updatedGuessedLetters);
        return updatedGuessedLetters;
      });
    }
    // Above checks and updates our guessed letters array only if the letter is not included there yet.

    if (!word.includes(letter)) {
      setMistakes((prevMistakes) => {
        const updatedMistakes = prevMistakes + 1;
        //console.log(`mistakes: ${updatedMistakes}`);
        return updatedMistakes;
      });
    }

    // Above checks if that letter is part of our word.
    // If the letter is part of the word no mistake is set, if not a mistake is added.
  };
  // Above is our handle guess function to handle everytime a guess is made.

  const getImage = () => {
    const images = [image0, image1, image2, image3, image4, image5, image6];
    //  Above, defines images or paths to images

    const mistakeIndex = Math.min(mistakes, images.length - 1);
    // Above, uses the mistakes variable to determine the index for the image
    return images[mistakeIndex];
  };

  // Above, is our getImage function that is responisble for displaying to correct image with the corect mistake.

  const getGameStatus = () => {
    const allLettersGuessed = word
      .split("")
      .every((letter) => guessedLetters.includes(letter));
    if (mistakes >= maxMistakes) {
      return "lose";
    }
    if (allLettersGuessed) {
      return "win";
    }
    return null; // Game is still ongoing
  };

  // Above is our get game status function that checks all letters guessed and mistakes.
  // If either are true it returns that.

  const resetGame = () => {
    setWord(getRandomWord()); // Reset to a new word
    setGuessedLetters([]); // Clear guessed letters
    setMistakes(0); // Reset mistakes
    setGameStatus(null); // Clear game status
  };

  // Above is our function that resets our state values.
  // we use this in our use effect hook once we determine if a game is over.

  useEffect(() => {
    if (!Auth.loggedIn()) {
      window.location.replace("/"); // Redirect to login if not authenticated
    }
  }, []);

  const { loading, error, data } = useQuery(QUERY_ME);

  useEffect(() => {
    const status = getGameStatus();

    if (status) {
      if (status === "win") {
        // Ensure highScore is defined and handle cases where fields might be null
        const currentHighScores = data?.me?.highScore || [];

        // Check if highScores is an array and get the last entry or default to '0'
        const lastHighScore =
          currentHighScores.length > 0
            ? currentHighScores.at(-1)
            : { highScoreTotal: "0" };

        // Get the high score total from the last high score object or default to '0'
        const highScoreTotal = lastHighScore.highScoreTotal || "0";
        const currentHighScoreNumber = parseInt(highScoreTotal, 10);

        if (isNaN(currentHighScoreNumber)) {
          console.error("Invalid current high score:", highScoreTotal);
          return;
        }

        // Calculate new high score and convert to string
        const newHighScore = (currentHighScoreNumber + 1).toString();
        const username = data?.me?.username || "Anonymous"; // Fetch username

        // Add the new high score
        addHighScore({
          variables: {
            highScoreTotal: newHighScore,
            highScoreName: username,
          },
          
        }).catch((err) => {
          console.error("Error adding high score:", err.message);
        });
      }

      setGameStatus(status);
      setIsKeypadDisabled(true);

      const timer = setTimeout(() => {
        setIsKeypadDisabled(false);
        resetGame();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [mistakes, guessedLetters,  data,  addHighScore]);

  // Above, we use the use effect hook which is responisible for checking our game status.
  // This function will run after ever render
  // It will check the game status function and if it returns anyhting it will display that message for 5 seconds
  // If game status is null it will return nothing
  // mistakes and guessedletters are our dependey arrays for this.
  // Also, we manage enabeling and disabling the keypad here.

  if (loading) return <p>Loading...</p>;

  // Handle error state
  if (error) return <p>Error: {error.message}</p>;

  console.log(data);
  console.log("Highscore data:", data.me.highScore);

  return (
    <div className="container-fluid backGround ">
      <section className="row">
        <Header />
        {gameStatus && (
          <div className="winnerDiv">
            {gameStatus === "win" ? (
              <h1 className="win">WINNER! 🏆</h1>
            ) : gameStatus === "lose" ? (
              <h1 className="lose">Sorry You Lose 😞</h1>
            ) : null}
          </div>
        )}

        <div>
          <h4 className="highScore">
            High Score:
            {Array.isArray(data.me.highScore) && data.me.highScore.length > 0
              ? data.me.highScore.at(-1).highScoreTotal || "0"
              : "0"}
          </h4>
        </div>

        <div className="gameDisplay ">
          <img
            className="gameStart "
            src={getImage()}
            alt="HangMan Start Picture"
          />
        </div>

        <section className="lineArea">
          {word.split("").map((letter, index) => (
            <div className="lines" key={index}>
              <span>
                <h4 className="letter">
                  {guessedLetters.includes(letter) ? letter : "_"}
                </h4>
                {/* Above, is how we display the letter only if it is included as part of our word */}
              </span>

              <hr className="line" />
            </div>
          ))}
          {/* Above, we map through our word to display it on our screen */}
        </section>

        <div>
          <Keypad handleGuess={handleGuess} isDisabled={isKeypadDisabled} />
          {/* Above, we pass our handleGuess function as a propt to our keypad component. */}
        </div>
      </section>
    </div>
  );
}

export default HangManGame;

// Above is our game page with our keypad imported. Later notes will be added here
