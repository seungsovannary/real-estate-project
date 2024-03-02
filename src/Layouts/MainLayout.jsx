import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import { supabase } from '..';
import { useDispatch } from 'react-redux';
import { logIn } from '../redux/slices/authSlice';
import { current } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

function MainLayout({ children }) {
  const dispatch = useDispatch();
  const [loading, SetLoading] = useState(false);
  const user = useSelector((state) => state.auth.value);

  const getMe = async () => {
    if (user.isLoggedIn) {
      return;
    }

    const url = 'http://localhost:8000/api/me';
    const accessToken = localStorage.getItem("access_token");

    await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(async data => {
        // Do something with the response data
        dispatch(logIn({ email: data.email, id: data.id, role: "admin" }));
        SetLoading(true);
      });
  }

  useEffect(() => {
    getMe();
  }, []);

  if (!loading && !user.isLoggedIn) {
    return <div>Loading...</div>;
  }

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
