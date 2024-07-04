import MainLayout from "../Layouts/MainLayout";
import ItemCard from "../components/ItemCard";
import { useEffect, useState } from "react";

const BrowsePage = () => {
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

  const getCategories = async () => {
    const baseUrl = process.env.REACT_APP_API_URL + "/categories";
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
    const baseUrl = process.env.REACT_APP_API_URL + "/states";
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
  }, [priceRange, sizeRange, stateName]);

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

  const filteredData = data.filter((item) => item?.status === "approved");

  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto px-2 flex flex-col justify-center items-center py-10">
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
          </div>
        </section>
              
        <section className="w-full my-10">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Browse</h1>
          </div>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-7">
            {filteredData.map((item) => {
              return <ItemCard key={item.id} item={item} />;
            })}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default BrowsePage;
