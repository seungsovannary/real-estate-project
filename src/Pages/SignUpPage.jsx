import { useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();

  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputPasswordConfirmation, setInputPasswordConfirmation] = useState('');
  const [inputRole, setInputRole] = useState('default');
  const [inputDisplayImage, setDisplayImage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (inputRole === 'default') {
      console.log('Please select role');
      return;
    }

    const signUpDatabaseRequest = {
      name: inputName,
      email: inputEmail,
      password: inputPassword,
      password_confirmation: inputPasswordConfirmation,
      profile: inputDisplayImage,
      role_id: inputRole,
    };

    fetch('http://localhost:8000/api/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpDatabaseRequest)
      })
      .then(response => response.json())
      .then(data => {
        navigate('/sign-in');
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      }).finally(() => {
      })
  };

  const getBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const handleUploadDisplayImg = async (e) => {
    e.preventDefault();

    const inputData = e.target.files[0];

    const Url = await getBase64(inputData);

    setDisplayImage(Url);
  };

  return (
    <MainLayout>
      <div className='max-w-screen-2xl mx-auto min-h-[80vh] px-2 flex flex-col justify-center items-center py-10'>
        <h1 className='text-4xl font-semibold'>Sign Up</h1>

        <form className='w-full flex flex-col items-center mt-10 gap-5' onSubmit={(e) => handleSignUp(e)}>
        <div className='space-y-2 flex flex-col justify-start items-start w-full max-w-lg'>
            <label htmlFor='category' className='text-lg font-semibold'>
              Profile Image
            </label>
            {inputDisplayImage ? null : (
              <>
                <button>
                  <input type='file' onChange={(e) => handleUploadDisplayImg(e)} />
                </button>
              </>
            )}

            {!inputDisplayImage ? null : (
              <div className='border shadow-none rounded-md w-full max-w-lg'>
                <div className='p-2'>
                  <div className='flex items-center justify-between'>
                    <div className={`w-[180px] h-[100px] bg-gray-50 rounded-md flex items-center justify-center`}>
                      <img src={inputDisplayImage} alt='hi' className='w-full h-full object-contain' />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Name</span>
            </div>
            <input
              type='text'
              placeholder='Enter your name'
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className='input input-bordered w-full max-w-lg'
            />
          </label>
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

          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Confirm Password</span>
            </div>
            <input
              type='password'
              autoComplete='false'
              value={inputPasswordConfirmation}
              onChange={(e) => setInputPasswordConfirmation(e.target.value)}
              placeholder='Enter your password again'
              className='input input-bordered w-full max-w-lg'
            />
          </label>

          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Role</span>
            </div>
            <select
              className='select select-bordered w-full max-w-xs'
              defaultValue={'default'}
              // value={inputRole}
              onChange={(e) => setInputRole(e.target.value)}
            >
              <option disabled value={'default'}>
                Please select user role
              </option>
              <option value={'2'}>Buyer</option>
              <option value={'3'}>Seller</option>
            </select>
          </label>

          <button type='submit' className='btn btn-primary mt-5'>
            Sign up
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default SignUpPage;
