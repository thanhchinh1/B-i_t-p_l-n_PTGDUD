import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import CourseListPage from "../pages/courses/CourseListPage";
import CourseCreatePage from "../pages/courses/CourseCreatePage";
import CourseEditPage from "../pages/courses/CourseEditPage";
import CourseDetailPage from "../pages/courses/CourseDetailPage";
import MyCoursesPage from "../pages/MyCoursesPage";
import UsersPage from "../pages/UsersPage";

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
      {
        path: "courses/:id",
        element: <CourseDetailPage />,
      },
      {
        path: "my-courses",
        element: <MyCoursesPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      // Add Settings route here later
    ],
  },
]);
