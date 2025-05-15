import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "@/components/adda/userProfile/profilesHeader";
import ProfileTabs from "@/components/adda/userProfile/profileTabs";
import PostsList from "@/components/adda/userProfile/postList";
import AboutSection from "@/components/adda/userProfile/aboutSection";
import FriendsSection from "@/components/adda/userProfile/freindSections";
import LoadingSpinner from "@/components/adda/userProfile/loader/spinner";
import ErrorDisplay from "@/components/adda/userProfile/loader/errorDisplay";
import { TabType, User, UserSummary } from "@/types";
import { Post, PostType } from "./userProfile";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "@/api/axios";

const ProfileDetails = () => {
  const { userId } = useParams();
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [numberOfPosts, setNumberOfPosts] = useState<number>(0);
  const [numberOffollowers, setNumberOffollowers] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        const response = await axiosInstance.get(`/user/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        console.log(response.data);
        setUser(response.data.data);

        fetchUserPosts(userId);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user data"
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

        console.log(response.data.data);
        setFriends(response.data.data);
        setNumberOffollowers(response.data.data.length ?? 0);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user posts"
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
        const response = await axiosInstance(`/posts/user/${uid}`, {
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
          })
        );
        setNumberOfPosts(formattedPosts.length ?? 0);
        setUserPosts(formattedPosts as unknown as Post[]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user posts"
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
        return <PostsList posts={userPosts} user={user} />;
      case "about":
        return <AboutSection user={user} />;
      case "friends":
        return <FriendsSection friends={friends} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ProfileHeader
          user={user}
          totalPosts={numberOfPosts}
          totalFollowing={numberOffollowers}
        />

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProfileDetails;
