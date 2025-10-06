import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchGroups } from "@/api/groups/groupsApi";

import CommunityBanner from "@/components/community/banner";
import CreateOwnGroup from "@/components/community/createGroup";
import GroupsSection from "@/components/community/groups";
import LetsRevive from "@/components/community/letsRevive/letsRevive";

const Community = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: groups,
    error,
    loading,
  } = useSelector((state: RootState) => state.groups);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  if (loading) return <p className="text-center">Loading groups...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <CommunityBanner />
      <div className="max-w-7xl my-5 mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <GroupsSection groups={groups} />
        <LetsRevive />
        <CreateOwnGroup />
      </div>
    </>
  );
};

export default Community;
