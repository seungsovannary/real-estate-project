import { Link } from 'react-router-dom';

const ItemCard = ({ item, handleDelete }) => {
  const handleEdit = (e) => {
  };

  return (
    <Link to={`/item/${item.id}`} className='card bg-base-100 border rounded-md shadow-sm'>
      <figure className='h-[200px]'>
        <img src={item.image} alt='home' className='h-full w-full object-cover' />
      </figure>
      <div className='p-3 sm:space-y-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-md sm:text-xl font-semibold text-primary'>${item.price.toLocaleString()}</h1>
          <h1>{item.category.name}</h1>
        </div>
        <h1 className='text-md sm:text-xl font-semibold  line-clamp-1'>{item.name}</h1>
        <div className='divider my-0 sm:my-5'></div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
          <div className='flex items-center gap-2 text-gray-500'>
            {/* Edit Button */}
            <button onClick={handleEdit} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Edit
            </button>

            {/* Delete Button */}
            <button onClick={(e) => handleDelete(e, item)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Delete
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default ItemCard;
