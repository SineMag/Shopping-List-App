import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className='navbar'>
      <h1>
        <Link to="/register">SMify</Link>
      </h1>
    </div>
  )
}
