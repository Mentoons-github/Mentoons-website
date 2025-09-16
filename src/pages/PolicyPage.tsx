import { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiShield,
  FiUser,
  FiAlertTriangle,
  FiInfo,
  FiMail,
  FiFileText,
  FiEdit3,
} from "react-icons/fi";
import { FaCopyright } from "react-icons/fa6";

const PolicyPage = () => {
  const sections = [
    {
      title: "Introduction",
      icon: <FiInfo className="w-6 h-6" />,
      content:
        "These Terms and Conditions govern your use of our website and services. By accessing or using our services, you agree to abide by these terms in full. We strive to provide you with the best possible experience while ensuring compliance with all applicable laws and regulations.",
      highlight: "Welcome to our platform",
    },
    {
      title: "User Responsibilities",
      icon: <FiUser className="w-6 h-6" />,
      content:
        "As a user, you are responsible for maintaining the confidentiality of your account, ensuring that any information provided is accurate, and refraining from any unlawful activities while using our services. This includes keeping your login credentials secure and notifying us immediately of any unauthorized access.",
      highlight: "Your account, your responsibility",
    },
    {
      title: "Prohibited Activities",
      icon: <FiAlertTriangle className="w-6 h-6" />,
      content:
        "Users are prohibited from engaging in activities that are harmful to the website, violate any laws, or infringe on the rights of others. This includes spamming, distributing malware, attempting to bypass security measures, harassment, or any form of illegal content distribution.",
      highlight: "Keep it clean and legal",
    },
    {
      title: "Intellectual Property",
      icon: <FaCopyright className="w-6 h-6" />,
      content:
        "All content and materials available on this website are protected by intellectual property laws. Unauthorized use of any material, including images, logos, and text, is strictly prohibited. We respect intellectual property rights and expect our users to do the same.",
      highlight: "Respect creative works",
    },
    {
      title: "Disclaimer of Warranties",
      icon: <FiShield className="w-6 h-6" />,
      content:
        "Our services are provided 'as is' without any guarantees or warranties of any kind. We disclaim all liability for any damages arising from the use or inability to use our services. While we strive for excellence, we cannot guarantee uninterrupted or error-free service.",
      highlight: "No guarantees, but we try our best",
    },
    {
      title: "Limitation of Liability",
      icon: <FiFileText className="w-6 h-6" />,
      content:
        "We are not liable for any damages, including direct, indirect, incidental, or consequential damages, that arise from your use of the website or services, even if we have been advised of the possibility of such damages. Our liability is limited to the maximum extent permitted by law.",
      highlight: "Legal protection for all parties",
    },
    {
      title: "Changes to Terms",
      icon: <FiEdit3 className="w-6 h-6" />,
      content:
        "We reserve the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on this page. We encourage users to review the terms periodically and will notify users of significant changes via email or prominent site notices.",
      highlight: "Terms may evolve over time",
    },
    {
      title: "Contact Us",
      icon: <FiMail className="w-6 h-6" />,
      content:
        "If you have any questions or concerns regarding these Terms and Conditions, please don't hesitate to contact us at info@mentoons.com. Our team is here to help clarify any aspects of these terms and address your concerns promptly.",
      highlight: "We're here to help",
    },
  ];

  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const getSectionColor = (index: number) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-red-500 to-orange-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
      "from-indigo-500 to-purple-500",
      "from-pink-500 to-rose-500",
      "from-teal-500 to-cyan-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-yellow-300/20 to-pink-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-gradient-to-r from-pink-300/20 to-blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>

        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-gradient-to-r from-blue-400/30 to-purple-400/30 transform rotate-45 animate-float"></div>
        <div className="absolute top-3/4 left-1/3 w-6 h-6 bg-gradient-to-r from-pink-400/30 to-red-400/30 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-gradient-to-r from-green-400/30 to-teal-400/30 transform rotate-12 animate-float animation-delay-3000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-8 lg:px-16 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl mb-4 mx-auto animate-pulse">
              <FiShield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-800 via-orange-700 to-yellow-700 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Please take a moment to review our terms and conditions. We've
            designed them to be clear, fair, and transparent.
          </p>
          <div className="mt-8 inline-block">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-6 py-3 border-2 border-blue-200 shadow-lg">
              <span className="text-blue-700 font-semibold">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Sections */}
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden transition-all duration-500 ${
                  expandedSection === index
                    ? "ring-4 ring-blue-300/50 shadow-2xl transform scale-[1.02]"
                    : ""
                }`}
              >
                {/* Gradient Border Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${getSectionColor(
                    index
                  )} opacity-10 pointer-events-none`}
                ></div>

                {/* Section Header */}
                <button
                  className="w-full flex justify-between items-center p-6 lg:p-8 text-left focus:outline-none transition-all duration-300"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center space-x-4 lg:space-x-6 flex-1">
                    {/* Icon with gradient background */}
                    <div
                      className={`flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${getSectionColor(
                        index
                      )} rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                        expandedSection === index
                          ? "transform rotate-12 scale-110"
                          : ""
                      }`}
                    >
                      <div className="text-white">{section.icon}</div>
                    </div>

                    {/* Title and Highlight */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        {section.title}
                      </h3>
                      <p className="text-sm lg:text-base text-gray-500 font-medium">
                        {section.highlight}
                      </p>
                    </div>
                  </div>

                  {/* Chevron with rotation animation */}
                  <div
                    className={`flex-shrink-0 ml-4 p-2 rounded-full bg-gray-100 transition-all duration-300 ${
                      expandedSection === index
                        ? "transform rotate-180 bg-blue-100"
                        : ""
                    }`}
                  >
                    {expandedSection === index ? (
                      <FiChevronUp className="w-6 h-6 text-gray-600" />
                    ) : (
                      <FiChevronDown className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                </button>

                {/* Expandable Content */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    expandedSection === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    <div className="ml-18 lg:ml-22">
                      {/* Divider */}
                      <div
                        className={`w-full h-1 bg-gradient-to-r ${getSectionColor(
                          index
                        )} rounded-full mb-6 opacity-20`}
                      ></div>

                      {/* Content */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl p-6 lg:p-8 border border-gray-100">
                        <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Number */}
                <div className="absolute top-4 right-4 opacity-20 transition-opacity">
                  <span className="text-6xl font-black text-gray-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-3xl p-8 lg:p-12 shadow-2xl max-w-4xl mx-auto border border-white/20 backdrop-blur-sm relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Questions About Our Terms?
              </h2>
              <p className="text-blue-100 text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
                Our team is here to help clarify any aspect of these terms and
                conditions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:info@mentoons.com"
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <FiMail className="w-5 h-5 mr-3" />
                  Contact Support
                </a>

                <div className="flex items-center text-blue-100">
                  <span className="text-sm">
                    Response time: Usually within 24 hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Move styles to a separate CSS file or keep inline without `jsx` */}
      <style>
        {`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }

          .animate-blob {
            animation: blob 7s infinite;
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          .animation-delay-1000 {
            animation-delay: 1s;
          }

          .animation-delay-3000 {
            animation-delay: 3s;
          }

          .ml-18 {
            margin-left: 4.5rem;
          }

          .ml-22 {
            margin-left: 5.5rem;
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #2563eb, #7c3aed);
          }
        `}
      </style>
    </div>
  );
};

export default PolicyPage;
