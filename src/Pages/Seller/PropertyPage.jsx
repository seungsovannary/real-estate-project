import AdminLayout from '../../Layouts/AdminLayout';
import ItemCard from '../../components/seller/ItemCard';
import { useEffect, useState } from 'react';

const PropertyPage = () => {
  const [searchValue, setSearchValue] = useState('');

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    const baseUrl = 'http://localhost:8000/api/categories';

    return fetch(baseUrl, {
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

  const getList = async (data = {}) => {
    const queryParams = {
    };

    if (data?.category_id) {
      queryParams.category_id = data.category_id
    }

    if (data?.type) {
      queryParams.type = data.type
    }

    if (data?.name) {
      queryParams.name = data.name
    }

    const baseUrl = 'http://localhost:8000/api/properties';
    const queryString = new URLSearchParams(queryParams).toString();
    const apiUrl = `${baseUrl}?${queryString}`;

    return fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      
    })
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      });
  }

  const handleDelete = (e, item) => {
    e.preventDefault();

    const baseUrl = 'http://localhost:8000/api/properties';
    const apiUrl = `${baseUrl}/${item.id}`;

    return fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          getList();
        }
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    getCategories();
    getList();
  }, []);

  const handleChangeType = (e) => {
    getList({
      type: e.target.value
    })
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);

    getList({
      name: e.target.value
    })
  };

  const handleChangeCategory = (e) => {
    const inputType = e.target.value;

    getList({
      category_id: inputType
    });
  };

  return (
    <AdminLayout>
      <section className='w-full'>
        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5 border p-1 sm:p-2 md:p-3 rounded-lg bg-gray-100'>
          <input
            type='text'
            value={searchValue}
            onChange={(e) => handleSearch(e)}
            placeholder='Enter name'
            className='input input-bordered w-full col-span-3'
          />
          <select
            className='select select-bordered w-full max-w-xs'
            defaultValue={'type'}
            onChange={(e) => handleChangeType(e)}
          >
            <option value='type' disabled>
              Type
            </option>
            <option value=''>All</option>
            <option value='rent'>Rent</option>
            <option value='sale'>Sale</option>
            <option value='booking'>Booking</option>
          </select>

          <select
            className='select select-bordered w-full max-w-xs'
            defaultValue={'category'}
            onChange={(e) => handleChangeCategory(e)}
          >
            <option value={'category'} disabled>
              Category
            </option>
            <option value={''}>All</option>
            {categories.map((item) => {
              return <option value={item.id}>{item.name}</option>
            })}
          </select>
        </div>
      </section>

      <section className='w-full my-10'>
        <div className='w-full flex items-center justify-between'>
          <h1 className='text-3xl font-semibold'>Browse</h1>
        </div>
        <div className='mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-7'>
          {data.map((item) => {
            return <ItemCard key={item.id} item={item} handleDelete={handleDelete} />;
          })}
        </div>
      </section>
    </AdminLayout>
  );
}

export default PropertyPage;
