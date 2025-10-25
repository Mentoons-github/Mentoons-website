import { BookOpen, Target, Users, Lightbulb } from "lucide-react";

export default function WhyComics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Why Comics?
          </h1>
          <p className="text-xl text-orange-50 max-w-2xl">
            Transforming literacy and learning through visual storytelling
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Subtitle */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            More Than Just Superheroes
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
        </div>

        {/* Educational Impact Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="text-blue-600" size={32} />
            <h3 className="text-2xl font-bold text-gray-800">
              Educational Impact
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Cultivating Reading Enthusiasm
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Comic books transform reading from a task into an adventure,
                improving children's love for reading through engaging visual
                narratives and compelling storylines.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow border-l-4 border-red-500">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Enhanced Cognitive Development
              </h4>
              <p className="text-gray-600 leading-relaxed">
                The combination of text and imagery encourages different
                thinking patterns, developing critical analysis skills and
                visual literacy alongside traditional reading comprehension.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Building Lifelong Habits
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Starting early with comics establishes strong reading habits
                from childhood, creating a foundation for continuous learning
                and literacy development.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow border-l-4 border-yellow-600">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Wellness & Relaxation
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Comics provide a healthy escape, helping children relax and
                de-stress while still engaging their minds in meaningful,
                entertaining content.
              </p>
            </div>
          </div>
        </section>

        {/* What Makes Our Comics Effective */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Target className="text-orange-600" size={32} />
            <h3 className="text-2xl font-bold text-gray-800">
              What Makes Our Comics Effective
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Features */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-8">
              <h4 className="text-lg font-semibold text-orange-700 mb-4">
                User Experience
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">▸</span>
                  <span>Intuitive, easy-to-use format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">▸</span>
                  <span>Age-appropriate, kid-friendly topics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">▸</span>
                  <span>Accessible pricing for all families</span>
                </li>
              </ul>
            </div>

            {/* Content Quality */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-8">
              <h4 className="text-lg font-semibold text-blue-700 mb-4">
                Content Quality
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">▸</span>
                  <span>Fun-filled, engaging features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">▸</span>
                  <span>Professional, captivating illustrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">▸</span>
                  <span>Compelling plots and characters</span>
                </li>
              </ul>
            </div>

            {/* Story Elements */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-8">
              <h4 className="text-lg font-semibold text-red-700 mb-4">
                Story Elements
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">▸</span>
                  <span>Dynamic, engaging plots</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">▸</span>
                  <span>Relatable, memorable characters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">▸</span>
                  <span>High-quality visual graphics</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Social Impact */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Lightbulb className="text-yellow-600" size={32} />
            <h3 className="text-2xl font-bold text-gray-800">
              Addressing Critical Issues
            </h3>
          </div>

          <div className="bg-white rounded-lg p-10 shadow-sm">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our comics tackle important social and developmental challenges
              that children face in today's world.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    Screen-time management and digital wellness
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    Bullying prevention and conflict resolution
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    Social skills and emotional intelligence
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    Building confidence and self-esteem
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    Character development and values
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    Mental health and emotional wellness
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Users className="text-red-600" size={32} />
            <h3 className="text-2xl font-bold text-gray-800">
              Our Multidisciplinary Team
            </h3>
          </div>

          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-10 text-white">
            <p className="text-lg mb-8 text-orange-50">
              Creating exceptional comics requires diverse expertise. Our team
              brings together professionals from various fields to ensure
              quality, authenticity, and educational value.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-opacity-20 transition-all">
                <p className="font-semibold">Content Monitors</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-opacity-20 transition-all">
                <p className="font-semibold">Illustrators</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-opacity-20 transition-all">
                <p className="font-semibold">Psychologists</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-opacity-20 transition-all">
                <p className="font-semibold">Musicians</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-opacity-20 transition-all">
                <p className="font-semibold">Developers</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-opacity-20 transition-all">
                <p className="font-semibold">Writers</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
