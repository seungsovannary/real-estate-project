import { useEffect, useState } from "react";
import SellerLayout from "../../Layouts/SellerLayout";
import { useSelector } from "react-redux";

function DashboardPage() {
  const user = useSelector((state) => state.auth.value);
  const [propertiesSeller, setPropertiesSeller] = useState([]);
  const [propertiesSellerPending, setPropertiesSellerPending] = useState([]);
  const [propertiesSellerApprove, setPropertiesSellerApprove] = useState([]);
  const [propertiesSellerUnapprove, setPropertiesSellerUnapprove] = useState(
    []
  );

  const fetchProperty = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/properties"
      );
      const data = await response.json();

      const properties = data.filter(
        (property) => property.user_id,
        toString() === user?.role_id.toString()
      );
      setPropertiesSeller(properties);

      const propertiesApprove = data.filter(
        (property) =>
          property.status.toString().toLocaleLowerCase() === "approved"
      );
      setPropertiesSellerApprove(propertiesApprove);

      const propertiesUnapprove = data.filter(
        (property) =>
          property.status.toString().toLocaleLowerCase() === "unapproved"
      );
      setPropertiesSellerUnapprove(propertiesUnapprove);

      const propertiesPending = data.filter(
        (property) =>
          property.status.toString().toLocaleLowerCase() === "pending"
      );
      setPropertiesSellerPending(propertiesPending);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  return (
    <SellerLayout>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <a
          href=""
          className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 cursor-pointer"
        >
          <div className="flex justify-between">
            <div>
              <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                {propertiesSeller.length}
              </h5>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Total Properties
              </p>
            </div>
          </div>
        </a>

        <a className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 cursor-pointer">
          <div className="flex justify-between">
            <div>
              <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                {propertiesSellerPending.length}
              </h5>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Total Properties Pending
              </p>
            </div>
          </div>
        </a>
        <a className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 cursor-pointer">
          <div className="flex justify-between">
            <div>
              <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                {propertiesSellerApprove.length}
              </h5>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Total Properties Approved
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
                {propertiesSellerUnapprove.length}
              </h5>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Total Properties Unapproved
              </p>
            </div>
          </div>
        </a>
      </div>
    </SellerLayout>
  );
}

export default DashboardPage;
