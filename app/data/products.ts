export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description?: string;
  inStock: boolean;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Minimalist Mobile Stand",
    price: 499,
    originalPrice: 699,
    image: "/product_1.png",
    category: "Desk Accessories",
    description: "Keep your workspace tidy with this elegant handcrafted wooden mobile stand. Designed for both form and function, it holds your phone at the perfect angle for video calls and notifications.",
    inStock: true,
    featured: true,
  },
  {
    id: "p2",
    name: "Executive Desk Organizer",
    price: 1299,
    originalPrice: 1599,
    image: "/product_2.png",
    category: "Office",
    description: "A premium desk organizer crafted from high-quality wood. Features compartments for pens, paper clips, sticky notes, and a built-in slot for your smartphone or tablet.",
    inStock: true,
    featured: true,
  },
  {
    id: "p3",
    name: "Classic Pen Holder",
    price: 349,
    originalPrice: 499,
    image: "/product_3.png",
    category: "Stationery",
    description: "Add a touch of nature to your desk with this classic cylindrical wooden pen holder. Hand-polished to a smooth finish, it accommodates pens, pencils, and markers beautifully.",
    inStock: true,
    featured: true,
  },
  {
    id: "p4",
    name: "Artisan Chopping Board",
    price: 899,
    originalPrice: 1199,
    image: "/product_4.png",
    category: "Kitchen",
    description: "A robust and beautiful wooden chopping board. Made from sustainable hardwood, it's gentle on knives and doubles as a stunning serving platter for cheeses and charcuterie.",
    inStock: true,
    featured: false,
  },
  {
    id: "p5",
    name: "Premium Coaster Set",
    price: 599,
    image: "/product_5.png",
    category: "Home Decor",
    description: "Protect your surfaces in style with this set of 4 premium wooden coasters. They come with a matching wooden holder and feature natural grain patterns.",
    inStock: true,
    featured: false,
  },
  {
    id: "p6",
    name: "Minimalist Wall Clock",
    price: 1999,
    originalPrice: 2499,
    image: "/product_6.png",
    category: "Home Decor",
    description: "A statement piece for any room. This minimalist wooden wall clock features a silent sweeping mechanism, clean lines, and an elegant natural finish.",
    inStock: true,
    featured: true,
  }
];
