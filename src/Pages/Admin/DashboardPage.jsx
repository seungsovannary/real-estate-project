import { useEffect, useState } from "react";
import AdminLayout from "../../Layouts/AdminLayout";
import SellerLayout from "../../Layouts/SellerLayout";
import { useSelector } from "react-redux";

function DashboardPage() {
  const user = useSelector((state) => state.auth.value);

  const isAdmin = user?.role_id === "1";
  const isSeller = user?.role_id === "2";

  const [users, setUsers] = useState([]);
  const [userSellers, setUserSellers] = useState([]);
  const [userBuyers, setUserBuyers] = useState([]);
  const [properties, setProperties] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/users");
      const data = await response.json();
      const filterUsers = data.filter((user) => user.role_id !== "1");
      setUsers(filterUsers);

      const filterUserSellers = data.filter((user) => user.role_id === "2");
      setUserSellers(filterUserSellers);
      const filterUserBuyers = data.filter((user) => user.role_id === "3");
      setUserBuyers(filterUserBuyers);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchProperty = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/properties"
      );
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchProperty();
  }, []);

  const approvedProperty = properties.filter(
    (item) => item?.status === "approved"
  );

  const unapprovedProperty = properties.filter(
    (item) => item?.status === "unapproved"
  );

  const pendingProperty = properties.filter(
    (item) => item?.status === "pending"
  );

  return (
    <AdminLayout>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <a
          href=""
          className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 cursor-pointer"
        >
          <div className="flex justify-between">
            <div>
              <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                {users.length}
              </h5>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Total Users
              </p>
            </div>
            {/* <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
              12%
              <svg
                className="w-3 h-3 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13V1m0 0L1 5m4-4 4 4"
                />
              </svg>
            </div> */}
          </div>
        </a>
        <a className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 cursor-pointer">
          <div className="flex justify-between">
            <div>
              <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                {userSellers.length}
              </h5>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Total Sellers
              </p>
            </div>
            {/* <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
              12%
              <svg
                className="w-3 h-3 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13V1m0 0L1 5m4-4 4 4"
                />
              </svg>
            </div> */}
          </div>
        </a>
        <a
          href=""
          className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 cursor-pointer"
        >
          <div className="flex justify-between">
            <div>
              <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                {userBuyers.length}
              </h5>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Total Buyers
              </p>
            </div>
            {/* <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
              12%
              <svg
                className="w-3 h-3 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13V1m0 0L1 5m4-4 4 4"
                />
              </svg>
            </div> */}
          </div>
        </a>
        <a
          href=""
          className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 cursor-pointer"
        >
          <div className="flex justify-between">
            <div>
              <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                {properties.length}
              </h5>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Total Properties
              </p>
            </div>
            {/* <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
              12%
              <svg
                className="w-3 h-3 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13V1m0 0L1 5m4-4 4 4"
                />
              </svg>
            </div> */}
          </div>
        </a>

        <a
          href=""
          className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 cursor-pointer"
        >
          <div className="flex justify-between">
            <div>
              <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                {pendingProperty.length}
              </h5>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Total Pending Properties
              </p>
            </div>
          </div>
        </a>
        <a
          href=""
          className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 cursor-pointer"
        >
          <div className="flex justify-between">
            <div>
              <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                {approvedProperty.length}
              </h5>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Total Approved Properties
              </p>
            </div>
          </div>
        </a>
        <a
          href=""
          className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 cursor-pointer"
        >
          <div className="flex justify-between">
            <div>
              <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                {unapprovedProperty.length}
              </h5>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Total Unapproved Properties
              </p>
            </div>
          </div>
        </a>
      </div>
    </AdminLayout>
  );
}

export default DashboardPage;
