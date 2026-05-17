import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import CourseListPage from "../pages/courses/CourseListPage";
import CourseCreatePage from "../pages/courses/CourseCreatePage";
import CourseEditPage from "../pages/courses/CourseEditPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "courses",
        element: <CourseListPage />,
      },
      {
        path: "courses/create",
        element: <CourseCreatePage />,
      },
      {
        path: "courses/edit/:id",
        element: <CourseEditPage />,
      },
      // Add other protected routes here (Users, Settings)
    ],
  },
]);
