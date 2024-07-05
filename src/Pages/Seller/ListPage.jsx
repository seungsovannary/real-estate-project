import { useSelector } from "react-redux";
import AdminLayout from "../../Layouts/AdminLayout";
import { useEffect, useState } from "react";

const PropertyPage = () => {
  const user = useSelector((state) => state.auth.value);
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [priceRange, setPriceRange] = useState({
    min_price: "",
    max_price: "",
  });
  const [sizeRange, setSizeRange] = useState({ min_size: "", max_size: "" });
  const [stateName, setStateName] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter

  const getCategories = async () => {
    const baseUrl = `${process.env.REACT_APP_API_URL}/categories`;
    try {
      const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const result = await response.json();
      setCategories(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getStates = async () => {
    const baseUrl = `${process.env.REACT_APP_API_URL}/states`;
    try {
      const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const result = await response.json();
      setStates(result);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const getList = async (filters = {}) => {
    const { min_price, max_price, min_size, max_size, ...otherFilters } =
      filters;

    const queryParams = new URLSearchParams({
      ...otherFilters,
      min_price: priceRange.min_price,
      max_price: priceRange.max_price,
      min_size: sizeRange.min_size,
      max_size: sizeRange.max_size,
      state_name: stateName,
      status: statusFilter, // Include status filter in API query
    }).toString();

    const apiUrl = `${process.env.REACT_APP_API_URL}/properties?${queryParams}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  console.log(data);

  useEffect(() => {
    getCategories();
    getStates();
    getList();
  }, []);

  useEffect(() => {
    const filters = {
      ...priceRange,
      ...sizeRange,
      state_name: stateName,
    };
    getList(filters);
  }, [priceRange, sizeRange, stateName, statusFilter]); // Include statusFilter in dependency array

  const handleChangeType = (e) => {
    getList({ type: e.target.value });
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    getList({ search: e.target.value });
  };

  const handleChangeCategory = (e) => {
    getList({ category_id: e.target.value });
  };

  const handleChangePrice = (e) => {
    const { name, value } = e.target;
    setPriceRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
  };

  const handleChangeSize = (e) => {
    const { name, value } = e.target;
    setSizeRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
  };

  const handleChangeState = (e) => {
    setStateName(e.target.value);
    getList({ state_name: e.target.value });
  };

  const handleChangeStatus = (e) => {
    setStatusFilter(e.target.value); // Update status filter state
  };

  const filteredData = data.filter(
    (item) =>
      (statusFilter ? item.status === statusFilter : true) &&
      item.user_id === user.id
  );

  return (
    <AdminLayout>
      <section>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-5 border p-1 sm:p-2 md:p-3 rounded-lg bg-gray-100">
          <input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Enter name"
            className="input input-bordered w-full col-2"
          />
          <select
            className="select select-bordered w-full max-w-xs"
            defaultValue="type"
            onChange={handleChangeType}
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
            defaultValue="category"
            onChange={handleChangeCategory}
          >
            <option value="category" disabled>
              Category
            </option>
            <option value="">All</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <div className="flex space-x-2">
            <input
              type="number"
              name="min_price"
              value={priceRange.min_price}
              onChange={handleChangePrice}
              placeholder="Min Price"
              className="input input-bordered w-full col"
            />
            <input
              type="number"
              name="max_price"
              value={priceRange.max_price}
              onChange={handleChangePrice}
              placeholder="Max Price"
              className="input input-bordered w-full col"
            />
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              name="min_size"
              value={sizeRange.min_size}
              onChange={handleChangeSize}
              placeholder="Min Size"
              className="input input-bordered w-full col"
            />
            <input
              type="number"
              name="max_size"
              value={sizeRange.max_size}
              onChange={handleChangeSize}
              placeholder="Max Size"
              className="input input-bordered w-full col"
            />
          </div>

          <select
            className="select select-bordered w-full max-w-xs"
            defaultValue="state"
            onChange={handleChangeState}
          >
            <option value="state" disabled>
              City/Province
            </option>
            <option value="">All</option>
            {states.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            className="select select-bordered w-full max-w-xs"
            value={statusFilter}
            onChange={handleChangeStatus} // Connect status filter to handleChangeStatus function
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="unapproved">Unapproved</option>
          </select>
        </div>
      </section>

      <section className="w-full my-10">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                User
              </th>
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
                Size
              </th>
              <th scope="col" className="px-6 py-3">
                City/Province
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                  <a href={`/item/${item.id}`} className="flex">
                    {item.image ? (
                      <img
                        src={item.image}
                        className="w-24 h-fit"
                        alt="property"
                      />
                    ) : (
                      <img
                        className="w-16 h-16 rounded-full"
                        src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                        alt="avatar"
                      />
                    )}
                    <div className="ps-3">
                      <div className="text-base font-semibold">{item.name}</div>
                      <p className="font-normal text-gray-500 w-40 overflow-hidden text-ellipsis whitespace-wrap">
                        {item.description}
                      </p>
                    </div>
                  </a>
                </td>
                <td className="px-6 py-4">{item.user.name}</td>
                <td className="px-6 py-4">{item.type.toUpperCase()}</td>
                <td className="px-6 py-4">
                  {item.category.name.toUpperCase()}
                </td>
                <td className="px-6 py-4">${item.price}</td>
                <td className="px-6 py-4">{item.size}m²</td>
                <td className="px-6 py-4">{item.state_name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {item.status === "approved" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    )}
                    {item.status === "unapproved" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></div>
                    )}
                    {item.status === "banned" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                    )}
                    {item.status.toUpperCase()}
                  </div>
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
            );
          })}
        </div> */}
      </section>
    </AdminLayout>
  );
};

export default PropertyPage;
