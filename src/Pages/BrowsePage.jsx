import MainLayout from "../Layouts/MainLayout";
import ItemCard from "../components/ItemCard";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Remove the default icon URLs to fix the missing icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const UpdateMapView = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 15); // Set the view to the new location with zoom level 15
    }
  }, [location, map]);
  return null;
};

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
  const [location, setLocation] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

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

  const handleItemClick = (item) => {
    setLocation({ lat: item.latitude, lng: item.longitude });
    setSelectedItem(item);
  };

  const handleMarkerClick = (item) => {
    setSelectedItem(item);
  };

  const filteredData = data.filter((item) => item?.status === "approved");

  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto px-2 flex flex-col justify-center items-center py-2">
        <section className="w-full h-screen">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Browse</h1>
          </div>
          <div className="flex w-full h-full">
            <div className="w-2/6 h-full overflow-y-scroll my-2">
              {filteredData.map((item) => (
                <div
                  className="flex h-32 w-full my-2 shadow-lg cursor-pointer"
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                >
                  <img
                    className="h-full w-32 object-cover border"
                    src={item.image}
                    alt={item.name}
                  />
                  <div className="px-2 flex flex-col justify-between py-2">
                    <div className="flex flex-col">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold ">${item.price}</p>
                      <p className="text-sm font-bold ">{item.category.name}</p>
                      <p className="text-sm font-bold ">
                        {item.type.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-4/6 h-full ">
              <MapContainer
                center={[11.5449, 104.8922]}
                zoom={13} // Default zoom level for initial load
                className="w-full h-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredData.map((item) => (
                  <Marker
                    key={item.id}
                    position={[item.latitude, item.longitude]}
                    eventHandlers={{
                      click: () => handleMarkerClick(item),
                    }}
                  >
                    <Popup>
                      <div  >
                        <img src={item.image} alt="" />
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm w-full oject-cover">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold ">${item.price}</p>
                          <p className="text-sm font-bold ">
                            {item.category.name}
                          </p>
                          <p className="text-sm font-bold ">
                            {item.type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                <UpdateMapView location={location} />
              </MapContainer>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default BrowsePage;
