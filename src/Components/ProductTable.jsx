import React, { useEffect, useState } from "react";
import ProductFilters from "./ProductFilters";

const getDefaultFilterOptions = () => {
  return {
    price: [
      { minValue: 0, maxValue: 25, label: "$0 - $25", checked: false },
      { minValue: 25, maxValue: 50, label: "$25 - $50", checked: false },
      { minValue: 50, maxValue: 75, label: "$50 - $75", checked: false },
      {
        minValue: 75,
        maxValue: Number.MAX_VALUE,
        label: "$75+",
        checked: false,
      },
    ],
    color: [
      { value: "beige", label: "Beige", checked: false },
      { value: "green", label: "Green", checked: false },
      { value: "white", label: "White", checked: false },
      { value: "black", label: "Black", checked: false },
      { value: "gray", label: "Gray", checked: false },
      { value: "teal", label: "Teal", checked: false },
    ],
  };
};

const getDefaultSortOptions = () => {
  return [
    { name: "Price", current: false },
    { name: "Newest", current: false },
  ];
};

export default function ProductTable({ cart, updateCart, open, setOpen }) {
  let [products, setProducts] = useState([]);

  const [filterOptions, setFilterOptions] = useState(getDefaultFilterOptions());
  const [sortOptions, setSortOptions] = useState(getDefaultSortOptions());
  useEffect(() => {
    let fetchProducts = async () => {
      let res = await fetch("http://localhost:3001/products");
      let body = await res.json();

      let filteredList = [];
      let priceOptions = filterOptions.price.filter((item) => item.checked);
      let colorOptions = filterOptions.color
        .filter((item) => item.checked)
        .map((item) => {
          return item.value;
        });

      if (priceOptions.length > 0 || colorOptions.length > 0) {
        let min = priceOptions[0]?.minValue || Number.MIN_VALUE;
        let max =
          priceOptions[priceOptions.length - 1]?.maxValue || Number.MAX_VALUE;
        filteredList = body.filter((item) => {
          if (colorOptions.length > 0) {
            return (
              item.price >= min &&
              item.price <= max &&
              colorOptions.includes(item.color)
            );
          } else {
            return item.price >= min && item.price <= max;
          }
        });

        setProducts(filteredList);
      } else {
        setProducts(body);
      }
    };

    fetchProducts();
  }, [filterOptions]);

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <ProductFilters
          {...{
            filterOptions,
            setFilterOptions,
            sortOptions,
            setSortOptions,
            setProducts,
          }}
        />

        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.length > 0 &&
            products.map((product) => (
              <a key={product.id} className="group overflow-hidden ">
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg xl:aspect-w-7 xl:aspect-h-8 transition-transform overflow-hidden">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="w-full h-full object-center object-cover scale transition-all duration-500 group-hover:scale-110 "
                  />
                  <button
                    type="button"
                    className="hidden group-hover:block group-hover:opacity-50 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black"
                    onClick={() => {
                      let newCart = cart.slice();

                      if (!newCart.includes(product)) {
                        product.quantity = 1;
                        newCart.push(product);
                      } else {
                        newCart.map((p) => {
                          if (p.id === product.id) {
                            p.quantity += 1;
                          }
                        });
                      }
                      localStorage.setItem(
                        "shoppingCart",
                        JSON.stringify(newCart)
                      );
                      updateCart(newCart);
                    }}
                  >
                    Add To Cart
                  </button>
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  ${product.price}
                </p>
              </a>
            ))}
          {products.length <= 0 && (
            <h3 className="text-2xl text-center col-span-full">
              0 Products Found
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}
