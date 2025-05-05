import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import Feed from "../Feed";
import { PostData } from "../PostCard";

const Posts = () => {
  const [posts, setPosts] = useState<PostData[]>([
    {
      _id: "1",
      postType: "text",
      user: {
        _id: "user1",
        name: "John Doe",
        role: "Student",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
      content:
        "This is a simple text post. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.",
      title: "My First Post",
      likes: [],
      comments: [],
      shares: [],
      createdAt: new Date().toISOString(),
      visibility: "public",
      tags: ["welcome", "first-post"],
    },
    {
      _id: "2",
      postType: "photo",
      user: {
        _id: "user2",
        name: "Jane Smith",
        role: "Teacher",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
      content: "Check out these awesome photos!",
      media: [
        {
          url: "https://images.unsplash.com/photo-1706812639572-255a585a5c28",
          type: "image",
          caption: "Beautiful landscape",
        },
        {
          url: "https://images.unsplash.com/photo-1708126914174-1a36aef617ee",
          type: "image",
        },
      ],
      likes: [{ _id: "user1" }],
      comments: [],
      shares: [],
      createdAt: new Date().toISOString(),
      visibility: "public",
      location: "New York, NY",
    },
    {
      _id: "3",
      postType: "video",
      user: {
        _id: "user3",
        name: "Alex Johnson",
        role: "Content Creator",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
      title: "My Latest Video",
      content: "Just uploaded this awesome video! Let me know what you think.",
      media: [
        {
          url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
          type: "video",
          caption: "Sample Video",
        },
      ],
      likes: [],
      comments: [],
      shares: [],
      createdAt: new Date().toISOString(),
      visibility: "public",
      tags: ["video", "tutorial"],
    },
    {
      _id: "4",
      postType: "article",
      user: {
        _id: "user4",
        name: "Sarah Williams",
        role: "Writer",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
      title: "My Latest Article",
      article: {
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam nec dui. Quisque nec mauris sit amet elit iaculis pretium sit amet quis magna. Aenean velit odio, elementum in tempus ut, vehicula eu diam. Pellentesque rhoncus aliquam mattis. Ut vulputate eros sed felis sodales nec vulputate justo hendrerit. Vivamus varius pretium ligula, a aliquam odio euismod sit amet. Quisque laoreet sem sit amet orci ullamcorper at ultricies metus viverra. Pellentesque arcu mauris, malesuada quis ornare accumsan, blandit sed diam.",
        coverImage:
          "https://images.unsplash.com/photo-1707343848610-16f9afe1ae99",
      },
      likes: [{ _id: "user2" }, { _id: "user3" }],
      comments: [],
      shares: [{ _id: "user1" }],
      createdAt: new Date().toISOString(),
      visibility: "public",
      tags: ["article", "writing"],
    },
    {
      _id: "5",
      postType: "event",
      user: {
        _id: "user5",
        name: "Michael Brown",
        role: "Event Organizer",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
      title: "Community Meetup",
      event: {
        startDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
        endDate: new Date(
          Date.now() + 86400000 * 7 + 3600000 * 2
        ).toISOString(), // 2 hours after start
        venue: "Central Park, New York",
        description:
          "Join us for a community meetup! We'll be discussing upcoming projects and activities.",
        coverImage:
          "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
      },
      likes: [],
      comments: [],
      shares: [],
      createdAt: new Date().toISOString(),
      visibility: "public",
      location: "New York, NY",
      tags: ["event", "community", "meetup"],
    },
    {
      _id: "6",
      postType: "mixed",
      user: {
        _id: "user6",
        name: "Emily Davis",
        role: "Photographer",
        profilePicture:
          "/assets/adda/profilePictures/pexels-stefanstefancik-91227.jpg",
      },
      title: "Trip to Paris",
      content:
        "Just got back from an amazing trip to Paris! Here are some photos and videos from the trip.",
      media: [
        {
          url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
          type: "image",
          caption: "Eiffel Tower",
        },
        {
          url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
          type: "image",
          caption: "Paris streets",
        },
        {
          url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
          type: "video",
          caption: "Walking in Paris",
        },
      ],
      likes: [{ _id: "user1" }, { _id: "user2" }, { _id: "user3" }],
      comments: [],
      shares: [{ _id: "user4" }, { _id: "user5" }],
      createdAt: new Date().toISOString(),
      visibility: "public",
      location: "Paris, France",
      tags: ["travel", "paris", "vacation"],
    },
  ]);

  const user = useUser();
  console.log(user);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("http://localhost:4000/api/v1/posts");
      console.log(response.data.data);
      setPosts(response.data.data);
    };
    fetchPosts();
  }, []);
  return (
    <div className="flex flex-col items-center justify-start w-full gap-5">
      <Feed posts={posts} />
    </div>
  );
};

export default Posts;
