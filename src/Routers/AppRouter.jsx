import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayOut from "../LayOut/LayOut";
import Home from "../Pages/Home/Home";
import Restaurant from "../Pages/Restaurant/Restaurant";
import NoUrl from "../Pages/NoUrl/NoUrl";
import MenuManagement from "../Pages/Menu/Menu";
import Login from "../Pages/Auth/Login";
import Signup from "../Pages/Auth/Signup";

const router1 = createBrowserRouter([
  {
    path: "/",
    element: <MainLayOut />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "restaurant",
        element: <Restaurant />,
      },
      {
        path: "restaurant/:restaurantId/menu",
        element: <MenuManagement />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "*",
        element: <NoUrl />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router1} />;
};

export default AppRouter;
