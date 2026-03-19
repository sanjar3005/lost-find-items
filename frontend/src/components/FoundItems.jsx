import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Navigatsiya uchun import
import HomeCart from "./HomeCart";
import api from "../service/api";
import { useEffect } from "react";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function FoundItems() {
    const navigate = useNavigate(); // 2. Hookni chaqiramiz
    const [items, setItems] = React.useState([]);
    useEffect(() => {
        fetchFourItems();
    }
        , []);

    const fetchFourItems = async () => {
        // Django will see limit=4 and only return 4 items!
        const response = await api.get('/api/items/?status=FOUND&limit=4');

        // Note: When you turn on pagination, DRF wraps your data in a 'results' object
        const fetched = response.data.results || response.data || [];
        setItems(fetched);
        console.log("Fetched items:", fetched);
    };



    return (
        <div className="max-w-85/100 mx-auto">
            <div className='flex justify-between my-8'>
                <h1 className='text-3xl font-bold'>Topib olingan buyumlar</h1>
                <button
                    onClick={() => navigate('/items?status=FOUND')}
                    className='hover:text-[#1e88e5] cursor-pointer underline underline-offset-10 decoration-blue-600 pt-2'
                >
                    Ko'proq
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-7 justify-between">
                {items.map((item) => {
                    // 1. Safely extract the first image from the array
                    // (Note: Change '.image' to '.url' or '.file' if your Django serializer uses a different key inside the object)
                    const firstImageObj = item.images && item.images.length > 0 ? item.images[0] : null;
                    let imageUrl = firstImageObj ? firstImageObj.image : null;

                    // 2. Glue the backend URL to the image if it's a relative path
                    if (imageUrl && !imageUrl.startsWith('http')) {
                        imageUrl = `${BACKEND_URL}${imageUrl}`;
                    }

                    return (
                        <div className="flex justify-center" key={item.id}>
                            <HomeCart
                                // Pass the exact fields from your JSON
                                date={item.date_lost_or_found || "Noma'lum"}
                                title={item.title}
                                author={item.owner_name}

                                // Optional: If your Homeitem has a badge for status or location, pass them too!
                                status={item.status}
                                location={item.location_address}

                                // The safely extracted thumbnail
                                image={imageUrl}

                                // Fallback to null since the JSON doesn't include an author profile picture
                                authorImage={item.owner_picture || null}

                                // Navigate to the specific item page
                                onDetails={() => navigate(`/items/${item.id}`)}
                                onMap={() => navigate(`/items?focus=${item.id}&view=map`)}
                                itemId={item.id}
                                initialSaved={item.is_saved}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    )
}