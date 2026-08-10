// import { useState, useEffect } from "react";

// export default function UserCards() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("https://fakestoreapi.com/products")
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         setProducts(data);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-10 px-4 sm:px-6 lg:px-10 font-['Integral_CF']">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-10 text-center">
//           <span className="mb-3 inline-block text-5xl uppercase tracking-[0.35em] ">
//             Top Products
//           </span>
//         </div>

//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           {products
//             .sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))
//             .slice(0, 4)
//             .map((product) => {
//               const price = Number(product.price || 0);
//               const rating = product.rating?.rate ?? 0;
//               const ratingCount = product.rating?.count ?? 0;

//               return (
//                 <div
//                   key={product.id}
//                   className="overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 max-h-100"
//                 >
//                   <div className="mb-6 rounded-[28px] bg-[#F0EEED] p-6 text-center">
//                     <img
//                       src={product.image || product.imageUrl}
//                       alt={product.title}
//                       className="mx-auto h-52 w-auto object-contain"
//                     />
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <h2 className="truncate width-full text-lg font-semibold text-slate-900">
//                         {product.title}
//                       </h2>
//                     </div>

//                     <div className="flex items-center gap-2 text-sm text-amber-500">
//                       <span className="ml-2">
//                         {"★".repeat(Math.round(rating))}
//                       </span>
//                       <span className="text-slate-500">
//                         {rating.toFixed(1)}/5
//                       </span>
//                       <span className="text-slate-400">({ratingCount})</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//         </div>

//         <div className="mt-10 flex justify-center">
//           <button className="w-70 h-15 rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
//             View All
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProductImageUrl } from "../../utils/media.js";

export default function UserCards() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-10 font-['Integral_CF']">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block text-3xl sm:text-5xl uppercase tracking-[0.15em] sm:tracking-[0.35em] font-bold">
            Top Products
          </span>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {products
            .sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))
            .slice(0, 4)
            .map((product) => {
              const price = Number(product.price || 0);
              const rating = product.rating?.rate ?? 0;
              const ratingCount = product.rating?.count ?? 0;

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="block overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="mb-4 rounded-[28px] bg-[#F0EEED] p-6 flex items-center justify-center h-64">
                    <img
                      src={getProductImageUrl(product)}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="space-y-2 px-1">
                    <div>
                      <h2 className="truncate w-full text-base sm:text-lg font-semibold text-slate-900">
                        {product.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-amber-500">
                      <span className="text-base">
                        {"★".repeat(Math.round(rating))}
                      </span>
                      <span className="text-slate-500 font-sans">
                        {rating.toFixed(1)}/5
                      </span>
                      <span className="text-slate-400 font-sans">
                        ({ratingCount})
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>

        <div className="mt-10 flex justify-center">
          <button className="w-full sm:w-70 h-14 rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
            View All
          </button>
        </div>
      </div>
    </div>
  );
}
