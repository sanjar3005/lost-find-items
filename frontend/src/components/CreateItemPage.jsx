import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, AlignLeft, Tag, Phone, Camera, X, CheckCircle2, AlertCircle } from 'lucide-react';
import LocationPicker from '../components/LocationPicker'; // The map component we built earlier
import api from '../service/api'; // Your configured axios instance


const CreateItemPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Route Protection: Kick out unauthenticated users
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);


    // Form States
    const [status, setStatus] = useState('LOST');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [dateLost, setDateLost] = useState('');
    const [locationLost, setLocationLost] = useState(''); // Text address
    const [contactInfo, setContactInfo] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    
    const [dbCategories, setDbCategories] = useState([]);
    // Image Upload State
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Handle Image Selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            setError("Maksimal 5 ta rasm yuklash mumkin.");
            return;
        }
        
        setImages(prev => [...prev, ...files]);
        
        // Create local URLs to show previews to the user
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Adjust the URL if your Django router has a different path
                const response = await api.get('/api/categories/'); 
                
                // DRF usually returns an array directly, or inside 'results' if paginated
                // If you use pagination, it might be response.data.results
                setDbCategories(response.data.results); 
            } catch (err) {
                console.error("Toifalarni yuklashda xatolik:", err);
            }
        };

        fetchCategories();
    }, []);

    // Remove an image before uploading
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    // Handle Form Submit (The FormData Magic)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 1. Create the cardboard box
        const formData = new FormData();
        
        // 2. Put text data inside
        formData.append('status', status);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category); // Sends the ID of the category
        formData.append('date_lost_or_found', dateLost);
        formData.append('location_address', locationLost);
        formData.append('contact_info', contactInfo);
        
        // Only append coordinates if the user dropped a pin
        if (coordinates.lat && coordinates.lng) {
            formData.append('latitude', coordinates.lat);
            formData.append('longitude', coordinates.lng);
        }

        // 3. Put physical image files inside
        images.forEach((image) => {
            // Must match the 'uploaded_images' name in your Django serializer exactly
            formData.append('uploaded_images', image); 
        });

        try {
            // Send to Django (Assuming your endpoint is /api/items/)
            await api.post('/api/items/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            setSuccess(true);
            // Redirect to their dashboard or the feed after 2 seconds
            setTimeout(() => navigate('/'), 2000);
            
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const backendErrors = err.response.data;
                if (backendErrors.title) {
                    setError(backendErrors.title[0]);
                } else if (backendErrors.description) {
                    setError(backendErrors.description[0]);
                } else if (backendErrors.category) {
                    setError(backendErrors.category[0]);
                } else if (backendErrors.date_lost_or_found) {
                    setError(backendErrors.date_lost_or_found[0]);
                } else if (backendErrors.location_address) {
                    setError(backendErrors.location_address[0]);
                } else if (backendErrors.contact_info) {
                    setError(backendErrors.contact_info[0]);
                }else if (backendErrors.contact_info){
                    setError(backendErrors.contact_info[0])

                } else {
                    setError("Noma'lum xatolik yuz berdi. Iltimos, ma'lumotlarni tekshirib qayta urinib ko'ring.");
                }
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null; // Prevent flicker before redirect

    return (
        <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto bg-white sm:shadow-lg sm:border sm:border-slate-100 rounded-2xl p-6 sm:p-10">
                
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">E'lon joylash</h1>
                <p className="text-slate-500 mb-8">Yo'qotgan yoki topib olgan buyumingiz haqida ma'lumot qoldiring.</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start gap-3 border border-red-100">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 rounded-xl flex items-start gap-3 border border-green-100">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-700 font-medium">E'lon muvaffaqiyatli joylandi! Yo'naltirilmoqda...</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* LOST vs FOUND Toggle */}
                    <div className="flex p-1 bg-[#F3F4F6] rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setStatus('LOST')}
                            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${status === 'LOST' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Yo'qotdim (Lost)
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus('FOUND')}
                            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${status === 'FOUND' ? 'bg-white text-green-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Topib oldim (Found)
                        </button>
                    </div>

                    {/* Title Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Tag className="h-5 w-5 text-slate-400 group-focus-within:text-[#1E85FF] transition-colors" />
                        </div>
                        <div className="bg-[#F3F4F6] rounded-xl px-4 pt-2 pb-2 pl-12 border border-transparent focus-within:border-[#1E85FF] focus-within:bg-white transition-all">
                            <label className="block text-xs font-medium text-slate-500 mb-0.5">Sarlavha</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="block w-full bg-transparent border-none p-0 text-slate-900 placeholder-slate-400 focus:ring-0 sm:text-base font-bold"
                                placeholder={status === 'LOST' ? "Masalan: Qora iPhone 13 Pro" : "Masalan: Qora hamyon topib oldim"}
                            />
                        </div>
                    </div>

                    {/* Category & Date Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Category Dropdown */}
                        <div className="bg-[#F3F4F6] rounded-xl px-4 py-3 border border-transparent focus-within:border-[#1E85FF] focus-within:bg-white transition-all">
                            <label className="block text-xs font-medium text-slate-500 mb-1">Toifa</label>
                            <select
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="block w-full bg-transparent border-none p-0 text-slate-900 focus:ring-0 sm:text-sm font-bold cursor-pointer"
                            >
                                <option value="" disabled>Toifani tanlang</option>
                                {dbCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-[#1E85FF] transition-colors" />
                            </div>
                            <div className="bg-[#F3F4F6] rounded-xl px-4 pt-2 pb-2 pl-12 border border-transparent focus-within:border-[#1E85FF] focus-within:bg-white transition-all h-full">
                                <label className="block text-xs font-medium text-slate-500 mb-0.5">Sana</label>
                                <input
                                    type="date"
                                    required
                                    value={dateLost}
                                    onChange={(e) => setDateLost(e.target.value)}
                                    className="block w-full bg-transparent border-none p-0 text-slate-900 focus:ring-0 sm:text-sm font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description Textarea */}
                    <div className="relative group">
                        <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                            <AlignLeft className="h-5 w-5 text-slate-400 group-focus-within:text-[#1E85FF] transition-colors" />
                        </div>
                        <div className="bg-[#F3F4F6] rounded-xl px-4 pt-2 pb-2 pl-12 border border-transparent focus-within:border-[#1E85FF] focus-within:bg-white transition-all">
                            <label className="block text-xs font-medium text-slate-500 mb-0.5">Batafsil ma'lumot</label>
                            <textarea
                                required
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="block w-full bg-transparent border-none p-0 text-slate-900 placeholder-slate-400 focus:ring-0 sm:text-sm font-medium resize-none"
                                placeholder="Rangi, chiziqlari yoki boshqa o'ziga xos belgilari..."
                            />
                        </div>
                    </div>

                    {/* Location Address (Text) */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-[#1E85FF] transition-colors" />
                        </div>
                        <div className="bg-[#F3F4F6] rounded-xl px-4 pt-2 pb-2 pl-12 border border-transparent focus-within:border-[#1E85FF] focus-within:bg-white transition-all">
                            <label className="block text-xs font-medium text-slate-500 mb-0.5">Taxminiy manzil</label>
                            <input
                                type="text"
                                required
                                value={locationLost}
                                onChange={(e) => setLocationLost(e.target.value)}
                                className="block w-full bg-transparent border-none p-0 text-slate-900 placeholder-slate-400 focus:ring-0 sm:text-sm font-bold"
                                placeholder="Masalan: Chilonzor metro bekati yonida"
                            />
                        </div>
                    </div>

                    {/* Interactive Map Component */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-900">Xaritadan aniq joyni belgilang (Ixtiyoriy)</label>
                        <LocationPicker onLocationSelect={(coords) => setCoordinates(coords)} />
                    </div>

                    {/* Contact Info */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-[#1E85FF] transition-colors" />
                        </div>
                        <div className="bg-[#F3F4F6] rounded-xl px-4 pt-2 pb-2 pl-12 border border-transparent focus-within:border-[#1E85FF] focus-within:bg-white transition-all">
                            <label className="block text-xs font-medium text-slate-500 mb-0.5">Aloqa uchun</label>
                            <input
                                type="text"
                                required
                                value={contactInfo}
                                onChange={(e) => setContactInfo(e.target.value)}
                                className="block w-full bg-transparent border-none p-0 text-slate-900 placeholder-slate-400 focus:ring-0 sm:text-sm font-bold"
                                placeholder="Telefon raqam yoki Telegram username"
                            />
                        </div>
                    </div>

                    {/* Image Upload Zone */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-900">Rasmlar (Maks. 5 ta)</label>
                        
                        <div className="flex flex-wrap gap-4">
                            {/* Previews */}
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {/* Upload Button */}
                            {images.length < 5 && (
                                <label className="w-24 h-24 flex flex-col items-center justify-center bg-[#F3F4F6] border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#1E85FF] hover:bg-blue-50 transition-colors">
                                    <Camera className="w-8 h-8 text-slate-400 mb-1" />
                                    <span className="text-xs font-medium text-slate-500">Qo'shish</span>
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/jpeg, image/png, image/jpg" 
                                        className="hidden" 
                                        onChange={handleImageChange} 
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-[#1E85FF] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Joylanmoqda..." : "E'lonni joylash"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateItemPage;