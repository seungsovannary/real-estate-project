import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../redux/slices/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseconfig';

function Nav() {
  const user = useSelector((state) => state.auth.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = user.isLoggedIn;

  useEffect(() => {
    // if (user?.userRole === 'admin') {
    //   navigate('/sign-in');
    // }
  })

  const handleLogOut = async (e) => {
    e.preventDefault();

    signOut(auth)
      .then(() => {
        dispatch(logOut());
        navigate('/sign-in');
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  return (
    <div className='max-w-screen border-b border-gray-300 fixed w-full z-20 top-0 start-0'>
      <div className='navbar bg-base-100 flex justify-between max-w-screen-2xl mx-auto'>
        <div className=''>
          {!isLoggedIn && (
            <div className='lg:hidden'>
              <div className='dropdown'>
                <div tabIndex={0} role='button' className='btn btn-ghost'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h8m-8 6h16' />
                  </svg>
                </div>
                <ul tabIndex={0} className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'>
                  <li>
                    <a href='/'>Home</a>
                  </li>
                  <li>
                    <a href='/browse'>Browse</a>
                  </li>
                  <li>
                    <a href='/sign-in'>Sign in</a>
                  </li>
                  <li>
                    <a href='/sign-up'>Create an account</a>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <Link to='/' className='text-2xl font-semibold'>
            Real Estate
          </Link>
        </div>

        {!isLoggedIn && (
          <div className=' hidden lg:flex'>
            <ul className='menu menu-horizontal px-1'>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/browse'>Browse</Link>
              </li>
              <li>
                <Link to='/about-us'>About Us</Link>
              </li>
            </ul>
          </div>
        )}

        <div className=' flex gap-4'>
          <div className='hidden md:block'>
            <Link to={'/sign-up'} className='btn btn-primary'>
              Create an account
            </Link>
          </div>
          <Link to={'/sign-in'} className='btn btn-outline'>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Nav;
