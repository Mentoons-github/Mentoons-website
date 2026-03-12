import { useState, useEffect } from "react";

const MessageFromFounder = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 font-serif">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-stone-900 via-amber-950 to-orange-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-16 pb-0 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            {/* Left: Title Text */}
            <div className={`pb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-orange-400 block" />
                <span className="text-orange-400 text-xs font-bold tracking-widest uppercase font-sans">
                  A Personal Note
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
                Message <br />
                <span className="italic text-orange-300">from the</span> <br />
                Founder
              </h1>
              <p className="text-white/50 text-base leading-relaxed font-sans font-light max-w-md">
                A heartfelt note about social media addiction and building
                healthier, more connected families.
              </p>
            </div>

            <div className={`flex justify-center md:justify-end transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-t from-orange-500/30 to-transparent rounded-t-2xl" />
                <img
                  src="/assets/home/founder/image.png"
                  alt="Mahesh K - Founder & CEO"
                  className="w-72 md:w-80 rounded-t-2xl object-cover object-top block relative z-10"
                />
                <div className="absolute -left-4 bottom-8 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-orange-500/40 font-sans tracking-wide uppercase z-20">
                  Founder & CEO
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* Letter Body — always renders first in DOM, shown first on mobile/tablet */}
          <div className={`lg:col-span-2 lg:order-1 order-1 transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="bg-white rounded-3xl shadow-md border border-amber-100 overflow-hidden">
              {/* Letter Top Bar */}
              <div className="bg-gradient-to-r from-amber-950 to-orange-900 px-8 py-5 flex items-center justify-between">
                <div>
                  <p className="text-orange-300 text-xs font-sans font-bold uppercase tracking-widest">
                    Open Letter
                  </p>
                  <p className="text-white text-lg font-semibold mt-0.5">
                    To Our Community
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300 text-lg">
                  ✉
                </div>
              </div>

              {/* Letter Content */}
              <div className="px-8 md:px-12 py-10 space-y-6 text-stone-700 leading-relaxed text-[17px]">
                <p>
                  I hope this letter finds you in good health and high spirits.
                  I am writing to bring to your attention a matter of great
                  concern that has been witnessed in our society lately —{" "}
                  <span className="font-semibold text-orange-600 bg-orange-50 px-1 rounded">
                    social media addiction
                  </span>
                  .
                </p>

                <p>
                  In recent years, the ever-growing popularity and accessibility
                  of social media platforms have had a significant impact on the
                  social fabric of our communities. While these platforms were
                  initially designed to connect people and foster communication,
                  they have inadvertently given rise to a new addiction that is
                  rapidly spreading among individuals of all ages and backgrounds.
                </p>

                {/* Highlight Block */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 my-2">
                  <p className="text-amber-900 font-semibold text-base leading-relaxed">
                    Social media addiction can be defined as an unhealthy and
                    excessive use of social media platforms, resulting in
                    detrimental effects on one's physical and mental well-being.
                  </p>
                </div>

                <p>
                  The constant need to check notifications, respond to messages,
                  and scroll through feeds often comes at the expense of
                  real-world relationships. This behaviour can lead to decreased
                  productivity, disrupted sleep patterns, and increased feelings
                  of anxiety, depression, and isolation.
                </p>

                <p>
                  As concerned members of society, it is our responsibility to
                  address this issue and take necessary steps to ensure the
                  well-being of individuals affected by social media addiction.
                  This involves raising awareness about the adverse effects of
                  excessive social media usage, promoting digital literacy, and
                  encouraging individuals to establish a healthy balance between
                  their online and offline lives.
                </p>

                {/* Three Impact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                  {[
                    { icon: "🏫", title: "Education", desc: "Digital literacy programs in schools" },
                    { icon: "🤝", title: "Support", desc: "Counselling & community groups" },
                    { icon: "📱", title: "Platforms", desc: "Encouraging responsible usage" },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="bg-stone-50 rounded-xl p-4 border border-stone-100 text-center">
                      <span className="text-2xl block mb-2">{icon}</span>
                      <p className="text-stone-800 font-bold text-sm font-sans">{title}</p>
                      <p className="text-stone-400 text-xs font-sans mt-1 leading-snug">{desc}</p>
                    </div>
                  ))}
                </div>

                <p>
                  Moreover, it is crucial for educational institutions, parents,
                  and guardians to actively engage in conversations surrounding
                  responsible social media usage. By incorporating digital
                  citizenship and media literacy programs into our curricula, we
                  can equip our future generations with the necessary knowledge
                  and skills to navigate the online world responsibly and ethically.
                </p>

                <p>
                  In addition, I propose the establishment of support groups and
                  counselling services dedicated to helping individuals overcome
                  social media addiction. By offering a safe and supportive
                  environment where affected individuals can seek guidance and
                  develop healthy coping mechanisms, we can contribute to their
                  recovery and promote long-term well-being.
                </p>

                <p>
                  Furthermore, it is essential for social media platforms
                  themselves to take a proactive role in mitigating the adverse
                  effects of excessive usage. Implementing features that
                  encourage users to moderate their screen time, set personal
                  boundaries, and prioritize offline relationships would be a
                  positive step forward.
                </p>

                <p className="font-medium text-stone-800">
                  In conclusion, social media addiction is a pressing issue that
                  requires our immediate attention. By addressing this matter
                  with sensitivity and a collaborative approach, we can create
                  an environment where individuals can fully harness the benefits
                  of social media without falling victim to its addictive
                  qualities. Let us come together, as a society, to combat this
                  affliction and build a healthier and more balanced digital culture.
                </p>

                <p className="font-medium text-stone-800">
                  Thank you for your time and consideration. I look forward to
                  your support and engagement in addressing this important matter.
                </p>

                {/* Signature */}
                <div className="pt-8 border-t border-amber-100 flex items-end justify-between flex-wrap gap-6">
                  <div className="space-y-1">
                    <p className="text-stone-400 text-sm font-sans">Yours sincerely,</p>
                    <p className="text-2xl font-bold text-stone-900">Mahesh K</p>
                    <p className="text-orange-600 text-sm font-sans font-semibold uppercase tracking-wider">
                      Founder & CEO
                    </p>
                    <a
                      href="https://mentormahesh.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 text-sm font-sans hover:text-orange-700 hover:underline transition inline-block mt-1"
                    >
                      mentormahesh.com ↗
                    </a>
                  </div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-orange-200">
                    M
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — order-2 on mobile/tablet, appears on left via lg:order-first */}
          <div className="lg:col-span-1 order-2 lg:order-first space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-amber-100 lg:sticky lg:top-8">
              <img
                src="/assets/home/founder/contact.png"
                alt="Contact Mahesh K"
                className="w-full object-cover block"
              />
              <div className="p-5">
                <p className="text-stone-900 text-xl font-bold">Mahesh K</p>
                <p className="text-amber-700 text-xs font-sans font-semibold uppercase tracking-widest mt-0.5 mb-4">
                  Founder & CEO
                </p>
                <div className="h-px bg-amber-100 mb-4" />
                <a
                  href="https://mentormahesh.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-sm font-bold font-sans py-3 px-4 rounded-xl w-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-200 transition-all duration-200"
                >
                  <span>🌐</span> mentormahesh.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MessageFromFounder;