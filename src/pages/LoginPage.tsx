import React from 'react'
import { useAppSelector, useAppDispatch } from '../../reduxHooks'


export default function LoginPage() {
     // The `state` arg is correctly typed as `RootState` already
  const email = useAppSelector((state) => state.login.email)
  const dispatch = useAppDispatch()


  return (
    <div>
      
    </div>
  )
}
