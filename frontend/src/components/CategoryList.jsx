import React, { useState, useEffect } from 'react';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories/');
        // Check if response is paginated (has .results) or is a direct array
        const data = Array.isArray(response.data) ? response.data : response.data.results;
        setCategories(data?.slice(0, 6) || []); // Get top 6 categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return null; // Or return a loader skeleton if you prefer
  }

  return (
    /* This wrapper must be identical to HowItWorks */
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10">
      <div className='flex justify-between items-end mb-5 sm:mb-8 gap-3'>
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold'>Turkum bo'yicha o'rganing</h1>
        <button
          onClick={() => navigate('/items')}
          className='hover:text-[#1e88e5] cursor-pointer underline underline-offset-4 sm:underline-offset-8 decoration-blue-600 text-sm sm:text-base pb-1 whitespace-nowrap'
        >
          Ko'proq
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat, index) => (
          <div
            key={cat.id || index}
            onClick={() => navigate(`/items?category=${cat.id}`)}
            className="bg-[#e6effa]/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-4 transition-all hover:shadow-lg cursor-pointer"
          >
            <span className="text-[#1e88e5] text-sm font-semibold text-center uppercase">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;