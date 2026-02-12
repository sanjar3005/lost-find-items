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


function App() {

  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <CategoryList/>
      <HomeCart
        date={"02-02-2007"}
        title={"Book"}
        author={"Bekzod"}
        authorImage={"Book"}
        image={"Book"}
      />
      <HomeCart
        date={"02-02-2007"}
        title={"Book"}
        author={"Bekzod"}
        authorImage={"Book"}
        image={"Book"}
      />
      
      <FoundedPerson/>
      <ItemDetail />
      <Lostitems
        
      
      />
        
    </>
  )
}

export default App
