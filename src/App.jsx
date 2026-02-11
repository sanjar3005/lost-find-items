import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import CategoryList from './components/CategoryList'
import FoundedPerson from './components/FoundedPerson'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <CategoryList />
      <FoundedPerson />
    </>
  )
}

export default App
