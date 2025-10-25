import { useState } from "react";
import {
  Share2,
  MapPin,
  Briefcase,
  IndianRupee,
  Search,
  X,
  Mail,
  MessageCircle,
  Linkedin,
  Twitter,
  Copy,
  Check,
} from "lucide-react";

const JobReferralPortal = () => {
  const [shareModal, setShareModal] = useState({ isOpen: false, job: null });
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const jobs = [
    {
      id: 1,
      title: "Clinical Psychologist",
      company: "MindWell Healthcare",
      location: "Mumbai, Maharashtra",
      type: "Full-time",
      salary: "₹6,00,000 - ₹10,00,000",
      reward: "₹25,000",
      tags: ["CBT", "Counseling", "Mental Health", "Clinical Assessment"],
      department: "Healthcare",
      logo: "M",
    },
    {
      id: 2,
      title: "Vedic Astrologer",
      company: "Jyotish Kendra",
      location: "Varanasi, Uttar Pradesh",
      type: "Full-time",
      salary: "₹4,00,000 - ₹8,00,000",
      reward: "₹20,000",
      tags: ["Vedic Astrology", "Horoscope", "Kundli", "Consultation"],
      department: "Spiritual",
      logo: "J",
    },
    {
      id: 3,
      title: "Digital Illustrator",
      company: "Creative Studio India",
      location: "Bangalore, Karnataka",
      type: "Full-time",
      salary: "₹5,00,000 - ₹9,00,000",
      reward: "₹22,000",
      tags: [
        "Adobe Illustrator",
        "Digital Art",
        "Character Design",
        "Procreate",
      ],
      department: "Design",
      logo: "C",
    },
    {
      id: 4,
      title: "Content Creator (Hindi)",
      company: "Desi Content Hub",
      location: "Delhi NCR",
      type: "Full-time",
      salary: "₹4,50,000 - ₹7,50,000",
      reward: "₹20,000",
      tags: ["Video Production", "Social Media", "Hindi Content", "Editing"],
      department: "Media",
      logo: "D",
    },
    {
      id: 5,
      title: "Ayurvedic Doctor",
      company: "Wellness Ayurveda",
      location: "Pune, Maharashtra",
      type: "Full-time",
      salary: "₹5,50,000 - ₹9,50,000",
      reward: "₹25,000",
      tags: ["BAMS", "Panchakarma", "Herbal Medicine", "Consultation"],
      department: "Healthcare",
      logo: "W",
    },
    {
      id: 6,
      title: "Graphic Designer",
      company: "BrandCraft India",
      location: "Hyderabad, Telangana",
      type: "Full-time",
      salary: "₹4,00,000 - ₹7,00,000",
      reward: "₹20,000",
      tags: ["Photoshop", "Illustrator", "Branding", "UI Design"],
      department: "Design",
      logo: "B",
    },
    {
      id: 7,
      title: "Yoga Instructor",
      company: "Pranayama Wellness Center",
      location: "Rishikesh, Uttarakhand",
      type: "Full-time",
      salary: "₹3,50,000 - ₹6,00,000",
      reward: "₹18,000",
      tags: ["Hatha Yoga", "Ashtanga", "Meditation", "Pranayama"],
      department: "Wellness",
      logo: "P",
    },
    {
      id: 8,
      title: "Social Media Manager",
      company: "Digital Marketing Pro",
      location: "Chennai, Tamil Nadu",
      type: "Full-time",
      salary: "₹5,00,000 - ₹8,50,000",
      reward: "₹22,000",
      tags: ["Instagram", "Facebook", "Content Strategy", "Analytics"],
      department: "Marketing",
      logo: "D",
    },
    {
      id: 9,
      title: "Nutritionist & Dietitian",
      company: "HealthFirst Clinic",
      location: "Jaipur, Rajasthan",
      type: "Full-time",
      salary: "₹4,50,000 - ₹7,50,000",
      reward: "₹20,000",
      tags: ["Diet Planning", "Nutrition", "Weight Management", "Clinical"],
      department: "Healthcare",
      logo: "H",
    },
  ];

  const stats = [
    { label: "Jobs Shared", value: "18" },
    { label: "Referrals Hired", value: "7" },
    { label: "Total Earned", value: "₹1,40,000" },
    { label: "Pending Reviews", value: "4" },
  ];

  const openShareModal = (job) => {
    setShareModal({ isOpen: true, job });
    setCopied(false);
  };

  const closeShareModal = () => {
    setShareModal({ isOpen: false, job: null });
    setCopied(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `https://careers.company.in/ref/EMP${Math.floor(Math.random() * 10000)}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareVia = (platform) => {
    const { job } = shareModal;
    const link = `https://careers.company.in/ref/EMP${Math.floor(
      Math.random() * 10000
    )}`;
    const message = `Check out this opportunity: ${job.title} at ${job.company}! ${link}`;

    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      email: `mailto:?subject=${encodeURIComponent(
        job.title + " at " + job.company
      )}&body=${encodeURIComponent(message)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        link
      )}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        message
      )}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || job.department === selectedDepartment;
    const matchesLocation =
      !selectedLocation || job.location.includes(selectedLocation);
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3">Job Referral Program</h1>
            <p className="text-lg text-orange-50">
              Share opportunities with your network and earn rewards
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white shadow-md border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-orange-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Jobs
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Job title, company..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition"
              >
                <option value="">All Departments</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Design">Design</option>
                <option value="Media">Media</option>
                <option value="Spiritual">Spiritual</option>
                <option value="Wellness">Wellness</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition"
              >
                <option value="">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500 overflow-hidden group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {job.logo}
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                    {job.reward}
                  </div>
                </div>

                {/* Job Info */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition">
                  {job.title}
                </h3>
                <p className="text-orange-600 font-semibold mb-4">
                  {job.company}
                </p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Briefcase className="w-4 h-4 mr-2 text-orange-500" />
                    {job.type}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <IndianRupee className="w-4 h-4 mr-2 text-orange-500" />
                    {job.salary}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => openShareModal(job)}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-amber-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-600 transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Job
                  </button>
                  <button className="px-4 py-3 border-2 border-orange-500 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {shareModal.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeShareModal}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Share Job Opening
                  </h2>
                  <p className="text-gray-600">
                    Share this opportunity and earn{" "}
                    <span className="font-bold text-orange-600">
                      {shareModal.job.reward}
                    </span>{" "}
                    when your referral gets hired!
                  </p>
                </div>
                <button
                  onClick={closeShareModal}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Job Details */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl mb-6 border-2 border-orange-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {shareModal.job.title}
                </h3>
                <p className="text-orange-600 font-semibold">
                  {shareModal.job.company}
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    {shareModal.job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-orange-500" />
                    {shareModal.job.salary}
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Share via:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    name: "WhatsApp",
                    icon: MessageCircle,
                    platform: "whatsapp",
                    color: "bg-green-500",
                  },
                  {
                    name: "Email",
                    icon: Mail,
                    platform: "email",
                    color: "bg-blue-500",
                  },
                  {
                    name: "LinkedIn",
                    icon: Linkedin,
                    platform: "linkedin",
                    color: "bg-blue-700",
                  },
                  {
                    name: "Twitter",
                    icon: Twitter,
                    platform: "twitter",
                    color: "bg-sky-500",
                  },
                ].map((option) => (
                  <button
                    key={option.platform}
                    onClick={() => shareVia(option.platform)}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-md transition"
                  >
                    <div
                      className={`${option.color} p-3 rounded-full text-white`}
                    >
                      <option.icon className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-700">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Referral Link */}
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Your Referral Link:
              </h3>
              <div className="flex gap-3 bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <input
                  type="text"
                  value={`https://careers.company.in/ref/EMP${Math.floor(
                    Math.random() * 10000
                  )}`}
                  readOnly
                  className="flex-1 bg-transparent text-gray-600 outline-none"
                />
                <button
                  onClick={copyLink}
                  className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-600 transition flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobReferralPortal;
