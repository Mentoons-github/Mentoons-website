import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  BarChart3,
  ShieldCheck,
  Users,
  Heart,
  Grid2x2,
  User,
  UserRound,
  Search,
  ChevronDown,
  Tag,
  FileText,
  ArrowUpDown,
  Clock,
  ArrowRight,
  Users2,
  History,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ProductType } from "@/utils/enum";
import {
  AgeCategory,
  AssessmentProduct,
  ProductBase,
} from "@/types/productTypes";

const features = [
  { icon: BarChart3, label: "Quick & Easy" },
  { icon: ShieldCheck, label: "Research Based" },
  { icon: Users, label: "Personalized Insights" },
  { icon: Heart, label: "Support Growth" },
];

const tabs = [
  { id: "all", label: "All Assessments", icon: Grid2x2 },
  { id: "children", label: "For Children (6 - 12 yrs)", icon: User },
  { id: "teens", label: "For Teens (13 - 19 yrs)", icon: UserRound },
  { id: "parents", label: "For Parents", icon: Users },
];

const filters = [
  { label: "Age Group", icon: Users2 },
  { label: "Category", icon: Tag },
  { label: "Format", icon: FileText },
  { label: "Sort by", icon: ArrowUpDown },
];

const tabAgeCategories: Record<string, AgeCategory[]> = {
  children: [AgeCategory.CHILD],
  teens: [AgeCategory.TEEN, AgeCategory.YOUNG_ADULT],
  parents: [AgeCategory.PARENTS],
};

interface AssessmentHistoryItem {
  _id: string;
  assessmentTitle: string;
  ageCategory?: string;
  score?: number;
  totalQuestions?: number;
  status: "started" | "completed";
  completedAt: string;
  product?: {
    _id: string;
    title: string;
    productImages?: { imageUrl: string }[];
  };
}

const AssessmentPage = ({
  activeTab,
  onTabChange,
}: {
  activeTab?: string;
  onTabChange?: (id: string) => void;
}) => {
  const [internalTab, setInternalTab] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const current = activeTab ?? internalTab;

  const { getToken } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products } = useSelector((state: RootState) => state.products);

  const handleTabClick = (id: string) => {
    setInternalTab(id);
    onTabChange?.(id);
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = (await getToken()) || "";
        await dispatch(
          fetchProducts({
            type: ProductType.ASSESSMENT,
            token,
          }),
        ).unwrap();
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load assessments",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, [dispatch, getToken]);

  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);
      const token = (await getToken()) || "";

      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/assessment-history`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 5 },
        },
      );

      setHistory(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching assessment history:", err);
      setHistoryError("Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredProducts = products.filter((product) => {
    const allowedAgeCategories = tabAgeCategories[current];
    const matchesTab =
      current === "all" ||
      (allowedAgeCategories &&
        allowedAgeCategories.includes(product.ageCategory));

    const matchesSearch = product.title
      ?.toLowerCase()
      .includes(search.trim().toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleStartAssessment = (product: ProductBase) => {
    navigate(`/assessment-questions`, {
      state: {
        questionGallery:
          (product.details as AssessmentProduct["details"])?.questionGallery ||
          [],
        assessment: product.title,
        productId: product._id,
        ageCategory: product.ageCategory,
      },
    });
  };

  return (
    <section className="w-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 px-6 md:px-10 pt-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold leading-snug text-gray-900">
            Small Assessments
            <br />
            Big Insights
          </h1>
          <p className="mt-3 text-gray-500 text-sm md:text-base max-w-md">
            Help children, teens and parents understand emotions, behaviours and
            strengths with simple assessments.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col gap-2">
                <Icon size={20} className="text-gray-700" strokeWidth={1.75} />
                <span className="text-xs font-medium text-gray-700 leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-56 md:h-64 flex items-center justify-center">
          <img
            src="/assets/v3/assessment/assessment.png"
            alt="banner-img"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="mt-8 px-6 md:px-10 pb-6">
        <div className="flex flex-wrap items-stretch w-full gap-4 overflow-hidden">
          {tabs.map(({ id, label, icon: Icon }, i) => {
            const isActive = current === id;
            return (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                className={`flex-1 flex flex-col items-center justify-center border border-gray-200 rounded-xl gap-2 px-6 py-6 text-base font-semibold text-black ${
                  isActive ? "bg-gray-100" : "bg-white"
                } ${i !== 0 ? "border-l border-gray-200" : ""}`}
              >
                <Icon size={30} className="text-black" strokeWidth={1.75} />
                <span className="text-black">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px] flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3">
            <Search size={18} className="text-gray-400" strokeWidth={1.75} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assessments..."
              className="w-full text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            />
          </div>

          {filters.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700"
            >
              <Icon size={16} className="text-gray-500" strokeWidth={1.75} />
              {label}
              <ChevronDown
                size={16}
                className="text-gray-400"
                strokeWidth={1.75}
              />
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="w-full text-center py-16">
                <div className="w-12 h-12 border-4 border-gray-100 rounded-full animate-spin border-t-gray-900 mx-auto"></div>
                <p className="mt-4 text-sm text-gray-500 font-medium">
                  Loading assessments...
                </p>
              </div>
            ) : error ? (
              <div className="w-full text-center py-16">
                <AlertCircle
                  size={40}
                  className="mx-auto text-red-500 mb-4"
                  strokeWidth={1.5}
                />
                <p className="text-red-600 text-sm font-semibold mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 bg-gray-900 text-white text-sm rounded-lg font-medium"
                >
                  Retry
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="w-full text-center py-16">
                <Inbox
                  size={40}
                  className="mx-auto text-gray-300 mb-4"
                  strokeWidth={1.5}
                />
                <p className="text-gray-600 text-sm font-medium">
                  No assessments available right now
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Try a different filter or check back later
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const details =
                    product.details as AssessmentProduct["details"];
                  return (
                    <div
                      key={product._id}
                      className="border border-gray-200 rounded-xl overflow-hidden flex flex-col"
                    >
                      <div className="relative bg-gray-100 h-44 overflow-hidden flex items-center justify-center">
                        <img
                          src={
                            product.productImages?.[0]?.imageUrl ||
                            "/placeholder-image.jpg"
                          }
                          alt={product.title}
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute top-3 right-3 flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-1 text-xs text-gray-600">
                          <Clock size={12} strokeWidth={1.75} />
                          {details?.duration
                            ? `${details.duration} mins`
                            : "N/A"}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {product.title}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs font-medium text-gray-600 border border-gray-200 rounded-full px-3 py-1">
                            {product.ageCategory || "N/A"}
                          </span>
                          {details?.difficulty && (
                            <span className="text-xs font-medium text-gray-600 border border-gray-200 rounded-full px-3 py-1">
                              {details.difficulty}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleStartAssessment(product)}
                          className="mt-auto flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-semibold rounded-lg px-4 py-2.5"
                        >
                          Start Assessment
                          <ArrowRight size={16} strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 border border-gray-200 rounded-xl p-5 flex flex-col">
            <h2 className="text-base font-semibold text-gray-900">
              Assessment History
            </h2>

            {historyLoading ? (
              <div className="flex-1 flex items-center justify-center py-10">
                <div className="w-8 h-8 border-4 border-gray-100 rounded-full animate-spin border-t-gray-900"></div>
              </div>
            ) : historyError ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-10">
                <AlertCircle
                  size={28}
                  className="text-red-400"
                  strokeWidth={1.5}
                />
                <p className="text-xs text-red-500">{historyError}</p>
              </div>
            ) : history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-10">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <History
                    size={20}
                    className="text-gray-400"
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    No history yet
                  </p>
                  <p className="mt-1 text-xs text-gray-400 max-w-[200px]">
                    Assessments you complete will show up here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex-1 flex flex-col gap-3 overflow-y-auto max-h-[420px]">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start gap-3 border border-gray-100 rounded-lg p-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <History
                        size={16}
                        className="text-gray-500"
                        strokeWidth={1.75}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.assessmentTitle}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(item.completedAt).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </p>
                      {typeof item.score === "number" && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Score: {item.score}
                          {item.totalQuestions
                            ? ` / ${item.totalQuestions}`
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              disabled={history.length === 0}
              className={`mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2.5 text-sm font-semibold ${
                history.length === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-900 text-gray-900"
              }`}
            >
              View All History
              <ArrowRight size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssessmentPage;
