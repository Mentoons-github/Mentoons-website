import { useState } from "react";
import {
  Video,
  Users,
  MessageSquare,
  Search,
  TrendingUp,
  FileText,
  Award,
  CheckCircle,
  Linkedin,
  Star,
  ArrowRight,
} from "lucide-react";

interface ServiceHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  color: string;
}

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent: string;
}

const Header = () => (
  <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 overflow-hidden">
    <div className="absolute inset-0 bg-white opacity-5">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      ></div>
    </div>
    <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
      <div className="inline-block mb-6">
        <span className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide backdrop-blur-sm">
          PROFESSIONAL CAREER SERVICES
        </span>
      </div>
      <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
        Transform Your Career with
        <span className="block text-yellow-200">Mentoons</span>
      </h1>
      <p className="text-xl text-white opacity-90 max-w-2xl mx-auto leading-relaxed">
        Expert guidance to elevate your professional journey and unlock
        opportunities you deserve
      </p>
    </div>
  </div>
);

const ServiceHeader = ({
  icon: Icon,
  title,
  subtitle,
  color,
}: ServiceHeaderProps) => (
  <div className="mb-12">
    <div className="flex items-center gap-4 mb-4">
      <div className={`${color} p-4 rounded-2xl shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 text-lg mt-1">{subtitle}</p>
      </div>
    </div>
  </div>
);

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  accent,
}: ServiceCardProps) => (
  <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent">
    <div className="flex items-start gap-6">
      <div
        className={`${accent} bg-opacity-10 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className={`w-7 h-7 ${accent.replace("bg-", "text-")}`} />
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
      </div>
    </div>
  </div>
);

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    experience: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.phone && formData.service) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          experience: "",
          message: "",
        });
      }, 3000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-2xl overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-12 text-white">
          <div className="mb-8">
            <Star className="w-12 h-12 text-yellow-400 mb-4" />
            <h2 className="text-4xl font-bold mb-4">
              Let's Start Your Journey
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Take the first step towards your dream career. Our expert team is
              ready to guide you through every milestone.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">
                  Personalized Approach
                </h4>
                <p className="text-blue-100">
                  Tailored strategies for your unique career goals
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Expert Guidance</h4>
                <p className="text-blue-100">
                  Industry professionals with proven track records
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Results-Driven</h4>
                <p className="text-blue-100">
                  Measurable outcomes and career advancement
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-12">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                Service of Interest
              </label>
              <select
                value={formData.service}
                onChange={(e) =>
                  setFormData({ ...formData, service: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
              >
                <option value="">Select a service</option>
                <option value="resume">Resume Writing Services</option>
                <option value="interview">Interview Excellence Training</option>
                <option value="job-search">Job Search Assistance</option>
                <option value="all">Complete Career Package</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                Your Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all resize-none"
                placeholder="Tell us about your career goals..."
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Submit Application
              <ArrowRight className="w-5 h-5" />
            </button>

            {showSuccess && (
              <div className="bg-green-500 text-white p-4 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Thank you! We'll reach out within 24 hours.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MentoonsServices = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Resume Writing Services */}
        <section className="mb-24">
          <ServiceHeader
            icon={FileText}
            title="Resume Writing Services"
            subtitle="Craft compelling narratives that capture attention and open doors"
            color="bg-gradient-to-br from-orange-500 to-red-500"
          />

          <div className="grid gap-8">
            <ServiceCard
              icon={Users}
              title="Career Storytelling Workshops"
              description="Are you struggling to showcase your skills and attract employers? Look no further! Our Career Storytelling Workshops are designed to help you stand out in the job market. We provide you with the tools and techniques to effectively tell your career story, highlighting your unique talents and experiences. Join us today and unlock the secret to landing your dream job."
              accent="bg-orange-500"
            />

            <ServiceCard
              icon={FileText}
              title="Stand Out with a Professional Resume"
              description="Your resume is your first impression and key to landing your dream job. Our expert team of resume writers will work closely with you to create a compelling and personalized resume that highlights your skills, experience, and achievements. With our exceptional resume writing service, you can differentiate yourself from the competition and make a lasting impact on potential employers."
              accent="bg-red-500"
            />

            <ServiceCard
              icon={Video}
              title="Make a Visual Impact with Video Resumes"
              description="In today's competitive job market, a traditional resume might not be enough to capture attention. Our video resume service allows you to showcase your personality, communication skills, and unique qualities in a visually engaging format. Our team will help you script, film, and edit a professional video resume that will grab the attention of hiring managers and leave a lasting impression."
              accent="bg-yellow-600"
            />

            <ServiceCard
              icon={Linkedin}
              title="Optimize Your LinkedIn Profile for Career Success"
              description="LinkedIn has become a vital tool for professionals to connect, network, and find new career opportunities. Our LinkedIn content management service will optimize your profile, highlight your achievements, and strategically position you as an industry expert. With a compelling and keyword-rich LinkedIn profile, you'll attract potential employers, partners, and clients, opening doors to exciting career prospects."
              accent="bg-blue-600"
            />
          </div>
        </section>

        {/* Interview Excellence */}
        {/* Interview Excellence */}
        <section className="mb-24">
          <ServiceHeader
            icon={MessageSquare}
            title="Interview Excellence Training"
            subtitle="Master interview dressing, etiquette, and professional behavior"
            color="bg-gradient-to-br from-blue-600 to-green-500"
          />

          <div className="grid gap-8">
            <ServiceCard
              icon={Award}
              title="Dress for Success"
              description="Learn how to make the right impression with professional attire. We'll guide you on choosing outfits that match your industry, understanding color psychology, and dressing confidently for every type of interview."
              accent="bg-blue-600"
            />

            <ServiceCard
              icon={CheckCircle}
              title="Interview Manners & Etiquette"
              description="Master essential professional behaviors, including body language, eye contact, greetings, and polite communication. Make sure your manners reflect competence, confidence, and respect."
              accent="bg-green-600"
            />

            <ServiceCard
              icon={TrendingUp}
              title="Effective Communication & Confidence"
              description="Enhance your verbal and non-verbal communication skills to articulate your ideas clearly and confidently. Learn techniques to handle difficult questions, maintain composure, and leave a lasting positive impression."
              accent="bg-yellow-600"
            />
          </div>
        </section>

        {/* Job Search Assistance */}
        <section className="mb-24">
          <ServiceHeader
            icon={Search}
            title="Job Search Assistance"
            subtitle="Strategic guidance to find and secure your ideal position"
            color="bg-gradient-to-br from-green-600 to-blue-500"
          />

          <div className="grid gap-8">
            <ServiceCard
              icon={Search}
              title="Strategic Job Search Planning"
              description="Stop the endless application cycle! Our strategic job search planning service helps you identify the right opportunities that align with your skills and career goals. We'll teach you how to research companies, network effectively, and target positions where you'll truly thrive. Learn insider strategies that successful job seekers use to land interviews faster."
              accent="bg-green-600"
            />

            <ServiceCard
              icon={Users}
              title="Networking & Personal Branding"
              description="Build meaningful professional connections that open doors to hidden job opportunities. We'll guide you on how to leverage your network, attend industry events effectively, and create a powerful personal brand that attracts recruiters. Learn how to make lasting impressions and turn connections into career opportunities."
              accent="bg-blue-600"
            />

            <ServiceCard
              icon={CheckCircle}
              title="Application Optimization & Tracking"
              description="Maximize your application success rate with our optimization techniques. We'll help you tailor each application to specific roles, track your progress systematically, and follow up effectively. Our proven methods ensure your applications stand out and reach the right people at the right time."
              accent="bg-orange-600"
            />
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <ContactForm />
        </section>
      </div>
    </div>
  );
};

export default MentoonsServices;
