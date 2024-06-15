
import { useEffect, useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useNavigate, useParams } from 'react-router-dom';

function EditPage() {
  const navigate = useNavigate();

  const { id } = useParams();
  const accessToken = localStorage.getItem('access_token');

  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputStatus, setInputStatus] = useState('default');

  const updateRequest = {
    name: inputName,
    email: inputEmail,
    status: inputStatus,
  };

  const updateUser = async (e) => {
    e.preventDefault();

    fetch('http://localhost:8000/api/users/' + id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(updateRequest)
      })
      .then(response => response.json())
      .then(data => {
        navigate('/admin/users');
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      }).finally(() => {
      })
  }

  const getUser = async (e) => {
    fetch('http://localhost:8000/api/users/' + id,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
      .then(response => response.json())
      .then(data => {
        setInputStatus(data.status);
        setInputName(data.name);
        setInputEmail(data.email);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      }).finally(() => {
      })
  }

  useEffect(() => {
    getUser();
  }, [])

  return (
    <AdminLayout>
      <div className='max-w-screen-2xl mx-auto min-h-[80vh] px-2 flex flex-col justify-center items-center py-10'>
        <h1 className='text-4xl font-semibold'>User Information</h1>

        <form className='w-full flex flex-col items-center mt-10 gap-5' onSubmit={(e) => updateUser(e)}>
        <div className='space-y-2 flex flex-col justify-start items-start w-full max-w-lg'>
            {/* {!inputDisplayImage ? null : (
              <div className='border shadow-none rounded-md w-full max-w-lg'>
                <div className='p-2'>
                  <div className='flex items-center justify-between'>
                    <div className={`w-[180px] h-[100px] bg-gray-50 rounded-md flex items-center justify-center`}>
                      <img src={inputDisplayImage} alt='hi' className='w-full h-full object-contain' />
                    </div>
                  </div>
                </div>
              </div>
            )} */}
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
              <span className='label-text text-xl'>Status</span>
            </div>
            <select
              className='select select-bordered w-full max-w-xs'
              value={inputStatus}
              onChange={(e) => setInputStatus(e.target.value)}
            >
              <option disabled value={'default'}>
                Please select status
              </option>
              <option value={'approved'}>Approved</option>
              <option value={'unapproved'}>Unapproved</option>
              <option value={'banned'}>Banned</option>
            </select>
          </label>

          <button type='submit' className='btn btn-primary mt-5'>
            Submit
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default EditPage;
