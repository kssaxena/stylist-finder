import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Button from "../components/Button";
import {
  getCartItemType,
  removeFromCart,
  updateCartQuantity,
} from "../redux/slice/shoppingSlice";

const Cart = () => {
  const items = useSelector((state) => state.shopping.cartItems);
  const { isAuthenticated, isAuthLoading, user } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canCheckout =
    isAuthenticated && user?.role?.toLowerCase() === "customer";
  const serviceItems = items.filter(
    (item) => getCartItemType(item) === "service",
  );
  const productItems = items.filter(
    (item) => getCartItemType(item) === "product",
  );
  const cartQuantity = items.reduce(
    (total, item) =>
      total + (getCartItemType(item) === "product" ? item.quantity || 1 : 1),
    0,
  );
  const productQuantity = productItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  const startCheckout = (itemType) => {
    if (!canCheckout) {
      navigate("/auth/login/customer", {
        state: { from: { pathname: "/cart" } },
      });
      return;
    }

    navigate(`/cart/checkout?type=${itemType === "product" ? "products" : "services"}`);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 pb-24 lg:pb-10 min-h-[50vh]">
      <h1 className="heading text-3xl text-[#8B2954] mb-2">Your cart</h1>
      <p className="text-neutral-600 mb-8">
        {items.length
          ? `${cartQuantity} item${cartQuantity === 1 ? "" : "s"} in your shared services and products cart`
          : "Your cart is empty. Browse services or products to get started."}
      </p>

      {items.length ? (
        <>
          <div className="space-y-4">
            {items.map((item) => {
              const isProduct = getCartItemType(item) === "product";
              const unitPrice = isProduct
                ? Number(item.price || 0)
                : Number(item?.charges || item?.price?.sellingPrice || 0);
              const quantity = isProduct ? item.quantity || 1 : 1;
              return (
                <article
                  key={`${isProduct ? "product" : "service"}-${item._id}`}
                  className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-4 sm:flex-row"
                >
                  <img
                    src={
                      (isProduct
                        ? item?.images?.[0]?.url
                        : item?.coverImage?.[0]?.url) || "/images/placeholder.jpg"
                    }
                    alt={item.name}
                    className="h-36 w-full rounded-lg object-cover sm:w-36"
                  />
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                      {isProduct ? "Product" : "Service"}
                    </p>
                    <h2 className="heading text-xl">{item.name}</h2>
                    <p className="text-sm text-neutral-600">
                      {isProduct
                        ? `${item.category || "Store"}${item.stock !== undefined ? ` · ${item.stock} in stock` : ""}`
                        : item?.store?.storeName || item?.professional?.name}
                    </p>
                    <p className="mt-2 text-lg text-[#8B2954]">
                      ₹{(unitPrice * quantity).toLocaleString("en-IN")}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        LabelName={isProduct ? "View product" : "View service"}
                        variant="secondary"
                        onClick={() =>
                          navigate(
                            isProduct
                              ? `/e-commerce/products/${item._id}`
                              : `/services/${item._id}/current-service`,
                          )
                        }
                      />
                      {isProduct && (
                        <div className="flex items-center gap-2 rounded-lg border px-2">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.name} quantity`}
                            disabled={quantity <= 1}
                            onClick={() =>
                              dispatch(
                                updateCartQuantity({
                                  id: item._id,
                                  quantity: quantity - 1,
                                }),
                              )
                            }
                            className="px-2 py-1 disabled:opacity-40"
                          >
                            −
                          </button>
                          <span>{quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.name} quantity`}
                            disabled={quantity >= Number(item.stock || 0)}
                            onClick={() =>
                              dispatch(
                                updateCartQuantity({
                                  id: item._id,
                                  quantity: quantity + 1,
                                }),
                              )
                            }
                            className="px-2 py-1 disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      )}
                      <Button
                        LabelName={
                          <span className="flex items-center gap-2">
                            <FaTrash /> Remove
                          </span>
                        }
                        variant="secondary"
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              id: item._id,
                              itemType: isProduct ? "product" : "service",
                            }),
                          )
                        }
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <p className="text-sm text-neutral-600 mb-4">
              Checkout services and products separately; both stay in this
              shared cart until their respective checkout is complete.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              {serviceItems.length > 0 && (
                <Button
                  LabelName={isAuthLoading ? "Checking sign-in..." : `Book ${serviceItems.length} service${serviceItems.length === 1 ? "" : "s"}`}
                  onClick={() => startCheckout("service")}
                  disabled={isAuthLoading}
                />
              )}
              {productItems.length > 0 && (
                <Button
                  LabelName={isAuthLoading ? "Checking sign-in..." : `Checkout ${productQuantity} product${productQuantity === 1 ? "" : "s"}`}
                  onClick={() => startCheckout("product")}
                  disabled={isAuthLoading}
                />
              )}
            </div>
            {!canCheckout && (
              <p className="text-sm text-neutral-500 mt-3">
                  You can add items without signing in. Customer login is
                  required to continue to checkout.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button
            LabelName="Browse services"
            onClick={() => navigate("/services/all")}
          />
          <Button
            LabelName="Shop products"
            variant="secondary"
            onClick={() => navigate("/e-commerce")}
          />
        </div>
      )}
    </main>
  );
};

export default Cart;
