import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css'
// ... all your other imports ...
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CategoryList from './components/CategoryList';
import FoundItems from './components/FoundItems';
import FoundedPerson from './components/FoundedPerson';
import LostItems from './components/LostItems';
import UserReview from './components/UserReview';
import Footer from './components/Footer';
import ItemDetail from './components/ItemDetail';
import Login from './components/Login';
import Register from './components/Register';
import LocationPicker from './components/LocationPicker';
import CreateItemPage from './components/CreateItemPage';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          {/* Navbar is outside Routes, so it always shows at the top */}
          <Navbar />

          <Routes>
            {/* Public Routes */}
            <Route path="/ItemDetail" element={<ItemDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/location-picker" element={<LocationPicker />} />
            <Route path="/create-item" element={<CreateItemPage />} />
            {/* Private Routes Wrapper */}
            <Route element={<PrivateRoute />}>

              {/* You must define a path (like "/") and put your components inside the 'element' prop */}
              <Route path="/" element={
                <>
                  <Hero />
                  <HowItWorks />
                  <CategoryList />
                  <FoundItems />
                  <FoundedPerson />
                  <LostItems />
                  <UserReview />
                  <Footer />
                </>
              } />

            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App; // Make sure you don't export the text "is it correct..."