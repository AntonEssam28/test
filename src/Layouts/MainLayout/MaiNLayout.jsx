import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from "./../../Components/Layout/Footer/Footer"
import NavbarComponent from './../../Components/Layout/Navbar/Navbar'

export default function MainLayout() {
  return (
    <div>
      <NavbarComponent />
      <Outlet />
      <Footer />
    </div>
  )
}
