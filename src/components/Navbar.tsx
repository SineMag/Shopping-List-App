import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className='navbar'>
      <h1>
        <Link to="/register">Shopping List App</Link>
      </h1>
    </div>
  )
}
