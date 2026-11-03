import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProductToCart } from "../../../redux/slice/shoppingSlice";
import { useToast } from "../../../components/hooks/ToastContext";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.shopping.cartItems);
  const { alertInfo, alertSuccess } = useToast();
  const quantityInCart =
    cartItems.find(
      (item) => item._id === product._id && item.itemType === "product",
    )?.quantity || 0;
  const soldOut = product.stock < 1;

  const addToCart = () => {
    if (soldOut) {
      alertInfo("This product is currently out of stock.");
      return;
    }
    if (quantityInCart >= product.stock) {
      alertInfo("Your cart already has all available stock.");
      return;
    }
    dispatch(addProductToCart(product));
    alertSuccess("Product added to your cart.");
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <button
        type="button"
        className="block h-56 w-full overflow-hidden bg-neutral-100"
        onClick={() => navigate(`/e-commerce/products/${product._id}`)}
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.images?.[0]?.url || "/images/placeholder.jpg"}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </button>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          {product.category}
        </p>
        <h2 className="mt-1 line-clamp-2 min-h-12 text-lg font-semibold">
          {product.name}
        </h2>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xl font-semibold text-[#8B2954]">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
          <span
            className={`text-xs ${soldOut ? "text-red-600" : product.stock < 5 ? "text-orange-700" : "text-green-700"}`}
          >
            {soldOut
              ? "Out of stock"
              : `${product.stock < 5 ? "Only few left" : "In stock"}`}
          </span>
        </div>
        <button
          type="button"
          onClick={addToCart}
          disabled={soldOut}
          className="mt-4 w-full rounded-lg bg-[#8B2954] px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {soldOut
            ? "Out of stock"
            : quantityInCart
              ? `Add another (${quantityInCart} in cart)`
              : "Add to cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
