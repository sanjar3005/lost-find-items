import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../service/api';
import HomeCart from './HomeCart';
import { Filter, Search, Calendar, Map, List, MapPin } from 'lucide-react';

import MapPopup from './MapPopup';

const BACKEND_URL = "http://127.0.0.1:8000";

// Custom icons based on status
const createIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

const lostIcon = createIcon('red');
const foundIcon = createIcon('green');

function FocusedMarkerController({ focusedItem }) {
    const map = useMap();

    useEffect(() => {
        if (!focusedItem?.latitude || !focusedItem?.longitude) return;
        map.flyTo([focusedItem.latitude, focusedItem.longitude], 15, { duration: 0.8 });
    }, [focusedItem, map]);

    return null;
}

export default function MapSearchPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // States
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'map', 'list', 'both'

    // Filters
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Add mobile filter toggle
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [focusedItemId, setFocusedItemId] = useState(null);
    const markerRefs = useRef({});

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    // Initial load: parse URL search params and categories
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('search');
        const categoryQuery = queryParams.get('category');
        const statusQuery = queryParams.get('status');
        const focusQuery = queryParams.get('focus');
        const viewQuery = queryParams.get('view');
        setSearch(searchQuery || '');
        setCategory(categoryQuery || '');
        setStatus(statusQuery || '');
        setFocusedItemId(focusQuery || null);
        if (viewQuery === 'map') {
            setViewMode('map');
        } else {
            setViewMode('list');
        }

        const fetchCategories = async () => {
            try {
                const res = await api.get('/api/categories/');
                setCategories(res.data.results || res.data);
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        };
        fetchCategories();
    }, [location.search]);

    // Load items based on filters
    const fetchItems = async () => {
        setLoading(true);
        try {
            let queryParams = [];
            queryParams.push(`limit=1000`); // Ensure we fetch all items so map shows everything
            if (search) queryParams.push(`search=${search}`);
            if (category) queryParams.push(`category=${category}`);
            if (status) queryParams.push(`status=${status}`);
            if (startDate) queryParams.push(`start_date=${startDate}`);
            if (endDate) queryParams.push(`end_date=${endDate}`);

            const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
            const res = await api.get(`/api/items/${queryString}`);
            setItems(res.data.results || res.data);
            setCurrentPage(1); // Reset page on new fetch
        } catch (err) {
            console.error("Failed to load items:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line
    }, [category, status, startDate, endDate]); // removed search from deps so typing doesn't auto-fetch, but should we auto-fetch if we got it from URL?

    // Only run once on first mount if there was a URL search param, to ensure it fetches immediately
    const [initialFetchDone, setInitialFetchDone] = useState(false);
    useEffect(() => {
        if (!initialFetchDone) {
            fetchItems();
            setInitialFetchDone(true);
        }
    }, [search]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchItems();
    };

    const handleCardSavedChange = (itemId, saved) => {
        setItems(prev => prev.map(item => (
            item.id === itemId ? { ...item, is_saved: saved } : item
        )));
    };

    const capitalizeFirst = (value) => {
        if (!value) return '';
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const focusedItem = items.find(i => String(i.id) === String(focusedItemId));

    useEffect(() => {
        if (focusedItem && focusedItem.latitude && focusedItem.longitude) {
            setViewMode('map');
            const openFocusedPopup = () => {
                const marker = markerRefs.current[focusedItem.id];
                if (marker) marker.openPopup();
            };
            openFocusedPopup();
            const timer = setTimeout(openFocusedPopup, 300);
            return () => clearTimeout(timer);
        }
    }, [focusedItem]);

    const mapCenter = focusedItem?.latitude && focusedItem?.longitude
                    ? [focusedItem.latitude, focusedItem.longitude]
                    : items.length > 0 && items[0].latitude && items[0].longitude 
                    ? [items[0].latitude, items[0].longitude] 
                    : [41.2995, 69.2401]; // Tashkent default

    return (
        <div className="bg-slate-50 min-h-screen pt-4 pb-12">
            <div className="max-w-[85%] mx-auto flex flex-col lg:flex-row gap-6">
                
                {/* LEFT SIDE: MAP & LIST CONTENT */}
                <div className="flex-1 flex flex-col">
                    
                    {/* Top Controls */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 flex flex-col md:flex-row gap-4 justify-between items-center border border-slate-100">
                        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="E'lonlar bo'yicha qidiruv..."
                                className="w-full bg-[#f3f4f6] pl-12 pr-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-[#1E85FF] focus:bg-white transition-all text-sm font-semibold text-slate-700"
                            />
                        </form>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button 
                                type="button"
                                onClick={() => setViewMode('map')}
                                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${viewMode === 'map' ? 'bg-[#1E85FF] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                <Map size={18} /> Xarita
                            </button>
                            <button 
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${viewMode === 'list' ? 'bg-[#1E85FF] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                <List size={18} /> Ro'yxat
                            </button>
                            <button 
                                type="button"
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-slate-800 text-white shadow-md transition-all shrink-0"
                            >
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[600px] flex flex-col">
                        
                        {/* Map View */}
                        {(viewMode === 'map' || viewMode === 'both') && (
                            <div className={`w-full ${viewMode === 'both' ? 'h-1/2 border-b border-slate-200' : 'h-full flex-1'}`}>
                                <MapContainer 
                                    center={mapCenter} 
                                    zoom={12} 
                                    style={{ height: '100%', width: '100%', zIndex: 10 }}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    {items.filter(i => i.latitude && i.longitude).map(item => (
                                        <Marker 
                                            key={item.id} 
                                            position={[item.latitude, item.longitude]}
                                            icon={item.status === 'LOST' ? lostIcon : foundIcon}
                                            ref={(marker) => {
                                                if (marker) markerRefs.current[item.id] = marker;
                                            }}
                                        >
                                            <Popup className="custom-popup" closeButton={false} minWidth={192} maxWidth={192}>
                                                <MapPopup item={item} />
                                            </Popup>
                                        </Marker>
                                    ))}
                                    <FocusedMarkerController focusedItem={focusedItem} />
                                </MapContainer>
                            </div>
                        )}

                        {/* List View */}
                        {(viewMode === 'list' || viewMode === 'both') && (
                            <div className={`w-full overflow-y-auto p-4 lg:p-6 ${viewMode === 'both' ? 'h-1/2' : 'h-full flex-1'}`}>
                                {loading ? (
                                    <div className="flex items-center justify-center h-full text-slate-400 font-medium">Yuklanmoqda...</div>
                                ) : items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                        <Filter size={48} className="mb-4 opacity-20" />
                                        <p className="font-medium">Ushbu filtrlarga mos e'lon topilmadi.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(item => {
                                                const firstImg = item.images && item.images.length > 0 ? item.images[0].image : null;
                                                let finalImg = firstImg;
                                                if (finalImg && !finalImg.startsWith('http')) finalImg = `${BACKEND_URL}${finalImg}`;
                                                
                                                return (
                                                    <HomeCart
                                                        key={item.id}
                                                        date={item.date_lost_or_found || "Noma'lum"}
                                                        title={item.title}
                                                        author={item.owner_name}
                                                        image={finalImg}
                                                        authorImage={item.owner_picture}
                                                        onDetails={() => navigate(`/items/${item.id}`)}
                                                        onMap={() => navigate(`/items?focus=${item.id}&view=map`)}
                                                        itemId={item.id}
                                                        initialSaved={item.is_saved}
                                                        onSavedChange={handleCardSavedChange}
                                                    />
                                                );
                                            })}
                                        </div>
                                        
                                        {/* Pagination Controls */}
                                        {items.length > ITEMS_PER_PAGE && (
                                            <div className="flex justify-center items-center gap-4 mt-8 pb-4">
                                                <button 
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-4 py-2 bg-slate-100 rounded-lg font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-200 transition-colors"
                                                >Oldingi</button>
                                                <span className="font-bold text-slate-700">
                                                    {currentPage} / {Math.ceil(items.length / ITEMS_PER_PAGE)}
                                                </span>
                                                <button 
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(items.length / ITEMS_PER_PAGE)))}
                                                    disabled={currentPage === Math.ceil(items.length / ITEMS_PER_PAGE)}
                                                    className="px-4 py-2 bg-slate-100 rounded-lg font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-200 transition-colors"
                                                >Keyingi</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                {/* RIGHT SIDE: FILTERS */}
                <div className={`w-full lg:w-80 shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
                        <div className="flex items-center gap-2 mb-6 text-slate-900 font-extrabold text-xl">
                            <Filter size={24} className="text-[#1E85FF]" /> Filtrlar
                        </div>

                        {/* Status Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-3">Holati</label>
                            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                                <button 
                                    onClick={() => setStatus('')}
                                    className={`flex-1 py-1.5 text-sm font-bold rounded-lg ${status === '' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                                >Barchasi</button>
                                <button 
                                    onClick={() => setStatus('LOST')}
                                    className={`flex-1 py-1.5 text-sm font-bold rounded-lg ${status === 'LOST' ? 'bg-red-500 shadow text-white' : 'text-slate-500'}`}
                                >Yo'qolgan</button>
                                <button 
                                    onClick={() => setStatus('FOUND')}
                                    className={`flex-1 py-1.5 text-sm font-bold rounded-lg ${status === 'FOUND' ? 'bg-green-500 shadow text-white' : 'text-slate-500'}`}
                                >Topilgan</button>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-3">Toifa</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-[#f3f4f6] text-slate-700 font-medium px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-[#1E85FF] outline-none"
                            >
                                <option value="">Barcha toifalar</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{capitalizeFirst(c.name)}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-3">Vaqt oralig'i</label>
                            <div className="space-y-3">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full bg-[#f3f4f6] text-slate-700 text-sm font-medium pl-10 pr-4 py-2.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#1E85FF]"
                                    />
                                </div>
                                <div className="text-center text-xs text-slate-400 font-bold">dan</div>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full bg-[#f3f4f6] text-slate-700 text-sm font-medium pl-10 pr-4 py-2.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#1E85FF]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                            <button 
                                onClick={fetchItems}
                                className="w-full bg-[#1E85FF] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
                            >
                                Filtrlarni qo'llash
                            </button>
                            <button 
                                onClick={() => {
                                    setSearch(''); setCategory(''); setStatus(''); setStartDate(''); setEndDate('');
                                }}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all active:scale-95"
                            >
                                Tozalash
                            </button>
                        </div>
                        
                    </div>
                </div>

            </div>
        </div>
    );
}