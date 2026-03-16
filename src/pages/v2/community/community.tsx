import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchGroups } from "@/redux/community/groupsThunk";

import CommunityBanner from "@/components/community/banner";
import CreateOwnGroup from "@/components/community/createGroup";
import GroupsSection from "@/components/community/groups";
import LetsRevive from "@/components/community/letsRevive/letsRevive";
import { useAuth } from "@clerk/clerk-react";

const Community = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: groups,
    error,
    loading,
  } = useSelector((state: RootState) => state.groups);
  const { getToken } = useAuth();

  const fetchAllGroups = async () => {
    const token = await getToken();
    if (!token) return;
    await dispatch(fetchGroups(token));
  };

  useEffect(() => {
    fetchAllGroups();
  }, []);

  return (
    <>
      <CommunityBanner />
      <div className="max-w-7xl my-5 mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <GroupsSection
          groups={groups}
          loading={loading}
          error={error}
          refetch={fetchAllGroups}
        />
        <LetsRevive />
        <CreateOwnGroup />
      </div>
    </>
  );
};

export default Community;
