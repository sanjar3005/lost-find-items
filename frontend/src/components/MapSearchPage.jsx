import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../service/api';
import HomeCart from './HomeCart';
import { Filter, Search, Calendar, Map, List, X } from 'lucide-react';

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

function ResizeMapController({ trigger }) {
    const map = useMap();

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 150);
        return () => clearTimeout(timer);
    }, [map, trigger]);

    return null;
}

export default function MapSearchPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // States
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'map' | 'list'

    const searchParams = new URLSearchParams(location.search);
    const initialCategory = searchParams.get('category') || '';
    const initialSearch = searchParams.get('search') || '';
    const initialStatus = searchParams.get('status') || '';
    const initialFocus = searchParams.get('focus') || null;
    const initialView = searchParams.get('view') === 'map' ? 'map' : 'list';

    // Filters
    const [searchInput, setSearchInput] = useState(initialSearch);
    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState(initialCategory);
    const [status, setStatus] = useState(initialStatus);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState(''); 
    const [selectedColors, setSelectedColors] = useState([]);

    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [focusedItemId, setFocusedItemId] = useState(initialFocus);
    const markerRefs = useRef({});

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    // Count active filters for badge
    const activeFilterCount = [category, status, startDate, endDate].filter(Boolean).length + (selectedColors.length > 0 ? 1 : 0);

    // Initial load for categories & colors
    useEffect(() => {
        const fetchCategoriesAndColors = async () => {
            try {
                const [catRes, colRes] = await Promise.all([
                    api.get('/api/categories/'),
                    api.get('/api/colors/')
                ]);
                setCategories(catRes.data.results || catRes.data);
                setAvailableColors(colRes.data.results || colRes.data);
            } catch (err) {
                console.error("Failed to load filters:", err);
            }
        };
        fetchCategoriesAndColors();
    }, []);

    // Sync state if location.search changes from outside
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('search');
        const categoryQuery = queryParams.get('category');
        const statusQuery = queryParams.get('status');
        const focusQuery = queryParams.get('focus');
        const viewQuery = queryParams.get('view');
        
        if (searchQuery !== null) {
            setSearchInput(searchQuery || '');
            setSearch(searchQuery || '');
        }
        if (categoryQuery !== null) setCategory(categoryQuery || '');
        if (statusQuery !== null) setStatus(statusQuery || '');
        if (focusQuery !== null) setFocusedItemId(focusQuery);
        if (viewQuery !== null) setViewMode(viewQuery === 'map' ? 'map' : 'list');
    }, [location.search]);

    // Load items
    const fetchItems = async () => {
        setLoading(true);
        try {
            let queryParams = [`limit=1000`];
            if (search) queryParams.push(`search=${search}`);
            if (category) queryParams.push(`category=${category}`);
            if (status) queryParams.push(`status=${status}`);
            if (startDate) queryParams.push(`start_date=${startDate}`);
            if (endDate) queryParams.push(`end_date=${endDate}`);
            if (selectedColors.length > 0) queryParams.push(`colors=${selectedColors.join(',')}`);
            const queryString = `?${queryParams.join('&')}`;
            const res = await api.get(`/api/items/${queryString}`);
            setItems(res.data.results || res.data);
            setCurrentPage(1);
        } catch (err) {
            console.error("Failed to load items:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line
    }, [search, category, status, startDate, endDate, selectedColors]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearch(searchInput.trim());
        setCurrentPage(1);
        setShowMobileFilters(false);
    };

    const handleApplyFilters = () => {
        setSearch(searchInput.trim());
        setCurrentPage(1);
        setShowMobileFilters(false);
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setSearch('');
        setCategory('');
        setStatus('');
        setStartDate('');
        setEndDate('');
        setSelectedColors([]);
        setCurrentPage(1);
        setShowMobileFilters(false);
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
            : [41.2995, 69.2401];

    // ── Reusable filter panel content ──────────────────────────────────────────
    const FilterPanel = ({ isMobile = false }) => (
        <div className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 ${!isMobile ? 'sticky top-24' : ''}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base sm:text-lg">
                    <Filter size={18} className="text-[#1E85FF]" /> Filtrlar
                </div>
                {isMobile && (
                    <button
                        onClick={() => setShowMobileFilters(false)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Status */}
            <div className="mb-4 sm:mb-5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Holati</label>
                <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
                    {[
                        { label: 'Barchasi', value: '', activeClass: 'bg-white shadow text-slate-800' },
                        { label: 'Yo\'qolgan', value: 'LOST', activeClass: 'bg-red-500 shadow text-white' },
                        { label: 'Topilgan', value: 'FOUND', activeClass: 'bg-green-500 shadow text-white' },
                    ].map(btn => (
                        <button
                            key={btn.value}
                            onClick={() => setStatus(btn.value)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${status === btn.value ? btn.activeClass : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category */}
            <div className="mb-4 sm:mb-5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Toifa</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-100 text-slate-700 text-sm font-medium px-3 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-[#1E85FF] outline-none"
                >
                    <option value="">Barcha toifalar</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{capitalizeFirst(c.name)}</option>
                    ))}
                </select>
            </div>

            {/* Colors */}
            <div className="mb-4 sm:mb-5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ranglar</label>
                {availableColors.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {availableColors.map(c => {
                            const isSelected = selectedColors.includes(c.name);
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => {
                                        setSelectedColors(prev => 
                                            isSelected ? prev.filter(color => color !== c.name) : [...prev, c.name]
                                        );
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isSelected ? 'bg-[#1E85FF] text-white border-[#1E85FF] shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                                >
                                    {c.name}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 font-medium italic">Hali ranglar qo'shilmagan.</p>
                )}
            </div>

            {/* Date Range */}
            <div className="mb-4 sm:mb-5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vaqt oralig'i</label>
                <div className="space-y-2">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-100 text-slate-700 text-sm font-medium pl-9 pr-3 py-2.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#1E85FF]"
                        />
                    </div>
                    <div className="text-center text-[11px] text-slate-400 font-bold">— gacha —</div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-100 text-slate-700 text-sm font-medium pl-9 pr-3 py-2.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#1E85FF]"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                <button
                    onClick={handleApplyFilters}
                    className="w-full bg-[#1E85FF] hover:bg-blue-600 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
                >
                    Filtrlarni qo'llash
                </button>
                <button
                    onClick={handleClearFilters}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95"
                >
                    Tozalash
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen pt-3 sm:pt-4 pb-8 sm:pb-12">
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex flex-col lg:flex-row gap-4 sm:gap-5">

                {/* ── LEFT SIDE ─────────────────────────────────────────────── */}
                <div className="flex-1 min-w-0 flex flex-col gap-3">

                    {/* Top Controls Bar */}
                    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        {/* Search */}
                        <form onSubmit={handleSearchSubmit} className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="E'lonlar bo'yicha qidiruv..."
                                className="w-full bg-slate-100 pl-10 pr-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-[#1E85FF] focus:bg-white transition-all text-sm font-semibold text-slate-700"
                            />
                        </form>

                        {/* View Toggle + Filter Button */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Map / List toggle */}
                            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('map')}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-[#1E85FF] text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Map size={15} /> <span className="hidden sm:inline">Xarita</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-[#1E85FF] text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <List size={15} /> <span className="hidden sm:inline">Ro'yxat</span>
                                </button>
                            </div>

                            {/* Mobile filter toggle – only on < lg */}
                            <button
                                type="button"
                                onClick={() => setShowMobileFilters(prev => !prev)}
                                className="lg:hidden relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white shadow transition-all active:scale-95"
                            >
                                <Filter size={15} />
                                <span>Filtr</span>
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1E85FF] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Filter Panel – inline, appears between controls and content */}
                    {showMobileFilters && (
                        <div className="lg:hidden">
                            <FilterPanel isMobile={true} />
                        </div>
                    )}

                    {/* ── CONTENT AREA (Map or List) ─────────────────────── */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">

                        {/* MAP VIEW */}
                        {viewMode === 'map' && (
                            <div style={{ height: '65vh', minHeight: '420px', maxHeight: '780px' }}>
                                <MapContainer
                                    key={`map-${viewMode}`}
                                    center={mapCenter}
                                    zoom={12}
                                    style={{ height: '100%', width: '100%' }}
                                    className="z-10"
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
                                    <ResizeMapController trigger={`${viewMode}-${items.length}-${focusedItemId || ''}`} />
                                </MapContainer>
                            </div>
                        )}

                        {/* LIST VIEW */}
                        {viewMode === 'list' && (
                            <div className="p-3 sm:p-4 lg:p-6" style={{ minHeight: '420px' }}>
                                {loading ? (
                                    <div className="flex items-center justify-center py-24 text-slate-400 font-medium">
                                        <svg className="animate-spin w-6 h-6 mr-2 text-[#1E85FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        Yuklanmoqda...
                                    </div>
                                ) : items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                                        <Filter size={48} className="mb-4 opacity-20" />
                                        <p className="font-medium text-sm">Ushbu filtrlarga mos e'lon topilmadi.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                                            {items
                                                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                                                .map(item => {
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

                                        {/* Pagination */}
                                        {items.length > ITEMS_PER_PAGE && (
                                            <div className="flex justify-center items-center gap-3 mt-6 pb-2">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-200 transition-colors"
                                                >← Oldingi</button>
                                                <span className="font-bold text-xs text-slate-700 min-w-[60px] text-center">
                                                    {currentPage} / {Math.ceil(items.length / ITEMS_PER_PAGE)}
                                                </span>
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(items.length / ITEMS_PER_PAGE)))}
                                                    disabled={currentPage === Math.ceil(items.length / ITEMS_PER_PAGE)}
                                                    className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-200 transition-colors"
                                                >Keyingi →</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT SIDE: Desktop Filter Sidebar ────────────────────── */}
                <div className="hidden lg:block w-72 xl:w-80 shrink-0">
                    <FilterPanel isMobile={false} />
                </div>

            </div>
        </div>
    );
}
