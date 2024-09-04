

const seedHighScoreData = async (arr,highScores) => {
    try {
      
        arr.forEach(item => {
           highScores.forEach(highScore=>{
            if(highScore.highScoreName === item.username){
                item.highScore.push(highScore);
                
            }

           })
        });

        // Above, is a nested loop that checkes for matches in usernames between the two arrays.

        await Promise.all(arr.map(user => user.save()));

        // Above we save each update to the array.

      console.log("Seeded highScore data for each user!");
        return arr
      // Above, lets us know that the seeding was successfull and we return the new array!

    } catch (error) {
      console.error("Error seeding highScores:", error);
      throw error; // Propagate the error for further handling
    }
};

module.exports = {seedHighScoreData};

// Above, we export our thoughts array and our fucntion to use later.