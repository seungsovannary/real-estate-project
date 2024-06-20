import AdminLayout from "../../../Layouts/AdminLayout";
import ItemCard from "../../../components/ItemCard";
import { useEffect, useState } from "react";

const RequestPropertyPage = () => {
  const [searchValue, setSearchValue] = useState("");

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    const baseUrl = process.env.REACT_APP_API_URL + "/categories";

    return fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  };

  const getList = async (filteredData = {}) => {
    const queryParams = {};

    if (filteredData?.category_id) {
      queryParams.category_id = filteredData.category_id;
    }

    if (filteredData?.type) {
      queryParams.type = filteredData.type;
    }

    if (filteredData?.name) {
      queryParams.name = filteredData.name;
    }

    const baseUrl = process.env.REACT_APP_API_URL + "/properties";
    const queryString = new URLSearchParams(queryParams).toString();
    const apiUrl = `${baseUrl}?${queryString}`;

    return fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getCategories();
    getList();
  }, []);

  const handleChangeType = (e) => {
    getList({
      type: e.target.value,
    });
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);

    getList({
      name: e.target.value,
    });
  };

  const handleChangeCategory = (e) => {
    const inputType = e.target.value;

    getList({
      category_id: inputType,
    });
  };
  const filteredData = data.filter((item) => item?.status === "unapproved");
  return (
    <AdminLayout>
      <section className="w-full">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5 border p-1 sm:p-2 md:p-3 rounded-lg bg-gray-100">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearch(e)}
            placeholder="Enter name"
            className="input input-bordered w-full col-span-3"
          />
          <select
            className="select select-bordered w-full max-w-xs"
            defaultValue={"type"}
            onChange={(e) => handleChangeType(e)}
          >
            <option value="type" disabled>
              Type
            </option>
            <option value="">All</option>
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
            <option value="booking">Booking</option>
          </select>

          <select
            className="select select-bordered w-full max-w-xs"
            defaultValue={"category"}
            onChange={(e) => handleChangeCategory(e)}
          >
            <option value={"category"} disabled>
              Category
            </option>
            <option value={""}>All</option>
            {categories.map((item) => {
              return <option value={item.id}>{item.name}</option>;
            })}
          </select>
        </div>
      </section>

      <section className="w-full my-10">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="colspan-2" class="px-6 py-3">
                Title
              </th>
              <th scope="col" class="px-6 py-3"></th>
              <th scope="col" class="px-6 py-3">
                User
              </th>
              <th scope="col" class="px-6 py-3">
                Type
              </th>
              <th scope="col" class="px-6 py-3">
                Category
              </th>
              <th scope="col" class="px-6 py-3">
                price
              </th>
              <th scope="col" class="px-6 py-3">
                status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((data, index) => (
              <tr
                scope="colspan-2"
                class="bg-white border-b  hover:bg-gray-50  "
              >
                <th
                  scope="row"
                  class="flex it  ems-center px-6 py-4 text-gray-900 whitespace-nowrap  "
                >
                  <a className="flex" key={index} href={`/item/${data.id}`}>
                    {data?.image ? (
                      <img src={data?.image} class="w-24 h-fit " alt="image" />
                    ) : (
                      <img
                        class="w-16 h-16 rounded-full"
                        src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                        alt="avatar"
                      />
                    )}
                    <div class="ps-3">
                      <div class="text-base font-semibold">{data?.name}</div>
                      <p className="font-normal text-gray-500 w-40 overflow-hidden text-ellipsis whitespace-wrap">
                        {data?.description}
                      </p>
                    </div>
                  </a>
                </th>
                <th></th>
                <td class="px-6 py-4">{data?.user?.name}</td>
                <td class="px-6 py-4">{String(data?.type).toUpperCase()}</td>
                <td className="px-6 py-4">
                  {String(data?.category?.name).toUpperCase()}
                </td>
                <td class="px-6 py-4">${data?.price}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    {data?.status === "approved" && (
                      <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                    )}
                    {data?.status === "unapproved" && (
                      <div class="h-2.5 w-2.5 rounded-full bg-yellow-500 me-2"></div>
                    )}
                    {data?.status === "banned" && (
                      <div class="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                    )}
                    {String(data?.status).toUpperCase()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminLayout>
  );
};

export default RequestPropertyPage;
