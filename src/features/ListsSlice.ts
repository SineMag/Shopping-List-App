import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type ShoppingList = {
  id: string | number;
  name: string;
  userId: string | number;
  createdAt: string;
  image?: string;
};

export const fetchLists = createAsyncThunk<ShoppingList[], { userId: string | number }>(
  "lists/fetch",
  async ({ userId }) => {
    const res = await fetch(`http://localhost:3001/shopping-lists?userId=${encodeURIComponent(String(userId))}&_sort=createdAt&_order=desc`);
    if (!res.ok) throw new Error("Failed to fetch lists");
    return (await res.json()) as ShoppingList[];
  }
);

// Helper function to get image based on list name keywords
async function getListImage(listName: string): Promise<string> {
  const keywords = listName.toLowerCase();
  
  // Keyword to image URL mapping
  const imageMap: Record<string, string> = {
    'grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    'groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    'food': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    'party': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500',
    'birthday': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500',
    'school': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500',
    'back to school': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500',
    'office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
    'work': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
    'home': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500',
    'household': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500',
    'travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500',
    'vacation': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500',
    'health': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500',
    'fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
    'baby': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500',
    'pet': 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=500',
    'garden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
    'cleaning': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500',
    'christmas': 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=500',
    'holiday': 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=500',
  };

  // Check for keyword matches
  for (const [keyword, imageUrl] of Object.entries(imageMap)) {
    if (keywords.includes(keyword)) {
      return imageUrl;
    }
  }

  // Default shopping image
  return 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500';
}

export const createList = createAsyncThunk<ShoppingList, { userId: string | number; name: string }>(
  "lists/create",
  async ({ userId, name }) => {
    const image = await getListImage(name);
    const payload = {
      userId,
      name: name.trim(),
      image,
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
