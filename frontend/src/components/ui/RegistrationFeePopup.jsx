import { useEffect } from "react";
import { FetchData } from "../../utils/FetchFromApi";

const RegistrationFeeModal = ({ store, onSuccess }) => {
  const openPayment = async () => {
    const res = await FetchData("payment/create", "post", {
      module: "RegistrationCharge",
      moduleId: store._id,
      user: store._id,
      amount: 500,
    });
    const { transaction, razorpay } = res.data.data;
    const options = {
      key: razorpay.key,
      amount: razorpay.amount,
      currency: razorpay.currency,
      name: "Cute & Glow",
      description: "Store Registration Fee",
      order_id: razorpay.orderId,
      handler: async (response) => {
        await FetchData("payment/verify", "post", {
          transactionId: transaction._id,
          ...response,
        });
        onSuccess();
      },
      modal: {
        escape: false,
        ondismiss: () => {},
      },
      theme: {
        color: "#8B2954",
      },
    };

    new window.Razorpay(options).open();
  };

  //   useEffect(() => {
  //     openPayment();
  //   }, []);

  const createRegistrationPayment = async () => {
    const res = await FetchData("payment/create", "post", {
      module: "RegistrationCharge",
      moduleId: store._id,
      user: store._id,
      amount: 500,
    });

    const { transaction, razorpay } = res.data.data;

    const options = {
      key: razorpay.key,
      amount: razorpay.amount,
      currency: razorpay.currency,
      name: "Cute & Glow",
      description: "Store Registration Fee",
      order_id: razorpay.orderId,

      handler: async (response) => {
        await FetchData("payment/verify", "post", {
          transactionId: transaction._id,
          ...response,
        });

        onSuccess();
      },

      modal: {
        escape: false,
        ondismiss: () => {},
      },

      theme: {
        color: "#8B2954",
      },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-96 text-center">
        <h2 className="text-2xl font-bold text-[#8B2954]">Registration Fee</h2>

        <p className="mt-3">
          Complete a one-time registration payment of ₹500 to continue.
        </p>

        <button
          onClick={() => openPayment()}
          //   onClick={() => {
          //     openPayment();
          //     console.log("Console from button");
          //   }}
          className="mt-5 bg-[#8B2954] text-white px-5 py-3 rounded-lg w-full cursor-pointer"
        >
          Pay ₹500
        </button>
      </div>
    </div>
  );
};

export default RegistrationFeeModal;
