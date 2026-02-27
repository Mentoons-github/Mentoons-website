import { Site_FAQData } from "@/types";

export const FAQ = [
  {
    question: "What is Mentoons Adda?",
    answer:
      "Mentoons Adda is a community space where parents and children can interact and engage in meaningful conversations.",
  },
  {
    question: "How does it work?",
    answer:
      "You can join Mentoons Adda online, participate in discussions, and explore resources for parents and children.",
  },
  {
    question: "How to join the community?",
    answer:
      "Simply sign up on our website and start interacting with other members of the community.",
  },
];

export const FAQ_PRODUCT = {
  "What benefit will I receive from this product?":
    "It helps you understand your emotional strengths, areas for improvement, and how your emotions impact various aspects of your life, including family, friendships, and career.",
  "What kind of results will I receive?":
    "You will receive a detailed report with scores, interpretations, and personalized recommendations for improvement in each category.",
  "Can I download this?":
    "Yes, you can download the report in PDF format. You can also share the report with your friends and family.",
  "Do you offer team reports or workshops?":
    "No, we do not offer team reports or workshops. This is a personalized product for individuals.",
  "What if I need help understanding my results?":
    "Our expert counselors and mentors are available to help you interpret your results and provide guidance on your personal development journey. You can schedule a one-on-one consultation through our platform.",
};

export const FAQ_ASSESSMENT = {
  "What is included in each category?":
    "Each category assessment includes 10 multiple-choice questions designed to provide insights into the specific area (e.g., self-awareness, addiction, skills, emotions).",
  "What kind of results will I receive?":
    "After completing the assessment, you'll receive a detailed report with scores, interpretations, and personalized recommendations for improvement in each category.",
  "Who can take these assessments?":
    "These assessments are designed for individuals aged 13 and above. Parents can help younger children complete the assessments, ensuring accurate and meaningful results.",
  "How do I purchase an assessment?":
    "You can purchase assessments directly through our website. Simply select the assessment you want, complete the payment process, and you'll get immediate access.",
  "What if I need help understanding my results?":
    "Our expert counselors and mentors are available to help you interpret your results and provide guidance on your personal development journey. You can schedule a one-on-one consultation through our platform.",
};

export const FAQ_ABOUT_US = {
  "How do I get started on Mentoons Adda?":
    "Simply sign up with your email or social media account. Once registered, you buy our membership and become a part of the community, ask questions, and connect with other community members.",
  "What types of topics can I discuss here?":
    "We offer workshops on a wide range of topics, including career guidance, personal development, and social skills. You can find detailed information about each workshop on our website or mobile app.",
  "Who can join Mentoons Adda?":
    "Anyone can join Mentoons Adda. We welcome parents, children, and educators to join our community.",
  "How do I engage with other users?":
    "You can engage with other users by participating in group discussions, sharing your thoughts and experiences, and asking questions. You can also connect with other users through private messages and group chats.",
  "Can experts contribute to the platform?":
    "Yes, we welcome contributions from experts in various fields. If you are an expert and would like to share your knowledge and insights with our community, please contact us for more information.",
};

export const FAQ_PRODUCT_DETAILS = [
  {
    id: "WF_01",
    question: "What benefit will I receive from this product?",
    answer:
      "It helps you understand your emotional strengths, areas for improvement, and how your emotions impact various aspects of your life, including family, friendships, and career.",
  },
  {
    id: "WF_02",
    question: "What kind of results will I receive?",
    answer:
      "You will receive a detailed report with scores, interpretations, and personalized recommendations for improvement in each category.",
  },
  {
    id: "WF_03",
    question: "Can I download this?",
    answer:
      "Yes, you can download the report in PDF format. You can also share the report with your friends and family.",
  },
  {
    id: "WF_04",
    question: "Do you offer team reports or workshops?",
    answer:
      "No, we do not offer team reports or workshops. This is a personalized product for individuals.",
  },
  {
    id: "WF_05",
    question: "What if I need help understanding my results?",
    answer:
      "Our expert counselors and mentors are available to help you interpret your results and provide guidance on your personal development journey. You can schedule a one-on-one consultation through our platform.",
  },
];

export const SITE_CATEGORIES = [
  "All",
  "About Our Services",
  "Programs and Workshops",
  "General Inquiries",
  "Post-Registration",
  "Additional Resources",
] as const;

export const COLORED_CATEGORIES = [
  {
    label: "All" as const,
    active: "bg-gray-800 border-gray-800 text-white shadow-gray-300",
    idle: "border-gray-300 text-gray-700 hover:bg-gray-100",
  },
  {
    label: "About Our Services" as const,
    active: "bg-blue-600 border-blue-600 text-white shadow-blue-200",
    idle: "border-blue-300 text-blue-600 hover:bg-blue-50",
  },
  {
    label: "Programs and Workshops" as const,
    active: "bg-emerald-600 border-emerald-600 text-white shadow-emerald-200",
    idle: "border-emerald-300 text-emerald-600 hover:bg-emerald-50",
  },
  {
    label: "General Inquiries" as const,
    active: "bg-amber-500 border-amber-500 text-white shadow-amber-200",
    idle: "border-amber-300 text-amber-600 hover:bg-amber-50",
  },
  {
    label: "Post-Registration" as const,
    active: "bg-violet-600 border-violet-600 text-white shadow-violet-200",
    idle: "border-violet-300 text-violet-600 hover:bg-violet-50",
  },
  {
    label: "Additional Resources" as const,
    active: "bg-pink-600 border-pink-600 text-white shadow-pink-200",
    idle: "border-pink-300 text-pink-600 hover:bg-pink-50",
  },
] as const;

export const SITE_FAQ: Site_FAQData[] = [
  {
    category: "About Our Services",
    icon: "🎯",
    color: "from-yellow-400 to-orange-500",
    faqs: [
      {
        question: "What exactly is Mentoons?",
        answer:
          "Mentoons is a unique platform that blends mentoring with the art of cartoons. We aim to address issues like social media addiction and enhance skills like self-awareness through interactive workshops and resources. Our programs are designed for children, teenagers, and adults who seek meaningful personal development in a creative and engaging way.",
      },
      {
        question: "How can Mentoons help with social media addiction?",
        answer:
          "At Mentoons, we tackle social media addiction by offering specially designed workshops that focus on building real-world connections and healthier habits. Participants engage in creative activities that foster a sense of community and connectivity without relying on digital interactions.",
      },
    ],
  },
  {
    category: "Programs and Workshops",
    icon: "🎨",
    color: "from-orange-400 to-red-500",
    faqs: [
      {
        question: "How do I choose the right workshop or program?",
        answer:
          "Visit our website and browse through the various programs offered. Each listing includes details that help you understand the focus of the workshop and whom it's best suited for, whether you're a parent looking to engage your child or a professional seeking self-development.",
      },
      {
        question: "How do I sign up for a workshop?",
        answer:
          "Signing up is easy: Visit our enrollment page, choose your desired workshop, click on 'Enroll Now' or fill out the application form, and complete your registration with the necessary details and payment.",
      },
      {
        question: "What should I expect after registering for a workshop?",
        answer:
          "You will receive access to the necessary materials and resources for the workshop. Engage with the content at scheduled times or at your own pace, depending on the format. Experience interactive learning designed to encourage personal growth and community interaction.",
      },
    ],
  },
  {
    category: "General Inquiries",
    icon: "❓",
    color: "from-yellow-300 to-orange-400",
    faqs: [
      {
        question: "Who can benefit most from Mentoons?",
        answer:
          "Our programs are ideal for anyone looking to overcome digital addiction issues, enhance personal skills like communication and creativity, and develop meaningful social connections. This includes children, teenagers, families, and professionals.",
      },
      {
        question:
          "What makes Mentoons different from other personal development programs?",
        answer:
          "Unlike traditional methods, Mentoons uses a combination of mentoring and cartoon-based storytelling to make the learning process enjoyable and effective. Our method is evidence-based, focusing on real-world outcomes and improvements in behavior and personal interaction skills.",
      },
    ],
  },
  {
    category: "Post-Registration",
    icon: "📋",
    color: "from-red-400 to-orange-600",
    faqs: [
      {
        question: "What happens if I miss a live session?",
        answer:
          "Don't worry! All live sessions are recorded, allowing you to catch up at your convenience. Plus, our instructors are always available for questions during their office hours.",
      },
    ],
  },
  {
    category: "Additional Resources",
    icon: "📚",
    color: "from-orange-300 to-yellow-500",
    faqs: [
      {
        question: "Are there resources available aside from the workshops?",
        answer:
          "Absolutely! Mentoons provides additional resources such as articles, cartoons, and interactive tools available through our platform to reinforce your learning and development.",
      },
      {
        question:
          "How can I stay updated with new workshops and Mentoons news?",
        answer:
          "To stay updated, subscribe to our newsletter, check our website regularly, and follow us on social media. We continually announce upcoming workshops and new content that could benefit you and your family.",
      },
    ],
  },
];
