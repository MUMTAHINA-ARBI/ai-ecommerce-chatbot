// data/products.ts
export const products = [
  {
    id: 1,
    name: "Nike Dri-FIT Running T-Shirt",
    category: "tshirt",
    price: 25,
    sizes: ["M", "L", "XL"], // ❌ "S" is intentionally missing (Out of stock test)
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400"
  },
  {
    id: 2,
    name: "Adidas Falcon Running Shoes",
    category: "shoes",
    price: 65,
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
  },
  {
    id: 3,
    name: "Puma Marathon Running Shorts",
    category: "pants",
    price: 30,
    sizes: ["S", "L"], // ❌ "M" is intentionally missing (Out of stock test)
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400"
  },
  {
    id: 4,
    name: "Under Armour ColdGear Running Joggers",
    category: "pants",
    price: 50,
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=400"
  },
  {
    id: 5,
    name: "Brooks Windbreaker Running Jacket",
    category: "jacket",
    price: 75,
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=400"
  }
];