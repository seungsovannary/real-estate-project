import { useSelector } from "react-redux";
import AdminLayout from "../../Layouts/AdminLayout";
import { useEffect, useState } from "react";
import BuyerLayout from "../../Layouts/BuyerLayout";
import * as XLSX from "xlsx";

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
  const downloadExcel = () => {
    console.log(filteredData);
    const data = filteredData.map((item) => ({
      ID: item.id,
      Name: item.property?.name,
      Description: item.property?.description,
      Type: item.property?.type,
      Category: item.property?.category?.name,
      Price: item.property?.price,
      Address: item.property?.address,
      Street: item.property?.street,
      "State Name": item.property?.state_name,
      "Town Name": item.property?.town_name,
      "Village Name": item.property?.village_name,
      Latitude: item.property?.latitude,
      Longitude: item.property?.longitude,
    }));
    console.log(data);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

    XLSX.writeFile(workbook, "properties.xlsx");
  };

  return (
    <BuyerLayout>
      <section className="w-full my-10">
        <div className="mb-4">
          <button
            onClick={downloadExcel}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Download Properties as Excel
          </button>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="colspan-2" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                City/Province
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((data, index) => (
              <tr
                key={index}
                scope="colspan-2"
                className="bg-white border-b hover:bg-gray-50"
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                >
                  <a
                    className="flex"
                    key={index}
                    href={`/item/${data.property_id}`}
                  >
                    {data?.property?.image ? (
                      <img
                        src={data?.property?.image}
                        className="w-24 h-fit"
                        alt="image"
                      />
                    ) : (
                      <img
                        className="w-16 h-16 rounded-full"
                        src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                        alt="avatar"
                      />
                    )}
                    <div className="ps-3">
                      <div className="text-base font-semibold">
                        {data?.property?.name}
                      </div>
                      <p className="font-normal text-gray-500 w-40 overflow-hidden text-ellipsis whitespace-wrap">
                        {data?.property?.description}
                      </p>
                    </div>
                  </a>
                </th>
                <th></th>
                <td className="px-6 py-4">
                  {String(data?.property?.type).toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  {String(data?.property?.category?.name).toUpperCase()}
                </td>
                <td className="px-6 py-4">${data?.property?.price}</td>
                <td className="px-6 py-4">
                  {String(data?.property?.state_name).toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </BuyerLayout>
  );
};

export default PropertyPage;
