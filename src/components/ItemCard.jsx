import { Bath, BedSingle, MapPin, Ruler } from 'lucide-react';

const ItemCard = () => {
  return (
    <a href='/item' className='card bg-base-100 border rounded-md'>
      <figure>
        <img
          src='https://media.onthemarket.com/properties/8592075/1428251558/image-0-480x320.jpg'
          alt='Shoes'
        />
      </figure>
      <div className='p-3 space-y-2'>
        <h1 className='text-2xl font-semibold text-primary'>$230,000</h1>
        <h1 className='text-2xl font-semibold'>House for sale</h1>
        <div className='divider my-5'></div>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex items-center gap-2 text-gray-500'>
            <MapPin className='w-4 h-4' />
            <p className='text-sm'>Toul Kork, Phnom Penh</p>
          </div>
          <div className='flex items-center gap-2 text-gray-500'>
            <Ruler className='w-4 h-4' />
            <p className='text-sm'>
              30m<span>^2</span>
            </p>
          </div>
          <div className='flex items-center gap-2 text-gray-500'>
            <BedSingle className='w-4 h-4' />
            <p className='text-sm'>3 Bedroom</p>
          </div>
          <div className='flex items-center gap-2 text-gray-500'>
            <Bath className='w-4 h-4' />
            <p className='text-sm'>3 Bathroom</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ItemCard;
