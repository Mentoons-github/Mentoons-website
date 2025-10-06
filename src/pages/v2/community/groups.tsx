import GroupBanner from "@/components/community/group/groupDetail";
import GroupMembers from "@/components/community/group/members";
import GroupChat from "./groupChat";
import GroupPolls from "./groupPoll";
import GroupTabs from "@/components/community/group/tabs";
import { useEffect, useState } from "react";
import GroupDescription from "@/components/community/group/description";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchGroupById } from "@/api/groups/groupsApi";
import { useAuth } from "@clerk/clerk-react";
import { useAuthModal } from "@/context/adda/authModalContext";

export type ActiveTabType = "MEMBERS" | "CHAT" | "POLLS";

interface CommunityGroupsProps {}

const CommunityGroups: React.FC<CommunityGroupsProps> = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("MEMBERS");
  const { getToken } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { id: groupId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedGroup, error, loading } = useSelector(
    (state: RootState) => state.groups
  );

  useEffect(() => {
    const fetchGroup = async () => {
      if (!groupId) {
        console.warn("No groupId provided in URL params!");
        return;
      }
      const token = await getToken();
      if (!token) {
        openAuthModal("sign-in");
        return;
      }
      console.log("Dispatching fetchGroupById for:", groupId);
      await dispatch(fetchGroupById({ groupId, token }));
    };
    fetchGroup();
  }, [groupId, dispatch]);

  const handleTabChange = (tab: ActiveTabType) => {
    setActiveTab(tab);
    console.log("Tab changed to:", tab);
  };

  // Log for debugging
  console.log("groupId:", groupId);
  console.log("selectedGroup:", selectedGroup);
  console.log("loading:", loading, "error:", error);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading group...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Error Loading Group
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={async () => {
              if (groupId) {
                const token = await getToken();
                if (!token) {
                  openAuthModal("sign-in");
                  return;
                }
                dispatch(fetchGroupById({ groupId, token }));
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!groupId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No group selected</p>
        </div>
      </div>
    );
  }

  if (!selectedGroup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Group not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GroupBanner group={selectedGroup} />
      <GroupDescription description={selectedGroup.details.description} />
      <GroupTabs activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="pb-10">
        {activeTab === "MEMBERS" && (
          <GroupMembers members={selectedGroup.members || []} />
        )}
        {activeTab === "CHAT" && <GroupChat />}
        {activeTab === "POLLS" && <GroupPolls groupId={groupId} />}
      </div>
    </>
  );
};

export default CommunityGroups;
