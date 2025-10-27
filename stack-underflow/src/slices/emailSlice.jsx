import { createSlice } from "@reduxjs/toolkit";

const emailSlice = createSlice({
    name: "email",
    initialState: { value: null },
    reducers: {
      setEmail: (state, action) => {
        state.value = action.payload;
      },
      cleanEmail: (state) => {
        state.value = null;
      },
    },
});

export const { setEmail, cleanEmail } = emailSlice.actions;
export default emailSlice.reducer;