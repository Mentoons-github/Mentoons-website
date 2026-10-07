import { Plus } from "lucide-react";

interface CreateOwnGroupProps {
  onOpenForm: () => void;
}

export default function CreateOwnGroup({ onOpenForm }: CreateOwnGroupProps) {
  return (
    <div className="px-4 py-10 md:py-16">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
          BUILD YOUR COMMUNITY
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Do you have a great idea? Create a group to connect with others — your
          community starts here!
        </p>
        <button
          onClick={onOpenForm}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-3 text-lg"
        >
          <Plus className="w-6 h-6" />
          Start a New Group
        </button>
      </div>
    </div>
  );
}
