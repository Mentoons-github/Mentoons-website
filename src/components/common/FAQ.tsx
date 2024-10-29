import { useState } from "react";

type Faq = {
    question: string;
    answer: string;
};

type FaqData = {
    category: string;
    faqs: Faq[];
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("About Our Services");

    const categories = ["All", "About Our Services", "Programs and Workshops", "General Inquiries", "Post-Registration", "Additional Resources"];

    const faqData: FaqData[] = [
        {
            category: "About Our Services",
            faqs: [
                {
                    question: "What exactly is Mentoons?",
                    answer: "Mentoons is a unique platform that blends mentoring with the art of cartoons. We aim to address issues like social media addiction and enhance skills like self-awareness through interactive workshops and resources. Our programs are designed for children, teenagers, and adults who seek meaningful personal development in a creative and engaging way.",
                },
                {
                    question: "How can Mentoons help with social media addiction?",
                    answer: "At Mentoons, we tackle social media addiction by offering specially designed workshops that focus on building real-world connections and healthier habits. Participants engage in creative activities that foster a sense of community and connectivity without relying on digital interactions.",
                },
            ],
        },
        {
            category: "Programs and Workshops",
            faqs: [
                {
                    question: "How do I choose the right workshop or program?",
                    answer: "Visit our website and browse through the various programs offered. Each listing includes details that help you understand the focus of the workshop and whom it's best suited for, whether you're a parent looking to engage your child or a professional seeking self-development.",
                },
                {
                    question: "How do I sign up for a workshop?",
                    answer: "Signing up is easy:\n* Visit our enrollment page.\n* Choose your desired workshop.\n* Click on 'Enroll Now' or fill out the application form.\n* Complete your registration with the necessary details and payment.",
                },
                {
                    question: "What should I expect after registering for a workshop?",
                    answer: "You will receive access to the necessary materials and resources for the workshop. Engage with the content at scheduled times or at your own pace, depending on the format. Experience interactive learning designed to encourage personal growth and community interaction.",
                },
            ],
        },
        {
            category: "General Inquiries",
            faqs: [
                {
                    question: "Who can benefit most from Mentoons?",
                    answer: "Our programs are ideal for anyone looking to overcome digital addiction issues, enhance personal skills like communication and creativity, and develop meaningful social connections. This includes children, teenagers, families, and professionals.",
                },
                {
                    question: "What makes Mentoons different from other personal development programs?",
                    answer: "Unlike traditional methods, Mentoons uses a combination of mentoring and cartoon-based storytelling to make the learning process enjoyable and effective. Our method is evidence-based, focusing on real-world outcomes and improvements in behavior and personal interaction skills.",
                },
            ],
        },
        {
            category: "Post-Registration",
            faqs: [
                {
                    question: "What happens if I miss a live session?",
                    answer: "Don't worry! All live sessions are recorded, allowing you to catch up at your convenience. Plus, our instructors are always available for questions during their office hours.",
                },
            ],
        },
        {
            category: "Additional Resources",
            faqs: [
                {
                    question: "Are there resources available aside from the workshops?",
                    answer: "Absolutely! Mentoons provides additional resources such as articles, cartoons, and interactive tools available through our platform to reinforce your learning and development.",
                },
                {
                    question: "How can I stay updated with new workshops and Mentoons news?",
                    answer: "To stay updated, subscribe to our newsletter, check our website regularly, and follow us on social media. We continually announce upcoming workshops and new content that could benefit you and your family.",
                },
            ],
        },
    ];

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredFaqs = selectedCategory === "All"
        ? faqData.flatMap(category => category.faqs)
        : faqData.find(faq => faq.category === selectedCategory)?.faqs || [];


    return (
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h6 className="text-3xl font-medium text-indigo-600 mb-2">FAQs</h6>
                    <p className="text-lg">Welcome to the FAQ section of Mentoons, where we've gathered some of the most asked questions to help you our services and their value. If you have other questions that aren't addressed here, please feel free to reach out!
                    </p>
                    <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-5">
                        Looking for answers?
                    </h2>
                    <div className="flex justify-center gap-4 mb-8 flex-wrap">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`py-2 px-4 rounded-full font-medium transition duration-300 ${selectedCategory === category
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="w-full lg:w-1/2">
                        <img
                            src="/md.png"
                            alt="FAQ section"
                            className="w-full h-auto rounded-xl"
                        />
                    </div>
                    <div className="w-full lg:w-1/2 max-h-1/2 overflow-y-auto">
                        <div className="lg:max-w-xl">
                            <div className="accordion-group">
                                {filteredFaqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className={`accordion py-4 border-b border-solid border-gray-200 ${openIndex === index ? "active" : ""
                                            }`}
                                    >
                                        <button
                                            className="accordion-toggle group inline-flex items-center justify-between text-xl font-normal leading-8 text-gray-600 w-full transition duration-500 hover:text-indigo-600 accordion-active:text-indigo-600 text-left mb-3"
                                            onClick={() => handleToggle(index)}
                                            aria-controls={`collapse-${index}`}
                                        >
                                            <h5>{faq.question}</h5>
                                            <svg
                                                className={`text-gray-900 transition duration-500 group-hover:text-indigo-600 ${openIndex === index ? "rotate-180" : ""
                                                    }`}
                                                width="22"
                                                height="22"
                                                viewBox="0 0 22 22"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                                                    stroke="currentColor"
                                                    strokeWidth="1.6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                ></path>
                                            </svg>
                                        </button>
                                        <div
                                            id={`collapse-${index}`}
                                            className={`accordion-content w-full px-0 overflow-hidden pr-4 ${openIndex === index ? "max-h-screen" : "max-h-0"
                                                }`}
                                            aria-labelledby={`heading-${index}`}
                                        >
                                            <p className="text-base font-normal text-gray-600">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
