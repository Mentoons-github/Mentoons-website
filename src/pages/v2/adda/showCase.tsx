import React, { useState, useMemo, useEffect } from "react";
import {
  Heart,
  Trophy,
  Calendar,
  TrendingUp,
  Filter,
  Search,
  Award,
  Users,
  Clock,
} from "lucide-react";

interface ContestEntry {
  id: number;
  name: string;
  imageUrl: string;
  uploadDate: string;
  votes: number;
  category: string;
  color: "red" | "blue" | "green" | "orange" | "yellow";
}

const ContestVotingPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<"votes" | "date" | "name">("votes");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [votedImages, setVotedImages] = useState<Set<number>>(new Set());
  const [showVoteAnimation, setShowVoteAnimation] = useState<number | null>(
    null
  );

  const [entries, setEntries] = useState<ContestEntry[]>([
    {
      id: 1,
      name: "Priya Sharma",
      imageUrl:
        "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=400&fit=crop",
      uploadDate: "2024-11-20",
      votes: 142,
      category: "Geometric",
      color: "red",
    },
    {
      id: 2,
      name: "Arjun S R",
      imageUrl:
        "https://images.unsplash.com/photo-1620503374956-c942862f0372?w=400&h=400&fit=crop",
      uploadDate: "2024-11-19",
      votes: 198,
      category: "Floral",
      color: "blue",
    },
    {
      id: 3,
      name: "Ananya Patel",
      imageUrl:
        "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&h=400&fit=crop",
      uploadDate: "2024-11-21",
      votes: 89,
      category: "Traditional",
      color: "green",
    },
    {
      id: 4,
      name: "Rohan Malhotra",
      imageUrl:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
      uploadDate: "2024-11-18",
      votes: 234,
      category: "Abstract",
      color: "orange",
    },
    {
      id: 5,
      name: "Kavya Iyer",
      imageUrl:
        "https://images.unsplash.com/photo-1620503374956-c942862f0372?w=400&h=400&fit=crop",
      uploadDate: "2024-11-20",
      votes: 167,
      category: "Spiritual",
      color: "yellow",
    },
    {
      id: 6,
      name: "Vikram Singh",
      imageUrl:
        "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=400&fit=crop",
      uploadDate: "2024-11-17",
      votes: 103,
      category: "Geometric",
      color: "red",
    },
    {
      id: 7,
      name: "Neha Gupta",
      imageUrl:
        "https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=400&h=400&fit=crop",
      uploadDate: "2024-11-22",
      votes: 76,
      category: "Contemporary",
      color: "blue",
    },
    {
      id: 8,
      name: "Aditya Kumar",
      imageUrl:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
      uploadDate: "2024-11-16",
      votes: 189,
      category: "Floral",
      color: "green",
    },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("contestVotes");
    if (saved) {
      setVotedImages(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("contestVotes", JSON.stringify([...votedImages]));
  }, [votedImages]);

  const categories = useMemo<string[]>(() => {
    const cats = entries.map((e) => e.category);
    return ["all", ...Array.from(new Set(cats))];
  }, [entries]);

  const handleVote = (id: number) => {
    if (votedImages.has(id)) return;

    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, votes: e.votes + 1 } : e))
    );
    setVotedImages((prev) => new Set(prev).add(id));
    setShowVoteAnimation(id);
    setTimeout(() => setShowVoteAnimation(null), 1000);
  };

  const filteredAndSortedEntries = useMemo(() => {
    let result = [...entries];

    if (searchTerm) {
      result = result.filter((e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      result = result.filter((e) => e.category === filterCategory);
    }

    if (sortBy === "votes") {
      result.sort((a, b) => b.votes - a.votes);
    } else if (sortBy === "date") {
      result.sort(
        (a, b) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [entries, sortBy, filterCategory, searchTerm]);

  const topThree = useMemo(() => {
    return [...entries].sort((a, b) => b.votes - a.votes).slice(0, 3);
  }, [entries]);

  const totalVotes = useMemo(() => {
    return entries.reduce((sum, e) => sum + e.votes, 0);
  }, [entries]);

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateStr: string): string => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  const getColorClasses = (color: ContestEntry["color"]) => {
    const map = {
      red: { bg: "bg-red-50", ring: "ring-red-200", badge: "bg-red-500" },
      blue: { bg: "bg-blue-50", ring: "ring-blue-200", badge: "bg-blue-500" },
      green: {
        bg: "bg-green-50",
        ring: "ring-green-200",
        badge: "bg-green-500",
      },
      orange: {
        bg: "bg-orange-50",
        ring: "ring-orange-200",
        badge: "bg-orange-500",
      },
      yellow: {
        bg: "bg-yellow-50",
        ring: "ring-yellow-200",
        badge: "bg-yellow-500",
      },
    };
    return map[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <Award className="text-purple-600" size={36} />
                Showcase
              </h1>
              <p className="text-gray-600">
                Vote for your favorite mandala artworks! Contest ends in 5 days.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-purple-100 px-3 py-2 rounded-lg">
                <Users size={18} className="text-purple-600" />
                <span className="font-semibold">{entries.length} Entries</span>
              </div>
              <div className="flex items-center gap-2 bg-pink-100 px-3 py-2 rounded-lg">
                <Heart size={18} className="text-pink-600" />
                <span className="font-semibold">{totalVotes} Votes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-purple-100">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-yellow-500" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">Top Artworks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topThree.map((entry, index) => {
              const colors = getColorClasses(entry.color);
              return (
                <div
                  key={entry.id}
                  className={`relative group ${index === 0 ? "md:-mt-4" : ""}`}
                >
                  <div
                    className={`absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold z-10 shadow-lg ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : "bg-orange-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div
                    className={`${colors.bg} rounded-xl p-4 shadow-lg transition-transform duration-300 group-hover:scale-105 ring-2 ${colors.ring}`}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      <img
                        src={entry.imageUrl}
                        alt={entry.name}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    </div>
                    <p className="font-bold text-lg text-gray-800">
                      {entry.name}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-red-500 font-bold">
                        <Heart size={18} fill="currentColor" />
                        <span>{entry.votes}</span>
                      </div>
                      <span
                        className={`text-xs ${colors.badge} text-white px-2 py-1 rounded-full`}
                      >
                        {entry.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by artist name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("votes")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                  sortBy === "votes"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <TrendingUp size={18} />
                Popular
              </button>
              <button
                onClick={() => setSortBy("date")}
                className={`flex-1 flex items-center justify-center gap-2 px-­4 py-3 rounded-lg font-medium transition ${
                  sortBy === "date"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Calendar size={18} />
                Newest
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-bold text-purple-600">
              {filteredAndSortedEntries.length}
            </span>{" "}
            of {entries.length} entries
          </p>
          {(searchTerm || filterCategory !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("all");
              }}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedEntries.map((entry) => {
            const isTopThree = topThree.some((t) => t.id === entry.id);
            const hasVoted = votedImages.has(entry.id);
            const topThreeIndex = topThree.findIndex((t) => t.id === entry.id);
            const colors = getColorClasses(entry.color);

            return (
              <div
                key={entry.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group ${
                  isTopThree ? "ring-4 ring-yellow-400 ring-offset-2" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={entry.imageUrl}
                    alt={entry.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {showVoteAnimation === entry.id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="animate-ping bg-red-500 rounded-full w-20 h-20 opacity-75"></div>
                      <Heart
                        className="absolute text-red-500 animate-bounce"
                        size={40}
                        fill="currentColor"
                      />
                    </div>
                  )}

                  {isTopThree && topThreeIndex >= 0 && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                      <Trophy size={16} />
                      Top {topThreeIndex + 1}
                    </div>
                  )}

                  <div
                    className={`absolute top-3 left-3 ${colors.badge} text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg`}
                  >
                    {entry.category}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    {entry.name}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{getTimeAgo(entry.uploadDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{formatDate(entry.uploadDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full transition-colors ${
                          hasVoted ? "bg-red-100" : "bg-gray-100"
                        }`}
                      >
                        <Heart
                          size={22}
                          className={
                            hasVoted
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400"
                          }
                        />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-gray-800">
                          {entry.votes}
                        </span>
                        <p className="text-xs text-gray-500">votes</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleVote(entry.id)}
                      disabled={hasVoted}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                        hasVoted
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-xl transform hover:scale-105"
                      }`}
                    >
                      {hasVoted ? (
                        <>
                          <Heart size={18} fill="currentColor" />
                          Voted
                        </>
                      ) : (
                        <>
                          <Heart size={18} />
                          Vote
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAndSortedEntries.length === 0 && (
          <div className="text-center py-20">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No entries found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      <div className="bg-white border-t mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-orange-600">
                {entries.length}
              </p>
              <p className="text-gray-600 mt-1">Total Entries</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-600">{totalVotes}</p>
              <p className="text-gray-600 mt-1">Total Votes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {categories.length - 1}
              </p>
              <p className="text-gray-600 mt-1">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">
                {votedImages.size}
              </p>
              <p className="text-gray-600 mt-1">Your Votes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestVotingPage;
