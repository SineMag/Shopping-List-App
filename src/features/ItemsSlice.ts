import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type Item = {
  id: number
  name: string
  price: number
  category: string
  image?: string
  createdAt?: string
}

type FetchArgs = { q?: string; sort?: string }

function buildQuery({ q, sort }: FetchArgs): string {
  const params = new URLSearchParams()
  if (q && q.trim()) {
    params.set('name_like', q.trim())
  }
  switch (sort) {
    case 'name_asc':
      params.set('_sort', 'name')
      params.set('_order', 'asc')
      break
    case 'name_desc':
      params.set('_sort', 'name')
      params.set('_order', 'desc')
      break
    case 'category':
      params.set('_sort', 'category')
      params.set('_order', 'asc')
      break
    case 'date_desc':
    default:
      params.set('_sort', 'createdAt')
      params.set('_order', 'desc')
      break
  }
  return params.toString()
}

export const fetchItems = createAsyncThunk<Item[], FetchArgs>(
  'items/fetch',
  async (args) => {
    const qs = buildQuery(args)
    const res = await fetch(`http://localhost:3001/items?${qs}`)
    if (!res.ok) throw new Error('Failed to fetch items')
    const data = (await res.json()) as Item[]
    return data
  }
)

interface ItemsState {
  items: Item[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: ItemsState = {
  items: [],
  status: 'idle',
}

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default itemsSlice.reducer
