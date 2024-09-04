import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Above are our imports to begin the application 

import "./styles/Style.css";
import 'bootstrap/dist/css/bootstrap.min.css';

// Above are our style imports 





import LeaderBoard from "./pages/LeaderBoard.jsx";
import Home from "./pages/Login.jsx";
import Game from "./pages/Game.jsx";
import Error from './pages/Error.jsx';

// Above are our page imports 


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/Game",
        element: <Game/>,
      },
      {
        path: "/LeaderBoard",
        element: <LeaderBoard />,
      },
    ],
  },
]);

// Above creates our router and sets our routes that connect to the respective page.

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

// Above is responisble for rendering our React Dom application with our router.
