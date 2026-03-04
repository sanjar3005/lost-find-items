import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Navigatsiya uchun import
import HomeCart from "./HomeCart";
import api from "../service/api";
import { useEffect } from "react";

export default function FoundItems() {
    const navigate = useNavigate(); // 2. Hookni chaqiramiz
    const [items, setItems] = React.useState([]);
    useEffect(() => {
        fetchFourItems();
    }
        , []);

    const fetchFourItems = async () => {
        // Django will see limit=4 and only return 4 items!
        const response = await api.get('/api/items/?limit=4');

        // Note: When you turn on pagination, DRF wraps your data in a 'results' object
        setItems(response.data.results);
        console.log("Fetched items:", response.data.results);
    };



    const carts = [{
        date: "02-07-2025",
        title: "Kitob",
        author: "Asilbek",
        authorImage: "/img/book.png",
        image: "/img/book.png",
    }, {
        date: "04-07-2026",
        title: "Mushuk",
        author: "Kamol",
        authorImage: "/img/cat.png",
        image: "/img/cat.png",
    }, {
        date: "25-08-2026",
        title: "Airpods",
        author: "Odil",
        authorImage: "/img/airpods.png",
        image: "/img/airpods.png",
    }, {
        date: "02-02-2026",
        title: "Kuchuk",
        author: "Zarina",
        authorImage: "/img/dog.png",
        image: "/img/dog.png",
    },
    ]

    return (
        <div className="max-w-85/100 mx-auto">
            <div className='flex justify-between my-8'>
                <h1 className='text-3xl font-bold'>Topib olingan buyumlar</h1>
                <p className='hover:text-[#1e88e5] cursor-pointer underline underline-offset-10 decoration-blue-600 pt-2'>Ko'proq</p>
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
                                date={item.date_lost_or_found}
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
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    )
}