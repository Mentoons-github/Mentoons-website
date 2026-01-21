import axiosInstance from "@/api/axios";
import AboutSection from "@/components/adda/userProfile/aboutSection";
import FriendsSection from "@/components/adda/userProfile/freindSections";
import ErrorDisplay from "@/components/adda/userProfile/loader/errorDisplay";
import LoadingSpinner from "@/components/adda/userProfile/loader/spinner";
// import PostsList from "@/components/adda/userProfile/postList";
import ProfileHeader from "@/components/adda/userProfile/profilesHeader";
import ProfileTabs from "@/components/adda/userProfile/profileTabs";
import { TabType, User, UserSummary } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Post, PostType } from "./userProfile";
import ProfilePostCard from "@/components/adda/home/addPosts/ProfilePostCard";
import { PostData } from "@/components/adda/home/addPosts/PostCard";

const ProfileDetails = () => {
  const { userId } = useParams();
  const { user: currentUser, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [numberOfPosts, setNumberOfPosts] = useState<number>(0);
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const res = await axiosInstance.get("user/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUserId(res.data.data._id);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError(err instanceof Error ? err.message : "Failed to load user data");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setUser(null);
    setUserPosts([]);
    if (!userId) {
      setError("User ID is required");
      setIsLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("No token found");
        }
        const response = await axiosInstance.get(`/user/friend/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data.user);
        setFollowers(response.data.data.user.followers);
        setFollowing(response.data.data.user.following);

        fetchUserPosts(userId);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user data",
        );
        setIsLoading(false);
      }
    };

    const fetchUserFriends = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("No token found");
        }
        const response = await axiosInstance("/adda/getFriends/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(response.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user posts",
        );
        setIsLoading(false);
      }
    };

    const fetchUserPosts = async (uid: string) => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("No token found");
        }
        const response = await axiosInstance(`/posts/friends-post/${uid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const formattedPosts = response.data.data.map(
          (post: Partial<Post>) => ({
            ...post,
            postType: (post.postType as PostType) || "text",
            user: post.user || {
              _id: user?._id || "",
              name: user?.name || "",
              picture: user?.picture || "",
              email: user?.email || "",
            },
            shares: post.shares || [],
            saves: post.saves || 0,
            visibility: post.visibility || "public",
          }),
        );

        setNumberOfPosts(formattedPosts.length ?? 0);
        setUserPosts(formattedPosts as unknown as Post[]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user posts",
        );
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchUserFriends();
  }, [userId]);

  if (isLoading) {
    return <LoadingSpinner message="Loading user profile..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!user) {
    return (
      <ErrorDisplay
        message="User not found"
        description="The requested user profile could not be loaded or doesn't exist."
      />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto ">
            {userPosts.map((post) => (
              <div
                onClick={() => navigate(`/adda/post/${post._id}`)}
                className="flex flex-col items-center justify-start w-full gap-5 p-2 border border-orange-200 rounded-xl min-h-fit"
              >
                <ProfilePostCard
                  setUserPosts={setUserPosts}
                  isUser={true}
                  key={post._id}
                  post={post as unknown as PostData}
                />
              </div>
            ))}
          </div>
        );
      // <PostsList posts={userPosts} user={user} />;

      case "about":
        return <AboutSection user={user} />;
      case "friends":
        return <FriendsSection friends={friends} />;
      default:
        return null;
    }
  };

  const isCurrentUser = isLoaded && user?.clerkId === currentUser?.id;
  const reduceFollower = () => {
    setFollowers((prev) => prev.filter((_id) => _id !== currentUserId));
  };
  const addFollowing = () => {
    setFollowing((prev) => [...prev, currentUserId]);
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-full px-2 pt-4 mx-auto sm:max-w-3xl md:max-w-4xl lg:max-w-5xl sm:pt-6 md:pt-8 ">
        <ProfileHeader
          user={user}
          totalPosts={numberOfPosts}
          totalFollowing={following}
          totalFollowers={followers}
          isCurrentUser={isCurrentUser}
          currentUserClerkId={currentUser?.id}
          reduceFollower={reduceFollower}
          addFollowing={addFollowing}
          currentUserId={currentUserId}
        />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-4 sm:mt-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProfileDetails;
