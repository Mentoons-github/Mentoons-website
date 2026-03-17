import {
  FaBalanceScale,
  FaExclamationCircle,
  FaHandsHelping,
  FaMobileAlt,
  FaShieldAlt,
  FaSmile,
  FaUserFriends,
} from "react-icons/fa";
import { FaBook, FaBrain, FaComments, FaHeart, FaUsers } from "react-icons/fa6";

export const LandingColors = [
  "#22C55E", // green
  "#EF4444", // red
  "#EAB308", // yellow
  "#F97316", // orange
  "#3B82F6", // blue
];

export const LandingItems = [
  {
    title: "Workshops 6-12",
    url: "/mentoons-workshops?category=Instant%20Katha",
  },
  {
    title: "Workshops 13-19",
    url: "/mentoons-workshops?category=Instant%20Katha",
  },
  { title: "Products 6-12", url: "/products?category=6-12" },
  { title: "Products 13-16", url: "/products?category=13-16" },
  { title: "Products 17-19", url: "/products?category=17-19" },
  { title: "Products 20+", url: "/products?category=20%2B" },
  { title: "Audio Comics", url: "/mentoons-comics?option=audio+comic" },
  { title: "E-Comics", url: "/mentoons-comics?option=comic" },
  { title: "Blogs", url: "/adda" },
];

export const LandingIssues = [
  {
    title: "Academic Distraction",
    text: "Lack of focus on studies due to excessive usage of gadgets and social media.",
    icon: <FaMobileAlt />,
    iconColor: "#6366F1",
  },
  {
    title: "Social Balance",
    text: "Difficulty balancing social media with real-life interactions.",
    icon: <FaUsers />,
    iconColor: "#14B8A6",
  },
  {
    title: "Family Bonding",
    text: "Decreased family bonding and limited quality family time.",
    icon: <FaHeart />,
    iconColor: "#EC4899",
  },
  {
    title: "Friendship Challenges",
    text: "Depending on online friends rather than building real friendships.",
    icon: <FaUserFriends />,
    iconColor: "#F59E0B",
  },
  {
    title: "Emotional Disconnect",
    text: "Reduced emotional interaction between parents and children.",
    icon: <FaBrain />,
    iconColor: "#8B5CF6",
  },
  {
    title: "Digital Addiction",
    text: "Dependence on gadgets and social media causing addictive behaviour.",
    icon: <FaExclamationCircle />,
    iconColor: "#06B6D4",
  },
];

export const LandingAchievements = [
  {
    title: "Balanced Lifestyle",
    text: "Well balanced kids who excel both culturally and digitally.",
    icon: <FaBalanceScale />,
    color: "#6366F1",
  },
  {
    title: "Better Academic Focus",
    text: "Kids with higher IQ and improved study focus.",
    icon: <FaBook />,
    color: "#10B981",
  },
  {
    title: "Real Friendships",
    text: "Strong friendships and respectful behaviour towards parents.",
    icon: <FaUserFriends />,
    color: "#3B82F6",
  },
  {
    title: "Emotional Intelligence",
    text: "Mindful kids with gratitude and emotional bonding.",
    icon: <FaSmile />,
    color: "#EC4899",
  },
  {
    title: "Reduced Gadget Dependency",
    text: "Less dependence on gadgets and social media.",
    icon: <FaMobileAlt />,
    color: "#F59E0B",
  },
  {
    title: "Open Communication",
    text: "Better parent-child interaction and openness.",
    icon: <FaComments />,
    color: "#8B5CF6",
  },
];

export const LandingResults = [
  {
    title: "Safe Kids",
    text: "Protection from online predators and unsafe digital environments.",
    icon: <FaShieldAlt />,
    color: "#22C55E",
  },
  {
    title: "Digital De-Addiction",
    text: "Support to overcome gaming, gambling and social media addiction.",
    icon: <FaMobileAlt />,
    color: "#F97316",
  },
  {
    title: "Better Study Focus",
    text: "Improved academic focus with early goal setting.",
    icon: <FaBook />,
    color: "#6366F1",
  },
];

export const LandingParentPoints = [
  {
    title: "Balanced & Fullfilling life",
    icon: <FaHandsHelping />,
    color: "bg-indigo-100 text-indigo-600",
    text: "As parents ourselves, we understand the challenges you face in today's digital age. We have experienced the same struggles and have successfully guided numerous families towards a balanced & fulfilling life.",
  },
  {
    title: "Guidance & Support",
    icon: <FaHeart />,
    color: "bg-pink-100 text-pink-500",
    text: "You can trust us to provide the guidance and support you need to overcome these challenges.",
  },
  {
    title: "Helping for success",
    icon: <FaUsers />,
    color: "bg-teal-100 text-teal-600",
    text: "Our team & psychologists are dedicated to helping you and your child succeed.",
  },
];

export const LandingCommunities = [
  {
    name: "Parents",
    icon: <FaUsers />,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    name: "Laughter",
    icon: <FaSmile />,
    color: "bg-yellow-100 text-yellow-500",
  },
  {
    name: "Storytelling",
    icon: <FaBook />,
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Music",
    icon: <FaHeart />,
    color: "bg-pink-100 text-pink-500",
  },
  {
    name: "Psychologists",
    icon: <FaBrain />,
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Teachers",
    icon: <FaHandsHelping />,
    color: "bg-teal-100 text-teal-600",
  },
];
