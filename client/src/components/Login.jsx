import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import myImage from "../assets/stickGuy.png";
import { LOGIN_USER, ADD_USER } from "../utils/mutations";

import { useMutation } from "@apollo/client";
import { useState } from "react";

import Auth from "../utils/auth";

const Login = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [login, { error: loginError }] = useMutation(LOGIN_USER);
  const [addUser, { error: addUserError }] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Check if all required fields are present for user creation
    if (formState.username && formState.email && formState.password) {
      try {
        // Attempt to create a new user
        const { data } = await addUser({
          variables: {
            username: formState.username,
            email: formState.email,
            password: formState.password,
          },
        });
  
        Auth.login(data.addUser.token);
        console.log("User created and logged in:", data.addUser.user.username);
      } catch (error) {
        console.error("Error creating user:", error.message);
      }
    } else if (formState.email && formState.password) {
      try {
        // Attempt to log in the user
        const { data } = await login({
          variables: {
            email: formState.email,
            password: formState.password,
          },
        });
  
        Auth.login(data.login.token);
        console.log("User logged in:", data.login.user.username);
      } catch (error) {
        console.error("Login failed:", error.message);
      }
    } else {
      console.error("Please provide all required fields.");
    }
  };







  return (
    <>
      <section className="container-fluid  backGround ">
        <div className="row">
          <header className="Greeting">
            <h1 className="welcome">Welcome to Hangman!</h1>
          </header>

          <div className="welcome">
            <div className="welcomeImage">
              <img
                src={myImage}
                alt="stick figure holding the letter H"
                width="250px"
                height="250px"
              />
            </div>
            <div className="welcomeText">
              <p>It's a game of guess or DEATH</p>
              <br />
              <p>can YOU save HIM?</p>
              <h6 className="info">*To login provide email and password only.</h6>
            </div>
          </div>

          <section>
            <Form className="centerForm" onSubmit={handleSubmit}>
              <div className="centerSection col-12 ">
                <Form.Group
                  className=" mb-3 maxW  col-11"
                  controlId="formUserName"
                >
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    className="mb-3  maxW"
                    type="username"
                    placeholder="Enter Username"
                    name="username"
                    value={formState.username}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="centerSection col-12">
                <Form.Group
                  className="mb-3 maxW col-11"
                  controlId="formBasicEmail"
                >
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
              </div>

              <div className="centerSection col-12">
                <Form.Group
                  className="mb-3 maxW col-11"
                  controlId="formBasicPassword"
                >
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formState.password}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="formbtn">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </section>
        </div>
      </section>
    </>
  );

  // Above is our form component that we use from react bootstrap to create.
};
//add click event to link and inside event handler clear the user session and redirect to page.
export default Login;
