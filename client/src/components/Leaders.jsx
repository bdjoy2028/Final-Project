
import Table from "react-bootstrap/Table";
import Header from "./Header";

// Above are our imports for the UI

import { useQuery } from "@apollo/client";
import { QUERY_ORDERED_HIGHSCORE } from "../utils/queries";
import React, { useState, useEffect } from "react";
import Auth from "../utils/auth"; // Import AuthService


// Above are our imports for our queries

const LeaderBoard = () => {
  const { data, loading, error } = useQuery(QUERY_ORDERED_HIGHSCORE);
  const highScores = data?.usersSortedByMostRecentHighScore || [];
  console.log("highscores!", highScores);

  // Above we query the data

  useEffect(() => {
    if (!Auth.loggedIn()) {
      window.location.replace('/'); // Redirect to login if not authenticated
    }
  }, []);

  // Above is our authentication before giving access to this page.




  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Header />
      <div className="container-fluid backGround leaderBoard  ">
        <section className="row">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>High Score</th>
              </tr>
            </thead>
            <tbody>
              {highScores &&
                highScores.map((score, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{score.username}</td>
                    <td>
                      {score.mostRecentHighScore
                        ? score.mostRecentHighScore.highScoreTotal
                        : "No Score"}
                    </td>
                  </tr>
                ))}
            </tbody>
            {/*Above, we use our queried data to create a page. */}
            {/*Also, check if high score exists and handle it with no score if it doesnt. */}
          </Table>
        </section>
      </div>
    </>
  );
};
//add click event to link and inside event handler clear the user session and redirect to page.
export default LeaderBoard;

// Above is our leaderboard comonent.
