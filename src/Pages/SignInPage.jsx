import { useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const navigate = useNavigate();

  const [inputPassword, setInputPassword] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputErrorMessage, setInputErrorMessage] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();

    const InputSignIn = {
      email: inputEmail,
      password: inputPassword,
    };

    fetch('http://localhost:8000/api/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(InputSignIn)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if(data.success){
            if (data?.access_token) {
              localStorage.setItem('access_token', data.access_token)
            }

            if (data?.user?.role?.slug === 'admin' || data?.user?.role?.slug === 'seller') {
              navigate('/admin');
            } else {
              navigate('/')
            }

        } else {
          setInputErrorMessage(data?.message);
        }
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      }).finally(() => {
      })
  };

  return (
    <MainLayout>
      <div className='max-w-screen-2xl mx-auto min-h-[80vh] px-2 flex flex-col justify-center items-center py-10'>
        <h1 className='text-4xl font-semibold'>Sign In</h1>

        <form className='w-full flex flex-col items-center mt-10 gap-5' onSubmit={(e) => handleSignIn(e)}>

          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Email</span>
            </div>
            <input
              type='email'
              placeholder='Enter your email'
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              className='input input-bordered w-full max-w-lg'
            />
          </label>

          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Password</span>
            </div>
            <input
              type='password'
              autoComplete='false'
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder='Enter your password'
              className='input input-bordered w-full max-w-lg'
            />
          </label>

          { inputErrorMessage && <span className='text-red-500'>{inputErrorMessage}</span>}

          <button type='submit' className='btn btn-primary mt-5'>
            Sign In
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default SignInPage;
