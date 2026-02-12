import React from "react";
import HomeCart from "./HomeCart";


export default function FoundItems() {
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
                {carts.map((cart, index) => (
                    <div className="flex justify-center" key={index}>
                        <HomeCart
                            date={cart.date}
                            title={cart.title}
                            author={cart.author}
                            authorImage={cart.authorImage}
                            image={cart.image}
                        />
                    </div>
                ))}

            </div>
        </div>
    )
}