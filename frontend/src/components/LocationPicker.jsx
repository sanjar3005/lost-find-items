import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { MapPin } from 'lucide-react';

// 1. The Map Listener: This silently watches the map as the user drags it
const MapCenterObserver = ({ onCenterChange }) => {
    const map = useMapEvents({
        // Fires continuously as the user drags the map
        move: () => {
            const center = map.getCenter();
            onCenterChange({ lat: center.lat, lng: center.lng });
        },
        // Fires when the user lets go of the screen
        moveend: () => {
            const center = map.getCenter();
            onCenterChange({ lat: center.lat, lng: center.lng });
        }
    });
    return null;
};

const LocationPicker = ({ onLocationSelect }) => {
    // Default center set to Tashkent
    const [centerPos, setCenterPos] = useState({ lat: 41.311081, lng: 69.240562 });

    // Send the coordinates to your Form, but use a small delay (debounce) 
    // so we don't spam the parent component while the user is actively dragging
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onLocationSelect) {
                onLocationSelect(centerPos);
            }
        }, 300); // Wait 300ms after they stop dragging to update the form
        
        return () => clearTimeout(timeoutId);
    }, [centerPos, onLocationSelect]);

    return (
        <div className="max-w-3xl h-72 rounded-xl overflow-hidden border border-slate-300 relative shadow-inner bg-slate-100">
            
            {/* 2. The Map Layer */}
            <MapContainer 
                center={[centerPos.lat, centerPos.lng]} 
                zoom={13} 
                scrollWheelZoom={true} 
                zoomControl={true} // Hiding default zoom controls makes it look more like a native app
                className="w-full h-full z-0"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapCenterObserver onCenterChange={setCenterPos} />
            </MapContainer>
            
            {/* 3. The Fixed Center Pin (Telegram Style) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-[1000] pointer-events-none flex flex-col items-center">
                {/* The Pin Icon */}
                <MapPin className="w-10 h-10 text-[#1877F2] drop-shadow-md" fill="#1877F2" stroke="white" strokeWidth={1.5} />
                
                {/* A little shadow/dot under the pin to show the EXACT center point */}
                <div className="w-2 h-1 bg-black/30 rounded-[100%] absolute -bottom-0.5 blur-[1px]"></div>
            </div>

            {/* Optional: Live Coordinates Display for the user */}
            <div className="absolute top-4 left-0 right-0 flex justify-center z-[1000] pointer-events-none">
                <span className="bg-white/90 text-slate-800 text-xs font-bold px-4 py-2 rounded-full shadow-md backdrop-blur-sm border border-slate-200">
                    Xaritani suring (Drag map)
                </span>
            </div>


            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-[1000] pointer-events-none">
                <span className="bg-white/90 text-slate-800 text-xs font-bold px-4 py-2 rounded-full shadow-md backdrop-blur-sm border border-slate-200">
                    {centerPos.lat.toFixed(4)}, {centerPos.lng.toFixed(4)}
                </span>
            </div>
            
        </div>
    );
};

export default LocationPicker;