import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type ShoppingList = {
  id: string | number;
  name: string;
  userId: string | number;
  createdAt: string;
};

export const fetchLists = createAsyncThunk<ShoppingList[], { userId: string | number }>(
  "lists/fetch",
  async ({ userId }) => {
    const res = await fetch(`http://localhost:3001/shopping-lists?userId=${encodeURIComponent(String(userId))}&_sort=createdAt&_order=desc`);
    if (!res.ok) throw new Error("Failed to fetch lists");
    return (await res.json()) as ShoppingList[];
  }
);

export const createList = createAsyncThunk<ShoppingList, { userId: string | number; name: string }>(
  "lists/create",
  async ({ userId, name }) => {
    const payload = {
      userId,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    const res = await fetch(`http://localhost:3001/shopping-lists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create list");
    return (await res.json()) as ShoppingList;
  }
);

export const updateList = createAsyncThunk<ShoppingList, { id: string | number; name: string; userId: string | number }>(
  "lists/update",
  async ({ id, name, userId }) => {
    const payload = { id, name: name.trim(), userId, createdAt: new Date().toISOString() };
    const res = await fetch(`http://localhost:3001/shopping-lists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update list");
    return (await res.json()) as ShoppingList;
  }
);

export const deleteList = createAsyncThunk<string | number, { id: string | number }>(
  "lists/delete",
  async ({ id }) => {
    const res = await fetch(`http://localhost:3001/shopping-lists/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete list");
    return id;
  }
);

interface ListsState {
  items: ShoppingList[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: ListsState = {
  items: [],
  status: "idle",
};

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(updateList.fulfilled, (state, action) => {
        state.items = state.items.map((l) => (String(l.id) === String(action.payload.id) ? action.payload : l));
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => String(l.id) !== String(action.payload));
      });
  },
});

export default listsSlice.reducer;
