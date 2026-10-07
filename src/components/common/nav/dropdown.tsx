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

    // Build query string manually so spaces become literal spaces
    // (matching ?category=6-12&productType=mentoons+cards&cardType=story+re-teller+card)
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

  const hoverVariants = {
    hover: {
      scale: 1.02,
      x: 8,
      backgroundColor: "#f8fafc",
      borderLeftColor: "#3b82f6",
      borderLeftWidth: "4px",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  if (labelType === "products") {
    return (
      <div className="relative font-akshar">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`absolute ${
            alignLeft ? "right-0" : "left-0"
          } mt-3 w-52 md:w-60 bg-white shadow-2xl z-50 rounded-xl overflow-hidden border border-gray-100 backdrop-blur-sm`}
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Shop by Age
            </h3>
          </div>

          <div className="md:py-2">
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.button
                variants={hoverVariants}
                onClick={() => handleClick("all")}
                className="w-full px-4 py-2 md:py-3 text-left transition-all duration-200 flex items-center justify-between group border-l-4 border-transparent hover:border-blue-500"
              >
                <span className="text-gray-700 text-sm md:text-base font-medium group-hover:text-gray-900">
                  All Products
                </span>
                <BiChevronRight
                  size={18}
                  className="text-gray-400 group-hover:text-blue-500"
                />
              </motion.button>
            </motion.div>
          </div>

          <div className="md:py-2 border-t border-gray-100">
            {menuProducts.length === 0 ? (
              <p className="px-4 py-3 text-xs text-gray-400">
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
                console.log("[DropDown] age row:", {
                  age,
                  hoveredAge,
                  isThisAgeHovered: hoveredAge === age,
                  filterIds,
                  filtersForAge: filtersForAge.map((f) => f.label),
                });

                return (
                  <div
                    key={age}
                    className="relative group/age z-[99999]"
                    onMouseEnter={() => {
                      console.log("ENTER", age);
                      setHoveredAge(age);
                    }}
                    onMouseLeave={() => {
                      console.log("LEAVE", age);
                      setHoveredAge(null);
                    }}
                  >
                    <motion.div
                      variants={itemVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="group relative"
                    >
                      <motion.button
                        variants={hoverVariants}
                        onClick={() => handleAgeClick(age)}
                        className={`w-full px-4 py-2 md:py-3 text-left transition-all duration-200 flex items-center justify-between group border-l-4 ${
                          ageActive
                            ? "border-blue-500 bg-blue-50/60"
                            : "border-transparent hover:border-blue-500"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
                          <span
                            className={`text-sm md:text-base font-medium transition-colors duration-200 ${
                              ageActive
                                ? "text-blue-600 font-semibold"
                                : "text-gray-700 group-hover:text-gray-900"
                            }`}
                          >
                            {age === "20+" ? "20+ yrs" : `${age} yrs`}
                          </span>
                        </div>
                        <BiChevronRight
                          size={18}
                          className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                        />
                      </motion.button>
                    </motion.div>

                    {/* Invisible bridge: closes the gap between the age
                        row and the flyout submenu so the mouse doesn't
                        leave the hover zone while moving sideways. */}
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
                          className={`absolute top-0 ${
                            alignLeft ? "right-full" : "left-full"
                          } w-56 bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 z-50`}
                          style={{
                            background:
                              "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                            boxShadow:
                              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          }}
                        >
                          <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                                className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 border-l-4 ${
                                  active
                                    ? "border-blue-500 bg-blue-50/60 text-blue-600 font-semibold"
                                    : "border-transparent text-gray-700 hover:bg-gray-50 hover:border-blue-500"
                                }`}
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
    <div className="relative font-akshar">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`absolute ${
          alignLeft ? "right-0" : "left-0"
        } mt-3 w-48 md:w-56 bg-white shadow-2xl z-50 rounded-xl overflow-hidden border border-gray-100 backdrop-blur-sm`}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {labelType}
          </h3>
        </div>

        <div className="md:py-2">
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
                whileHover="hover"
                whileTap="tap"
                className="group relative"
              >
                <motion.button
                  variants={hoverVariants}
                  onClick={() => handleClick(data.label)}
                  className={`w-full px-4 py-2 md:py-3 text-left transition-all duration-200 flex items-center justify-between group border-l-4 ${
                    active
                      ? "border-blue-500 bg-blue-50/60"
                      : "border-transparent hover:border-blue-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 transition-opacity duration-200 ${
                        active
                          ? "opacity-100"
                          : "opacity-60 group-hover:opacity-100"
                      }`}
                    ></div>

                    <span className="flex flex-col">
                      <span
                        className={`text-sm md:text-base font-medium transition-colors duration-200 ${
                          active
                            ? "text-blue-600 font-semibold"
                            : "text-gray-700 group-hover:text-gray-900"
                        }`}
                      >
                        {data.label}
                      </span>

                      {sideLine && (
                        <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                          {sideLine}
                        </span>
                      )}
                    </span>
                  </div>

                  <motion.div
                    className={`transition-colors duration-200 ${
                      active
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-blue-500"
                    }`}
                    animate={{ x: 0 }}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  >
                    <BiChevronRight size={18} />
                  </motion.div>
                </motion.button>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 rounded-lg mx-2"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            );
          })}
        </div>

        <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            {items.length} {items.length === 1 ? "option" : "options"} available
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DropDown;
