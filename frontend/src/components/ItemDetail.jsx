import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Eye, Heart, MapPin, ChevronLeft, ChevronRight, Phone, MessageCircle, ArrowLeft } from 'lucide-react';
import api from '../service/api';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const BACKEND_URL = "http://127.0.0.1:8000";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- State ---
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carousel State
  const [activeImage, setActiveImage] = useState(0);
  const thumbnailScrollRef = useRef(null);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await api.get(`/api/items/${id}/`);
        setItem(response.data);
      } catch (err) {
        console.error(err);
        setError("E'lon topilmadi yoki serverda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  // --- Helpers ---
  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/800x600?text=Rasm+yoq';
    return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
  };

  // If loading or error, show a simple screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
          Orqaga qaytish
        </button>
      </div>
    );
  }

  // Safely extract the image array from the backend response
  const imageArray = item.images && item.images.length > 0
    ? item.images.map(img => getImageUrl(img.image || img.url))
    : ['https://via.placeholder.com/800x600?text=Rasm+yoq'];

  // --- Logic to handle image switching and scrolling ---
  const scrollThumbnail = (index) => {
    if (thumbnailScrollRef.current) {
      const thumbnailWidth = 80;
      const scrollAmount = index * thumbnailWidth - (thumbnailScrollRef.current.clientWidth / 2) + (thumbnailWidth / 2);
      thumbnailScrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatDateUz = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    // Safety check just in case Django sends a bad string
    if (isNaN(date.getTime())) return dateString;

    const monthsUz = [
      'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
      'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
    ];



    const day = date.getDate();
    const month = monthsUz[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month} ${year}`;
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIndex = (activeImage + 1) % imageArray.length;
    setActiveImage(nextIndex);
    scrollThumbnail(nextIndex);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const prevIndex = (activeImage - 1 + imageArray.length) % imageArray.length;
    setActiveImage(prevIndex);
    scrollThumbnail(prevIndex);
  };

  const handleThumbnailClick = (index) => {
    setActiveImage(index);
    scrollThumbnail(index);
  };

  return (
    <div className="bg-white min-h-screen pb-5 pt-3">
      <div className="max-w-[85%] mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-[#3B82F6] mb-6 transition-colors font-medium w-fit"
        >
          <ArrowLeft size={20} />
          Orqaga
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* --- LEFT COLUMN: Carousel Gallery --- */}
          <div className="space-y-4 select-none">
            {/* Main Image Stage */}
            <div className="relative aspect-[4/3] w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm group">

              {/* THE FIX: Map through all images, stack them, and fade opacity */}
              {imageArray.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${item.title} rasm ${index + 1}`}
                  // absolute inset-0 stacks them perfectly
                  // transition-opacity duration-500 makes it smooth!
                  className={`absolute inset-0 w-full h-full object-contain mix-blend-multiply transition-opacity duration-500 ease-in-out ${index === activeImage ? 'opacity-100' : 'opacity-0'
                    }`}
                />
              ))}

              {/* Only show arrows if there is more than 1 image */}
              {imageArray.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    // Added z-10 so the buttons stay clickable above the stacked images
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg opacity-100 transition-all active:scale-95"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNext}
                    // Added z-10 here as well
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg opacity-100 transition-all active:scale-95"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Scrollable Thumbnails Strip (Only show if multiple images) */}
            {imageArray.length > 1 && (
              <div
                ref={thumbnailScrollRef}
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {imageArray.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === index
                      ? 'border-[#3B82F6] ring-2 ring-blue-100 opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: Details --- */}
          <div>

            <div className='flex justify-between  py-auto items-end mb-3'>
              <h1 className=" flex text-3xl pb-3 md:text-4xl font-extrabold text-[#0F172A] font-sans leading-tight ">
                {item.title}
                
              </h1>
              <div className="flex gap-3 mb-3 shrink-0 max-h-8">
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-semibold">
                    <Clock size={16} /> Sana: {formatDateUz(item.date_lost_or_found)}
                  </div>
                </div>
            </div>

            

            {/* Description */}
            <div className="mb-3">
              <p className="text-slate-600 leading-relaxed text-base bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="font-bold">Izoh:</span> {item.description}
              </p>
            </div>

            {/* Profile Card */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 mb-5 border border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A] mb-3">
                {item.status === 'LOST' ? "Yo'qotgan shaxsning profili" : "Topib olgan shaxsning profili"}
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={getImageUrl(item.owner_picture)}
                  alt={item.owner_name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-[#0F172A] text-lg">{item.owner_name}</h4>
                  <p className="text-slate-400 text-sm">{item.location_address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                {/* Changed to an <a> tag so it actually dials the phone! */}
                <a
                  href={`tel:${item.contact_info}`}
                  className="flex-1 bg-white border border-slate-200 hover:border-[#3B82F6] hover:text-[#3B82F6] text-slate-700 py-2.5 rounded-xl font-semibold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                >
                  <Phone size={18} /> {item.contact_info}
                </a>
                <button className="flex-1 bg-white border border-slate-200 hover:border-[#3B82F6] hover:text-[#3B82F6] text-slate-700 py-2.5 rounded-xl font-semibold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> Xabar
                </button>
              </div>
            </div>

            {/* Map Section */}
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] mb-3">Manzil</h3>

              {/* Ensure z-0 is here so the map doesn't overlap your navbar or dropdowns */}
              <div className="w-full h-64 bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200 z-0">

                {/* Only draw the map if we actually have coordinates from Django */}
                {(item.latitude && item.longitude) ? (
                  <MapContainer
                    center={[item.latitude, item.longitude]}
                    zoom={14}
                    scrollWheelZoom={true} // Prevents getting stuck when scrolling down the page
                    style={{ height: "100%", width: "100%", zIndex: 1 }}

                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[item.latitude, item.longitude]} />
                  </MapContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                    <MapPin size={40} className="mb-2 opacity-50" />
                    <p>Xarita ma'lumotlari kiritilmagan</p>
                  </div>
                )}

                {/* Show the actual address floating over the bottom of the map */}
                {/* z-[1000] is required to sit on top of Leaflet, pointer-events-none lets you drag the map through the text */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl text-sm font-bold text-slate-800 shadow-lg z-[1000] pointer-events-none border border-slate-100 flex items-center gap-2">
                  <MapPin size={18} className="text-[#3B82F6]" />
                  {item.location_address}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}