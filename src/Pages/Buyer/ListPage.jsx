import { useSelector } from "react-redux";
import AdminLayout from "../../Layouts/AdminLayout";
import { useEffect, useState } from "react";
import BuyerLayout from "../../Layouts/BuyerLayout";

const PropertyPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const user = useSelector((state) => state.auth.value);
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

    const baseUrl = process.env.REACT_APP_API_URL + "/saves";
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
        console.log(data);
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
  const filteredData = data.filter((item) => item.user_id === user.id);
  return (
    <BuyerLayout>
      <section className="w-full my-10">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="colspan-2" class="px-6 py-3">
                Title
              </th>
              <th scope="col" class="px-6 py-3"></th>
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
                city/provice
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((data, index) => (
              <tr
                key={index}
                scope="colspan-2"
                class="bg-white border-b  hover:bg-gray-50  "
              >
                <th
                  scope="row"
                  class="flex it  ems-center px-6 py-4 text-gray-900 whitespace-nowrap  "
                >
                  <a
                    className="flex"
                    key={index}
                    href={`/item/${data.property_id}`}
                  >
                    {data?.property?.image ? (
                      <img
                        src={data?.property?.image}
                        class="w-24 h-fit "
                        alt="image"
                      />
                    ) : (
                      <img
                        class="w-16 h-16 rounded-full"
                        src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                        alt="avatar"
                      />
                    )}
                    <div class="ps-3">
                      <div class="text-base font-semibold">
                        {data?.property?.name}
                      </div>
                      <p className="font-normal text-gray-500 w-40 overflow-hidden text-ellipsis whitespace-wrap">
                        {data?.property?.description}
                      </p>
                    </div>
                  </a>
                </th>
                <th></th>
                <td class="px-6 py-4">
                  {String(data?.property?.type).toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  {String(data?.property?.category?.name).toUpperCase()}
                </td>
                <td class="px-6 py-4">${data?.property?.price}</td>
                <td class="px-6 py-4">
                  {String(data?.property?.state_name).toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <Link
                      to={"/admin/datas/" + data?.id + "/edit"}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit data
                    </Link> */}
        {/* <div className="w-full flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Browse</h1>
          </div>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-7">
            {data.map((item) => {
              return (
                <ItemCard key={item.id} item={item} handleDelete={handleDelete} />
              );p
            })}
          </div> */}
      </section>
    </BuyerLayout>
  );
};

export default PropertyPage;
