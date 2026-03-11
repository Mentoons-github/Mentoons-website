const MessageFromFounder = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 px-6 md:px-20 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Message from the Founder
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            A note about social media addiction and building healthier families
          </p>
        </div>

        {/* Letter Card */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-3xl p-8 md:p-12 space-y-6 text-gray-700 leading-relaxed text-lg">
          <p>
            I hope this letter finds you in good health and high spirits. I am
            writing to bring to your attention a matter of great concern that
            has been witnessed in our society lately —{" "}
            <span className="font-semibold text-orange-600">
              social media addiction
            </span>
            .
          </p>

          <p>
            In recent years, the ever-growing popularity and accessibility of
            social media platforms have had a significant impact on the social
            fabric of our communities. While these platforms were initially
            designed to connect people and foster communication, they have
            inadvertently given rise to a new addiction that is rapidly
            spreading among individuals of all ages and backgrounds.
          </p>

          <p>
            Social media addiction can be defined as an unhealthy and excessive
            use of social media platforms, resulting in detrimental effects on
            one's physical and mental well-being. The constant need to check
            notifications, respond to messages, and scroll through feeds often
            comes at the expense of real-world relationships.
          </p>

          <p>
            This behaviour can lead to decreased productivity, disrupted sleep
            patterns, and increased feelings of anxiety, depression, and
            isolation.
          </p>

          <p>
            As concerned members of society, it is our responsibility to address
            this issue and take necessary steps to ensure the well-being of
            individuals affected by social media addiction.
          </p>

          <p>
            Educational institutions, parents, and guardians must actively
            engage in conversations surrounding responsible social media usage.
            By incorporating digital citizenship and media literacy programs
            into our education systems, we can equip future generations with the
            knowledge and skills to navigate the online world responsibly.
          </p>

          <p>
            In addition, I propose the establishment of support groups and
            counselling services dedicated to helping individuals overcome
            social media addiction and develop healthier coping mechanisms.
          </p>

          <p>
            Social media platforms themselves should also take a proactive role
            in mitigating the adverse effects of excessive usage by encouraging
            users to moderate screen time and prioritize real-life connections.
          </p>

          <p>
            Social media addiction is a pressing issue that requires our
            immediate attention. Together we can build a healthier and more
            balanced digital culture for future generations.
          </p>

          {/* Signature */}
          <div className="pt-10 border-t border-gray-200 space-y-2">
            <p className="font-medium">Yours sincerely,</p>
            <p className="text-xl font-semibold text-gray-900">Mahesh K</p>
            <p className="text-gray-500">Founder & CEO</p>
            <a
              href="https://mentormahesh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-medium hover:text-orange-700 hover:underline transition"
            >
              mentormahesh.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageFromFounder;
