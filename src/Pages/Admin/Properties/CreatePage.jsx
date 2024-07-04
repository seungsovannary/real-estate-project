import React, { useRef, useState, useEffect } from "react";
import cn from "../../../utils/cn";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../Layouts/AdminLayout";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

const CreatePostPage = () => {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedRoad, setSelectedRoad] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.setView([location.lat, location.lng]);
    }
  }, [location]);

  const LocationSelector = ({ setLocation }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        axios
          .get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          )
          .then((response) => {
            if (response.data && response.data.address) {
              const { amenity, road, city, village, town, state, country } =
                response.data.address;
              const { display_name, lat, lon } = response.data;
              console.log(response.data);
              // console.log(
              //   `Clicked location: ${village}, ${town},  ${state}, ${country}`
              // );
              setSelectedState(state);
              setSelectedTown(town || city);
              setSelectedVillage(village);
              setSelectedRoad(road);
              setSelectedAddress(amenity || display_name);
              setLatitude(lat);
              setLongitude(lon);
            }
          })
          .catch((error) => {
            console.error("Error fetching location details", error);
          });
      },
    });

    return null;
  };

  const CurrentLocationButton = ({ map, setLocation }) => {
    const handleLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });

            if (map) {
              map.setView([latitude, longitude], 15);
            }
            axios
              .get(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
              )
              .then((response) => {
                if (response.data && response.data.address) {
                  const { amenity, road, village, city, town, state, country } =
                    response.data.address;
                  const { display_name, lat, lon } = response.data;
                  console.log(response.data);
                  // console.log(
                  //   `Clicked location: ${village}, ${town},  ${state}, ${country}`
                  // );
                  setSelectedState(state);
                  setSelectedTown(town || city);
                  setSelectedVillage(village);
                  setSelectedRoad(road);
                  setSelectedAddress(amenity || display_name);
                  setLatitude(lat);
                  setLongitude(lon);
                }
              })
              .catch((error) => {
                console.error("Error fetching location details", error);
              });
          },
          (error) => {
            console.error("Error getting location", error);
            alert("Error getting your location. Please try again later.");
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser");
        alert("Geolocation is not supported by this browser.");
      }
    };

    return (
      <button
        onClick={handleLocation}
        className="current-location-btn bg-blue-500 text-white py-1 px-2 my-2 rounded-lg shadow-md"
      >
        Current Location
      </button>
    );
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    setSelectedTown("");
    setSelectedVillage("");
    setLocation(null);
    axios
      .get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${stateName}`
      )
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setLatitude(lat);
          setLongitude(lon);
          setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
        } else {
          console.log(`No coordinates found for ${stateName}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching state coordinates", error);
      });
  };

  const handleTownChange = (e) => {
    const townName = e.target.value;
    setSelectedTown(townName);
    setSelectedVillage("");
    setLocation(null);

    axios
      .get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${townName}`
      )
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setLatitude(lat);
          setLongitude(lon);
          setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
        } else {
          console.log(`No coordinates found for ${townName}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching town coordinates", error);
      });
  };

  const handleVillageChange = (e) => {
    const villageName = e.target.value;
    setSelectedVillage(villageName);
    setLocation(null);
    axios
      .get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${villageName}`
      )
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setLatitude(lat);
          setLongitude(lon);
          setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
        } else {
          console.log(`No coordinates found for ${villageName}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching village coordinates", error);
      });
  };

  const accessToken = localStorage.getItem("access_token");
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [inputType, setInputType] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [inputStreet, setInputStreet] = useState("");
  const [inputDistrict, setInputDistrict] = useState("");
  const [inputCity, setInputCity] = useState("");
  const [inputSize, setInputSize] = useState(0);
  const [inputBed, setInputBed] = useState(0);
  const [inputBath, setInputBath] = useState(0);
  const [inputPrice, setInputPrice] = useState(0);

  const [displayImage, setDisplayImage] = useState("");
  const [displayFileImage, setDisplayFileImage] = useState("");
  const [errorDisplayImage, setErrorDisplayImage] = useState(false);
  const [errorCategoty, setErrorCategory] = useState(false);
  const [errorType, setErrorType] = useState(false);
  const [othersImage, setOthersImage] = useState([]);
  const [othersFileImage, setOthersFileImage] = useState([]);
  const [errorOthersImage, setErrorOthersImage] = useState(false);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmitPost = async (e) => {
    e.preventDefault();

    if (!displayImage) {
      setErrorDisplayImage(true);
      return;
    } else {
      setErrorDisplayImage(false);
    }

    // if (othersImage.length <= 0) {
    //   setErrorOthersImage(true);
    //   return;
    // } else {
    //   setErrorOthersImage(false);
    // }

    if (!inputCategory) {
      setErrorCategory(true);
      return;
    } else {
      setErrorCategory(false);
    }

    if (!inputType) {
      setErrorType(true);
      return;
    } else {
      setErrorType(false);
    }

    setLoading(true);

    const inputData = {
      name: inputTitle,
      description: inputDescription,
      type: inputType,
      price: inputPrice,
      image: displayImage,
      status: "approved",
      address: selectedAddress,
      street: selectedRoad,
      village_name: selectedVillage,
      town_name: selectedTown,
      state_name: selectedState,
      size: inputSize,
      latitude: latitude,
      longitude: longitude,
      // allImages: othersImageObj,
      // details: {
      //   location: [inputDistrict, inputCity],
      //   size: inputSize,
      //   bed: inputBed,
      //   bath: inputBath,
      // },
      category_id: inputCategory,
      // contactPerson: {
      //   profileImg: 'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
      //   name: 'Seung Sovannary',
      //   phoneNumber: '0232398324',
      // },
      // customerReviews: [],
      // createdAt: new Date(Date.now()).toISOString(),
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/properties",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(inputData),
        }
      );
      // Check if the response is not okay (status in the range 200-299)

      // Convert the response to JSON
      const data = await response.json();
      if (response.type === "cors") {
        setLoading(false);
        navigate("/admin/properties/request");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      throw error;
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleUploadDisplayImg = async (e) => {
    e.preventDefault();

    const inputData = e.target.files[0];

    const Url = await getBase64(inputData);

    setDisplayImage(Url);
    setDisplayFileImage(inputData);
  };

  const handleUploadOtherImg = async (e) => {
    e.preventDefault();

    const inputData = Array.from(e.target.files);
    setOthersFileImage(inputData);

    inputData.map((img) => {
      const Url = URL.createObjectURL(img);
      console.log(Url);

      setOthersImage((prev) => [...prev, Url]);
    });
  };

  const handleDelete = async (inputData) => {
    setDisplayImage("");
    setDisplayFileImage("");
  };

  const handleDeleteOthers = async (inputData) => {
    const index = othersImage.findIndex((item) => item === inputData);
    setOthersImage((prev) => prev.filter((item) => item !== inputData));
    const data = othersFileImage;
    data.splice(index, 1);
    setOthersFileImage(data);
  };

  const getCategories = () => {
    return fetch(process.env.REACT_APP_API_URL + "/categories", {
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

  const [states, setStates] = useState([]);
  const getStates = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/states`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Assuming data is an array of states
        setStates(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error fetching states:", error);
      });
  };

  const [towns, setTowns] = useState([]);
  const getTowns = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/towns`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Assuming data is an array of states
        setTowns(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error fetching states:", error);
      });
  };

  const [villages, setVillages] = useState([]);
  const getVillages = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/villages`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Assuming data is an array of states
        setVillages(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error fetching states:", error);
      });
  };

  useEffect(() => {
    getCategories();
    getStates();
    getTowns();
    getVillages();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-screen-2xl mx-auto min-h-[80vh] px-2 flex flex-col justify-center items-center py-10">
        <h1 className="text-4xl font-semibold">Create Post</h1>

        <form className="w-full flex flex-col items-center mt-10 gap-5">
          <label className="form-control w-full max-w-lg">
            <div className="label">
              <span className="label-text text-xl">Title</span>
            </div>
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="input input-bordered w-full max-w-lg"
              required
            />
          </label>
          <label className="form-control w-full max-w-lg">
            <div className="label">
              <span className="label-text text-xl">Description</span>
            </div>
            <textarea
              type="text"
              value={inputDescription}
              onChange={(e) => setInputDescription(e.target.value)}
              className="input input-bordered py-2 w-full max-w-lg min-h-[100px]"
              required
            />
          </label>

          <div className="space-y-2 flex flex-col justify-start items-start w-full max-w-lg">
            <label
              htmlFor="category"
              className={cn(
                "text-lg font-semibold",
                errorDisplayImage ? "text-red-500" : ""
              )}
            >
              Display Picture
            </label>
            {displayImage ? null : (
              <>
                <button>
                  <input
                    type="file"
                    onChange={(e) => handleUploadDisplayImg(e)}
                  />
                </button>
                {errorDisplayImage && (
                  <p className="text-sm font-medium text-red-500">
                    Display Image is required
                  </p>
                )}
              </>
            )}

            {!displayImage ? null : (
              <div className="border shadow-none rounded-md w-full max-w-lg">
                <div className="p-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-[180px] h-[100px] bg-gray-50 rounded-md flex items-center justify-center`}
                    >
                      <img
                        src={displayImage}
                        alt="hi"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      className="mr-5 border px-4 py-2 rounded-md text-red-500"
                      onClick={() => handleDelete(displayImage)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <label className="form-control w-full max-w-lg">
            <div className="label">
              <span className="label-text text-xl">Category</span>
            </div>
            <select
              className="select select-bordered w-full max-w-xs"
              defaultValue={"default"}
              onChange={(e) => setInputCategory(e.target.value)}
            >
              <option disabled value={"default"}>
                Please select category
              </option>
              {categories.map((item, index) => {
                return (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            {errorCategoty && (
              <p className="text-sm font-medium text-red-500">
                Please select any cateogry.
              </p>
            )}
          </label>
          <label className="form-control w-full max-w-lg">
            <div className="label">
              <span className="label-text text-xl">Type</span>
            </div>
            <select
              className="select select-bordered w-full max-w-xs"
              defaultValue={"default"}
              onChange={(e) => setInputType(e.target.value)}
            >
              <option disabled value={"default"}>
                Please select type
              </option>
              <option value="sale">For sale</option>
              <option value="rent">For rent</option>
              <option value="booking">For booking</option>
            </select>
            {errorType && (
              <p className="text-sm font-medium text-red-500">
                Please select any type.
              </p>
            )}
          </label>

          <label className="form-control w-full max-w-lg">
            <div className="label">
              <span className="label-text text-xl">Property Price</span>
            </div>
            <input
              type="number"
              value={inputPrice}
              onChange={(e) => setInputPrice(Number(e.target.value))}
              className="input input-bordered w-full max-w-lg"
              required
            />
          </label>
        </form>

        {/* Map Section */}
        <label className="form-control w-full max-w-lg">
          <div className="label">
            <span className="label-text text-xl">
              Location & Infrastructure
            </span>
          </div>
          <div className="map-container relative">
            <div className="flex w-full items-center justify-between ">
              {/* Dropdown for state selection */}
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="border border-gray-300 rounded-lg p-2 mb-4"
              >
                <option value="">Select a state...</option>
                {states?.map((state, index) => (
                  <option key={index} value={state.name}>
                    {state.name}
                  </option>
                ))}
                {/* Add more options as needed */}
              </select>

              {/* Dropdown for town selection */}
              <select
                value={selectedTown}
                onChange={handleTownChange}
                className="border border-gray-300 rounded-lg p-2 mb-4"
              >
                <option value="">Select a town...</option>
                {/* Populate towns based on selected state */}
                {states.map((state, index) => {
                  if (selectedState === state.name) {
                    return (
                      <React.Fragment key={index}>
                        {towns?.map((town, idx) => {
                          if (town.state_id === state.id) {
                            return (
                              <option key={idx} value={town.name}>
                                {town.name}
                              </option>
                            );
                          }
                          return null;
                        })}
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </select>

              {/* Dropdown for village selection */}
              <select
                value={selectedVillage}
                onChange={handleVillageChange}
                className="border border-gray-300 rounded-lg p-2 mb-4"
              >
                <option value="">Select a town...</option>
                {/* Populate towns based on selected state */}
                {towns?.map((town, index) => {
                  if (selectedTown === town.name) {
                    return (
                      <React.Fragment key={index}>
                        {villages?.map((village, idx) => {
                          if (village.town_id === town.id) {
                            return (
                              <option key={idx} value={village.name}>
                                {village.name}
                              </option>
                            );
                          }
                          return null;
                        })}
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </select>
            </div>

            {/* Map container */}
            <MapContainer
              center={[11.5449, 104.8922]} // Default center for initial load
              zoom={15} // Default zoom level for initial load
              className="w-full h-64"
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {location && <Marker position={[location.lat, location.lng]} />}
              <LocationSelector setLocation={setLocation} />
            </MapContainer>
            <CurrentLocationButton
              map={mapRef.current}
              setLocation={setLocation}
            />
          </div>
        </label>
        <label className="form-control w-full max-w-lg">
          <div className="label">
            <span className="label-text text-xl">Address</span>
          </div>
          <input
            type="text"
            value={selectedAddress || ""}
            onChange={(e) => setSelectedAddress(e.target.value)}
            className="input input-bordered w-full max-w-lg"
            required
          />
        </label>
        <label className="form-control w-full max-w-lg">
          <div className="label">
            <span className="label-text text-xl">Road</span>
          </div>
          <input
            type="text"
            value={selectedRoad || ""}
            onChange={(e) => setSelectedRoad(e.target.value)}
            className="input input-bordered w-full max-w-lg"
            required
          />
        </label>
        <button
          onClick={(e) => handleSubmitPost(e)}
          className="btn btn-primary mt-5"
        >
          {loading ? "Loading..." : "Submit Post"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default CreatePostPage;
