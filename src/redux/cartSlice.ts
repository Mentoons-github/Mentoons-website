import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface CartItem {
  productId: string;
  productType: string;
  title: string;
  ageCategory?: string;
  productImage?: string;
  cardType?: string;
  quantity: number;
  price: number;
  productDetails?: any;
}

interface AppliedCoupon {
  code: string;
  discountAmount: number;
  discountType: "percentage" | "fixed";
}

interface Cart {
  userId: string;
  items: CartItem[];
  totalPrice: number;
  totalItemCount: number;
  cartStatus: "active" | "completed" | "cancelled";
  appliedCoupon?: AppliedCoupon;
  discountedPrice: number;
}

const initialState: {
  loading: boolean;
  error: string | null;
  success: boolean;
  cart: Cart;
  apiStatus: "idle" | "loading" | "succeeded" | "failed";
} = {
  loading: false,
  error: null,
  success: false,
  apiStatus: "idle",
  cart: {
    userId: "",
    items: [],
    totalPrice: 0,
    totalItemCount: 0,
    cartStatus: "active",
    discountedPrice: 0,
  },
};

export const getCart = createAsyncThunk(
  "cart/getCart",
  async ({ token, userId }: { token: string; userId: string }) => {
    try {
      const response = await axios.get(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/cart/${userId}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch the Cart");
    }
  }
);

export const addItemCart = createAsyncThunk(
  "cart/addToCart",
  async ({
    token,
    userId,
    productId,
    productType,
    title,
    quantity,
    price,
    ageCategory,
    productImage,
    productDetails,
  }: {
    token: string;
    userId: string;
    productId: string;
    productType: string;
    title: string;
    quantity: number;
    price: number;
    ageCategory?: string;
    productImage?: string;
    productDetails?: any;
  }) => {
    try {
      const response = await axios.post(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/cart/add`,
        // "http://localhost:4000/api/v1/cart/add",

        {
          userId,
          productId,
          productType,
          title,
          quantity,
          price,
          ageCategory,
          productImage,
          productDetails,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to add the product to the Cart");
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({
    token,
    userId,
    productId,
  }: {
    token: string;
    userId: string;
    productId: string;
  }) => {
    try {
      const response = await axios.delete(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/cart/remove`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {
            userId,
            productId,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to remove the product from the Cart");
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({
    token,
    userId,
    productId,
    quantity,
  }: {
    token: string;
    userId: string;
    productId: string;
    quantity: number;
  }) => {
    try {
      const response = await axios.patch(
        // `https://mentoons-backend-zlx3.onrender.com/api/v1/cart/update-quantity`,
        `${import.meta.env.VITE_PROD_URL}/cart/update-quantity`,
        {
          userId,
          productId,
          quantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update item quantity in the Cart");
    }
  }
);

// New thunk for applying a coupon
export const applyCoupon = createAsyncThunk(
  "cart/applyCoupon",
  async ({
    token,
    userId,
    couponCode,
  }: {
    token: string;
    userId: string;
    couponCode: string;
  }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/cart/apply-coupon`, // Restore the API endpoint

        {
          userId,
          couponCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to apply coupon");
    }
  }
);

// New thunk for removing a coupon
export const removeCoupon = createAsyncThunk(
  "cart/removeCoupon",
  async ({ token, userId }: { token: string; userId: string }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/cart/remove-coupon`,
        {
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to remove coupon");
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = {
        userId: "",
        items: [],
        totalPrice: 0,
        totalItemCount: 0,
        cartStatus: "active",
        discountedPrice: 0,
      };
      state.loading = false;
      state.error = null;
      state.success = false;
      state.apiStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCart.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.apiStatus = "loading";
    });

    builder.addCase(getCart.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.apiStatus = "succeeded";
      state.cart.items = action.payload?.items;
      state.cart.totalPrice = action.payload?.totalPrice;
      state.cart.totalItemCount = action.payload?.totalItemCount;
      state.cart.cartStatus = action.payload?.status || "active";
      state.cart.appliedCoupon = action.payload?.appliedCoupon;
      state.cart.discountedPrice =
        action.payload?.discountedPrice || action.payload?.totalPrice;
    });

    builder.addCase(getCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch the Cart";
      state.success = false;
      state.apiStatus = "failed";
    });

    builder.addCase(addItemCart.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.apiStatus = "loading";
    });

    builder.addCase(addItemCart.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.apiStatus = "succeeded";
      state.cart.items = action.payload?.items;
      state.cart.totalPrice = action.payload?.totalPrice;
      state.cart.totalItemCount = action.payload?.totalItemCount;
      state.cart.cartStatus = action.payload?.status || "active";
      state.cart.appliedCoupon = action.payload?.appliedCoupon;
      state.cart.discountedPrice =
        action.payload?.discountedPrice || action.payload?.totalPrice;
    });

    builder.addCase(addItemCart.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Failed to add the product to the Cart";
      state.success = false;
      state.apiStatus = "failed";
    });

    // Handle applyCoupon
    builder.addCase(applyCoupon.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.apiStatus = "loading";
    });

    builder.addCase(applyCoupon.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.apiStatus = "succeeded";
      state.cart.appliedCoupon = action.payload?.appliedCoupon;
      state.cart.discountedPrice = action.payload?.discountedPrice;
      state.cart.totalPrice = action.payload?.totalPrice;
    });

    builder.addCase(applyCoupon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to apply coupon";
      state.success = false;
      state.apiStatus = "failed";
    });

    // Handle removeCoupon
    builder.addCase(removeCoupon.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.apiStatus = "loading";
    });

    builder.addCase(removeCoupon.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.apiStatus = "succeeded";
      state.cart.appliedCoupon = undefined;
      state.cart.discountedPrice = action.payload?.totalPrice;
      state.cart.totalPrice = action.payload?.totalPrice;
    });

    builder.addCase(removeCoupon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to remove coupon";
      state.success = false;
      state.apiStatus = "failed";
    });

    // Additional handlers for other actions (removeItemFromCart, updateItemQuantity)
    // Handle removeItemFromCart
    builder.addCase(removeItemFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.apiStatus = "loading";
    });

    builder.addCase(removeItemFromCart.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.apiStatus = "succeeded";
      state.cart.items = action.payload?.items;
      state.cart.totalPrice = action.payload?.totalPrice;
      state.cart.totalItemCount = action.payload?.totalItemCount;
      state.cart.cartStatus = action.payload?.status || "active";
      state.cart.appliedCoupon = action.payload?.appliedCoupon;
      state.cart.discountedPrice =
        action.payload?.discountedPrice || action.payload?.totalPrice;
    });

    builder.addCase(removeItemFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Failed to remove the product from the Cart";
      state.success = false;
      state.apiStatus = "failed";
    });

    // Handle updateItemQuantity
    builder.addCase(updateItemQuantity.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.apiStatus = "loading";
    });

    builder.addCase(updateItemQuantity.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.apiStatus = "succeeded";
      state.cart.items = action.payload?.items;
      state.cart.totalPrice = action.payload?.totalPrice;
      state.cart.totalItemCount = action.payload?.totalItemCount;
      state.cart.cartStatus = action.payload?.status || "active";
      state.cart.appliedCoupon = action.payload?.appliedCoupon;
      state.cart.discountedPrice =
        action.payload?.discountedPrice || action.payload?.totalPrice;
    });

    builder.addCase(updateItemQuantity.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Failed to update item quantity in the Cart";
      state.success = false;
      state.apiStatus = "failed";
    });

    // would follow the same pattern, updating all cart fields from the response
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
