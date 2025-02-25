import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "../types/productTypes";

interface ProductState {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  search: string;
  sortBy: string;
  order: "asc" | "desc";
}

const initialState: ProductState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
  search: "",
  sortBy: "createdAt",
  order: "desc",
};

// Fetch multiple products with pagination, search, and sort.
export const fetchProducts = createAsyncThunk<
  { items: Product[]; total: number },
  void,
  { state: { products: ProductState }; rejectValue: string }
>("products/fetchProducts", async (_, thunkAPI) => {
  const state = thunkAPI.getState().products;
  const { search, sortBy, order, page, limit } = state;
  try {
    const response = await axios.get("http://localhost:4000/api/v1/products", {
      params: { search, sortBy, order, page, limit },
    });
    console.log("Product Response", response.data);
    return { items: response.data.data, total: response.data.total };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
    return thunkAPI.rejectWithValue("An unknown error occurred");
  }
});

// Fetch a single product by ID.
export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchProductById", async (id, thunkAPI) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/v1/products/${id}`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
    return thunkAPI.rejectWithValue("An unknown error occurred");
  }
});

// Create a new product.
// Update the createProduct thunk
export const createProduct = createAsyncThunk<
  Product,
  Partial<Product>,
  { rejectValue: string }
>("products/createProduct", async (productData, thunkAPI) => {
  try {
    const formData = new FormData();

    // Handle base product fields
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== "proudctImage" && key !== "details") {
        formData.append(key, value as string);
      }
    });

    // Handle product images
    if (productData.productImages) {
      productData.productImages.forEach((image: File) => {
        formData.append(`productImages`, image);
      });
    }

    // Handle details based on product type
    if (productData.details) {
      Object.entries(productData.details).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(`details[${key}]`, value.toISOString());
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`details[${key}][${index}]`, JSON.stringify(item));
          });
        } else {
          formData.append(`details[${key}]`, JSON.stringify(value));
        }
      });
    }

    const response = await axios.post(
      "http://localhost:4000/api/v1/products",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
    return thunkAPI.rejectWithValue("An unknown error occurred");
  }
});

// Update the updateProduct thunk similarly
export const updateProduct = createAsyncThunk<
  Product,
  { id: string; updatedData: Partial<Product> },
  { rejectValue: string }
>("products/updateProduct", async ({ id, updatedData }, thunkAPI) => {
  try {
    const formData = new FormData();

    Object.entries(updatedData).forEach(([key, value]) => {
      if (key !== "proudctImage" && key !== "details") {
        formData.append(key, value as string);
      }
    });

    if (updatedData.productImages) {
      updatedData.productImages.forEach((image: File) => {
        formData.append(`productImages`, image);
      });
    }

    if (updatedData.details) {
      Object.entries(updatedData.details).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(`details[${key}]`, value.toISOString());
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`details[${key}][${index}]`, JSON.stringify(item));
          });
        } else {
          formData.append(`details[${key}]`, JSON.stringify(value));
        }
      });
    }

    const response = await axios.put(
      `http://localhost:4000/api/v1/products/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
    return thunkAPI.rejectWithValue("An unknown error occurred");
  }
});

// Delete a product.
export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("products/deleteProduct", async (id, thunkAPI) => {
  try {
    await axios.delete(`http://localhost:4000/api/v1/products/${id}`);
    return id;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
    return thunkAPI.rejectWithValue("An unknown error occurred");
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1; // Reset to first page when search changes
    },
    setSort(
      state,
      action: PayloadAction<{ sortBy: string; order: "asc" | "desc" }>
    ) {
      state.sortBy = action.payload.sortBy;
      state.order = action.payload.order;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<{ items: Product[]; total: number }>) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      }
    );
    builder.addCase(fetchProducts.rejected, (state) => {
      state.loading = false;
      state.error = "An error occurred";
    });

    // fetchProductById (you may store it in a separate property if needed)
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProductById.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.items = state.items.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      }
    );
    builder.addCase(fetchProductById.rejected, (state) => {
      state.loading = false;
      state.error = "An error occurred";
    });

    // createProduct
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createProduct.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.items.unshift(action.payload); // Add new product to the beginning.
        state.total += 1;
      }
    );
    builder.addCase(createProduct.rejected, (state) => {
      state.loading = false;
      state.error = "An error occurred";
    });

    // updateProduct
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateProduct.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      }
    );
    builder.addCase(updateProduct.rejected, (state) => {
      state.loading = false;
      state.error = "An error occurred";
    });

    // deleteProduct
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteProduct.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter((p) => p._id !== action.payload);
        state.total -= 1;
      }
    );
    builder.addCase(deleteProduct.rejected, (state) => {
      state.loading = false;
      state.error = "An error occurred";
    });
  },
});

export const { setSearch, setSort, setPage, setLimit } = productSlice.actions;
export default productSlice.reducer;
