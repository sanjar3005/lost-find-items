import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' // 1. Router import qilindi
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import ItemDetail from './components/ItemDetail'
import CategoryList from './components/CategoryList'
import FoundedPerson from './components/FoundedPerson'
import FoundItems from './components/FoundItems'
import LostItems from './components/lostitems'
import UserReview from './components/UserReview'

function App() {
  return (
    // 2. Butun ilovani Router bilan o'raymiz
    <Router>
      <Navbar />
      
      {/* 3. Sahifalar almashadigan joyni Routes ichiga olamiz */}
      <Routes>
        {/* Asosiy (Bosh) sahifa */}
        <Route path="/" element={
          <>
            <Hero />
            <HowItWorks />
            <CategoryList />
            <FoundItems />
            <FoundedPerson />
            <LostItems />
            <UserReview />
          </>
        } />

        {/* ItemDetail sahifasi */}
        <Route path="/ItemDetail" element={<ItemDetail />} />
      </Routes>
    </Router>
  )
}

export default App