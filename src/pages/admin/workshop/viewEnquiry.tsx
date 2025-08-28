import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import Loader from "@/components/common/admin/loader";
import { getEnquiryById } from "@/redux/admin/workshop";
import { SingleWorkshopEnquiryResponse } from "@/types/admin";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Clock,
  PhoneCall,
  Copy,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ViewEnquiry = () => {
  const { enquiryId } = useParams<{ enquiryId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { enquiry, loading, error, success } = useSelector(
    (state: RootState) => state.adminWorkshop
  );
  const enquiryData: SingleWorkshopEnquiryResponse["data"] | undefined =
    enquiry?.data;

  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (enquiryId) {
      dispatch(getEnquiryById({ enquiryId }));
    }
  }, [dispatch, enquiryId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCall = () => {
    if (enquiryData?.phone) {
      window.location.href = `tel:${enquiryData.phone}`;
    } else {
      toast.error("Phone number not available");
    }
  };

  const handleEmail = () => {
    if (enquiryData?.email) {
      window.location.href = `mailto:${enquiryData.email}?subject=Regarding Your Workshop Enquiry`;
    } else {
      toast.error("Email not available");
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getEnquiryStatus = () => {
    // You can implement your own status logic here
    return "pending"; // or "contacted", "resolved", etc.
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "Pending Review",
      },
      contacted: {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
        text: "Contacted",
      },
      resolved: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Resolved",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon className="w-4 h-4 mr-1.5" />
        {config.text}
      </span>
    );
  };

  const InfoCard = ({
    icon: Icon,
    title,
    children,
    gradient = "from-blue-500 to-purple-600",
  }: {
    icon: any;
    title: string;
    children: React.ReactNode;
    gradient?: string;
  }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${gradient} px-6 py-4`}>
        <div className="flex items-center text-white">
          <Icon className="w-6 h-6 mr-3" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const CopyableField = ({
    label,
    value,
    fieldName,
    icon: Icon,
  }: {
    label: string;
    value: string;
    fieldName: string;
    icon?: any;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {Icon && <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />}
          <span className="text-gray-900 font-medium truncate">{value}</span>
        </div>
        <button
          onClick={() => copyToClipboard(value, fieldName)}
          className="ml-3 p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          title={`Copy ${fieldName}`}
        >
          {copiedField === fieldName ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader />
      </div>
    );
  }

  if (!enquiryData && success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto pt-16">
          <div className="text-center bg-white rounded-2xl shadow-xl p-8">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Enquiry Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The enquiry you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Enquiries
            </button>
            <StatusBadge status={getEnquiryStatus()} />
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Enquiry Details
            </h1>
            <p className="text-gray-600">
              Complete information about the workshop enquiry
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCall}
                disabled={!enquiryData?.phone}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <PhoneCall className="w-5 h-5 mr-2" />
                Call Enquirer
              </button>

              <button
                onClick={handleEmail}
                disabled={!enquiryData?.email}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </button>

              <button
                onClick={() =>
                  copyToClipboard(
                    `${enquiryData?.firstname} ${enquiryData?.lastname}\nEmail: ${enquiryData?.email}\nPhone: ${enquiryData?.phone}\nWorkshop: ${enquiryData?.workshop}\nMessage: ${enquiryData?.message}`,
                    "enquiry details"
                  )
                }
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Copy className="w-5 h-5 mr-2" />
                Copy Details
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student Information */}
          <InfoCard
            icon={User}
            title="Student Information"
            gradient="from-blue-500 to-blue-600"
          >
            <div className="space-y-6">
              <CopyableField
                label="Full Name"
                value={
                  `${enquiryData?.firstname || ""} ${
                    enquiryData?.lastname || ""
                  }`.trim() || "Not provided"
                }
                fieldName="name"
                icon={User}
              />

              <CopyableField
                label="Email Address"
                value={enquiryData?.email || "Not provided"}
                fieldName="email"
                icon={Mail}
              />
            </div>
          </InfoCard>

          {/* Contact Information */}
          <InfoCard
            icon={Phone}
            title="Contact Information"
            gradient="from-green-500 to-green-600"
          >
            <div className="space-y-6">
              <CopyableField
                label="Phone Number"
                value={enquiryData?.phone || "Not provided"}
                fieldName="phone"
                icon={Phone}
              />
            </div>
          </InfoCard>

          {/* Workshop Details */}
          <InfoCard
            icon={Building2}
            title="Workshop Details"
            gradient="from-purple-500 to-purple-600"
          >
            <div className="space-y-6">
              <CopyableField
                label="Workshop Name"
                value={enquiryData?.workshop || "Not provided"}
                fieldName="workshop"
                icon={Building2}
              />
            </div>
          </InfoCard>

          {/* Message */}
          <InfoCard
            icon={MessageSquare}
            title="Enquiry Message"
            gradient="from-orange-500 to-red-500"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Message Content
              </label>
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-400">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {enquiryData?.message || "No message provided"}
                </p>
              </div>
              {enquiryData?.message && (
                <button
                  onClick={() =>
                    copyToClipboard(enquiryData.message, "message")
                  }
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy message
                </button>
              )}
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default ViewEnquiry;
