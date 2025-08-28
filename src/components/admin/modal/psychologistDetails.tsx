import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Briefcase,
  Activity,
  Building,
  MapPinned,
  Globe,
  Hash,
} from "lucide-react";
import { useEffect, useState } from "react";

interface PsychologistAddress {
  houseName: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Psychologist {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  isActive: boolean;
  salary: number;
  place: PsychologistAddress;
  profilePicture?: string;
}

const PsychologistDetails = ({
  psychologist,
  onClose,
}: {
  psychologist: Psychologist;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!psychologist) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          className="bg-white rounded-xl p-6 shadow-2xl max-w-md w-full"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <p className="text-red-500 font-medium text-center">
            Psychologist data not available
          </p>
        </motion.div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className="relative w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          role="dialog"
          aria-labelledby="psychologist-details-title"
          aria-modal="true"
        >
          <motion.div
            className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex-shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              className="absolute right-4 top-4 p-1 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pt-12 pb-6 px-6 sm:px-8 text-center">
              <motion.div
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {psychologist.profilePicture ? (
                  <img
                    src={psychologist.profilePicture}
                    alt={`${psychologist.name}'s profile`}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold text-indigo-700">
                    {psychologist.name.charAt(0)}
                  </span>
                )}
              </motion.div>

              <motion.h2
                id="psychologist-details-title"
                className="text-xl sm:text-2xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {psychologist.name}
              </motion.h2>

              <motion.div
                className="flex flex-wrap justify-center gap-2 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-indigo-200 text-indigo-900">
                  {psychologist.role}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-200 text-blue-900">
                  {psychologist.department}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                    psychologist.isActive
                      ? "bg-green-200 text-green-900"
                      : "bg-red-200 text-red-900"
                  }`}
                >
                  {psychologist.isActive ? "Active" : "Inactive"}
                </span>
              </motion.div>
            </div>

            <div className="flex border-b border-indigo-900/20">
              <TabButton
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
                icon={<User className="w-4 h-4" />}
                label="Profile"
              />
              <TabButton
                active={activeTab === "contact"}
                onClick={() => setActiveTab("contact")}
                icon={<Phone className="w-4 h-4" />}
                label="Contact"
              />
              <TabButton
                active={activeTab === "address"}
                onClick={() => setActiveTab("address")}
                icon={<MapPin className="w-4 h-4" />}
                label="Address"
              />
            </div>
          </motion.div>

          <div className="overflow-y-auto flex-grow">
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <TabContent key="profile">
                    <div className="space-y-6">
                      <InfoCard title="Career Information">
                        <InfoItem
                          icon={
                            <Briefcase className="w-5 h-5 text-indigo-600" />
                          }
                          label="Role"
                          value={psychologist.role}
                        />
                        <InfoItem
                          icon={
                            <Building className="w-5 h-5 text-indigo-600" />
                          }
                          label="Department"
                          value={psychologist.department}
                        />
                        <InfoItem
                          icon={
                            <Calendar className="w-5 h-5 text-indigo-600" />
                          }
                          label="Join Date"
                          value={formatDate(psychologist.joinDate)}
                        />
                        <InfoItem
                          icon={
                            <Activity className="w-5 h-5 text-indigo-600" />
                          }
                          label="Status"
                          value={
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                psychologist.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {psychologist.isActive ? "Active" : "Inactive"}
                            </span>
                          }
                        />
                      </InfoCard>

                      <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-indigo-100 rounded-full">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                          </div>
                          <h3 className="font-medium text-indigo-900">
                            Employment Info
                          </h3>
                        </div>
                        <p className="text-indigo-700 text-sm">
                          Joined on {formatDate(psychologist.joinDate)} with an
                          active employment status.
                        </p>
                      </div>
                    </div>
                  </TabContent>
                )}

                {activeTab === "contact" && (
                  <TabContent key="contact">
                    <div className="space-y-6">
                      <InfoCard title="Contact Information">
                        <InfoItem
                          icon={<Mail className="w-5 h-5 text-indigo-600" />}
                          label="Email"
                          value={
                            <a
                              href={`mailto:${psychologist.email}`}
                              className="text-indigo-600 hover:underline"
                            >
                              {psychologist.email}
                            </a>
                          }
                        />
                        <InfoItem
                          icon={<Phone className="w-5 h-5 text-indigo-600" />}
                          label="Phone"
                          value={
                            <a
                              href={`tel:${psychologist.phone}`}
                              className="text-indigo-600 hover:underline"
                            >
                              {psychologist.phone}
                            </a>
                          }
                        />
                      </InfoCard>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ContactCard
                          icon={<Mail className="w-6 h-6 text-blue-600" />}
                          title="Send Email"
                          detail={psychologist.email}
                          action="Email Now"
                          href={`mailto:${psychologist.email}`}
                          color="bg-blue-50 border-blue-100"
                          buttonColor="bg-blue-600 hover:bg-blue-700"
                        />

                        <ContactCard
                          icon={<Phone className="w-6 h-6 text-green-600" />}
                          title="Call Directly"
                          detail={psychologist.phone}
                          action="Call Now"
                          href={`tel:${psychologist.phone}`}
                          color="bg-green-50 border-green-100"
                          buttonColor="bg-green-600 hover:bg-green-700"
                        />
                      </div>
                    </div>
                  </TabContent>
                )}

                {activeTab === "address" && (
                  <TabContent key="address">
                    <div className="space-y-6">
                      <InfoCard title="Location Details">
                        <InfoItem
                          icon={
                            <Building className="w-5 h-5 text-indigo-600" />
                          }
                          label="House"
                          value={psychologist.place?.houseName || "N/A"}
                        />
                        <InfoItem
                          icon={
                            <MapPinned className="w-5 h-5 text-indigo-600" />
                          }
                          label="Street"
                          value={psychologist.place?.street || "N/A"}
                        />
                        <InfoItem
                          icon={<MapPin className="w-5 h-5 text-indigo-600" />}
                          label="City"
                          value={psychologist.place?.city || "N/A"}
                        />
                        <InfoItem
                          icon={<MapPin className="w-5 h-5 text-indigo-600" />}
                          label="District"
                          value={psychologist.place?.district || "N/A"}
                        />
                        <InfoItem
                          icon={<Globe className="w-5 h-5 text-indigo-600" />}
                          label="State"
                          value={psychologist.place?.state || "N/A"}
                        />
                        <InfoItem
                          icon={<Hash className="w-5 h-5 text-indigo-600" />}
                          label="Pincode"
                          value={psychologist.place?.pincode || "N/A"}
                        />
                        <InfoItem
                          icon={<Globe className="w-5 h-5 text-indigo-600" />}
                          label="Country"
                          value={psychologist.place?.country || "N/A"}
                        />
                      </InfoCard>

                      <div className="rounded-lg overflow-hidden border border-gray-200">
                        <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <h3 className="text-sm font-medium text-gray-700">
                              Full Address
                            </h3>
                          </div>
                        </div>
                        <div className="p-4 text-gray-700">
                          {psychologist.place?.houseName},{" "}
                          {psychologist.place?.street}
                          <br />
                          {psychologist.place?.city},{" "}
                          {psychologist.place?.district}
                          <br />
                          {psychologist.place?.state} -{" "}
                          {psychologist.place?.pincode}
                          <br />
                          {psychologist.place?.country}
                        </div>
                      </div>
                    </div>
                  </TabContent>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3 flex-shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const TabButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-1 text-sm font-medium transition-colors ${
      active ? "bg-white text-indigo-700" : "text-white/80 hover:bg-white/10"
    }`}
    onClick={onClick}
  >
    {icon}
    {label}
  </button>
);

const TabContent = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
      <h3 className="font-medium text-gray-800">{title}</h3>
    </div>
    <div className="divide-y divide-gray-100">{children}</div>
  </div>
);

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="px-4 py-3 flex items-start gap-3">
    <div className="flex-shrink-0 mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <div className="text-gray-900">
        {value || <span className="text-gray-400">Not provided</span>}
      </div>
    </div>
  </div>
);

const ContactCard = ({
  icon,
  title,
  detail,
  action,
  href,
  color,
  buttonColor,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  action: string;
  href: string;
  color: string;
  buttonColor: string;
}) => (
  <div className={`rounded-lg border p-4 ${color}`}>
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h3 className="font-medium">{title}</h3>
    </div>
    <p className="text-gray-700 mb-4 text-sm">{detail}</p>
    <a
      href={href}
      className={`block text-center py-2 rounded-lg text-white text-sm font-medium ${buttonColor}`}
    >
      {action}
    </a>
  </div>
);

export default PsychologistDetails;
