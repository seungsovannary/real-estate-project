import { useNavigate, useParams } from "react-router-dom";

import {
  BedSingle,
  Home,
  MapPin,
  PhoneCall,
  Star,
  StarHalf,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import MainLayout from "../Layouts/MainLayout";

import { useSelector } from "react-redux";
import { db } from "../config/firebaseconfig";
import cn from "../utils/cn";

const ItemDetailPage = () => {
  const user = useSelector((state) => state.auth.value);
  const itemId = useParams();
  const [data, setData] = useState();

  const [inputReview, setInputReview] = useState("");
  const [rating, setRating] = useState(0);
  const [starTemp, setStarTemp] = useState(0);
  const [reviewErrorMessage, setReviewErrorMessage] = useState("");

  const getDetail = async () => {
    return fetch(process.env.REACT_APP_API_URL + "/properties/" + itemId.id)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setInputDescription(data?.description);
        setInputTitle(data?.name);
        setInputType(data?.type);
        setInputPrice(data?.price);
        setDisplayImage(data?.imaeg);
        setDisplayFileImage(data?.imaeg);
        setStatus(data?.status);
        setInputCategories(data?.category_id);
        setUserId(data?.user_id);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  };
  console.log(data);

  useEffect(() => {
    getDetail();
  }, []);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handlePostReviewClick = (e) => {
    e.preventDefault();

    if (!inputReview) {
      setReviewErrorMessage("Please enter review");
      return;
    }

    if (!rating) {
      setReviewErrorMessage("Please enter rating");
      return;
    }

    setReviewErrorMessage("");

    const inputData = {
      userId: user.userId,
      userName: user.userName,
      userEmail: user.userEmail,
      message: inputReview,
      rating: rating,
      isPending: true,
      createdAt: new Date(Date.now()).toISOString(),
    };

    const newData = { ...data };

    newData.customerReviews.push(inputData);
  };

  const handleChangeReview = (review) => {
    const inputNewReview = {
      ...review,
      isPending: !review.isPending,
    };

    const newData = { ...data };

    const index = newData.customerReviews.findIndex(
      (each) => each.createdAt === inputNewReview.createdAt
    );

    if (index === -1) {
      return;
    }

    newData.customerReviews[index] = inputNewReview;
  };

  // Seller
  const accessToken = localStorage.getItem("access_token");
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [inputType, setInputType] = useState("");
  const [inputPrice, setInputPrice] = useState(0);
  const [inputCategories, setInputCategories] = useState([]);
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");

  const [displayImage, setDisplayImage] = useState("");
  const [displayFileImage, setDisplayFileImage] = useState("");
  const [errorDisplayImage, setErrorDisplayImage] = useState(false);
  const [errorCategoty, setErrorCategory] = useState(false);
  const [errorType, setErrorType] = useState(false);

  const [othersImage, setOthersImage] = useState([]);
  const [othersFileImage, setOthersFileImage] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const inputData = {
      name: inputTitle,
      description: inputDescription,
      type: inputType,
      price: inputPrice,
      image: displayImage,
      category_id: inputCategories,
      status: status,
    };

    return fetch(process.env.REACT_APP_API_URL + "/properties/" + itemId.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(inputData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate("/seller/properties");
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  };

  //Update Approve
  const handleSubmitApprove = async (e) => {
    e.preventDefault();
    setLoading(true);
    const inputData = {
      status: "approved",
    };

    return fetch(process.env.REACT_APP_API_URL + "/properties/" + itemId.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(inputData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate("/admin/properties");
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  };

  //Update Unapprove
  const handleSubmitUnapprove = async (e) => {
    e.preventDefault();
    setLoading(true);
    const inputData = {
      status: "unapproved",
    };

    return fetch(process.env.REACT_APP_API_URL + "/properties/" + itemId.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(inputData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate("/admin/properties");
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  };

  //Delete
  const handleSubmitDelete = async (e) => {
    e.preventDefault();
    setLoading(true);

    return fetch(process.env.REACT_APP_API_URL + "/properties/" + itemId.id, {
      method: "DELETE", // Use DELETE method for deleting
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // No content to parse as JSON for DELETE requests
        console.log("Property deleted successfully");
        navigate("/admin/properties");
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
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

  const handleDelete = async (inputData) => {
    setDisplayImage("");
    setDisplayFileImage("");
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

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-screen-xl mx-auto min-h-[80vh] px-2 flex flex-col py-10">
        {/* TITLE */}
        <div className="w-full flex justify-between items-center  ">
          <div className="flex items-center gap-2 mt-1  ">
            <Home className="w-10 h-10" />
            <h1 className="text-3xl font-bold">{data?.name}</h1>
            {/* <div className="flex items-center gap-2 mt-1 text-gray-500">
              <MapPin className="w-5 h-5" />
              <p className="text-md">{data?.details?.location.join(", ")}</p>
            </div> */}
          </div>
          <div>
            <h1 className="text-3xl">${data?.price?.toLocaleString()}</h1>
          </div>
          {user?.role_id === "2" ? (
            <div>
              <button
                type="submit"
                onClick={handleSubmitDelete}
                className="btn btn-primary bg-red-500 border-none text-white mt-5"
              >
                {loading ? "Loading..." : "Delete"}
              </button>
            </div>
          ) : (
            ""  
          )}
        </div>
        {/* IMAGES */}
        <div className="grid grid-cols-12 h-[500px] gap-5 mt-5">
          <div className="col-span-6 h-full overflow-hidden">
            <img
              src={data?.image}
              alt="ji"
              className="h-full w-full object-cover rounded-xl"
            />
          </div>

          {/* <div className="col-span-3">
            <img src={data?.allImages[0]} alt='ji' className='h-full w-full object-cover rounded-xl' />{' '}
          </div> */}

          {user?.role_id === "2" ? (
            <div className="col-span-6 flex flex-col gap-5 overflow-y-auto">
              <form
                className="w-full flex flex-col items-center mt-10 gap-5"
                onSubmit={(e) => handleSubmitUpdate(e)}
              >
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
                    {categories?.map((item) => {
                      return <option value={item.id}>{item.name}</option>;
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

                <button type="submit" className="btn btn-primary mt-5">
                  {loading ? "Loading..." : "Submit Update"}
                </button>
              </form>
              {/* <div className="h-full relative rounded-xl overflow-hidden">
              <img
                src={data?.allImages[1]}
                alt="jbjfvncdbgdhgbdi"
                className="h-full w-full object-cover rounded-xl"
              />
              <img
                src=""
                alt="ji"
                className="h-full w-full object-cover rounded-xl"
              />
            </div>

            <div className="h-1/2 relative  rounded-xl overflow-hidden">
              <img
                src={data?.allImages[2]}
                alt="ji"
                className="h-full w-full object-cover rounded-xl"
              />
              <img src="" alt="ji" className="h-full w-full object-cover" />

              <div className=" absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center">
                <p className="text-xl text-white">View More</p>
              </div>
            </div> */}
            </div>
          ) : (
            ""
          )}
        </div>

        {/* Info section */}
        {user?.role_id !== "2" ? (
          <>
            <div className="grid grid-cols-12 mt-10 gap-5">
              {/* OVERVIEW */}
              <div className="border rounded-lg col-span-8 p-5 space-y-10">
                {/* <div>
              <h3 className="text-xl font-semibold">Overview</h3>

              <div className="grid grid-cols-12 mt-5 gap-5">
                <div className="flex items-center gap-2 text-gray-500 col-span-3">
                  <BedSingle className="w-10 h-10 p-2.5 bg-gray-200 rounded-md" />
                  <p className="text-lg">3 Bedroom</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500 col-span-3">
                  <BedSingle className="w-10 h-10 p-2.5 bg-gray-200 rounded-md" />
                  <p className="text-lg">3 Bedroom</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500 col-span-3">
                  <BedSingle className="w-10 h-10 p-2.5 bg-gray-200 rounded-md" />
                  <p className="text-lg">3 Bedroom</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500 col-span-3">
                  <BedSingle className="w-10 h-10 p-2.5 bg-gray-200 rounded-md" />
                  <p className="text-lg">3 Bedroom</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500 col-span-3">
                  <BedSingle className="w-10 h-10 p-2.5 bg-gray-200 rounded-md" />
                  <p className="text-lg">3 Bedroom</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500 col-span-3">
                  <BedSingle className="w-10 h-10 p-2.5 bg-gray-200 rounded-md" />
                  <p className="text-lg">3 Bedroom</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500 col-span-3">
                  <BedSingle className="w-10 h-10 p-2.5 bg-gray-200 rounded-md" />
                  <p className="text-lg">3 Bedroom</p>
                </div>
              </div>
            </div> */}

                <div>
                  <h3 className="text-xl font-semibold">Description</h3>
                  <p className="mt-5 text-lg text-gray-500">
                    {data?.description}
                  </p>
                </div>
              </div>

              {/* CONTACT */}
              <div className="border rounded-lg col-span-4 p-5 row-span-3">
                {user?.role_id === "3" ? (
                  <>
                    <h3 className="text-xl font-semibold">Contact</h3>

                    {/* Contact Person Info (Commented out section) */}

                    <form className="w-full flex flex-col items-center mt-10 gap-5">
                      <label className="form-control w-full max-w-lg">
                        <div className="label">
                          <span className="label-text text-xl">Full name</span>
                        </div>
                        <input
                          type="firstname"
                          placeholder="Enter your full name"
                          className="input input-bordered w-full max-w-lg"
                        />
                      </label>

                      <label className="form-control w-full max-w-lg">
                        <div className="label">
                          <span className="label-text text-xl">Email</span>
                        </div>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="input input-bordered w-full max-w-lg"
                        />
                      </label>

                      <label className="form-control w-full max-w-lg">
                        <div className="label">
                          <span className="label-text text-xl">
                            Phone Number
                          </span>
                        </div>
                        <input
                          type="number"
                          placeholder="Enter your phone number"
                          className="input input-bordered w-full max-w-lg"
                        />
                      </label>

                      <label className="form-control w-full">
                        <div className="label">
                          <span className="label-text text-xl">Messages</span>
                        </div>
                        <textarea
                          className="textarea textarea-bordered h-24"
                          placeholder="Write your messages here"
                        ></textarea>
                      </label>

                      <button type="submit" className="btn btn-primary w-full">
                        Send Messages
                      </button>
                    </form>
                  </>
                ) : user?.role_id === "1" ? (
                  data?.status.toLowerCase() === "unapproved" ? (
                    <>
                      <h3 className="text-xl font-semibold ">Approved</h3>
                      <button
                        onClick={handleSubmitApprove}
                        className="btn btn-sm btn-success my-4  text-white"
                      >
                        {loading ? "Loading" : "Approve"}
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold">Approved</h3>
                      <button
                        onClick={handleSubmitUnapprove}
                        className="btn btn-sm bg-red-500 my-4 text-white"
                      >
                        {loading ? "Loading" : "Unapprove"}
                      </button>
                    </>
                  )
                ) : (
                  ""
                )}
              </div>

              {/* DETAIL */}
              <div className="border rounded-lg col-span-8 p-5">
                <h3 className="text-xl font-semibold">Details</h3>

                <div className="grid grid-cols-3 mt-5 gap-y-3">
                  {/* <div className="flex gap-2">
                <p className=" font-semibold">Bathroom:</p>
                <p className="text-gray-500">{data?.details?.bath}</p>
              </div>
              <div className="flex gap-2">
                <p className=" font-semibold">Room :</p>
                <p className="text-gray-500">{data?.details?.bed}</p>
              </div>
              <div className="flex gap-2">
                <p className=" font-semibold">Structure Type:</p>
                <p className="text-gray-500">Brick</p>
              </div> */}
                  <div className="flex gap-2">
                    <p className=" font-semibold">Property Price</p>
                    <p className="text-gray-500">
                      ${data?.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <p className=" font-semibold">Property Type:</p>
                    <p className="text-gray-500">{data?.category.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <p className=" font-semibold">property status:</p>
                    <p className="text-gray-500">For {data?.type}</p>
                  </div>
                </div>
              </div>

              {/* MAP */}
              <div className="border rounded-lg col-span-8 p-5"></div>

              {/* Customer Reviews */}
              {/* <div className="border rounded-lg col-span-8 p-5">
            <h3 className="text-xl font-semibold">Customer Reviews</h3>

            <div className="mt-5">
              {data?.customerReviews.map((review, index) => {
                if (user.userRole !== 'admin' && review.isPending) {
                  return null;
                }
                return (
                  <div className='border p-2 rounded-md bg-gray-50 flex flex-col mb-3' key={index}>
                    <div className='flex items-center gap-5'>
                      <h1 className='text-lg font-semibold'>{review.userName}</h1>
                      <div className='flex gap-2'>
                        {['1', '2', '3', '4', '5'].slice(0, review.rating).map((rating, index) => {
                          return <Star className='w-5 h-5 text-yellow-500' key={index} />;
                        })}
                      </div>
                    </div>

                    <p className='text-gray-500'>{review.message}</p>

                    {user.userRole === 'admin' && (
                      <div className='flex gap-2 self-end'>
                        {review.isPending ? (
                          <button className='btn btn-sm btn-success' onClick={() => handleChangeReview(review)}>
                            Approve
                          </button>
                        ) : (
                          <button className='btn btn-sm btn-error' onClick={() => handleChangeReview(review)}>
                            Hide
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div> */}

              {/* POST REVIEW */}
              {/* <div className="border rounded-lg col-span-4 p-5 h-fit">
            <h3 className="text-xl font-semibold">Post a review</h3>
            <form
              className="w-full flex flex-col items-center mt-2 gap-5"
              onSubmit={(e) => handlePostReviewClick(e)}
            >
              <label className="form-control w-full">
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Write your messages here"
                  value={inputReview}
                  onChange={(e) => setInputReview(e.target.value)}
                ></textarea>
              </label>
              <div className="flex justify-between items-center w-full">
                <div className="flex">
                  {["1", "2", "3", "4", "5"].map((star, index) => {
                    return (
                      <Star
                        key={index}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => {
                          setRating(0);
                          setStarTemp(star);
                        }}
                        onMouseLeave={() => {
                          setStarTemp(0);
                          setRating(star);
                        }}
                        className={cn(
                          "w-8 ",
                          index + 1 <= starTemp || index < rating
                            ? "text-yellow-500"
                            : ""
                        )}
                      />
                    );
                  })}
                </div>

                <button type="submit" className="btn btn-primary">
                  Post Review
                </button>
              </div>
              {reviewErrorMessage && (
                <p className="text-red-500">Error: {reviewErrorMessage}</p>
              )}
            </form>
          </div> */}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </MainLayout>
  );
};

export default ItemDetailPage;
