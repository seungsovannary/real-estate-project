import { useEffect, useState } from "react";
import AdminLayout from "../../Layouts/AdminLayout";
import { Link } from "react-router-dom";

function CategoryPage() {
  const [users, setUsers] = useState([]);
  const [backUp, setBackUpData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [isDetele, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const getList = async () => {
    return fetch(process.env.REACT_APP_API_URL + "/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setBackUpData(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setUsers(
      backUp.filter((item) =>
        String(item.email)
          .toLowerCase()
          .includes(String(e.target.value).toLowerCase())
      )
    );
  };

  const handleOpenModal = (newTitle, isEdit, isDelete) => {
    setOpenModal(true);
    setTitle(newTitle);
    if (isDelete === true) {
      setIsDelete(true);
    } else if (isEdit === true) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
      setIsDelete(false);
    }
  };

  return (
    <AdminLayout>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              onChange={(e) => handleSearch(e)}
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm input input-bordered"
              placeholder="Search for users"
            />
          </div>
          <div className="flex gap-4">
            <div className="hidden md:block">
              <Link
                onClick={() => handleOpenModal("New Category", false, false)}
                className="btn btn-primary"
              >
                Create Category
              </Link>
            </div>
          </div>
        </div>
        <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="colspan-2" className="px-12 py-6">
                Name
              </th>
              <th scope="col" className="px-12py-6"></th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {users.map((user) => ( */}
            <tr className="bg-white border-b hover:bg-gray-50">
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
              >
                <p>Category Id</p>
              </th>
              <th scope="colspan-2" className="px-12 py-4">
                <p>Category Name</p>
              </th>
              <th className="px-12 py-4"></th>
              <td className="pl-6 py-4">
                <Link
                  onClick={() => handleOpenModal("Edit Category", true)}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                >
                  Edit
                </Link>
                <Link
                  onClick={() =>
                    handleOpenModal("Detele Category", false, true)
                  }
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Delete
                </Link>
              </td>
            </tr>
            {/* ))} */}
          </tbody>
        </table>
        {openModal && (
          <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg w-96">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <button
                    onClick={() => setOpenModal(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    &times;
                  </button>
                </div>
                <div className="p-6">
                  {isDetele ? (
                    <p>Are you to delete this Category?</p>
                  ) : isEdit ? (
                    <input
                      type="text"
                      placeholder="Edit Category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="input input-bordered w-full max-w-lg"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter new category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="input input-bordered w-full max-w-lg"
                    />
                  )}
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
                  {isDetele ? (
                    <button
                      onClick={() => setOpenModal(false)}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Delete
                    </button>
                  ) : isEdit ? (
                    <button
                      onClick={() => setOpenModal(false)}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={() => setOpenModal(false)}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Create
                    </button>
                  )}

                  <button
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default CategoryPage;
