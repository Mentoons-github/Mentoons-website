const AboutMentoons = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 shadow-sm border border-orange-100 mt-5">
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <div className="bg-white/60 rounded-lg p-4 border-l-4 border-blue-400">
          <p className="font-medium text-gray-700 mb-2">🎨 Our Mission</p>
          <p>
            At Mentoons, we believe in leveraging the power of cartoons and
            comics to impart mentoring and learning lessons. Our unique approach
            revolves around conducting workshops for social media de-addiction,
            mobile de-addiction and gaming de-addiction.
          </p>
        </div>

        <div className="bg-white/60 rounded-lg p-4 border-l-4 border-orange-400">
          <p className="font-medium text-gray-700 mb-2">👥 Our Team</p>
          <p>
            Our team of talented artists, psychologists/educators and
            storytellers work together to create a vibrant world of comics,
            audio comics, podcasts and engaging workshops that inspire
            creativity, critical thinking and a love for life.
          </p>
        </div>

        <div className="bg-white/60 rounded-lg p-4 border-l-4 border-green-400">
          <p className="font-medium text-gray-700 mb-2">🌟 Our Approach</p>
          <p>
            At Mentoons, we believe that learning should be an adventure! We're
            passionate about nurturing young minds through the power of
            storytelling, visual arts and interactive experiences.
          </p>
        </div>

        <div className="bg-white/60 rounded-lg p-4 border-l-4 border-purple-400">
          <p className="font-medium text-gray-700 mb-2">🎯 Our Impact</p>
          <p>
            Our impactful lessons resonate with people of all age groups,
            creating meaningful connections and lasting positive change.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-orange-200">
        <div className="flex items-center justify-center">
          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              Comics
            </span>
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
              Workshops
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Podcasts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMentoons;
