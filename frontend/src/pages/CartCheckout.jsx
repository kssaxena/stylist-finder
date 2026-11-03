import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import { useToast } from "../components/hooks/ToastContext";
import { clearCart, getCartItemType } from "../redux/slice/shoppingSlice";
import { FetchData } from "../utils/FetchFromApi";

const getTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const CartCheckout = () => {
  const cartItems = useSelector((state) => state.shopping.cartItems);
  const [searchParams] = useSearchParams();
  const checkoutType =
    searchParams.get("type") === "products" ? "product" : "service";
  const items = cartItems.filter(
    (item) => getCartItemType(item) === checkoutType,
  );
  const { isAuthenticated, isAuthLoading, user } = useSelector(
    (state) => state.auth,
  );
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [bookingDates, setBookingDates] = useState({});
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [paying, setPaying] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { alertSuccess, alertError, alertInfo } = useToast();
  const alertErrorRef = useRef(alertError);
  useEffect(() => {
    alertErrorRef.current = alertError;
  }, [alertError]);
  const canCheckout =
    isAuthenticated && user?.role?.toLowerCase() === "customer";
  const amount =
    items.reduce(
      (total, item) =>
        total +
        Math.round(
          Number(
            checkoutType === "product"
              ? item?.price || 0
              : item?.charges || item?.price?.sellingPrice || 0,
          ) * 100,
        ) *
          (checkoutType === "product" ? item.quantity || 1 : 1),
      0,
    ) / 100;

  useEffect(() => {
    if (isAuthLoading) return;
    if (!canCheckout) {
      navigate("/auth/login/customer", {
        state: { from: { pathname: "/cart/checkout" } },
        replace: true,
      });
      return;
    }
    if (items.length === 0) {
      navigate("/cart", { replace: true });
      return;
    }

    let cancelled = false;
    const loadAddresses = async () => {
      try {
        const response = await FetchData(
          `customer/get/customer/data/${user._id}`,
          "get",
        );
        if (cancelled) return;
        const customerAddresses = response.data.data.customer?.address || [];
        setAddresses(customerAddresses);
        const preferredAddress =
          customerAddresses.find((address) => address.defaultAddress) ||
          customerAddresses[0];
        setAddressId(preferredAddress?._id || "");
      } catch (error) {
        if (!cancelled) {
          alertErrorRef.current(
            error?.response?.data?.message || "Unable to load your addresses",
          );
        }
      } finally {
        if (!cancelled) setLoadingAddresses(false);
      }
    };

    loadAddresses();
    return () => {
      cancelled = true;
    };
  }, [
    canCheckout,
    checkoutType,
    isAuthLoading,
    items.length,
    navigate,
    user?._id,
  ]);

  const setDateForService = (serviceId, dateForBooking) => {
    setBookingDates((current) => ({ ...current, [serviceId]: dateForBooking }));
  };

  const startPayment = async (event) => {
    event.preventDefault();
    if (!addressId) {
      alertInfo("Please add or select an address before checkout.");
      return;
    }
    if (!window.Razorpay) {
      alertError("Payment gateway is unavailable. Please try again.");
      return;
    }

    setPaying(true);
    try {
      const response =
        checkoutType === "product"
          ? await FetchData("products/orders/create-payment", "post", {
              address: addressId,
              items: items.map((item) => ({
                productId: item._id,
                quantity: item.quantity || 1,
              })),
            })
          : await FetchData("payment/service-booking/create", "post", {
              address: addressId,
              items: items.map((item) => ({
                serviceId: item._id,
                dateForBooking: bookingDates[item._id] || getTomorrow(),
              })),
            });
      const { transaction, razorpay } = response.data.data;
      const checkout = new window.Razorpay({
        key: razorpay.key,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: razorpay.name,
        description: razorpay.description,
        order_id: razorpay.orderId,
        handler: async (paymentResponse) => {
          try {
            await FetchData(
              checkoutType === "product"
                ? "payment/product-order/verify"
                : "payment/service-booking/verify",
              "post",
              {
              transactionId: transaction._id,
              ...paymentResponse,
              },
            );
            dispatch(clearCart(checkoutType));
            alertSuccess(
              checkoutType === "product"
                ? "Payment received. Your product order is being processed."
                : "Payment received and all appointments are booked.",
            );
            navigate(checkoutType === "product" ? "/cart" : "/dashboard");
          } catch (error) {
            alertError(
              error?.response?.data?.message ||
                "Payment verification failed. Your cart has been kept.",
            );
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
        theme: { color: "#8B2954" },
      });
      checkout.on("payment.failed", (paymentError) => {
        alertError(
          paymentError?.error?.description || "Payment was not successful.",
        );
        setPaying(false);
      });
      checkout.open();
    } catch (error) {
      setPaying(false);
      alertError(
        error?.response?.data?.message || "Unable to start checkout payment",
      );
    }
  };

  if (isAuthLoading || !canCheckout || items.length === 0) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10 min-h-[50vh]">
        <p className="text-neutral-600">Loading checkout...</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 pb-24 lg:pb-10 min-h-[50vh]">
      <h1 className="heading text-3xl text-[#8B2954] mb-2">Cart checkout</h1>
      <p className="text-neutral-600 mb-8">
        {checkoutType === "product"
          ? "Confirm your delivery address and pay securely for the products."
          : "Choose an appointment date for each service, then pay securely."}
      </p>

      <form onSubmit={startPayment}>
        <div className="space-y-4">
          {items.map((item) => {
            const isProduct = checkoutType === "product";
            return (
            <article
              key={item._id}
              className="flex flex-col sm:flex-row gap-4 border border-neutral-200 rounded-xl p-4"
            >
              <img
                src={
                  (isProduct
                    ? item?.images?.[0]?.url
                    : item?.coverImage?.[0]?.url) || "/images/placeholder.jpg"
                }
                alt={item.name}
                className="w-full sm:w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="heading text-xl">{item.name}</h2>
                <p className="text-sm text-neutral-600">
                  {isProduct
                    ? `Quantity: ${item.quantity || 1}`
                    : item?.store?.storeName || item?.professional?.name}
                </p>
                <p className="text-lg text-[#8B2954] my-2">
                  ₹
                  {(
                    Number(
                      isProduct
                        ? item.price || 0
                        : item?.charges || item?.price?.sellingPrice || 0,
                    ) * (isProduct ? item.quantity || 1 : 1)
                  ).toLocaleString("en-IN")}
                </p>
                {!isProduct && (
                  <label className="text-sm font-medium">
                    Appointment date
                    <input
                      type="date"
                      required
                      min={getTomorrow()}
                      value={bookingDates[item._id] || getTomorrow()}
                      onChange={(event) =>
                        setDateForService(item._id, event.target.value)
                      }
                      className="block border border-neutral-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </label>
                )}
              </div>
            </article>
            );
          })}
        </div>

        <section className="mt-8 border-t border-neutral-200 pt-6 space-y-5">
          <label className="block font-medium">
            {checkoutType === "product" ? "Delivery address" : "Booking address"}
            <select
              required
              value={addressId}
              onChange={(event) => setAddressId(event.target.value)}
              disabled={loadingAddresses || addresses.length === 0}
              className="block w-full border border-neutral-300 rounded-lg px-3 py-3 mt-2"
            >
              {addresses.length === 0 ? (
                <option value="">No saved addresses</option>
              ) : (
                addresses.map((address) => (
                  <option key={address._id} value={address._id}>
                    {address.addressType || "Address"} —{" "}
                    {[address.area, address.city, address.state]
                      .filter(Boolean)
                      .join(", ")}
                    {address.defaultAddress ? " (Default)" : ""}
                  </option>
                ))
              )}
            </select>
          </label>
          {addresses.length === 0 && !loadingAddresses && (
            <p className="text-sm text-red-700">
              Add an address in your customer dashboard before checkout.
            </p>
          )}
          <div className="flex items-center justify-between text-xl font-semibold">
            <span>Cart total</span>
            <span className="text-[#8B2954]">
              ₹{amount.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-sm text-neutral-600">
            Final payable amount is validated against current prices and stock.
            Online payment is required to confirm checkout.
          </p>
          <Button
            LabelName={
              paying
                ? "Opening secure payment..."
                : checkoutType === "product"
                  ? "Pay for products"
                  : "Pay for services"
            }
            type="submit"
            className="w-full sm:w-auto"
            disabled={paying || loadingAddresses || addresses.length === 0}
          />
        </section>
      </form>
    </main>
  );
};

export default CartCheckout;
