import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HomeCart from './components/HomeCart'
import HowItWorks from './components/HowItWorks'
import ItemDetail from './components/ItemDetail'
import CategoryList from './components/CategoryList'
import FoundedPerson from './components/FoundedPerson'
import FoundItems from './components/FoundItems'


function App() {

  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <CategoryList />
      <FoundItems />
      

      {/* <ItemDetail /> */}
    </>
  )
}

export default App
