export const placeholders = [
    "Search for Comics...",
    "Search for Audio Comics...",
    "Search for Podcast...",
    "Search for Moral Stories...",
    "Search for 6-12 years...",
    "Search for 13-14 years...",
    "Search for Workshops...",
  ];
  export const date = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date());


  export const cardsCategory = [
    {
      image:'/assets/cards/6-12.png',
      category:'6-12 years',
    },
    {
      image:'/assets/cards/13-19.png',
      category:'13-19 years',
    },
    {
      image:'/assets/cards/20+.png',
      category:'20+ years',
    }
  ]
