import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "react-responsive-modal/styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { app } from "./Authorization/firebaseConfig.jsx";
import "./index.css";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword.jsx";
import LogIn from "./Pages/LogIn/LogIn.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import Registration from "./Pages/Registration/Registration.jsx";
import Store from "./Store.jsx";

console.log(app);
const router = createBrowserRouter([
  {
    path: "/",
    element: <LogIn />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/forgetPassword",
    element: <ForgetPassword />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <RouterProvider router={router} />
  </Provider>
);
