import React from "react";

export default function Footer() {
    return (
    <footer className="bg-white border-t border-slate-100 pt-12 pb-8">
        <div className="max-w-85/100 mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Column 1: Description */}
            <div className="col-span-1 md:col-span-1">
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                Har qanday yo'qolgan narsangizni salon mumkun!
              </p>
            </div>

            {/* Column 2: Biz haqimizda */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Biz haqimizda</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Haqida</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Aloqa</a></li>
              </ul>
            </div>

            {/* Column 3: Havolalar */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Havolalar</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Yordam markazi</a></li>
              </ul>
            </div>

             {/* Column 4: Hamjamiyat & Socials */}
             <div>
              <h4 className="font-bold text-slate-900 mb-4">Hamjamiyat havolalari</h4>
              <ul className="space-y-2 text-sm text-slate-500 mb-6">
                 <li><a href="#" className="hover:text-blue-600 transition-colors">Ixtilof</a></li>
                 <li><a href="#" className="hover:text-blue-600 transition-colors">Jamiyat</a></li>
              </ul>
            </div>
          </div>
          
           {/* Social Icons Row */}
           <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-100 pt-8">
              <h4 className="font-bold text-slate-900 mb-4 md:mb-0 md:mr-auto">Ijtimoiy tarmoq</h4>
              <div className="flex gap-4">
                {/* Instagram */}
                <a href="#" className="w-10 h-10 bg-[#88C1F8] rounded-lg flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                {/* Twitter */}
                <a href="#" className="w-10 h-10 bg-[#88C1F8] rounded-lg flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
                {/* Facebook */}
                <a href="#" className="w-10 h-10 bg-[#88C1F8] rounded-lg flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                {/* Telegram (Send Icon) */}
                <a href="#" className="w-10 h-10 bg-[#88C1F8] rounded-lg flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </a>
              </div>
           </div>

        </div>
      </footer>
)}