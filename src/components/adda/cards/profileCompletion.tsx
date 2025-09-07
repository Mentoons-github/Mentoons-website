import { AlertCircle, CheckCircle, Edit3, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileCompletionTooltipProps {
  isAnimating: boolean;
  isProfileComplete: boolean;
  profileCompletionPercentage: number;
  incompleteFields: string[];
  handleCloseTooltip: () => void;
  handleEditProfile: () => void;
}

const ProfileCompletionTooltip = ({
  isAnimating,
  isProfileComplete,
  profileCompletionPercentage,
  incompleteFields,
  handleCloseTooltip,
  handleEditProfile,
}: ProfileCompletionTooltipProps) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40"
        onClick={handleCloseTooltip}
      />
      <div
        className={`
          relative mr-4 bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm z-50
          transform transition-all duration-300 ease-out
          ${
            isAnimating
              ? "scale-100 opacity-100 translate-x-0"
              : "scale-95 opacity-0 translate-x-4"
          }
        `}
      >
        <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-white border-t-8 border-t-transparent border-b-8 border-b-transparent" />
        <button
          onClick={handleCloseTooltip}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close"
        >
          <X size={16} className="text-gray-400" />
        </button>
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                {isProfileComplete ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Profile Complete!
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                    Almost There
                  </>
                )}
              </h3>
              <span className="text-sm font-semibold text-gray-500">
                {profileCompletionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isProfileComplete
                    ? "bg-green-500"
                    : "bg-gradient-to-r from-orange-500 to-orange-400"
                }`}
                style={{ width: `${profileCompletionPercentage}%` }}
              />
            </div>
          </div>
          {isProfileComplete ? (
            <p className="text-gray-600 mb-4">
              🎉 Your profile is now complete! You're all set to make the most
              of your experience.
            </p>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Complete these {incompleteFields.length} fields to unlock your
                full profile potential:
              </p>
              <ul className="space-y-2 mb-4">
                {incompleteFields.map((field, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0" />
                    <span className="text-sm">{field}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button
            onClick={handleEditProfile}
            className={`
              w-full font-semibold rounded-lg px-4 py-3 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center
              ${
                isProfileComplete
                  ? "bg-gradient-to-r from-green-500 to-green-400 text-white hover:shadow-lg"
                  : "bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:shadow-lg"
              }
            `}
          >
            <Edit3 size={16} className="mr-2" />
            {isProfileComplete ? "View Profile" : "Complete Profile"}
          </button>
        </div>
      </div>
    </>
  );
};

const ProfileCompletionWidget = ({
  profileCompletionPercentage,
  incompleteFields,
  setShowCompletionForm,
  isProfileComplete,
}: {
  profileCompletionPercentage: number;
  incompleteFields: string[];
  setShowCompletionForm: (value: boolean) => void;
  isProfileComplete: boolean;
}) => {
  const [showIncompleteFields, setShowIncompleteFields] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (showIncompleteFields) {
      setIsAnimating(true);
    }
  }, [showIncompleteFields]);

  const handleToggleFields = () => {
    setShowIncompleteFields(!showIncompleteFields);
    if (!showIncompleteFields) {
      setIsAnimating(false);
      setTimeout(() => setIsAnimating(true), 50);
    }
  };

  const handleCloseTooltip = () => {
    setShowIncompleteFields(false);
    setIsAnimating(false);
  };

  const handleEditProfile = () => {
    setShowIncompleteFields(false);
    setShowCompletionForm(true);
    setIsAnimating(false);
  };

  return (
    <div className="fixed right-6 top-1/2 z-50 flex items-center transform -translate-y-1/2">
      {showIncompleteFields && (
        <ProfileCompletionTooltip
          isAnimating={isAnimating}
          isProfileComplete={isProfileComplete}
          profileCompletionPercentage={profileCompletionPercentage}
          incompleteFields={incompleteFields}
          handleCloseTooltip={handleCloseTooltip}
          handleEditProfile={handleEditProfile}
        />
      )}
      <button
        onClick={handleToggleFields}
        className={`
          relative font-semibold rounded-full px-5 py-3 shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95
          ${
            isProfileComplete
              ? "bg-gradient-to-r from-green-500 to-green-400 text-white hover:shadow-green-200"
              : "bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:shadow-orange-200"
          }
          hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:ring-opacity-50
        `}
        aria-label={`Profile completion: ${profileCompletionPercentage}% complete`}
      >
        {!isProfileComplete && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center px-2 animate-pulse">
            {incompleteFields.length}
          </span>
        )}
        <span className="flex items-center">
          {isProfileComplete ? (
            <>
              <CheckCircle size={16} className="mr-2" />
              Complete
            </>
          ) : (
            "Complete Profile"
          )}
        </span>
      </button>
    </div>
  );
};

export default ProfileCompletionWidget;
