import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { BiChevronRight } from "react-icons/bi";
import { NavLink } from "@/constant";
import { CardType, ProductType } from "@/utils/enum";
import { ProductBase } from "@/types/productTypes";
import { useAuth } from "@clerk/clerk-react";

interface NavLinkWithDescription extends NavLink {
  description?: string;
}

const AGE_ORDER = ["6-12", "13-16", "17-19", "20+"];

const CARD_TYPE_FILTERS = [
  {
    id: "S_1",
    label: "Conversation Starter Cards",
    productType: ProductType.MENTOONS_CARDS,
    cardType: CardType.CONVERSATION_STARTER_CARDS,
  },
  {
    id: "S_2",
    label: "Story Re-Teller Cards",
    productType: ProductType.MENTOONS_CARDS,
    cardType: CardType.STORY_RE_TELLER_CARD,
  },
  {
    id: "S_3",
    label: "Silent Stories",
    productType: ProductType.MENTOONS_CARDS,
    cardType: CardType.SILENT_STORIES,
  },
  {
    id: "S_4",
    label: "Conversataion Story Cards",
    productType: ProductType.MENTOONS_CARDS,
    cardType: CardType.CONVERSATION_STORY_CARDS,
  },
  {
    id: "S_5",
    label: "Coloring Books",
    productType: ProductType.MENTOONS_COLORING_BOOKS,
    cardType: undefined as (typeof CardType)[keyof typeof CardType] | undefined,
  },
];

const ageSortValue = (age: string) => {
  const idx = AGE_ORDER.indexOf(age);
  return idx === -1 ? AGE_ORDER.length : idx;
};

const COMIC_FONT = {
  fontFamily: "var(--font-comic)",
  fontWeight: 400,
  letterSpacing: "0.04em",
};

const MENU_BOX =
  "absolute mt-3 z-50 overflow-hidden rounded-xl border-[3px] border-black bg-white shadow-[4px_4px_0_0_#000]";

const TITLE_STRIP = "border-b-[3px] border-black bg-[#fde047] px-4 py-2.5";

const TITLE_TEXT = "text-sm uppercase tracking-wider text-black";

const rowClass = (active: boolean) =>
  `group flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-black transition-colors duration-100 md:py-2.5 ${
    active ? "bg-[#fde047]" : "bg-transparent hover:bg-[#fed7aa]"
  }`;

const Dot = ({ active }: { active: boolean }) => (
  <span
    className={`h-2.5 w-2.5 shrink-0 rounded-full border-2 border-black ${
      active ? "bg-black" : "bg-[#ff9800] group-hover:bg-black"
    }`}
  />
);

let menuProductsCache: ProductBase[] | null = null;
let menuProductsPromise: Promise<ProductBase[]> | null = null;

const loadMenuProducts = async (token: string): Promise<ProductBase[]> => {
  if (menuProductsCache) return menuProductsCache;
  if (menuProductsPromise) return menuProductsPromise;

  menuProductsPromise = axios
    .get<{ data: ProductBase[]; total: number }>(
      `${import.meta.env.VITE_PROD_URL}/products`,
      {
        params: { page: 1, limit: 500, sortBy: "createdAt", order: "desc" },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((res) => {
      menuProductsCache = res.data.data;
      return menuProductsCache;
    })
    .catch((err) => {
      menuProductsPromise = null;
      throw err;
    });

  return menuProductsPromise;
};

const DropDown = ({
  items = [],
  alignLeft,
  isOpen,
  labelType,
}: {
  items: NavLinkWithDescription[];
  alignLeft?: boolean;
  isOpen?: (val: boolean) => void;
  labelType?: "products" | "games" | "workshops" | "joinus";
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getToken } = useAuth();
  const [menuProducts, setMenuProducts] = useState<ProductBase[]>(
    menuProductsCache ?? [],
  );
  const [hoveredAge, setHoveredAge] = useState<string | null>(null);
  const [productsError, setProductsError] = useState(false);

  useEffect(() => {
    if (labelType !== "products") return;
    if (menuProductsCache) {
      setMenuProducts(menuProductsCache);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const token = await getToken();
        const data = await loadMenuProducts(token ?? "");
        if (!cancelled) {
          setMenuProducts(data);
          setProductsError(false);
        }
      } catch (error) {
        console.error("Failed to load products for menu:", error);
        if (!cancelled) setProductsError(true);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [labelType, getToken]);

  const ageProductMap = useMemo(() => {
    if (labelType !== "products") return {} as Record<string, true>;

    const productMap: Record<string, true> = {};

    menuProducts.forEach((product) => {
      const age = product.ageCategory;
      if (!age) return;
      productMap[age] = true;
    });

    return productMap;
  }, [menuProducts, labelType]);

  const availableAges = useMemo(
    () =>
      Object.keys(ageProductMap).sort(
        (a, b) => ageSortValue(a) - ageSortValue(b),
      ),
    [ageProductMap],
  );

  const FIXED_AGE_FILTERS: Record<string, string[]> = {
    "6-12": ["S_1", "S_2", "S_3", "S_4", "S_5"],
    "13-16": ["S_1", "S_2", "S_3", "S_4", "S_5"],
    "17-19": ["S_1", "S_2", "S_3", "S_4", "S_5"],
    "20+": ["S_4"],
  };

  const basePathFor = (type: typeof labelType) => {
    if (type === "products") return "/products";
    if (type === "workshops") return "/mentoons-workshops";
    if (type === "joinus") return "/joinus";
    return "/mentoons-games";
  };

  const basePath = basePathFor(labelType);

  const isItemActive = (label: string) => {
    if (labelType === "joinus") {
      const slug =
        label === "Join as mentor" ? "become-mentor" : label.toLowerCase();
      return location.pathname === `${basePath}/${slug}`;
    }

    if (location.pathname !== basePath) return false;
    const params = new URLSearchParams(location.search);
    return params.get("category")?.toLowerCase() === label.toLowerCase();
  };

  const isAgeActive = (age: string) => {
    if (location.pathname !== basePath) return false;
    const params = new URLSearchParams(location.search);
    return (
      params.get("category") === age &&
      !params.get("productType") &&
      !params.get("cardType")
    );
  };

  const isCardTypeActive = (
    age: string,
    filter: (typeof CARD_TYPE_FILTERS)[number],
  ) => {
    if (location.pathname !== basePath) return false;
    const params = new URLSearchParams(location.search);
    return (
      params.get("category") === age &&
      params.get("productType") === filter.productType &&
      (filter.cardType
        ? params.get("cardType") === filter.cardType
        : !params.get("cardType"))
    );
  };

  const handleClick = (category: string) => {
    if (isOpen) isOpen(false);

    if (labelType === "joinus") {
      if (category === "Join as mentor") {
        navigate(`${basePath}/become-mentor`);
        return;
      }
      navigate(`${basePath}/${category.toLowerCase()}`);
      return;
    }

    if (category === "all") {
      navigate(basePath);
      return;
    }

    navigate(`${basePath}?category=${encodeURIComponent(category)}`);
  };

  const handleAgeClick = (age: string) => {
    if (isOpen) isOpen(false);
    setHoveredAge(null);
    navigate(`${basePath}?category=${encodeURIComponent(age)}#product`);
  };

  const handleAgeCategoryClick = (
    age: string,
    filter: (typeof CARD_TYPE_FILTERS)[number],
  ) => {
    if (isOpen) isOpen(false);
    setHoveredAge(null);

    const parts = [`category=${encodeURIComponent(age)}`];
    parts.push(
      `productType=${encodeURIComponent(filter.productType).replace(/%20/g, "+")}`,
    );
    if (filter.cardType) {
      parts.push(
        `cardType=${encodeURIComponent(filter.cardType).replace(/%20/g, "+")}`,
      );
    }

    navigate(`${basePath}?${parts.join("&")}#product`);
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const tapVariants = {
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  if (labelType === "products") {
    return (
      <div className="relative" style={COMIC_FONT}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`${MENU_BOX} ${
            alignLeft ? "right-0" : "left-0"
          } w-52 md:w-60`}
        >
          <div className={TITLE_STRIP}>
            <h3 className={TITLE_TEXT}>Shop by Age</h3>
          </div>

          <div>
            <motion.div variants={itemVariants} whileTap="tap">
              <motion.button
                variants={tapVariants}
                onClick={() => handleClick("all")}
                className={rowClass(false)}
              >
                <span className="flex items-center gap-3">
                  <Dot active={false} />
                  <span className="text-sm md:text-base">All Products</span>
                </span>
                <BiChevronRight size={18} className="text-black" />
              </motion.button>
            </motion.div>
          </div>

          <div className="border-t-[3px] border-black">
            {menuProducts.length === 0 ? (
              <p className="px-4 py-3 text-xs text-black">
                {productsError
                  ? "Couldn't load ages. Try again."
                  : "Loading..."}
              </p>
            ) : (
              availableAges.map((age) => {
                const filterIds = FIXED_AGE_FILTERS[age] ?? [];
                const filtersForAge = CARD_TYPE_FILTERS.filter((f) =>
                  filterIds.includes(f.id),
                );
                const ageActive = isAgeActive(age);

                return (
                  <div
                    key={age}
                    className="relative z-[99999]"
                    onMouseEnter={() => setHoveredAge(age)}
                    onMouseLeave={() => setHoveredAge(null)}
                  >
                    <motion.div
                      variants={itemVariants}
                      whileTap="tap"
                      className="relative"
                    >
                      <motion.button
                        variants={tapVariants}
                        onClick={() => handleAgeClick(age)}
                        className={rowClass(ageActive || hoveredAge === age)}
                      >
                        <span className="flex items-center gap-3">
                          <Dot active={ageActive || hoveredAge === age} />
                          <span className="text-sm md:text-base">
                            {age === "20+" ? "20+ yrs" : `${age} yrs`}
                          </span>
                        </span>
                        <BiChevronRight size={18} className="text-black" />
                      </motion.button>
                    </motion.div>

                    {filtersForAge.length > 0 && (
                      <div
                        className={`absolute top-0 h-full w-2 ${
                          alignLeft ? "right-full" : "left-full"
                        }`}
                      />
                    )}

                    <AnimatePresence>
                      {hoveredAge === age && filtersForAge.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute top-0 z-50 w-60 overflow-hidden rounded-xl border-[3px] border-black bg-white shadow-[4px_4px_0_0_#000] ${
                            alignLeft ? "right-full" : "left-full"
                          }`}
                        >
                          <div className={TITLE_STRIP}>
                            <h4 className={TITLE_TEXT}>
                              {age === "20+" ? "20+ yrs" : `${age} yrs`}
                            </h4>
                          </div>
                          {filtersForAge.map((filter) => {
                            const active = isCardTypeActive(age, filter);
                            return (
                              <button
                                key={filter.id}
                                onClick={() =>
                                  handleAgeCategoryClick(age, filter)
                                }
                                className={`${rowClass(active)} text-sm`}
                              >
                                {filter.label}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative" style={COMIC_FONT}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`${MENU_BOX} ${
          alignLeft ? "right-0" : "left-0"
        } w-48 md:w-56`}
      >
        <div className={TITLE_STRIP}>
          <h3 className={TITLE_TEXT}>{labelType}</h3>
        </div>

        <div>
          {items.map((data, index) => {
            let sideLine = "";
            if (labelType === "workshops") {
              if (data.label === "Instant Katha") sideLine = "Storytelling";
              else if (data.label === "Hasyaras") sideLine = "Laughter";
              else if (data.label === "KalaKriti") sideLine = "Art";
              else if (data.label === "Music Therapy") sideLine = "Music";
            }

            const active = isItemActive(data.label);

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileTap="tap"
                className="relative"
              >
                <motion.button
                  variants={tapVariants}
                  onClick={() => handleClick(data.label)}
                  className={rowClass(active)}
                >
                  <span className="flex items-center gap-3">
                    <Dot active={active} />

                    <span className="flex flex-col">
                      <span className="text-sm md:text-base">{data.label}</span>

                      {sideLine && (
                        <span className="text-xs text-black/70">
                          {sideLine}
                        </span>
                      )}
                    </span>
                  </span>

                  <BiChevronRight size={18} className="text-black" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        <div className="border-t-[3px] border-black bg-[#fed7aa] px-4 py-2">
          <p className="text-center text-xs text-black">
            {items.length} {items.length === 1 ? "option" : "options"} available
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DropDown;
