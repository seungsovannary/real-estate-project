
import { useEffect, useState } from 'react';
import { db } from '../../config/firebaseconfig';
import AdminLayout from '../../Layouts/AdminLayout';
import { collection, onSnapshot } from 'firebase/firestore';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [backUp, setBackUpData] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const usersCollection = collection(db, 'users');

  useEffect(() => {
    onSnapshot(usersCollection, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setUsers(data);
      setBackUpData(data);
    });
  }, [])

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setUsers(backUp.filter((item) => String(item.email).toLowerCase().includes(String(e.target.value).toLowerCase())));
  };

  return (
    <AdminLayout>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
        <div class="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-whit">
          <label for="table-search" class="sr-only">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input onChange={(e) => handleSearch(e)} type="text" id="table-search-users" class="block p-2 ps-10 text-sm input input-bordered" placeholder="Search for users" />
          </div>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" class="px-6 py-3">
                Name
              </th>
              <th scope="col" class="px-6 py-3">
                Position
              </th>
              <th scope="col" class="px-6 py-3">
                Status
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr class="bg-white border-b  hover:bg-gray-50 ">
                <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">
                  <img class="w-10 h-10 rounded-full" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="avatar" />
                  <div class="ps-3">
                    <div class="text-base font-semibold">{ user.firstName } { user.lastName }</div>
                    <div class="font-normal text-gray-500">{ user.email }</div>
                  </div>
                </th>
                <td class="px-6 py-4">
                  {String(user.role).toUpperCase()}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> Active
                  </div>
                </td>
                <td class="px-6 py-4">
                  <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit user</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default UsersPage;
