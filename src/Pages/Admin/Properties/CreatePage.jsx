import { useEffect, useState } from 'react';
import cn from '../../../utils/cn';
import { Trash2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../Layouts/AdminLayout';

const CreatePostPage = () => {
  const accessToken = localStorage.getItem('access_token');
  const [inputTitle, setInputTitle] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [inputCategory, setInputCategory] = useState('');
  const [inputType, setInputType] = useState('');
  const [inputDistrict, setInputDistrict] = useState('');
  const [inputCity, setInputCity] = useState('');
  const [inputSize, setInputSize] = useState(0);
  const [inputBed, setInputBed] = useState(0);
  const [inputBath, setInputBath] = useState(0);
  const [inputPrice, setInputPrice] = useState(0);

  const [displayImage, setDisplayImage] = useState('');
  const [displayFileImage, setDisplayFileImage] = useState('');
  const [errorDisplayImage, setErrorDisplayImage] = useState(false);
  const [errorCategoty, setErrorCategory] = useState(false);
  const [errorType, setErrorType] = useState(false);

  const [othersImage, setOthersImage] = useState([]);
  const [othersFileImage, setOthersFileImage] = useState([]);
  const [errorOthersImage, setErrorOthersImage] = useState(false);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmitPost = async (e) => {
    e.preventDefault();

    if (!displayImage) {
      setErrorDisplayImage(true);
      return;
    } else {
      setErrorDisplayImage(false);
    }

    // if (othersImage.length <= 0) {
    //   setErrorOthersImage(true);
    //   return;
    // } else {
    //   setErrorOthersImage(false);
    // }

    if (!inputCategory) {
      setErrorCategory(true);
      return;
    } else {
      setErrorCategory(false);
    }

    if (!inputType) {
      setErrorType(true);
      return;
    } else {
      setErrorType(false);
    }

    setLoading(true);

    const inputData = {
      name: inputTitle,
      description: inputDescription,
      type: inputType,
      price: inputPrice,
      image: displayImage,
      // allImages: othersImageObj,
      // details: {
      //   location: [inputDistrict, inputCity],
      //   size: inputSize,
      //   bed: inputBed,
      //   bath: inputBath,
      // },
      category_id: inputCategory,
      // contactPerson: {
      //   profileImg: 'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
      //   name: 'Seung Sovannary',
      //   phoneNumber: '0232398324',
      // },
      // customerReviews: [],
      // createdAt: new Date(Date.now()).toISOString(),
    };

    fetch(process.env.REACT_APP_API_URL + '/properties',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(inputData)
      })
      .then(response => response.json())
      .then(data => {
        if (data?.success) {
          navigate('/');
        }
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      }).finally(() => {
        setLoading(false);
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
    setDisplayFileImage(inputData);
  };

  const handleUploadOtherImg = async (e) => {
    e.preventDefault();

    const inputData = Array.from(e.target.files);
    setOthersFileImage(inputData);

    inputData.map((img) => {
      const Url = URL.createObjectURL(img);
      console.log(Url);

      setOthersImage((prev) => [...prev, Url]);
    });
  };

  const handleDelete = async (inputData) => {
    setDisplayImage('');
    setDisplayFileImage('');
  };
  const handleDeleteOthers = async (inputData) => {
    const index = othersImage.findIndex((item) => item === inputData);
    setOthersImage((prev) => prev.filter((item) => item !== inputData));
    const data = othersFileImage;
    data.splice(index, 1);
    setOthersFileImage(data);
  };

  const getCategories = () => {
    return fetch(process.env.REACT_APP_API_URL + '/categories',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
      })
      .then(response => response.json())
      .then(data => {
        setCategories(data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <AdminLayout>
      <div className='max-w-screen-2xl mx-auto min-h-[80vh] px-2 flex flex-col justify-center items-center py-10'>
        <h1 className='text-4xl font-semibold'>Create Post</h1>

        <form className='w-full flex flex-col items-center mt-10 gap-5' onSubmit={(e) => handleSubmitPost(e)}>
          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Title</span>
            </div>
            <input
              type='text'
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className='input input-bordered w-full max-w-lg'
              required
            />
          </label>
          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Description</span>
            </div>
            <textarea
              type='text'
              value={inputDescription}
              onChange={(e) => setInputDescription(e.target.value)}
              className='input input-bordered py-2 w-full max-w-lg min-h-[100px]'
              required
            />
          </label>

          <div className='space-y-2 flex flex-col justify-start items-start w-full max-w-lg'>
            <label htmlFor='category' className={cn('text-lg font-semibold', errorDisplayImage ? 'text-red-500' : '')}>
              Display Picture
            </label>
            {displayImage ? null : (
              <>
                <button>
                  <input type='file' onChange={(e) => handleUploadDisplayImg(e)} />
                </button>
                {errorDisplayImage && <p className='text-sm font-medium text-red-500'>Display Image is required</p>}
              </>
            )}

            {!displayImage ? null : (
              <div className='border shadow-none rounded-md w-full max-w-lg'>
                <div className='p-2'>
                  <div className='flex items-center justify-between'>
                    <div className={`w-[180px] h-[100px] bg-gray-50 rounded-md flex items-center justify-center`}>
                      <img src={displayImage} alt='hi' className='w-full h-full object-contain' />
                    </div>
                    <button
                      type='button'
                      className='mr-5 border px-4 py-2 rounded-md text-red-500'
                      onClick={() => handleDelete(displayImage)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <div className='space-y-2 flex flex-col justify-start items-start w-full max-w-lg'>
            <label htmlFor='category' className={cn('text-lg font-semibold', errorOthersImage ? 'text-red-500' : '')}>
              Other Pictures
            </label>
            {!othersImage ? null : (
              <>
                <button>
                  <input type='file' multiple onChange={(e) => handleUploadOtherImg(e)} />
                </button>
                {errorOthersImage && <p className='text-sm font-medium text-red-500'>Others Image is required</p>}
              </>
            )}

            {!othersImage
              ? null
              : othersImage?.map((img) => {
                  return (
                    <div className='border shadow-none rounded-md w-full max-w-lg' key={img}>
                      <div className='p-2'>
                        <div className='flex items-center justify-between'>
                          <div className={`w-[180px] h-[100px] bg-gray-50 rounded-md flex items-center justify-center`}>
                            <img src={img} alt='hi' className='w-full h-full object-contain' />
                          </div>
                          <button
                            type='button'
                            className='mr-5 border px-4 py-2 rounded-md text-red-500'
                            onClick={() => handleDeleteOthers(img)}
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div> */}

          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Category</span>
            </div>
            <select
              className='select select-bordered w-full max-w-xs'
              defaultValue={'default'}
              onChange={(e) => setInputCategory(e.target.value)}
            >
              <option disabled value={'default'}>
                Please select category
              </option>
              {categories.map((item) => {
                return <option value={item.id}>{item.name}</option>
              })}
            </select>
            {errorCategoty && <p className='text-sm font-medium text-red-500'>Please select any cateogry.</p>}
          </label>
          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Type</span>
            </div>
            <select
              className='select select-bordered w-full max-w-xs'
              defaultValue={'default'}
              onChange={(e) => setInputType(e.target.value)}
            >
              <option disabled value={'default'}>
                Please select type
              </option>
              <option value='sale'>For sale</option>
              <option value='rent'>For rent</option>
              <option value='booking'>For booking</option>
            </select>
            {errorType && <p className='text-sm font-medium text-red-500'>Please select any type.</p>}
          </label>

          {/* <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>District</span>
            </div>
            <input
              type='text'
              autoComplete='false'
              value={inputDistrict}
              onChange={(e) => setInputDistrict(e.target.value)}
              className='input input-bordered w-full max-w-lg'
              required
            />
          </label>
          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Province / City</span>
            </div>
            <input
              type='text'
              autoComplete='false'
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              className='input input-bordered w-full max-w-lg'
              required
            />
          </label>

          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Property Size</span>
            </div>
            <input
              type='number'
              value={inputSize}
              onChange={(e) => setInputSize(Number(e.target.value))}
              className='input input-bordered w-full max-w-lg'
              required
            />
          </label>

          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Bedroom</span>
            </div>
            <input
              type='number'
              value={inputBed}
              onChange={(e) => setInputBed(Number(e.target.value))}
              className='input input-bordered w-full max-w-lg'
              required
            />
          </label>

          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Bathroom</span>
            </div>
            <input
              type='number'
              value={inputBath}
              onChange={(e) => setInputBath(Number(e.target.value))}
              className='input input-bordered w-full max-w-lg'
              required
            />
          </label> */}

          <label className='form-control w-full max-w-lg'>
            <div className='label'>
              <span className='label-text text-xl'>Property Price</span>
            </div>
            <input
              type='number'
              value={inputPrice}
              onChange={(e) => setInputPrice(Number(e.target.value))}
              className='input input-bordered w-full max-w-lg'
              required
            />
          </label>

          <button type='submit' className='btn btn-primary mt-5'>
            {loading ? 'Loading...' : 'Submit Post'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreatePostPage;
