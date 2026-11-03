import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FetchData } from "../../../utils/FetchFromApi";
import { addProductToCart } from "../../../redux/slice/shoppingSlice";
import { useToast } from "../../../components/hooks/ToastContext";
import LoadingSkeleton from "../components/LoadingSkeleton";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.shopping.cartItems);
  const { alertError, alertSuccess } = useToast();
  const alertErrorRef = useRef(alertError);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alertErrorRef.current = alertError;
  }, [alertError]);

  useEffect(() => {
    let cancelled = false;
    FetchData(`products/by-id/${productId}`, "get")
      .then((response) => {
        if (!cancelled) setProduct(response.data.data);
      })
      .catch((error) => {
        if (!cancelled) {
          alertErrorRef.current(
            error?.response?.data?.message || "Unable to load product.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading || product?._id !== productId) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <LoadingSkeleton />
      </main>
    );
  }
  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="heading text-2xl">Product unavailable</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
      <img
        src={product.images?.[0]?.url || "/images/placeholder.jpg"}
        alt={product.name}
        className="aspect-square w-full rounded-2xl bg-neutral-100 object-cover"
      />
      <section className="py-2">
        <p className="text-sm uppercase tracking-wide text-neutral-500">
          {product.category}
        </p>
        <h1 className="heading mt-2 text-3xl">{product.name}</h1>
        <p className="mt-4 text-2xl font-semibold text-[#8B2954]">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-neutral-700">
          {product.description || "No description provided."}
        </p>
        {/* <p className="mt-5 text-sm text-neutral-600">
          {product.stock > 0
            ? `${product.stock} available`
            : "Currently out of stock"}
        </p> */}
        {/* <span
          className={`text-xs ${soldOut ? "text-red-600" : product.stock < 5 ? "text-orange-700" : "text-green-700"}`}
        >
          {soldOut
            ? "Out of stock"
            : `${product.stock < 5 ? "Only few left" : "In stock"}`}
        </span> */}
        <button
          type="button"
          disabled={product.stock < 1}
          onClick={() => {
            const quantityInCart =
              cartItems.find(
                (item) =>
                  item._id === product._id && item.itemType === "product",
              )?.quantity || 0;
            if (quantityInCart >= product.stock) {
              alertError("Your cart already has all available stock.");
              return;
            }
            dispatch(addProductToCart(product));
            alertSuccess("Product added to your cart.");
          }}
          className="mt-6 rounded-lg bg-[#8B2954] px-6 py-3 font-medium text-white disabled:bg-neutral-400"
        >
          Add to cart
        </button>
      </section>
    </main>
  );
};

export default ProductDetails;
