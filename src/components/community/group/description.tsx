import { Users, MapPin } from "lucide-react";

const GroupDescription = ({ description }: { description: string }) => {
  return (
    <div className="mt-8 p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h1 className="text-left text-3xl font-bold text-gray-800 mb-4">
              About this group
            </h1>
            <p className="text-left text-base leading-relaxed text-gray-700 mb-4">
              {description}
            </p>

            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Private group</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Online community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDescription;
