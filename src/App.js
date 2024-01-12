import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import Homepage from './Pages/Homepage';
import BrowsePage from './Pages/BrowsePage';
import SignUpPage from './Pages/SignUpPage';
import SignInPage from './Pages/SignInPage';
import ItemDetailPage from './Pages/ItemDetailPage';
import CreatePostPage from './Pages/CreatePostPage';
import AboutUsPage from './Pages/AboutUsPage';

import AdminDashboardPage from './Pages/Admin/DashboardPage';
import AdminUsersPage from './Pages/Admin/UsersPage';
import AdminPropertyPage from './Pages/Admin/PropertyPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route index element={<Homepage />} />
      <Route path='browse' element={<BrowsePage />} />
      <Route path='sign-up' element={<SignUpPage />} />
      <Route path='sign-in' element={<SignInPage />} />
      <Route path='create-post' element={<CreatePostPage />} />
      <Route path='item/:id' element={<ItemDetailPage />} />
      <Route path='about-us' element={<AboutUsPage />} />

      <Route path='admin'>
        <Route index element={<AdminDashboardPage />} />
        <Route path='dashboard' element={<AdminDashboardPage />} />
        <Route path='users' element={<AdminUsersPage />} />
        <Route path='properties' element={<AdminPropertyPage />} />
        <Route path='create-post' element={<CreatePostPage />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
