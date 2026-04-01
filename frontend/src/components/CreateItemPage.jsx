import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, MapPin, Calendar, AlignLeft, Tag, Phone, Camera, X, CheckCircle2, AlertCircle, Loader2, Camera as CameraIcon } from 'lucide-react';
import LocationPicker from '../components/LocationPicker'; // The map component we built earlier
import api from '../service/api'; // Your configured axios instance


const CreateItemPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

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

    // Camera State
    const [showCamera, setShowCamera] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Handle Image Selection
    const appendSelectedFiles = (fileList) => {
        const files = Array.from(fileList || []);
        if (files.length === 0) return;

        if (files.length + imagePreviews.length > 5) {
            setError("Maksimal 5 ta rasm yuklash mumkin.");
            return;
        }

        setImages(prev => [...prev, ...files]);

        // Create local URLs to show previews to the user
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const handleImageChange = (e) => {
        appendSelectedFiles(e.target.files);
        e.target.value = '';
    };

    const handleCameraCapture = (e) => {
        appendSelectedFiles(e.target.files);
        e.target.value = '';
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            streamRef.current = stream;
            setShowCamera(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Kameraga kirish imkoni bo'lmadi. Iltimos, ruxsat bering.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setShowCamera(false);
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
                    appendSelectedFiles([file]);
                    stopCamera();
                }
            }, 'image/jpeg', 0.8);
        }
    };

    useEffect(() => {
        if (showCamera && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [showCamera]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Adjust the URL if your Django router has a different path
                const response = await api.get('/api/categories/'); 
                
                // DRF usually returns an array directly, or inside 'results' if paginated
                // If you use pagination, it might be response.data.results
                setDbCategories(response.data.results || response.data); 
            } catch (err) {
                console.error("Toifalarni yuklashda xatolik:", err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (!isEditMode) return;

        const fetchItem = async () => {
            try {
                const response = await api.get(`/api/items/${id}/`);
                const item = response.data;

                setStatus(item.status || 'LOST');
                setTitle(item.title || '');
                setDescription(item.description || '');
                setCategory(item.category || '');
                setDateLost(item.date_lost_or_found || '');
                setLocationLost(item.location_address || '');
                setContactInfo(item.contact_info || '');

                if (item.latitude && item.longitude) {
                    setCoordinates({ lat: item.latitude, lng: item.longitude });
                }

                if (item.images && item.images.length > 0) {
                    const existingPreviews = item.images
                        .map((img) => img.image)
                        .filter(Boolean)
                        .map((url) => (url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`));
                    setImagePreviews(existingPreviews);
                }
            } catch (err) {
                console.error("E'lonni yuklashda xatolik:", err);
                setError("E'lon ma'lumotlarini yuklab bo'lmadi.");
            }
        };

        fetchItem();
    }, [id, isEditMode]);

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
            if (isEditMode) {
                await api.put(`/api/items/${id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/api/items/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            
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
        <div className="min-h-screen bg-white py-4 sm:py-8 lg:py-10 px-3 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto bg-white sm:shadow-lg sm:border sm:border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-8 lg:p-10">
                
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">{isEditMode ? "E'lonni tahrirlash" : "E'lon joylash"}</h1>
                <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">Yo'qotgan yoki topib olgan buyumingiz haqida ma'lumot qoldiring.</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start gap-3 border border-red-100">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 rounded-xl flex items-start gap-3 border border-green-100 flex-col">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-green-700 font-medium">{isEditMode ? "E'lon muvaffaqiyatli yangilandi! Yo'naltirilmoqda..." : "E'lon muvaffaqiyatli joylandi! Yo'naltirilmoqda..."}</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-700 font-medium">AI tizimimiz orqali e'loningiz toifasi avtomatik ravishda tekshiriladi va kerak bo'lsa yangilanadi!</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    
                    {/* LOST vs FOUND Toggle */}
                    <div className="flex p-1 bg-[#F3F4F6] rounded-xl mb-4 sm:mb-6">
                        <button
                            type="button"
                            onClick={() => setStatus('LOST')}
                            className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${status === 'LOST' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Yo'qotdim (Lost)
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus('FOUND')}
                            className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${status === 'FOUND' ? 'bg-white text-green-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
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
                        <div className="bg-[#F3F4F6] rounded-xl px-4 py-3 border border-transparent focus-within:border-[#1E85FF] focus-within:bg-white transition-all relative">
                            <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                                Toifa
                                <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> AI Yordamida
                                </span>
                            </label>
                            {/* <select
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="block w-full bg-transparent border-none p-0 text-slate-900 focus:ring-0 sm:text-sm font-bold cursor-pointer appearance-none"
                            >
                                <option value="" disabled>Toifani tanlang (yoki AI ga qo'yib bering)</option>
                                {dbCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select> */}
                            <p className="text-[10px] text-slate-400 mt-1">Rasmingiz asosida AI eng mos toifani avtomatik aniqlaydi.</p>
                        </div>

                        {/* Date Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-[#1E85FF] transition-colors" />
                            </div>
                            <div className="bg-[#F3F4F6] rounded-xl px-4 pt-2 pb-2 pl-12 border border-transparent focus-within:border-[#1E85FF] focus-within:bg-white transition-all h-full">
                                <label className="block text-xs font-medium text-slate-500 mb-0.5">Sana (Ixtiyoriy)</label>
                                <input
                                    type="date"
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
                            <label className="block text-xs font-medium text-slate-500 mb-0.5">Batafsil ma'lumot (Ixtiyoriy)</label>
                            <textarea
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
                            <label className="block text-xs font-medium text-slate-500 mb-0.5">Mo'ljal</label>
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
                            <label className="block text-xs font-medium text-slate-500 mb-0.5">Aloqa uchun (Ixtiyoriy)</label>
                            <input
                                type="text"
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
                        
                        <div className="flex flex-wrap gap-3">
                            {/* Previews */}
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
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
                            {imagePreviews.length < 5 && (
                                <>
                                    <label htmlFor="gallery-upload" className="w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center bg-[#F3F4F6] border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#1E85FF] hover:bg-blue-50 transition-colors">
                                        <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 mb-1" />
                                        <span className="text-[11px] sm:text-xs font-medium text-slate-500">Galereya</span>
                                        <input 
                                            id="gallery-upload"
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={handleImageChange} 
                                        />
                                    </label>

                                    <button 
                                        type="button"
                                        onClick={startCamera}
                                        className="w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center bg-[#F3F4F6] border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#1E85FF] hover:bg-blue-50 transition-colors"
                                    >
                                        <CameraIcon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 mb-1" />
                                        <span className="text-[11px] sm:text-xs font-medium text-slate-500">Kamera</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 sm:pt-6">
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full flex items-center justify-center py-3 sm:py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm sm:text-base font-bold text-white bg-[#1E85FF] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Joylanmoqda...
                                </>
                            ) : (
                                isEditMode ? "E'lonni yangilash" : "E'lonni joylash"
                            )}
                        </button>
                    </div>

                    {/* Camera Modal */}
                    {showCamera && (
                        <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4">
                            <div className="relative w-full max-w-md bg-black rounded-2xl overflow-hidden shadow-2xl">
                                <button
                                    type="button"
                                    onClick={stopCamera}
                                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline
                                    className="w-full h-auto aspect-[3/4] object-cover bg-slate-900"
                                />
                                <canvas ref={canvasRef} className="hidden" />
                                
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={captureImage}
                                        className="w-16 h-16 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        <div className="w-12 h-12 bg-white rounded-full border border-slate-200 shadow-sm" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
};

export default CreateItemPage;