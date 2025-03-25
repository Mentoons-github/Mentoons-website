import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Product, ProductBase } from "../types/productTypes";

interface ProductState {
  items: ProductBase[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  search: string;
  filter: {
    type: string;
    ageCategory: string;
    tags: string[];
  };
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
  filter: {
    type: "",
    ageCategory: "",
    tags: [],
  },
  sortBy: "createdAt",
  order: "desc",
};

// Define filter params interface
interface FilterParams {
  type?: string;
  ageCategory?: string;
  tags?: string[];
}

// Fetch multiple products with pagination, search, and sort.
export const fetchProducts = createAsyncThunk<
  { items: ProductBase[]; total: number },
  FilterParams | undefined,
  { state: { products: ProductState }; rejectValue: string }
>("products/fetchProducts", async (filterParams, thunkAPI) => {
  const state = thunkAPI.getState().products;
  const { search, sortBy, order, page, limit } = state;

  // Use passed filter params or default to state
  const filter = filterParams || state.filter;

  try {
    const response = await axios.get(
      "https://mentoons-backend-zlx3.onrender.com/api/v1/products",
      {
        params: {
          search,
          sortBy,
          order,
          page,
          limit,
          ...filter, // Spread filter params into request
        },
      }
    );
    console.log("Product Response data : ", response.data.data);
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
      `https://mentoons-backend-zlx3.onrender.com/api/v1/products/${id}`
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
    if ("productImages" in productData && productData.productImages) {
      const images = productData.productImages as (
        | File
        | { _id: string; imageUrl: string }
      )[];
      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("productImages", image);
        } else {
          // If it's an existing image, append its ID
          formData.append("existingImages", image._id);
        }
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
      "https://mentoons-backend-zlx3.onrender.com/api/v1/products",
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

    if ("productImages" in updatedData && updatedData.productImages) {
      const images = updatedData.productImages as (
        | File
        | { _id: string; imageUrl: string }
      )[];
      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("productImages", image);
        } else {
          // If it's an existing image, append its ID
          formData.append("existingImages", image._id);
        }
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
      `https://mentoons-backend-zlx3.onrender.com/api/v1/products/${id}`,
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
    await axios.delete(
      `https://mentoons-backend-zlx3.onrender.com/api/v1/products/${id}`
    );
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
    // Add reducer for filter
    setFilter(state, action: PayloadAction<Partial<ProductState["filter"]>>) {
      state.filter = { ...state.filter, ...action.payload };
      state.page = 1; // Reset to first page when filter changes
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
      (
        state,
        action: PayloadAction<{ items: ProductBase[]; total: number }>
      ) => {
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
        const index = state.items.findIndex((p) =>
          "_id" in p && "_id" in action.payload
            ? p._id === action.payload._id
            : "id" in p && "id" in action.payload
            ? p.id === action.payload.id
            : false
        );
        if (index !== -1) {
          state.items[index] = action.payload as unknown as ProductBase;
        }
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
        state.items.unshift(action.payload as unknown as ProductBase); // Add new product to the beginning.
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
        const index = state.items.findIndex((p) =>
          "_id" in p && "_id" in action.payload
            ? p._id === action.payload._id
            : "id" in p && "id" in action.payload
            ? p.id === action.payload.id
            : false
        );
        if (index !== -1) {
          state.items[index] = action.payload as unknown as ProductBase;
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
        state.items = state.items.filter(
          (p) =>
            !("_id" in p && p._id === action.payload) &&
            !("id" in p && p.id === action.payload)
        );
        state.total -= 1;
      }
    );
    builder.addCase(deleteProduct.rejected, (state) => {
      state.loading = false;
      state.error = "An error occurred";
    });
  },
});

export const { setSearch, setSort, setPage, setLimit, setFilter } =
  productSlice.actions;
export default productSlice.reducer;
