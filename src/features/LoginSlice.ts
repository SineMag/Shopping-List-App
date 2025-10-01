// loginSlice.ts
import { createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'



interface LoginState {
  email: string,
  password: string,

}
const initialState: LoginState = {
  email: 'my@email.com',
  password: '123456',
}


const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {}
})


export default loginSlice.reducer