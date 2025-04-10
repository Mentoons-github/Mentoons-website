import { addItemCart } from "@/redux/cartSlice";
import { AppDispatch } from "@/redux/store";
import { ProductBase } from "@/types/productTypes";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useProductActions = ({
  setShowLoginModal,
  setShowAddToCartModal,
  setCartProductTitle,
}: {
  setShowLoginModal: (val: boolean) => void;
  setShowAddToCartModal: (val: boolean) => void;
  setCartProductTitle: (title: string) => void;
}) => {
  const { getToken, userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    product: ProductBase
  ) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        setShowLoginModal(true);
        return;
      }

      if (userId) {
        const response = await dispatch(
          addItemCart({
            token,
            userId,
            productId: product._id,
            productType: product.type,
            title: product.title,
            quantity: 1,
            price: product.price,
            ageCategory: product.ageCategory,
            productImage: product.productImages?.[0].imageUrl,
            productDetails: product.details,
          })
        );

        if (response.payload) {
          setCartProductTitle(product.title);
          setShowAddToCartModal(true);
        }
        setIsLoading(false);
      } else {
        toast.error("User ID is missing");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error while adding to cart");
      setIsLoading(false);
    }
  };

  const handleBuyNow = async (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductBase
  ) => {
    e.stopPropagation();
    const token = await getToken();
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    navigate(`/order-summary?productId=${product._id}`, { replace: true });
  };

  return { isLoading, handleAddToCart, handleBuyNow };
};
