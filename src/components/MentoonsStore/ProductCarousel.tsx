import React from "react";
import Slider from "react-slick";
import ProductCard, { ProductDetail } from "./ProductCard"; // Adjust the import based on your file structure

const ProductCarousel: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const dummyProducts: ProductDetail[] = [
    {
      _id: "1",
      productTitle: "Mystery of the Lost Treasure",
      productCategory: "Comics",
      productSummary:
        "Join our hero on an adventure to uncover hidden treasures.",
      minAge: 10,
      maxAge: 15,
      ageFilter: "10-15",
      rating: "4.5",
      paperEditionPrice: "299",
      printablePrice: "199",
      productImages: [
        { imageSrc: "/assets/products/product1.jpg" },
        { imageSrc: "/assets/products/product1-2.jpg" },
      ],
      productVideos: [{ videoSrc: "/assets/videos/product1.mp4" }],
      productDescription: [
        {
          label: "Description",
          descriptionList: [
            {
              description:
                "An exciting comic that takes you on a journey through time.",
            },
          ],
        },
      ],
      productReview: [
        { id: "1", quote: "A thrilling read!", author: "John Doe" },
        { id: "2", quote: "Loved the illustrations!", author: "Jane Smith" },
      ],
    },
    {
      _id: "2",
      productTitle: "The Adventures of Space Explorers",
      productCategory: "Posters",
      productSummary:
        "A stunning poster that captures the beauty of the universe.",
      minAge: 5,
      maxAge: 12,
      ageFilter: "5-12",
      rating: "4.8",
      paperEditionPrice: "499",
      printablePrice: "399",
      productImages: [
        { imageSrc: "/assets/products/product2.jpg" },
        { imageSrc: "/assets/products/product2-2.jpg" },
      ],
      productVideos: [],
      productDescription: [
        {
          label: "Description",
          descriptionList: [
            { description: "A beautiful poster for space enthusiasts." },
          ],
        },
      ],
      productReview: [
        { id: "1", quote: "Perfect for my room!", author: "Alice Johnson" },
      ],
    },
    {
      _id: "3",
      productTitle: "Dinosaur Adventure",
      productCategory: "Cards",
      productSummary: "A fun card game featuring various dinosaurs.",
      minAge: 7,
      maxAge: 14,
      ageFilter: "7-14",
      rating: "4.7",
      paperEditionPrice: "199",
      printablePrice: "149",
      productImages: [
        { imageSrc: "/assets/products/product3.jpg" },
        { imageSrc: "/assets/products/product3-2.jpg" },
      ],
      productVideos: [],
      productDescription: [
        {
          label: "Description",
          descriptionList: [{ description: "An engaging card game for kids." }],
        },
      ],
      productReview: [
        { id: "1", quote: "My kids love it!", author: "Mark Brown" },
      ],
    },
  ];

  return (
    <div className="p-4">
      <Slider {...settings}>
        {dummyProducts.map((product) => (
          <div key={product._id} className="px-2">
            <ProductCard productDetails={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
