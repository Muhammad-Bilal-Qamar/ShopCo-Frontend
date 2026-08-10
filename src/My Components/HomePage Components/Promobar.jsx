// import { useState } from "react";

// function PromoBanner() {
//   const [isVisible, setIsVisible] = useState(true);
//   if (!isVisible) return null;

//   return (
//     <p className="relative flex items-center justify-between bg-black text-white p-3 text-sm text-center">
//       <span className="mx-auto pl-6">
//         Sign up and get 20% off your first order.{" "}
//         <a href="/signup" className="underline font-semibold">
//           Sign up now!
//         </a>
//       </span>

//       <button
//         onClick={() => setIsVisible(false)}
//         className="cursor-pointer p-1 hover:opacity-70 transition-opacity"
//         aria-label="Close banner"
//       >
//         <img src="src/assets/Cross.svg" alt="Cancel" className="w-4 h-4" />
//       </button>
//     </p>
//   );
// }

// export default PromoBanner;

import { useEffect, useState } from "react";

function PromoBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("ecomm_user") || "null");
    return !storedUser;
  });

  useEffect(() => {
    const updateVisibility = () => {
      const storedUser = JSON.parse(
        localStorage.getItem("ecomm_user") || "null",
      );
      setIsVisible(!storedUser);
    };

    window.addEventListener("storage", updateVisibility);
    window.addEventListener("authchange", updateVisibility);

    return () => {
      window.removeEventListener("storage", updateVisibility);
      window.removeEventListener("authchange", updateVisibility);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative flex items-center justify-between bg-black text-white px-4 py-3 text-xs sm:text-sm text-center">
      <span className="mx-auto pr-2">
        Sign up and get 20% off your first order.{" "}
        <a href="/signup" className="underline font-semibold whitespace-nowrap">
          Sign up now!
        </a>
      </span>

      <button
        onClick={() => setIsVisible(false)}
        className="cursor-pointer p-1 hover:opacity-70 transition-opacity shrink-0"
        aria-label="Close banner"
      >
        <img
          src="src/assets/Cross.svg"
          alt="Cancel"
          className="w-3 h-3 sm:w-4 sm:h-4"
        />
      </button>
    </div>
  );
}

export default PromoBanner;
