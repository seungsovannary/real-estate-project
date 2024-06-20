import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Homepage from "./Pages/Homepage";
import BrowsePage from "./Pages/BrowsePage";
import SignUpPage from "./Pages/SignUpPage";
import SignInPage from "./Pages/SignInPage";
import ItemDetailPage from "./Pages/ItemDetailPage";
import AboutUsPage from "./Pages/AboutUsPage";

import AdminDashboardPage from "./Pages/Admin/DashboardPage";
import AdminUsersPage from "./Pages/Admin/Users/ListPage";
import AdminUserEditPage from "./Pages/Admin/Users/EditPage";
import AdminPropertyPage from "./Pages/Admin/Properties/ListPage";
import AdminPropertyCreatePage from "./Pages/Admin/Properties/CreatePage";
import AdminCategoryPage from "./Pages/Admin/Categories/ListPage";
import AdminRequestPropertyPage from "./Pages/Admin/Properties/RequestListPage";

import SellerDashboardPage from "./Pages/Seller/DashboardPage";
import SellerPropertyPage from "./Pages/Seller/ListPage";
import SellerPropertyCreatePage from "./Pages/Seller/CreatePage";
// import SellerCategoryPage from './Pages/Seller/Categories/ListPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Homepage />} />
      <Route path="browse" element={<BrowsePage />} />
      <Route path="sign-up" element={<SignUpPage />} />
      <Route path="sign-in" element={<SignInPage />} />
      <Route path="item/:id" element={<ItemDetailPage />} />
      <Route path="about-us" element={<AboutUsPage />} />

      <Route path="admin">
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/:id/edit" element={<AdminUserEditPage />} />
        <Route path="properties" element={<AdminPropertyPage />} />
        <Route path="properties/create" element={<AdminPropertyCreatePage />} />
        <Route
          path="properties/request"
          element={<AdminRequestPropertyPage />}
        />
        <Route path="categories" element={<AdminCategoryPage />} />
      </Route>

      <Route path="seller">
        <Route index element={<SellerDashboardPage />} />
        <Route path="dashboard" element={<SellerDashboardPage />} />
        <Route path="properties" element={<SellerPropertyPage />} />
        <Route
          path="properties/create"
          element={<SellerPropertyCreatePage />}
        />
        {/* <Route path='categories' element={<SellerCategoryPage />} /> */}
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
