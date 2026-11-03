import { useEffect, useRef, useState } from "react";
import { FetchData } from "../../../utils/FetchFromApi";
import { useToast } from "../../../components/hooks/ToastContext";

const ProductOrders = () => {
  const { alertError } = useToast();
  const alertErrorRef = useRef(alertError);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alertErrorRef.current = alertError;
  }, [alertError]);

  useEffect(() => {
    let cancelled = false;
    FetchData("products/orders/my", "get")
      .then((response) => {
        if (!cancelled) setOrders(response.data.data || []);
      })
      .catch((error) => {
        if (!cancelled) {
          alertErrorRef.current(
            error?.response?.data?.message || "Unable to load your orders.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto min-h-[50vh] max-w-5xl px-4 py-10 pb-24">
      <h1 className="heading mb-2 text-3xl text-[#8B2954]">My product orders</h1>
      <p className="mb-6 text-neutral-600">
        Review payment and delivery progress for your store purchases.
      </p>
      {loading ? (
        <p className="py-8 text-neutral-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="rounded-xl border bg-white p-8 text-center text-neutral-500">
          You have not placed any product orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order._id} className="rounded-xl border bg-white p-4">
              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <div>
                  <h2 className="font-semibold">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-sm text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="font-semibold text-[#8B2954]">
                    ₹{Number(order.amount).toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm">{order.status}</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 border-t pt-3">
                {order.items.map((item, index) => (
                  <li
                    key={`${item.product}-${index}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span>{item.name} × {item.quantity}</span>
                    <span>
                      ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-neutral-600">
                Delivery to: {[
                  order.shippingAddress?.area,
                  order.shippingAddress?.city,
                  order.shippingAddress?.state,
                  order.shippingAddress?.pincode,
                ].filter(Boolean).join(", ")}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default ProductOrders;
