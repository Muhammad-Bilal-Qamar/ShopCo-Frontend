// import React from "react";

// const Hero = () => {
//   return (
//     <div className="relative w-full overflow-hidden bg-[#F2F0F1]">
//       <img
//         src="./src/assets/Rectangle 2.svg"
//         alt="Models background"
//         className="w-full h-auto min-h-125 object-cover object-right md:object-center"
//       />
//       <div>
//         <img
//           src="src\assets\Star.svg"
//           alt="star"
//           className="absolute top-10 right-10 w-26 h-26"
//         />
//         <img
//           src="src\assets\Star.svg"
//           alt="star"
//           className="absolute top-65 right-140 w-14 h-14"
//         />
//       </div>
//       <div className="absolute inset-0 flex items-center max-w-[700px] max-h-[400px]">
//         <div className="max-w-310 w-full mx-auto px-4 md:px-6">
//           <div className="max-w-xl space-y-6 mt-42 ml-12">
//             <h1 className="text-4 md:text-6xl font-black font-['Integral_CF'] tracking-tight leading-none text-black">
//               FIND CLOTHES <br />
//               THAT MATCHES <br />
//               YOUR STYLE
//             </h1>

//             <p className="text-gray-600 text-sm md:text-base max-w-md leading-relaxed">
//               Browse through our diverse range of meticulously crafted garments,
//               designed to bring out your individuality and cater to your sense
//               of style.
//             </p>

//             <button className="bg-black text-white text-sm md:text-base font-medium px-14 py-4 rounded-full hover:bg-black/80 transition-all cursor-pointer">
//               Shop Now
//             </button>

//             <div className="flex flex-wrap items-center gap-8 pt-6">
//               <div>
//                 <span className="block text-2xl md:text-4xl font-bold text-black">
//                   200+
//                 </span>
//                 <span className="text-xs md:text-sm text-gray-500">
//                   International Brands
//                 </span>
//               </div>
//               <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
//               <div>
//                 <span className="block text-2xl md:text-4xl font-bold text-black">
//                   2,000+
//                 </span>
//                 <span className="text-xs md:text-sm text-gray-500">
//                   High-Quality Products
//                 </span>
//               </div>
//               <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
//               <div>
//                 <span className="block text-2xl md:text-4xl font-bold text-black">
//                   30,000+
//                 </span>
//                 <span className="text-xs md:text-sm text-gray-500">
//                   Happy Customers
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="bg-black flex items-center justify-center gap-20 py-8">
//         <img src="src\assets\Versace.svg" alt="" />
//         <img src="src\assets\zara-logo-1 1.svg" alt="" />
//         <img src="src\assets\gucci-logo-1 1.svg" alt="" />
//         <img src="src\assets\prada-logo-1 1.svg" alt="" />
//         <img src="src\assets\Calvin.svg" alt="" />
//       </div>
//     </div>
//   );
// };

// export default Hero;

import React from "react";
import RectangleImage from "../../assets/Rectangle 2.svg";
import StarIcon from "../../assets/Star.svg";
import VersaceLogo from "../../assets/Versace.svg";
import ZaraLogo from "../../assets/zara-logo-1 1.svg";
import GucciLogo from "../../assets/gucci-logo-1 1.svg";
import PradaLogo from "../../assets/prada-logo-1 1.svg";
import CalvinLogo from "../../assets/Calvin.svg";

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden bg-[#F2F0F1] flex flex-col md:block">
      {/* Content Layer (Above image on mobile, Absolute on desktop) */}
      <div className="relative md:absolute inset-0 flex items-center z-20 w-full structure-wrapper md:mt-[-50px]">
        <div className="max-w-[1240px] w-full mx-auto px-4 md:px-8 py-8 md:py-0">
          <div className="max-w-xl space-y-5 md:space-y-6 text-left">
            <h1 className="text-[36px] md:text-6xl font-black font-['Integral_CF'] tracking-tight leading-none text-black">
              FIND CLOTHES <br />
              THAT MATCHES <br />
              YOUR STYLE
            </h1>

            <p className="text-gray-600 text-sm md:text-base max-w-md leading-relaxed">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>

            <button className="w-full md:w-auto bg-black text-white text-sm md:text-base font-medium px-14 py-4 rounded-full hover:bg-black/80 transition-all cursor-pointer">
              Shop Now
            </button>

            {/* Stats Counter */}
            <div className="pt-6 sm:pt-8 md:pt-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:justify-start sm:gap-6 md:gap-8">
                <div className="text-center sm:text-left border-r border-gray-200 pr-6 last:border-r-0 sm:border-r-0 sm:pr-0">
                  <span className="block text-2xl md:text-4xl font-bold text-black">
                    200+
                  </span>
                  <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                    International Brands
                  </span>
                </div>
                <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
                <div className="text-center sm:text-left">
                  <span className="block text-2xl md:text-4xl font-bold text-black">
                    2,000+
                  </span>
                  <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                    High-Quality Products
                  </span>
                </div>
                <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
                <div className="col-span-2 sm:col-auto text-center sm:text-left mt-3 sm:mt-0">
                  <span className="block text-2xl md:text-4xl font-bold text-black">
                    30,000+
                  </span>
                  <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                    Happy Customers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image Container */}
      <div className="w-full relative z-10 px-4 md:px-0">
        <img
          src={RectangleImage}
          alt="Models with stars"
          className="w-full h-auto min-h-[300px] md:min-h-[500px] lg:min-h-[600px] object-cover object-right md:object-center rounded-2xl md:rounded-none"
        />

        {/* Decorative Stars */}
        <img
          src={StarIcon}
          alt="decorative star"
          className="absolute left-[8%] top-[25%] md:left-[55%] md:top-[40%] w-8 h-8 md:w-11 md:h-11 z-30"
        />
        <img
          src={StarIcon}
          alt="decorative star"
          className="absolute right-[10%] top-[10%] md:top-[10%] md:right-[5%] w-16 h-16 md:w-20 md:h-20 lg:w-26 lg:h-26 z-30"
        />
      </div>

      {/* Brand Logos Strip (Now rendered below the pic on mobile) */}
      <div className="bg-black flex flex-col items-center justify-center gap-y-6 gap-x-8 md:gap-x-20 py-8 px-4 md:flex-row z-20 relative">
        {/* Row 1 (Mobile) */}
        <div className="flex items-center justify-center gap-x-8 md:gap-x-20">
          <img
            src={VersaceLogo}
            alt="Versace"
            className="h-5 md:h-6 object-contain"
          />
          <img
            src={ZaraLogo}
            alt="Zara"
            className="h-5 md:h-6 object-contain"
          />
          <img
            src={GucciLogo}
            alt="Gucci"
            className="h-5 md:h-6 object-contain"
          />
        </div>
        {/* Row 2 (Mobile) */}
        <div className="flex items-center justify-center gap-x-8 md:gap-x-20">
          <img
            src={PradaLogo}
            alt="Prada"
            className="h-5 md:h-6 object-contain"
          />
          <img
            src={CalvinLogo}
            alt="Calvin Klein"
            className="h-5 md:h-6 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
