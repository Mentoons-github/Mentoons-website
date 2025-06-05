import { Button } from "@/components/ui/button";
import { memo } from "react";
import { FiAlertCircle } from "react-icons/fi";

interface ProfileCompletionProps {
  profileCompletionPercentage: number;
  incompleteFields: string[];
  setShowCompletionForm: (value: boolean) => void;
}

const ProfileCompletion = memo(
  ({
    profileCompletionPercentage,
    incompleteFields,
    setShowCompletionForm,
  }: ProfileCompletionProps) => (
    <div className="p-6 mt-6 border border-orange-200 bg-orange-50 rounded-xl shadow-sm">
      <div className="flex items-start gap-4">
        <FiAlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-orange-800">
            Complete Your Profile
          </h3>
          <p className="mt-2 text-sm text-orange-700">
            Enhance your experience by completing your profile information.
          </p>
          <div className="mt-4">
            <div className="relative h-3 bg-orange-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${profileCompletionPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-orange-600">
              {profileCompletionPercentage}% complete
            </p>
            {incompleteFields.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-orange-700">Missing:</p>
                <ul className="flex flex-wrap gap-2 mt-2 text-sm text-orange-700 list-disc pl-5">
                  {incompleteFields.slice(0, 5).map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                  {incompleteFields.length > 5 && (
                    <li>and {incompleteFields.length - 5} more...</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <Button
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setShowCompletionForm(true)}
          >
            Complete Profile
          </Button>
        </div>
      </div>
    </div>
  )
);

export default ProfileCompletion;
