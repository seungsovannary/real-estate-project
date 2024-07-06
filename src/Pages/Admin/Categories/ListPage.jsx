import { useEffect, useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Link } from "react-router-dom";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [backUp, setBackUpData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  const getList = async () => {
    return fetch(process.env.REACT_APP_API_URL + "/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
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
    setCategories(
      backUp.filter((item) =>
        String(item.name)
          .toLowerCase()
          .includes(String(e.target.value).toLowerCase())
      )
    );
  };

  const handleOpenModal = (newTitle, isEdit, isDelete, id = null) => {
    setOpenModal(true);
    setTitle(newTitle);
    if (isDelete === true) {
      setIsDelete(true);
      setCategoryId(id);
    } else if (isEdit === true) {
      setIsEdit(true);
      setCategoryId(id);
      const categoryToEdit = categories.find((cat) => cat.id === id);
      setCategory(categoryToEdit.name);
    } else {
      setIsEdit(false);
      setIsDelete(false);
      setCategory("");
    }
  };

  const handleCreate = async () => {
    const newCategory = { name: category };
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(newCategory),
        }
      );
      const data = await response.json();
      console.log(data);
      setCategories([...categories, data]);
      setBackUpData([...categories, data]);
      setOpenModal(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async () => {
    const updatedCategory = { name: category };
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(updatedCategory),
      });
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? { ...cat, name: category } : cat
        )
      );
      setBackUpData(
        categories.map((cat) =>
          cat.id === categoryId ? { ...cat, name: category } : cat
        )
      );
      setOpenModal(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.ok) {
        setCategories(categories.filter((cat) => cat.id !== id));
        setBackUpData(categories.filter((cat) => cat.id !== id));
        console.log("Category deleted successfully:", response);
      } else {
        console.error("Failed to delete category:", response);
      }

      setOpenModal(false);
    } catch (error) {
      console.error("Error:", error);
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
              id="table-search-categories"
              className="block p-2 ps-10 text-sm input input-bordered"
              placeholder="Search for category"
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
        <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="colspan-2" className="px-12 py-6">
                Name
              </th>
              <th scope="col" className="px-12 py-6"></th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                >
                  <p>{category.id}</p>
                </th>
                <th scope="colspan-2" className="px-12 py-4">
                  <p>{category.name}</p>
                </th>
                <th className="px-12 py-4"></th>
                <td className="pl-6 py-4">
                  <Link
                    onClick={() =>
                      handleOpenModal("Edit Category", true, false, category.id)
                    }
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <Link
                    onClick={() =>
                      handleOpenModal(
                        "Delete Category",
                        false,
                        true,
                        category.id
                      )
                    }
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {openModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-96">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button
                  onClick={() => {
                    setOpenModal(false);
                    setIsDelete(false);
                    setIsEdit(false);
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  &times;
                </button>
              </div>
              <div className="p-6">
                {isDelete ? (
                  <p>Are you sure you want to delete this category?</p>
                ) : (
                  <input
                    type="text"
                    placeholder={
                      isEdit ? "Edit Category" : "Enter new category"
                    }
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input input-bordered w-full max-w-lg"
                  />
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
                {isDelete ? (
                  <button
                    onClick={() => handleDelete(categoryId)}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    onClick={isEdit ? handleUpdate : handleCreate}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    {isEdit ? "Update" : "Create"}
                  </button>
                )}
                <button
                  onClick={() => {
                    setOpenModal(false);
                    setIsDelete(false);
                    setIsEdit(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default CategoryPage;
