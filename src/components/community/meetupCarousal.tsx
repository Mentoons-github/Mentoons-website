import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Star,
  Users,
  MapPin,
  Monitor,
} from "lucide-react";
import { useState } from "react";

export interface MeetupFormValues {
  title: string;
  date: string;
  time: string;
  duration: string;
  maxCapacity: number;
  platform: string;
  meetingLink: string;
  place: string;
  description: string;
  detailedDescription: string;
  speakerName: string;
  speakerImage: File | null | string;
  speakerImageUrl: string | null;
  topics: string;
  tags: string;
  isOnline: boolean;
  dateTime?: string;
}

interface MeetupCarouselProps {
  currentMeetup: MeetupFormValues | undefined;
  currentMeetups: MeetupFormValues[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  active: "offline" | "online";
}

const MeetupCarousel: React.FC<MeetupCarouselProps> = ({
  currentMeetup,
  currentMeetups,
  currentIndex,
  setCurrentIndex,
  active,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const parseTopics = (topicsString: string | undefined | null): string[] => {
    if (typeof topicsString !== "string" || !topicsString) {
      return [];
    }
    return topicsString
      .split(",")
      .map((topic) => topic.trim())
      .filter((topic) => topic.length > 0);
  };

  const parseTags = (tagsString: string | undefined | null): string[] => {
    if (typeof tagsString !== "string" || !tagsString) {
      return [];
    }
    return tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  const getMockParticipants = (maxCapacity: number) =>
    Math.floor(Math.random() * maxCapacity);
  const getMockSpeakerRating = () => (4.0 + Math.random() * 1.0).toFixed(1);
  const getMockDifficulty = () => {
    const difficulties = ["Beginner", "Intermediate", "Advanced"];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  const formatDateTime = (
    dateTime?: string,
    date?: string,
    time?: string
  ): string => {
    try {
      let dateObj: Date;
      if (dateTime) {
        dateObj = new Date(dateTime);
      } else if (date && time) {
        dateObj = new Date(`${date} ${time}`);
      } else {
        return "Date not available";
      }

      if (isNaN(dateObj.getTime())) {
        return "Date not available";
      }

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(dateObj);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date not available";
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === currentMeetups.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? currentMeetups.length - 1 : prevIndex - 1
    );
  };

  const handleRegisterClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ name: "", email: "", phone: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration submitted:", formData);
    handleModalClose();
  };

  if (currentMeetups.length === 0 || currentIndex >= currentMeetups.length) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
        <p className="text-gray-600 text-lg font-medium">
          No meetups available at this time.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Check back later for upcoming events!
        </p>
      </div>
    );
  }

  if (!currentMeetup) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
        <p className="text-gray-600 text-lg font-medium">
          Loading meetup details...
        </p>
      </div>
    );
  }

  const topicsArray = parseTopics(currentMeetup.topics);
  const tagsArray = parseTags(currentMeetup.tags);
  const participants = getMockParticipants(currentMeetup.maxCapacity);
  const speakerRating = getMockSpeakerRating();
  const difficulty = getMockDifficulty();

  return (
    <div className="relative">
      <div className="relative bg-white rounded-2xl shadow-xl">
        <button
          onClick={prevSlide}
          className="absolute top-1/3 -left-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transform -translate-y-1/2 z-20 transition-all duration-300 ease-in-out hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/3 -right-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transform -translate-y-1/2 z-20 transition-all duration-300 ease-in-out hover:scale-110"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
        <div className="grid md:grid-cols-3 gap-0">
          <div className="md:col-span-2 p-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {currentMeetup.title.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {currentMeetup.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        difficulty === "Beginner"
                          ? "bg-green-100 text-green-700"
                          : difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {difficulty}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{speakerRating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
                  <Users className="w-4 h-4 mr-2" />
                  {participants}/{currentMeetup.maxCapacity}
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              {currentMeetup.detailedDescription || currentMeetup.description}
            </p>
            <div className="bg-white rounded-lg p-5 mb-6 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  {currentMeetup.speakerImage ? (
                    <img
                      src={currentMeetup.speakerImage as string}
                      alt={currentMeetup.speakerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white font-bold">
                      {currentMeetup.speakerName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-lg">
                    {currentMeetup.speakerName}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">Expert Speaker</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700">
                        {speakerRating}/5
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      • Expert Rating
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">
                    🎯 Your speaker for this meetup:
                  </span>{" "}
                  {currentMeetup.speakerName} will be conducting this session,
                  bringing expertise and insights to help you learn effectively.
                </p>
              </div>
            </div>
            {/* Topics */}
            {topicsArray.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  What you'll learn:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {topicsArray.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm font-medium shadow-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <div className="font-medium">
                    {formatDateTime(
                      currentMeetup.dateTime,
                      currentMeetup.date,
                      currentMeetup.time
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Date & Time</div>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-green-500" />
                <div>
                  <div className="font-medium">{currentMeetup.duration}</div>
                  <div className="text-sm text-gray-500">Duration</div>
                </div>
              </div>
              <div className="flex items-center text-gray-700 col-span-2">
                {active === "online" ? (
                  <Monitor className="w-5 h-5 mr-3 text-purple-500" />
                ) : (
                  <MapPin className="w-5 h-5 mr-3 text-red-500" />
                )}
                <div>
                  <div className="font-medium">
                    {active === "online"
                      ? currentMeetup.platform
                      : currentMeetup.place}
                  </div>
                  <div className="text-sm text-gray-500">
                    {active === "online" ? "Online Platform" : "Venue"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Section - Tags & Action */}
          <div className="p-8 bg-white">
            {tagsArray.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tagsArray.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Event Details
              </h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">
                    {currentMeetup.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="font-medium">
                    {currentMeetup.maxCapacity} people
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span className="font-medium text-green-600">
                    {currentMeetup.maxCapacity - participants} spots
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleRegisterClick}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Register Now
            </button>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Limited seats • {currentMeetup.maxCapacity - participants} spots
                left
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6 space-x-3">
        {currentMeetups.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 ease-in-out ${
              index === currentIndex
                ? "w-8 h-3 bg-blue-500 rounded-full"
                : "w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Register for {currentMeetup.title}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetupCarousel;
