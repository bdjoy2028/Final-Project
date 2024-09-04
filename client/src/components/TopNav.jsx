import React from "react";
import { Link, useLocation } from "react-router-dom";
import Auth from '../utils/auth';





const TopNav = () => {
  const currentPage = useLocation().pathname;

  const handleLogout = () => {
    Auth.logout(); // Clear the token and redirect
  };



  return (

    <div className="container-fluid  ">
      <section className="row">
    <div className="navLinks ">
      <Link
        className={currentPage === "/Game" ? "highlight" : "highlightNone"}
        to="/Game"
      >
        Hangman
      </Link>
      <Link
        className={
          currentPage === "/LeaderBoard" ? "highlight" : "highlightNone"
        }
        to="/LeaderBoard"
      >
        Leaderboard{" "}
      </Link>
      
        <button className="logout" onClick={handleLogout} >
          Logout
        </button>
      
    </div>
   </section>
   </div>
  );

  // Above is our nav component that includes our LINKs and routes from react router Dom.
};
//add click event to link and inside event handler clear the user session and redirect to page.
export default TopNav;
