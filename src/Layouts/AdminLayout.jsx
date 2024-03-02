import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import { useDispatch } from 'react-redux';
import { logIn } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.value);

  const [loading, SetLoading] = useState(false);

  const getMe = async () => {
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
        checkRole("admin");
        SetLoading(true);
      })
      .catch(error => {
        // Handle any errors
        navigate('/sign-in');
      });
  }

  const checkRole = (role) => {
    if (role !== "admin") {
      navigate("/")
    }
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
      <Sidebar />
      <div className="p-4 sm:ml-64 mt-[68px]">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
