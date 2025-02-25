import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Cart {
  userId: string;
  items: [
    {
      productId: {
        _id: string;
        productTitle: string;
        productSummary: string;
        productImages: [
          {
            imageSrc: string;
          }
        ];
        productCategory: string;
      };
      quantity: number;
      stock: "In Stock" | "Out of Stock";
      price: number;
    }
  ];
  totalPrice: number;
  totalItemCount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: {
  loading: boolean;
  error: string | null;
  success: boolean;
  cart: Cart;
} = {
  loading: false,
  error: null,
  success: false,
  cart: {
    userId: "",
    items: [
      {
        productId: {
          _id: "",
          productTitle: "",
          productSummary: "",
          productImages: [
            {
              imageSrc: "",
            },
          ],
          productCategory: "",
        },
        stock: "In Stock",
        quantity: 0,
        price: 0,
      },
    ],
    totalPrice: 0,
    totalItemCount: 0,
    status: "idle",
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
      console.log("ThunkActionResult", response.data);
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
    quantity,
    price,
  }: {
    token: string;
    userId: string;
    productId: string;
    quantity: number;
    price: number;
  }) => {
    console.log();
    try {
      const response = await axios.post(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/cart/add`,
        {
          userId,
          productId,
          quantity,
          price,
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
        `https://mentoons-backend-zlx3.onrender.com/api/v1/cart/remove/${userId}/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
  "cart/updateItemQuantity",
  async ({
    token,
    userId,
    productId,
    flag,
  }: {
    token: string;
    userId: string;
    productId: string;
    flag: string;
  }) => {
    try {
      const response = await axios.patch(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/cart/update/${productId}`,
        {
          userId,
          flag,
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
      throw new Error("Failed to update the product quantity in the Cart");
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCart.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });

    builder.addCase(getCart.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.cart.items = action.payload?.items;
      state.cart.totalPrice = action.payload?.totalPrice;
      state.cart.totalItemCount = action.payload?.totalItemCount;
      state.cart.status = action.payload?.status;
    });

    builder.addCase(getCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch the Cart";
      state.success = false;
    });

    builder.addCase(addItemCart.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });

    builder.addCase(addItemCart.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.cart.items = action.payload?.items;
      state.cart.totalPrice = action.payload?.totalPrice;
      state.cart.totalItemCount = action.payload?.totalItemCount;
      state.cart.status = action.payload?.status;
    });

    builder.addCase(addItemCart.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Failed to add the product to the Cart";
      state.success = false;
    });

    builder.addCase(removeItemFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });

    builder.addCase(removeItemFromCart.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.cart.items = action.payload?.items;
      state.cart.totalPrice = action.payload?.totalPrice;
      state.cart.totalItemCount = action.payload?.totalItemCount;
      state.cart.status = action.payload?.status;
    });

    builder.addCase(removeItemFromCart.rejected, (state, action) => {
      state.loading = true;
      state.error =
        action.error.message || "Failed to remove the product from the Cart";
      state.success = false;
    });

    builder.addCase(updateItemQuantity.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });

    builder.addCase(updateItemQuantity.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.cart.items = action.payload?.items;
      state.cart.totalPrice = action.payload?.totalPrice;
      state.cart.totalItemCount = action.payload?.totalItemCount;
      state.cart.status = action.payload?.status;
    });

    builder.addCase(updateItemQuantity.rejected, (state, action) => {
      state.loading = true;
      state.error =
        action.error.message ||
        "Failed to update the product quantity in the Cart";
      state.success = false;
    });
  },
});

export default cartSlice.reducer;
