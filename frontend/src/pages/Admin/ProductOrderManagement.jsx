import { useEffect, useRef, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import { useToast } from "../../components/hooks/ToastContext";

const nextStatuses = ["Packed", "Shipped", "Delivered"];

const ProductOrderManagement = () => {
  const { alertError, alertSuccess } = useToast();
  const alertErrorRef = useRef(alertError);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alertErrorRef.current = alertError;
  }, [alertError]);

  const loadOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await FetchData("products/admin/orders", "get");
      setOrders(response.data.data || []);
    } catch (error) {
      alertErrorRef.current(
        error?.response?.data?.message || "Unable to load product orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    FetchData("products/admin/orders", "get")
      .then((response) => {
        if (!cancelled) setOrders(response.data.data || []);
      })
      .catch((error) => {
        if (!cancelled) {
          alertErrorRef.current(
            error?.response?.data?.message || "Unable to load product orders.",
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

  const updateStatus = async (orderId, status) => {
    try {
      await FetchData(`products/admin/orders/${orderId}/status`, "post", { status });
      alertSuccess(`Order marked ${status.toLowerCase()}.`);
      await loadOrders(false);
    } catch (error) {
      alertError(error?.response?.data?.message || "Unable to update this order.");
    }
  };

  return (
    <section>
      <header className="mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Product orders</h2>
        <p className="mt-1 text-sm text-gray-600">
          Review paid orders and update their fulfilment status.
        </p>
      </header>
      {loading ? (
        <p className="py-8 text-neutral-600">Loading product orders...</p>
      ) : orders.length === 0 ? (
        <p className="rounded-xl border bg-white p-8 text-center text-neutral-500">No product orders have been placed.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const canUpdate = ["Processing", "Packed", "Shipped"].includes(order.status);
            return (
              <article key={order._id} className="rounded-xl border bg-white p-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <h3 className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="text-sm text-neutral-600">
                      {order.customer?.name || "Customer"} · {order.customer?.contactNumber || order.customer?.email || ""}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {new Date(order.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-[#8B2954]">₹{Number(order.amount).toLocaleString("en-IN")}</p>
                    <p className="text-sm">{order.status}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 border-t pt-3 text-sm">
                  {order.items.map((item, index) => (
                    <li key={`${item.product}-${index}`} className="flex justify-between gap-4">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-neutral-600">
                  Ship to: {[
                    order.shippingAddress?.name,
                    order.shippingAddress?.flatNumber,
                    order.shippingAddress?.street1,
                    order.shippingAddress?.area,
                    order.shippingAddress?.city,
                    order.shippingAddress?.state,
                    order.shippingAddress?.pincode,
                  ].filter(Boolean).join(", ")}
                </p>
                {canUpdate && (
                  <label className="mt-3 flex items-center gap-2 text-sm">
                    Update fulfilment
                    <select
                      value=""
                      onChange={(event) => updateStatus(order._id, event.target.value)}
                      className="rounded-lg border px-3 py-2"
                    >
                      <option value="" disabled>Choose status</option>
                      {nextStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductOrderManagement;
