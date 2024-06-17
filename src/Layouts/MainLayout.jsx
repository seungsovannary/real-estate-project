import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import { supabase } from '..';
import { useDispatch } from 'react-redux';
import { logIn, logOut } from '../redux/slices/authSlice';
import { current } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
function MainLayout({ children }) {
  const dispatch = useDispatch();
  const [loading, SetLoading] = useState(false);
  const user = useSelector((state) => state.auth.value);

  const getMe = async () => {
    if (user.id) {
      SetLoading(false);
      return;
    }

    const url = process.env.REACT_APP_API_URL + '/me';
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      dispatch(logOut());
      return;
    }

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(async data => {
        // Do something with the response data
        dispatch(logIn({ email: data.email, id: data.id, role_id: data.role_id }));
        SetLoading(true);
      }).catch((e) => {
        console.log(e)
        dispatch(logOut());
      }).finally(() => {
        SetLoading(true);
      });
  }

  useEffect(() => {
    getMe();
  }, []);

  // if (loading && !user.id) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <Nav />
      <div className='mt-[68px]'>
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
