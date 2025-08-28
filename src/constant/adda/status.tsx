import { XCircle, Sparkles, Shield, Heart, Users } from "lucide-react";

export const DOS = [
  {
    text: "Post your success stories and achievements",
    icon: <Sparkles className="w-4 h-4" />,
    category: "Achievement",
  },
  {
    text: "Share your journey as an influencer or content creator",
    icon: <Sparkles className="w-4 h-4" />,
    category: "Influencer",
  },
  {
    text: "Show your hobbies or passions (gaming, art, music)",
    icon: <Users className="w-4 h-4" />,
    category: "Personal",
  },
  {
    text: "Share stories from your experiences as a gamer, artist, or creator",
    icon: <Users className="w-4 h-4" />,
    category: "Experiences",
  },
];

export const DONTS = [
  {
    text: "Don't upload offensive or pornographic content",
    icon: <XCircle className="w-4 h-4" />,
    category: "Content",
  },
  {
    text: "Avoid hate speech, bullying, or harassment",
    icon: <Shield className="w-4 h-4" />,
    category: "Behavior",
  },
  {
    text: "Don't post spam or irrelevant content",
    icon: <XCircle className="w-4 h-4" />,
    category: "Content",
  },
  {
    text: "Avoid controversial topics that may hurt others",
    icon: <Heart className="w-4 h-4" />,
    category: "Sensitivity",
  },
];
