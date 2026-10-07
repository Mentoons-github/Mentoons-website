import { CardType, ProductType } from "@/utils/enum";
import { useNavigate } from "react-router-dom";

const PopularProducts = () => {
  const products = [
    {
      name: "Conversation Starter Cards",
      imageUrl: "/assets/mythos/about/mythos-conversation-starter-cards.png",
      meta: "Age: 6-12, 13-16, 17-19 yrs",
      originalPrice: "₹199",
      discountedPrice: "₹99",
      discountLabel: "50% off",
      url: `/products?productType=${ProductType.MENTOONS_CARDS}&cardType=${CardType.CONVERSATION_STARTER_CARDS}#product`,
    },
    {
      name: "Story Re-teller Cards",
      imageUrl: "/assets/mythos/about/mythos-story-reteller-cards.png",
      meta: "Age: 6-12, 13-16, 17-19 yrs",
      originalPrice: "₹199",
      discountedPrice: "₹99",
      discountLabel: "50% off",
      url: `/products?productType=${ProductType.MENTOONS_CARDS}&cardType=${CardType.STORY_RE_TELLER_CARD}#product`,
    },
    {
      name: "Silent Stories",
      imageUrl:
        "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/Silent+stories+6-12.png",
      meta: "Age: 6-12, 13-16, 17-19 yrs",
      originalPrice: "₹199",
      discountedPrice: "₹99",
      discountLabel: "50% off",
      url: `/products?productType=${ProductType.MENTOONS_CARDS}&cardType=${CardType.SILENT_STORIES}#product`,
    },
    {
      name: "Conversation Story Cards",
      imageUrl:
        "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/Conversation_Story_Cards_20%2B/Conversation+Story+Cards+20%2B.png",
      meta: "Age: 6-12, 13-16, 17-19 yrs",
      originalPrice: "₹199",
      discountedPrice: "₹99",
      discountLabel: "50% off",
      url: `/products?productType=${ProductType.MENTOONS_CARDS}&cardType=${CardType.CONVERSATION_STORY_CARDS}#product`,
    },
    // {
    //   name: "Podcasts",
    //   imageUrl: "/assets/mythos/about/mythos-podcasts.png",
    //   meta: "8-12 Yrs   13-16 Yrs",
    //   discountedPrice: "Rs.99/-",
    //   url: `/products?productType=${ProductType.MENTOONS_PODCASTS}#product`,
    // },
  ];

  const navigate = useNavigate();

  return (
    <section className="py-20 px-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-semibold text-neutral-900">
          Check out our Popular Products
        </h2>

        <a
          href="#"
          className="text-sm text-neutral-500 flex items-center gap-1 hover:text-neutral-800"
        >
          View All Products <span aria-hidden>&rarr;</span>
        </a>
      </div>

      <div className="grid w-full gap-8 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {products.map((p) => (
          <div
            key={p.name}
            onClick={() => navigate(p.url)}
            className="relative w-full flex flex-col gap-4 border border-neutral-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition"
          >
            {p.discountLabel && (
              <span className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-sm font-semibold px-2.5 py-1 rounded">
                {p.discountLabel}
              </span>
            )}

            {/* Product Image */}
            <div className="w-full h-56 bg-neutral-200 flex items-center justify-center overflow-hidden">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Card Content */}
            <div className="flex flex-col gap-4 p-5">
              <p className="text-lg font-semibold text-neutral-800">{p.name}</p>

              <p className="text-sm text-neutral-500 leading-relaxed">
                {p.meta}
              </p>

              <div className="flex items-center gap-2">
                {p.originalPrice && (
                  <span className="text-base text-neutral-400 line-through">
                    {p.originalPrice}
                  </span>
                )}
                <span className="text-lg font-semibold text-neutral-700">
                  {p.discountedPrice}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(p.url);
                }}
                className="w-full border border-orange-500 bg-orange-500 text-white font-semibold rounded-md px-3 py-2.5 text-base hover:bg-orange-600 hover:border-orange-600 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularProducts;
