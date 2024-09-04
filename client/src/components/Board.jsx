






function generateKeypad({handleGuess,isDisabled}) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  // Above we create the letters for our board
  // Also, we pass in our props to use for this function.


  

  return (
    <section className="container-fluid keys ">
      <div className="row">
        <div className="keypad ">
          {letters.split("").map((letter, index) => (
            
            <button
            className="key"
              key={index}
              value={letter}
              onClick={()=> handleGuess(letter)}
              disabled={isDisabled}
              // Above is where we use our passsed in crops
            >
              {letter}
            </button>
            
          ))}
        </div>
      </div>
    </section>
    // Above, we map through the letters to create a keyboard.
  );
}

export default generateKeypad;

// Above is the component for our keyboardd