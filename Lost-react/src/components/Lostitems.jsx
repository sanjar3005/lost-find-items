import React from 'react';

const CardItem = ({ image, userImage, name, location }) => {
    return (
        <div className="bg-[#E9E9E9] rounded-[24px] p-4 lg:p-5 flex flex-col gap-4 shadow-sm">
            {/* Asosiy rasm konteyneri */}
            <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-white">
                <img
                    src={image}
                    alt="Product"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Foydalanuvchi ma'lumotlari qismi */}
            <div className="flex items-center gap-3 px-1">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-[12px] overflow-hidden bg-black shrink-0">
                    <img
                        src={userImage}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-[#0A2342] font-bold text-base lg:text-lg leading-tight">
                        {name}
                    </span>
                    <span className="text-[#8E8E93] text-sm lg:text-base font-medium">
                        {location}
                    </span>
                </div>
            </div>
        </div>
    );
};

const LostItems = () => {
    const data = [
        { id: 1, name: "Otabek", location: "Toshkent", image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop", userImage: "https://media.gettyimages.com/id/1369199360/photo/portrait-of-a-handsome-young-businessman-working-in-office.jpg?s=612x612&w=gi&k=20&c=BFc13n-vhT4GMd0ohRt0PFD3IzJ_Onf6nKDAObgh1CA=" },
        { id: 2, name: "Alisher", location: "Farg'ona", image: "https://cdn.pixabay.com/photo/2020/04/10/01/17/airpods-5023660_640.jpg", userImage: "https://media.istockphoto.com/id/1399565382/photo/young-happy-mixed-race-businessman-standing-with-his-arms-crossed-working-alone-in-an-office.jpg?s=612x612&w=0&k=20&c=buXwOYjA_tjt2O3-kcSKqkTp2lxKWJJ_Ttx2PhYe3VM=" },
        { id: 3, name: "Abdulloh", location: "Andijon", image: "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=1000&auto=format&fit=crop", userImage: "https://img3.stockfresh.com/files/n/nyul/m/97/623482_stock-photo-portrait-of-happy-older-man.jpg" },
    ];

    return (
        <div className="max-w-91/100 w-full mx-auto p-10 lg:px-9 px-2">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-[#0a1d37] text-2xl lg:text-4xl font-bold leading-tight">
                        Yo'qolgan buyumlar
                    </h2>
                    <p className="text-gray-500 mt-1 text-xs md:text-base font-medium">
                        Bu yerda siz yo'qolgan narsalarni ko'rishingiz mumkin
                    </p>
                </div>
                <button className="hover:text-[#1e88e5] underline underline-offset-10 decoration-blue-600 cursor-pointer text-sm md:text-base  border-b-2 border-[#1e88e5] pb-5 whitespace-nowrap lg:mb-4">
                    Ko'proq
                </button>
            </div>
            {/* Grid: Mobil 1 ta, PC 3 ta ustun */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((item) => (
                    <CardItem key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
};

export default LostItems;