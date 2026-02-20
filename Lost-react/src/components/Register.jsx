import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Key, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import { useGoogleLogin } from '@react-oauth/google';

const RegisterPage = () => {
    const { registerUser } = useAuth();

    // States for all fields in the design
    const [fullName, setFullName] = useState('Asadbek Malikov'); // Default value from design
    const [email, setEmail] = useState('asadbekmalikov@gmail.com');
    const [password, setPassword] = useState('asadbek722');
    const [confirmPassword, setConfirmPassword] = useState('asadbek722');

    // States for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // UI States
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // Default value from design
    const [phoneNumber, setPhoneNumber] = useState(' +998 90 123 45 67');
    // Change your phoneNumber state to store raw digits





    const { loginUser, loginWithGoogle } = useAuth();

    // 3. Initialize the Google Hook
    const handleGoogleClick = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Send Google's access token to your backend
                await loginWithGoogle(tokenResponse.access_token);
            } catch (err) {
                setError("Google orqali kirishda xatolik yuz berdi.");
            }
        },
        onError: () => setError("Google tizimiga ulanish bekor qilindi."),
    });




    // Add this function to format the display (e.g., "90 123 45 67")
    const formatPhoneDisplay = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const cvLength = phoneNumber.length;
        if (cvLength < 3) return phoneNumber;
        if (cvLength < 6) return `${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2)}`;
        if (cvLength < 8) return `${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2, 5)} ${phoneNumber.slice(5)}`;
        return `${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2, 5)} ${phoneNumber.slice(5, 7)} ${phoneNumber.slice(7, 9)}`;
    };

    const handlePhoneChange = (e) => {
        // Only allow numbers and limit to 9 digits
        const rawValue = e.target.value.replace(/[^\d]/g, '').slice(0, 9);
        setPhoneNumber(rawValue);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 1. Validate Passwords Match on Frontend first
        if (password !== confirmPassword) {
            setError("Parollar mos kelmadi. Iltimos tekshirib qaytadan kiriting.");
            setLoading(false);
            return;
        }

        // 2. Validate Phone Length
        if (phoneNumber.length !== 9) {
            setError("Telefon raqam to'liq kiritilmagan.");
            setLoading(false);
            return;
        }

        // 3. Format Name and Phone for Django
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Formats "901234567" into "90-123-45-67" to satisfy Django's strict regex
        const formattedPhone = phoneNumber.trim();

        try {
            await registerUser({
                first_name: firstName,
                last_name: lastName,
                phone_number: formattedPhone, // Sending the dashed format
                email: email,
                password: password,
                password_confirm: confirmPassword // Added missing field!
            });
        } catch (err) {
            const errorMsg = err.response?.data?.email
                ? "Ushbu email allaqachon ro'yxatdan o'tgan."
                : err.response?.data?.detail || "Ro'yxatdan o'tishda xatolik yuz berdi.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white rounded-xl shadow-none sm:shadow-lg sm:border sm:border-slate-100 p-8 space-y-6">

                    {/* Logo Header */}
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <div className="w-8 h-8 relative flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="14" fill="#0F172A" />
                                <path d="M8 26C8 26 15 32 32 14" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900">Logo</h2>
                    </div>

                    <div className="error">{error && <p className="text-red-500 text-sm text-center">{error}</p>}</div>

                    <form className="space-y-4" onSubmit={handleSubmit}>

                        {/* Full Name Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-800" />
                            </div>
                            <div className="bg-[#F3F4F6] rounded-lg px-4 pt-2 pb-2 pl-12 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                                <label className="block text-xs font-medium text-slate-500 mb-0.5">To'liq ism</label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="block w-full bg-transparent border-none p-0 text-slate-900 placeholder-slate-400 focus:ring-0 sm:text-sm font-bold"
                                    placeholder="Ism Familiya"
                                />
                            </div>
                        </div>

                        {/* Phone Number Input */}
                        {/* Phone Number Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-slate-800" />
                            </div>
                            <div className="bg-[#F3F4F6] rounded-lg px-4 pt-2 pb-2 pl-12 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                                <label className="block text-xs font-medium text-slate-500 mb-0.5">Telefon raqam</label>
                                <div className="flex items-center">
                                    <span className="text-slate-900 font-bold mr-1 sm:text-sm tracking-wide">+998</span>
                                    <input
                                        type="text"
                                        required
                                        value={formatPhoneDisplay(phoneNumber)}
                                        onChange={handlePhoneChange}
                                        className="block w-full bg-transparent border-none p-0 text-slate-900 placeholder-slate-400 focus:ring-0 sm:text-sm font-bold tracking-wide"
                                        placeholder="90 123 45 67"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-800" />
                            </div>
                            <div className="bg-[#F3F4F6] rounded-lg px-4 pt-2 pb-2 pl-12 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                                <label className="block text-xs font-medium text-slate-500 mb-0.5">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full bg-transparent border-none p-0 text-slate-900 placeholder-slate-400 focus:ring-0 sm:text-sm font-bold"
                                    placeholder="example@gmail.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Key className="h-5 w-5 text-slate-800" />
                            </div>
                            <div className="bg-[#F3F4F6] rounded-lg px-4 pt-2 pb-2 pl-12 pr-10 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                                <label className="block text-xs font-medium text-slate-500 mb-0.5">Parol</label>
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full bg-transparent border-none p-0 text-slate-900 placeholder-slate-400 focus:ring-0 sm:text-sm font-bold tracking-widest"
                                    placeholder="••••••••••"
                                />
                            </div>
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Key className="h-5 w-5 text-slate-800" />
                            </div>
                            <div className="bg-[#F3F4F6] rounded-lg px-4 pt-2 pb-2 pl-12 pr-10 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                                <label className="block text-xs font-medium text-slate-500 mb-0.5">Parolni tekshirish</label>
                                <input
                                    required
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full bg-transparent border-none p-0 text-slate-900 placeholder-slate-400 focus:ring-0 sm:text-sm font-bold tracking-widest"
                                    placeholder="••••••••••"
                                />
                            </div>
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-500">OR</span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={() => handleGoogleClick()} // 4. Attach the hook here!
                                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                                Google orqali davom etish
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#1E85FF] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Yuklanmoqda..." : "Royxatdan o'tish"}
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="text-center text-sm pt-4">
                        <span className="text-slate-600">Hisobingiz mavjudmi ? </span>
                        <a href="/login" className="font-medium text-[#1E85FF] hover:text-blue-700">
                            Kirish
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RegisterPage;