// import React from "react";

// const Footer = () => {
//   return (
//     <footer className="relative bg-[#F0F0F0] font-['Satoshi'] mt-24 pb-12 w-full">
//       <div className="mx-auto max-w-[1240px] px-4 md:px-8">
//         {/* --- Newsletter Banner (Overlapping Section) --- */}
//         <div className="relative -top-16 flex flex-col gap-6 rounded-[20px] bg-black px-6 py-8 text-white md:flex-row md:items-center md:justify-between md:px-16 md:py-10">
//           <h2 className="max-w-[550px] text-[32px] font-extrabold uppercase leading-[1.1] tracking-tight md:text-[40px]">
//             Stay upto date about our latest offers
//           </h2>
//           <div className="flex flex-col gap-3 w-full sm:max-w-[350px]">
//             {/* Input Wrapper */}
//             <div className="relative flex items-center w-full">
//               <img
//                 src="src/assets/Mail.svg"
//                 alt="mail"
//                 className="absolute left-4 h-5 w-5 object-contain pointer-events-none"
//               />
//               <input
//                 type="email"
//                 placeholder="Enter your email address"
//                 className="w-full rounded-full bg-white pl-12 pr-5 py-3 text-sm text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/20"
//               />
//             </div>
//             {/* Subscribe Button */}
//             <button className="w-full rounded-full bg-white py-3 text-sm font-medium text-black transition hover:bg-gray-100 text-center">
//               Subscribe to Newsletter
//             </button>
//           </div>
//         </div>
//         <div className="-mt-4 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
//           {/* Brand Intro */}
//           <div className="max-w-[280px]">
//             <h1 className="text-3xl font-extrabold uppercase tracking-tight text-black pb-4">
//               SHOP.CO
//             </h1>
//             <p className="mb-6 text-sm leading-6 text-gray-500">
//               We have clothes that suits your style and which you're proud to
//               wear. From women to men.
//             </p>
//             <div className="flex items-center gap-3">
//               <a
//                 href="#"
//                 className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-black hover:text-white transition"
//               >
//                 <img src="src/assets/x.svg" alt="X" className="h-3 w-3" />
//               </a>
//               <a
//                 href="#"
//                 className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white hover:opacity-80 transition"
//               >
//                 <img
//                   src="src/assets/fb.svg"
//                   alt="Facebook"
//                   className="h-3 w-3 invert"
//                 />
//               </a>
//               <a
//                 href="#"
//                 className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-black hover:text-white transition"
//               >
//                 <img
//                   src="src/assets/insta.svg"
//                   alt="Instagram"
//                   className="h-3 w-3"
//                 />
//               </a>
//               <a
//                 href="#"
//                 className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-black hover:text-white transition"
//               >
//                 <img
//                   src="src/assets/git.svg"
//                   alt="Github"
//                   className="h-3 w-3"
//                 />
//               </a>
//             </div>
//           </div>
//           <div className="grid w-full grid-cols-2 gap-8 sm:grid-cols-4 lg:max-w-[760px]">
//             <div>
//               <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-black">
//                 Company
//               </h2>
//               <ul className="space-y-3.5 text-sm text-gray-500">
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     About
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Features
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Works
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Career
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-black">
//                 Help
//               </h2>
//               <ul className="space-y-3.5 text-sm text-gray-500">
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Customer Support
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Delivery Details
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Terms & Conditions
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Privacy Policy
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-black">
//                 FAQ
//               </h2>
//               <ul className="space-y-3.5 text-sm text-gray-500">
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Account
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Manage Deliveries
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Orders
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Payments
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-black">
//                 Resources
//               </h2>
//               <ul className="space-y-3.5 text-sm text-gray-500">
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Free eBooks
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Development Tutorial
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     How to - Blog
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-black transition">
//                     Youtube Playlist
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <hr className="my-8 border-t border-gray-200" />
//         <div className="flex flex-col items-center justify-between gap-4 text-xs text-gray-500 md:flex-row">
//           <p>Shop.co © 2000-2023, All Rights Reserved</p>
//           <div className="w-70.3 h-7.5 flex flex-wrap items-center justify-center gap-2 px-2 py-1 rounded">
//             <img
//               src="src/assets/Visa.svg"
//               alt="Visa"
//               className="w-11.65 h-7.5"
//             />
//             <img
//               src="src/assets/MasterCard.svg"
//               alt="MasterCard"
//               className="w-11.65 h-7.5"
//             />
//             <img
//               src="src/assets/PayPal.svg"
//               alt="PayPal"
//               className="w-11.65 h-7.5"
//             />
//             <img
//               src="src/assets/ApplePay.svg"
//               alt="Apple Pay"
//               className="w-11.65 h-7.5"
//             />
//             <img
//               src="src/assets/GooglePay.svg"
//               alt="Google Pay"
//               className="w-11.65 h-7.5"
//             />
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";

const Footer = () => {
  return (
    <footer className="relative bg-[#F0F0F0] font-['Satoshi'] mt-24 pb-12 w-full">
      <div className="mx-auto max-w-[1240px] px-4 md:px-8">
        {/* --- Newsletter Banner (Overlapping Section) --- */}
        <div className="relative -top-16 flex flex-col gap-6 rounded-[20px] bg-black px-6 py-8 text-white md:flex-row md:items-center md:justify-between md:px-16 md:py-10">
          <h2 className="max-w-[550px] text-[28px] font-extrabold uppercase leading-[1.1] tracking-tight md:text-[40px]">
            Stay upto date about our latest offers
          </h2>
          <div className="flex flex-col gap-3 w-full sm:max-w-[350px]">
            {/* Input Wrapper */}
            <div className="relative flex items-center w-full">
              <img
                src="src/assets/Mail.svg"
                alt="mail"
                className="absolute left-4 h-5 w-5 object-contain pointer-events-none"
              />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-full bg-white pl-12 pr-5 py-3 text-sm text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
            {/* Subscribe Button */}
            <button className="w-full rounded-full bg-white py-3 text-sm font-medium text-black transition hover:bg-gray-100 text-center">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
        <div className="-mt-4 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* Brand Intro */}
          <div className="max-w-[280px]">
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-black pb-4">
              SHOP.CO
            </h1>
            <p className="mb-6 text-sm leading-6 text-gray-500">
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-black hover:text-white transition"
              >
                <img src="src/assets/x.svg" alt="X" className="h-3 w-3" />
              </a>
              <a
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white hover:opacity-80 transition"
              >
                <img
                  src="src/assets/fb.svg"
                  alt="Facebook"
                  className="h-3 w-3 invert"
                />
              </a>
              <a
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-black hover:text-white transition"
              >
                <img
                  src="src/assets/insta.svg"
                  alt="Instagram"
                  className="h-3 w-3"
                />
              </a>
              <a
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-black hover:text-white transition"
              >
                <img
                  src="src/assets/git.svg"
                  alt="Github"
                  className="h-3 w-3"
                />
              </a>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-8 sm:grid-cols-4 lg:max-w-[760px]">
            <div>
              <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-black">
                Company
              </h2>
              <ul className="space-y-3.5 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-black transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Career
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-black">
                Help
              </h2>
              <ul className="space-y-3.5 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-black transition">
                    Customer Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Delivery Details
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-black">
                FAQ
              </h2>
              <ul className="space-y-3.5 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-black transition">
                    Account
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Manage Deliveries
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Orders
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Payments
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-black">
                Resources
              </h2>
              <ul className="space-y-3.5 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-black transition">
                    Free eBooks
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Development Tutorial
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    How to - Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Youtube Playlist
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-8 border-t border-gray-200" />
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-gray-500 md:flex-row">
          <p>Shop.co © 2000-2023, All Rights Reserved</p>
          <div className="flex flex-wrap items-center justify-center gap-2 px-2 py-1 rounded">
            <img
              src="src/assets/Visa.svg"
              alt="Visa"
              className="w-12 h-7 object-contain"
            />
            <img
              src="src/assets/MasterCard.svg"
              alt="MasterCard"
              className="w-12 h-7 object-contain"
            />
            <img
              src="src/assets/PayPal.svg"
              alt="PayPal"
              className="w-12 h-7 object-contain"
            />
            <img
              src="src/assets/ApplePay.svg"
              alt="Apple Pay"
              className="w-12 h-7 object-contain"
            />
            <img
              src="src/assets/GooglePay.svg"
              alt="Google Pay"
              className="w-12 h-7 object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
