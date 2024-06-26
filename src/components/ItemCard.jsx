import { Bath, BedSingle, MapPin, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
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
        {/* <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
          <div className='flex items-center gap-2 text-gray-500'>
            <MapPin className='min-w-4 min-h-4' />
            <p className='text-xs line-clamp-1'>{item.details.location.join(',')}</p>
          </div>
          <div className='flex items-center gap-2 text-gray-500'>
            <Ruler className='w-4 h-4' />
            <p className='text-xs  line-clamp-1'>
              {item.details.size} m<span>^2</span>
            </p>
          </div>
          <div className='flex items-center gap-2 text-gray-500'>
            <BedSingle className='w-4 h-4' />
            <p className='text-xs  line-clamp-1'>{item.details.bed} Bedroom</p>
          </div>
          <div className='flex items-center gap-2 text-gray-500'>
            <Bath className='w-4 h-4' />
            <p className='text-xs  line-clamp-1'>{item.details.bath} Bathroom</p>
          </div>
        </div> */}
      </div>
    </Link>
  );
};

export default ItemCard;
