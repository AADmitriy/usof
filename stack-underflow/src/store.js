import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import emailReducer from "./slices/emailSlice";
import userReducer from "./slices/userSlice";


const rootReducer = combineReducers({
  user: userReducer,
  email: emailReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "email"],
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
