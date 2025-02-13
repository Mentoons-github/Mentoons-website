import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const TermsAndConditions = () => {
  const sections = [
    {
      title: "Introduction",
      content:
        "These Terms and Conditions govern your use of our website and services. By accessing or using our services, you agree to abide by these terms in full.",
    },
    {
      title: "User Responsibilities",
      content:
        "As a user, you are responsible for maintaining the confidentiality of your account, ensuring that any information provided is accurate, and refraining from any unlawful activities while using our services.",
    },
    {
      title: "Prohibited Activities",
      content:
        "Users are prohibited from engaging in activities that are harmful to the website, violate any laws, or infringe on the rights of others. This includes spamming, distributing malware, and attempting to bypass security measures.",
    },
    {
      title: "Intellectual Property",
      content:
        "All content and materials available on this website are protected by intellectual property laws. Unauthorized use of any material, including images, logos, and text, is strictly prohibited.",
    },
    {
      title: "Disclaimer of Warranties",
      content:
        "Our services are provided 'as is' without any guarantees or warranties of any kind. We disclaim all liability for any damages arising from the use or inability to use our services.",
    },
    {
      title: "Limitation of Liability",
      content:
        "We are not liable for any damages, including direct, indirect, incidental, or consequential damages, that arise from your use of the website or services, even if we have been advised of the possibility of such damages.",
    },
    {
      title: "Changes to Terms",
      content:
        "We reserve the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on this page. We encourage users to review the terms periodically.",
    },
    {
      title: "Contact Us",
      content:
        "If you have any questions or concerns regarding these Terms and Conditions, please contact us at info@mentoons.com.",
    },
  ];

  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index: any) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="terms-and-conditions-page px-4 py-6 sm:px-8 lg:px-16">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Terms and Conditions
      </h1>
      <div className="sections w-full mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6 lg:p-8">
        {sections.map((section, index) => (
          <div key={index} className="section mb-6 border-b border-gray-200">
            <button
              className="w-full flex justify-between items-center py-4 px-2 text-left text-xl font-medium text-gray-800 hover:bg-gray-100 focus:outline-none transition-all duration-200 rounded-lg"
              onClick={() => toggleSection(index)}
            >
              <span>{section.title}</span>
              {expandedSection === index ? (
                <FiChevronUp className="w-6 h-6 text-gray-500" />
              ) : (
                <FiChevronDown className="w-6 h-6 text-gray-500" />
              )}
            </button>
            {expandedSection === index && (
              <p className="mt-3 ml-4 mr-4 mb-4 text-gray-700 text-base">
                {section.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsAndConditions;
