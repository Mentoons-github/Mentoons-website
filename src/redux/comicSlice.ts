import { audioComicsData, comicsData } from "@/constant/comicsConstants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Comic {
  name: string;
  desc: string;
  mini_thumbnail: string;
  thumbnail: string;
  comicLink: string;
  category: string;
  type: string;
}

export interface AudioComic {
  name: string;
  desc: string;
  duration: string;
  mini_thumbnail: string;
  thumbnail: string;
  videoLink: string;
  category: string;
  type: string;
}
interface CartItemsPrototype {
  thumbnail: string;
  name: string;
  price: number;
  quantity: number;
}

export interface InitialStatePrototype {
  cart: CartItemsPrototype[];
  wishlist: (AudioComic | Comic)[];
  audioComics: AudioComic[];
  comics: Comic[];
  selectedFilter: string;
  currentHoverComic: AudioComic | Comic | null;
}

const initialState: InitialStatePrototype = {
  cart: [],
  wishlist: [],
  audioComics: audioComicsData,
  comics: comicsData,
  selectedFilter: "",
  currentHoverComic: null,
};

export const comicsSlice = createSlice({
  name: "comics",
  initialState,
  reducers: {
    addToCartReducer: (state, action) => {
      const currComic = action.payload;
      console.log(currComic);
      const isPresent = state.cart.find(
        (item) => item.thumbnail === currComic.thumbnail
      );

      if (!isPresent) {
        const newComic = { ...currComic, quantity: 1, price: 10 };
        state.cart.push(newComic);
      } else {
        isPresent.quantity += 1;
        isPresent.price = isPresent.quantity * 10;
      }
    },
    removeFromCartReducer: (state, action) => {
      state.cart = state.cart.filter((item) => {
        return item.thumbnail != action.payload;
      });
    },
    addToWishlistReducer: (state, action) => {
      const isPresent = state.wishlist.find((item) => {
        return item.thumbnail == action.payload.image;
      });
      console.log(isPresent);
      if (!isPresent) {
        const comic = state.comics.find((item) => {
          return item.thumbnail == action.payload.thumbnail;
        });
        if (comic) state.wishlist.push(comic);
      }
    },
    removeFromWishlistReducer: (state, action) => {
      // state.wishlist = state.wishlist.filter((item) => {
      //   return item.thumbnail != action.payload;
      // });
      console.log(state + " " + action);
    },
    updateComicQuantityReducer: (
      state,
      action: PayloadAction<{ image: string; quantity: number }>
    ) => {
      const { image, quantity } = action.payload;
      const item = state.cart.find((item) => {
        return item.thumbnail == image;
      });
      if (item) {
        item.quantity = quantity;
        item.price = quantity * 10;
      }
    },
    updateSelectedFilterReducer: (state, action) => {
      state.selectedFilter = action.payload;
    },
    updateCurrentHoverComicReducer: (
      state,
      action: PayloadAction<AudioComic | Comic | null>
    ) => {
      state.currentHoverComic = action.payload;
    },
  },
});

export const {
  addToCartReducer,
  removeFromCartReducer,
  addToWishlistReducer,
  removeFromWishlistReducer,
  updateComicQuantityReducer,
  updateSelectedFilterReducer,
  updateCurrentHoverComicReducer,
} = comicsSlice.actions;

export default comicsSlice.reducer;
