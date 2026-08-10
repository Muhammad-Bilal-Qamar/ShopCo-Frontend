// import React from "react";

// const BrowseBy = () => {
//   return (
//     <>
//       <div className="font-['Integral_CF'] flex  justify-center px-4 ">
//         <div className="bg-[#F0F0F0] w-full max-w-309.75 rounded-2xl py-10 px-4">
//           <h1 className="text-center font-integral font-bold text-[38px] md:text-[48px]">
//             Browse By Dress Style
//           </h1>

//           <div className="flex flex-col justify-center gap-5 my-5 text-[36px] font-bold md:flex-row">
//             <div className="relative w-full h-47.5 md:w-101.75 md:h-72.25 rounded-2xl overflow-hidden bg-white">
//               <img
//                 src="src\assets\Casual.svg"
//                 className="w-full h-full object-cover "
//               />
//               <h1 className="absolute top-6 left-6  ">Casual</h1>
//             </div>
//             <div className="relative w-full h-47.5 md:w-171 md:h-72.25 rounded-2xl overflow-hidden bg-white">
//               <img
//                 src="src\assets\Formal.svg"
//                 className="w-full h-full object-cover "
//               />
//               <h1 className="absolute top-6 left-6 ">Formal</h1>
//             </div>
//           </div>
//           <div className="flex flex-col justify-center gap-5 text-[36px] font-bold md:flex-row">
//             <div className="relative w-full h-47.5 md:w-171 md:h-72.25 rounded-2xl overflow-hidden bg-white">
//               <img
//                 src="src\assets\Party.svg"
//                 className="w-full h-full object-cover"
//               />
//               <h1 className="absolute top-6 left-6 ">Party</h1>
//             </div>
//             <div className="relative w-full h-47.5 md:w-101.75 md:h-72.25 rounded-2xl overflow-hidden bg-white">
//               <img
//                 src="src\assets\Gym.svg"
//                 className="w-full h-full object-cover"
//               />
//               <h1 className="absolute top-6 left-6 ">Gym</h1>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BrowseBy;

import React from "react";
import { Link } from "react-router-dom";

const BrowseBy = () => {
  return (
    <>
      <div className="font-['Integral_CF'] flex justify-center px-4">
        <div className="bg-[#F0F0F0] w-full max-w-7xl rounded-2xl py-10 px-4 md:px-14">
          <h1 className="text-center font-integral font-bold text-[32px] md:text-[48px] leading-tight mb-4">
            Browse By Dress Style
          </h1>

          <div className="flex flex-col justify-center gap-5 my-5 text-[24px] md:text-[36px] font-bold md:flex-row">
            <Link
              to="/category/casual"
              className="relative w-full h-[190px] md:w-[40%] md:h-[288px] rounded-2xl overflow-hidden bg-white transition hover:opacity-90"
            >
              <img
                src="src\assets\Casual.svg"
                className="w-full h-full object-cover"
                alt="Casual"
              />
              <h1 className="absolute top-6 left-6">Casual</h1>
            </Link>
            <Link
              to="/category/formal"
              className="relative w-full h-[190px] md:w-[60%] md:h-[288px] rounded-2xl overflow-hidden bg-white transition hover:opacity-90"
            >
              <img
                src="src\assets\Formal.svg"
                className="w-full h-full object-cover"
                alt="Formal"
              />
              <h1 className="absolute top-6 left-6">Formal</h1>
            </Link>
          </div>
          <div className="flex flex-col justify-center gap-5 text-[24px] md:text-[36px] font-bold md:flex-row">
            <Link
              to="/category/party"
              className="relative w-full h-[190px] md:w-[60%] md:h-[288px] rounded-2xl overflow-hidden bg-white transition hover:opacity-90"
            >
              <img
                src="src\assets\Party.svg"
                className="w-full h-full object-cover"
                alt="Party"
              />
              <h1 className="absolute top-6 left-6">Party</h1>
            </Link>
            <Link
              to="/category/gym"
              className="relative w-full h-[190px] md:w-[40%] md:h-[288px] rounded-2xl overflow-hidden bg-white transition hover:opacity-90"
            >
              <img
                src="src\assets\Gym.svg"
                className="w-full h-full object-cover"
                alt="Gym"
              />
              <h1 className="absolute top-6 left-6">Gym</h1>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowseBy;
