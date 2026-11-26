export interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  usageImages?: string[];
  order?: number;
  category: string;
  description?: string;
  inStock: boolean;
  featured?: boolean;
  rating?: number;
  numReviews?: number;
  reviews?: any[];
}

export const fallbackProducts: Product[] = [
  {
    "id": "6a475b7c5036748a377cee33",
    "_id": "6a475b7c5036748a377cee33",
    "name": "Premium Wooden Storage Crate",
    "price": 1495,
    "originalPrice": 1943,
    "category": "Home Decor",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061371/kaashtacrafts_products/nhnjmqqjkhiphdjj1mfe.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061371/kaashtacrafts_products/nhnjmqqjkhiphdjj1mfe.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061372/kaashtacrafts_products/nkauqlqdhsvbwbp9crdv.jpg"
    ],
    "description": "Handcrafted premium wooden storage crate made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a475bf45036748a377cee60",
    "_id": "6a475bf45036748a377cee60",
    "name": "Premium Wooden Kitchen Utensil Set",
    "price": 798,
    "originalPrice": 1037,
    "category": "Kitchen",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061491/kaashtacrafts_products/qpjwlxbpmdznbti2pli1.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061491/kaashtacrafts_products/qpjwlxbpmdznbti2pli1.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061492/kaashtacrafts_products/ovefgwgqkjtbcboqr1dc.jpg"
    ],
    "description": "Handcrafted premium wooden kitchen utensil set made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a475c40d1d2bcd103944e37",
    "_id": "6a475c40d1d2bcd103944e37",
    "name": "Premium Wooden Serving Set",
    "price": 999,
    "originalPrice": 1298,
    "category": "Kitchen",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061568/kaashtacrafts_products/uaev0mvvm7llelal0grx.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061568/kaashtacrafts_products/uaev0mvvm7llelal0grx.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061568/kaashtacrafts_products/vbhvbwjpivzuvno0a4j7.jpg"
    ],
    "description": "Handcrafted premium wooden serving set made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a475c81a14b8a0ceb741ceb",
    "_id": "6a475c81a14b8a0ceb741ceb",
    "name": "Premium Wooden Kitchen Essentials Set",
    "price": 1299,
    "originalPrice": 1688,
    "category": "Kitchen",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061632/kaashtacrafts_products/tmdzsivfef6t4n4rnf7o.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061632/kaashtacrafts_products/tmdzsivfef6t4n4rnf7o.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061632/kaashtacrafts_products/fmgfvcxouy6q6y4vkuwz.jpg"
    ],
    "description": "Handcrafted premium wooden kitchen essentials set made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a475ca5a14b8a0ceb741cfa",
    "_id": "6a475ca5a14b8a0ceb741cfa",
    "name": "Premium Olive Wood Kitchen Utensil Set",
    "price": 1599,
    "originalPrice": 2078,
    "category": "Kitchen",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061668/kaashtacrafts_products/rq2xfziagcyeys2ixq8l.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061668/kaashtacrafts_products/rq2xfziagcyeys2ixq8l.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061668/kaashtacrafts_products/fdwhr9o6wihhrphtksdj.jpg"
    ],
    "description": "Handcrafted premium olive wood kitchen utensil set made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a475ce96d6a66ab443b80ea",
    "_id": "6a475ce96d6a66ab443b80ea",
    "name": "Premium Wooden Cutting & Serving Board Set",
    "price": 1499,
    "originalPrice": 1948,
    "category": "Kitchen",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061736/kaashtacrafts_products/ejlz0nlpm7hx14cw3zxz.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061736/kaashtacrafts_products/ejlz0nlpm7hx14cw3zxz.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061737/kaashtacrafts_products/dprb0nlta9erfwscywhg.jpg"
    ],
    "description": "Handcrafted premium wooden cutting & serving board set made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a475d33afee11183e1501d4",
    "_id": "6a475d33afee11183e1501d4",
    "name": "Premium Wooden Serving Bowl Set",
    "price": 899,
    "originalPrice": 1168,
    "category": "Kitchen",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061810/kaashtacrafts_products/aykqrjdfyluajrfncfap.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061810/kaashtacrafts_products/aykqrjdfyluajrfncfap.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783061811/kaashtacrafts_products/zlzi460cfd1h0h3aev3p.jpg"
    ],
    "description": "Handcrafted premium wooden serving bowl set made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a475e65625d54aec10a93af",
    "_id": "6a475e65625d54aec10a93af",
    "name": "Premium Bamboo Mobile Phone Stand",
    "price": 499,
    "originalPrice": 648,
    "category": "Desk Accessories",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062116/kaashtacrafts_products/p6zmszatq9el2fabgjkr.png",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062116/kaashtacrafts_products/p6zmszatq9el2fabgjkr.png",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062117/kaashtacrafts_products/shgr7cqyshj0aiymshem.png"
    ],
    "description": "Handcrafted premium bamboo mobile phone stand made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a475eeeedb0086a37c49ad8",
    "_id": "6a475eeeedb0086a37c49ad8",
    "name": "Premium Foldable Bamboo Phone Stand",
    "price": 799,
    "originalPrice": 1038,
    "category": "Desk Accessories",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062253/kaashtacrafts_products/zsw2clvd7vfx8bteergo.png",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062253/kaashtacrafts_products/zsw2clvd7vfx8bteergo.png",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062254/kaashtacrafts_products/thvcquvydr5mngy6l9ag.png"
    ],
    "description": "Handcrafted premium foldable bamboo phone stand made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a475f8aafee11183e150270",
    "_id": "6a475f8aafee11183e150270",
    "name": "Premium Bamboo Desktop Phone Stand",
    "price": 799,
    "originalPrice": 1038,
    "category": "Desk Accessories",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062409/kaashtacrafts_products/molnm41rqoi4icnh4ttn.png",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062409/kaashtacrafts_products/molnm41rqoi4icnh4ttn.png",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062410/kaashtacrafts_products/yljybnpdvqepg9tdlirw.png"
    ],
    "description": "Handcrafted premium bamboo desktop phone stand made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a476002b9ef13797940501f",
    "_id": "6a476002b9ef13797940501f",
    "name": "Premium Wooden Wall Clock",
    "price": 999,
    "originalPrice": 1298,
    "category": "Home Decor",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062529/kaashtacrafts_products/husan02jcmbnzifliau5.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062529/kaashtacrafts_products/husan02jcmbnzifliau5.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062529/kaashtacrafts_products/okabp2yjeulh4urgrs01.jpg"
    ],
    "description": "Handcrafted premium wooden wall clock made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a476035afee11183e15029c",
    "_id": "6a476035afee11183e15029c",
    "name": "Handcrafted Wooden Plant Stand",
    "price": 2999,
    "originalPrice": 3898,
    "category": "Home Decor",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062580/kaashtacrafts_products/te7g5mpwotlr9f3tm1up.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062580/kaashtacrafts_products/te7g5mpwotlr9f3tm1up.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062580/kaashtacrafts_products/uvlvxfykohk6yphoeoc0.jpg"
    ],
    "description": "Handcrafted handcrafted wooden plant stand made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a476061afee11183e1502b0",
    "_id": "6a476061afee11183e1502b0",
    "name": "Wooden Wall Art (Tree of Life)",
    "price": 2499,
    "originalPrice": 3248,
    "category": "Home Decor",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062624/kaashtacrafts_products/jxwxsh7s5p75rk578wn7.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062624/kaashtacrafts_products/jxwxsh7s5p75rk578wn7.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062625/kaashtacrafts_products/vb5n4mefhatacu0fadl5.jpg"
    ],
    "description": "Handcrafted wooden wall art (tree of life) made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a4760981b3364d7984fc9df",
    "_id": "6a4760981b3364d7984fc9df",
    "name": "Premium Wooden Table Lamp",
    "price": 1999,
    "originalPrice": 2598,
    "category": "Home Decor",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062679/kaashtacrafts_products/cjx7airfsoxxbadxnqi8.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062679/kaashtacrafts_products/cjx7airfsoxxbadxnqi8.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062680/kaashtacrafts_products/vrlehebrbuqfuxpsscir.jpg"
    ],
    "description": "Handcrafted premium wooden table lamp made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a4760d0b9ef13797940504b",
    "_id": "6a4760d0b9ef13797940504b",
    "name": "Wooden Candle Holder Set",
    "price": 899,
    "originalPrice": 1168,
    "category": "Home Decor",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062735/kaashtacrafts_products/o6vpbx8mwvsdlgw0tbda.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062735/kaashtacrafts_products/o6vpbx8mwvsdlgw0tbda.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062736/kaashtacrafts_products/b63idvn6bqlbefjkuj8p.jpg"
    ],
    "description": "Handcrafted wooden candle holder set made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a47615eedb0086a37c49b69",
    "_id": "6a47615eedb0086a37c49b69",
    "name": "Premium Wooden Pen Stand",
    "price": 499,
    "originalPrice": 648,
    "category": "Stationery",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062877/kaashtacrafts_products/zz2iipokk7gdad0oqqk5.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062877/kaashtacrafts_products/zz2iipokk7gdad0oqqk5.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062877/kaashtacrafts_products/spz5hqjbszw4q5sac11a.jpg"
    ],
    "description": "Handcrafted premium wooden pen stand made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a47618bafee11183e150327",
    "_id": "6a47618bafee11183e150327",
    "name": "Wooden Desk Organizer",
    "price": 999,
    "originalPrice": 1298,
    "category": "Stationery",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062922/kaashtacrafts_products/ki1yls6tkje4nbqufvtd.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062922/kaashtacrafts_products/ki1yls6tkje4nbqufvtd.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062922/kaashtacrafts_products/rsowfxfaish2km9lfcjn.jpg"
    ],
    "description": "Handcrafted wooden desk organizer made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a4761c5625d54aec10a9485",
    "_id": "6a4761c5625d54aec10a9485",
    "name": "Wooden Book Stand",
    "price": 799,
    "originalPrice": 1038,
    "category": "Stationery",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062981/kaashtacrafts_products/clsumciwo63xgdzohbri.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062981/kaashtacrafts_products/clsumciwo63xgdzohbri.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783062981/kaashtacrafts_products/xp9cnehx4y8sp09lklpz.jpg"
    ],
    "description": "Handcrafted wooden book stand made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a476209d7456ab18fe18903",
    "_id": "6a476209d7456ab18fe18903",
    "name": "Wooden Business Card Holde",
    "price": 399,
    "originalPrice": 518,
    "category": "Stationery",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783063048/kaashtacrafts_products/wumdvlfakkawhdnd4q3j.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783063048/kaashtacrafts_products/wumdvlfakkawhdnd4q3j.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783063049/kaashtacrafts_products/fmr7yzzc7mh23dpq4kax.jpg"
    ],
    "description": "Handcrafted wooden business card holde made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  },
  {
    "id": "6a47625bd7456ab18fe18924",
    "_id": "6a47625bd7456ab18fe18924",
    "name": "Wooden Magazine Holder",
    "price": 999,
    "originalPrice": 1298,
    "category": "Stationery",
    "image": "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783063130/kaashtacrafts_products/erc9x5uzmjf7gzpllt8t.jpg",
    "images": [
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783063130/kaashtacrafts_products/erc9x5uzmjf7gzpllt8t.jpg",
      "https://res.cloudinary.com/dqvzgegxj/image/upload/v1783063131/kaashtacrafts_products/fabkf5wlbyjpnkgjocsx.jpg"
    ],
    "description": "Handcrafted wooden magazine holder made with premium wood. Designed with elegance and longevity in mind.",
    "inStock": true,
    "featured": false,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  }
];

export const products = fallbackProducts;
