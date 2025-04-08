import { CardType, ProductType } from "@/utils/enum";
import {
  FaChalkboard,
  FaCreditCard,
  FaMoon,
  FaPhone,
  FaShare,
  FaShoppingCart,
} from "react-icons/fa";
import { FaCalendarCheck, FaChartBar, FaCoins, FaUsers } from "react-icons/fa6";
import { IconType } from "react-icons/lib";

export const CATEGORIES = [
  "Comedy",
  "History",
  "True Crime",
  "Culture",
  "Self-Care",
  "Stories",
];

// Type For category constant

export const PODCAST_DETAILS = [
  {
    id: 1,
    topic: "Negative impact of Mobile phone",
    description:
      "Podcast Negative Impact of Mobile Phones takes a closer look at the consequences of our constant connection to the digital world. Through expert insights, real-life stories, and research-backed discussions, we explore how excessive mobile phone usage can affect mental health, disrupt relationships, and hinder personal growth. Each episode uncovers the hidden costs of living through a screen and offers strategies to reclaim balance, improve focus, and foster deeper connections with the world around us.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/negative_impact_of_mobile.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/negative_impact_of_mobile.mp3",
    thumbnail: "/assets/images/negative-impact-of-mobile-phone.jpg", //todo Change it.
    category: "mobile addiction",
    age: "",
    author: "Haaris Rueben",
    duration: "",
  },
  {
    id: 2,
    topic: "Negative impact of social media",
    description:
      "Podcast on Negative Impact of Social Media delves into the darker side of the digital landscape and its effects on mental health, self-esteem, and social relationships. Each episode uncovers how excessive use of social platforms can lead to anxiety, comparison, isolation, and addiction. Through expert interviews, personal stories, and actionable advice, we explore the psychological toll of social media and offer strategies to create healthier habits, foster genuine connections, and regain control over our digital lives.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/negative-impact-of-social-media.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/negative-impact-of-social-media.mp3",
    thumbnail: "/assets/images/negative-impact-of-social-media.jpg", //todo Change it
    category: "mobile addiction",
    age: "",
    author: "Haaris Rueben",
    duration: "",
  },
  {
    id: 3,
    topic: "How does it feel to be an teenager",
    description:
      "Podcast on How Does It Feel to Be a Teenager explores the unique challenges and experiences of adolescence in today's fast-paced world. Each episode dives into topics like identity, peer pressure, mental health, and navigating relationships during this transformative phase of life. Featuring candid conversations with teens, experts, and influencers, we shed light on the emotions, struggles, and joys that come with being a teenager. Together, we'll provide insights and advice to help teens feel understood, empowered, and confident in their journey to adulthood.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/how-does-it-feet-to-be-an-teenager-orignals.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/how-does-it-feet-to-be-an-teenager-orignals.mp3",
    thumbnail: "/assets/images/how-does-it-feel-to-be-teenager.jpg",
    category: "teen emotions",
    age: "",
    author: "Haaris Rueben",
    duration: "",
  },
  {
    id: 4,
    topic: "Performance Addiction",
    description:
      "Podcast on Performance Addiction explores the relentless pursuit of achievement and perfection in today's competitive culture. Each episode delves into how the pressure to constantly excel—whether in academics, career, or personal life—can lead to burnout, anxiety, and a diminished sense of self-worth. Through interviews with psychologists, performance coaches, and individuals who have struggled with this addiction, we unpack the harmful effects of an overemphasis on success and offer strategies to cultivate self-acceptance, balance, and fulfillment beyond mere performance.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/perfomance-addiction.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/perfomance-addiction.mp3",
    thumbnail: "/assets/images/perfomance-addiction.jpg",
    category: "teen emotions",
    age: "",
    author: "Haaris Rueben",
    duration: "",
  },
  // todo change the content
  {
    id: 5,
    topic: "The Magic of play without phone",
    description:
      "Social Media Reward System delves into how platforms use rewards to keep users hooked. Understand the psychology behind likes, shares, and notifications in this eye-opening podcast.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/the-magic-of-play-without-phone.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/the-magic-of-play-without-phone.mp3",
    thumbnail: "/assets/images/social-media-reward-system.jpg", // todo change this
    category: "mobile addiction",
    age: "",
    author: "Kisha Kothari",
    duration: "",
  },
  {
    id: 6,
    topic: "Common Parenting Mistake",
    description:
      "Podcast on Common Parenting Mistakes offers a compassionate and insightful look into the missteps many parents make in raising their children. Each episode explores topics like overprotection, inconsistency, unrealistic expectations, and miscommunication, revealing how these actions can impact a child's emotional and behavioral development. Through expert interviews and real-life anecdotes, we provide practical advice to help parents recognize and correct these mistakes, fostering healthier relationships, stronger communication, and a nurturing environment for their children to thrive..",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/common-parrenting-mistake-orignals.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/common-parrenting-mistake-orignals.mp3",
    thumbnail: "/assets/images/common-parenting-mistakes.jpg",
    category: "teen emotions",
    age: "",
    author: "Kisha Kothari",
    duration: "",
  },
  {
    id: 7,
    topic: "Entertainment Addiction",
    description:
      "Podcast on Entertainment Addiction delves into the growing dependency on entertainment and its impact on our daily lives. Each episode examines how excessive consumption of TV, video games, social media, and other forms of entertainment can lead to decreased productivity, social isolation, and mental health challenges. Through expert insights, personal stories, and practical tips, we explore ways to strike a healthier balance between entertainment and real-life responsibilities, fostering a more fulfilling and engaged lifestyle.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/entertainment-addiction-orignals.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/entertainment-addiction-orignals.mp3",
    thumbnail: "/assets/images/Entertainment_Addiction_ 2.jpg",
    category: "gaming addiction",
    age: "",
    author: "Haaris Rueben",
    duration: "",
  },
  {
    id: 8,
    topic: "Toddler phone Addiction",
    description:
      "Podcast on Toddler Phone Addiction investigates the effects of early exposure to screens on young children's development and behavior. Each episode explores how excessive phone use can impact toddlers' cognitive, social, and emotional growth, and offers insights into the challenges faced by parents in managing screen time. Through expert interviews, case studies, and practical advice, we provide strategies for creating healthy screen habits, encouraging interactive play, and supporting a balanced approach to technology in early childhood.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/toddler-phone-addiction.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/toddler-phone-addiction.mp3",
    thumbnail: "/assets/images/toddler-phone-addiction.jpg",
    category: "mobile addiction",
    age: "",
    author: "Kisha Kothari",
    duration: "",
  },
  {
    id: 9,
    topic: "Social media de-addiction",
    description:
      "Podcast on Social Media De-addiction explores the journey to breaking free from the grips of excessive social media use. Each episode delves into the effects of social media addiction on mental health, relationships, and productivity, and offers practical advice for reclaiming control. Featuring insights from experts, personal success stories, and actionable strategies, we guide listeners through the process of reducing screen time, fostering healthier online habits, and finding a more balanced, fulfilling life beyond the screen.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/social-media-de-addiction-orignals.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/social-media-de-addiction-orignals.mp3",
    thumbnail: "/assets/images/social-media-de-addiction.jpg",
    category: "mobile addiction",
    age: "6-12",
    author: "Kisha Kothari",
    duration: "",
  },
  {
    id: 10,
    topic: "Teen Emotions and Behavioural Problems",
    description:
      "Podcast on Teen Emotions and Behavioral Problems addresses the complex emotional and behavioral challenges faced by adolescents. Each episode explores issues such as mood swings, anxiety, defiance, and social pressures, providing a deep dive into the underlying causes and impacts. Through expert interviews, real-life stories, and practical advice, we aim to offer parents, educators, and teens themselves insights into managing and understanding these emotional and behavioral struggles, fostering a supportive environment for healthy growth and development.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/teen-emotional-and-behavioural-problems-orignals.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/teen-emotional-and-behavioural-problems-orignals.mp3",
    thumbnail: "/assets/images/Teen_emotion_&_behaviour_problems_ 2.jpg",
    category: "teen emotions",
    age: "6-12",
    author: "Kisha Kothari",
    duration: "",
  },
  {
    id: 11,
    topic: "The Magical Journey to self Discovery",
    description:
      "Podcast on The Magical Journey to Self-Discovery invites listeners to embark on a transformative exploration of personal growth and self-awareness. Each episode delves into various paths and practices that lead to uncovering one's true self, including mindfulness, introspection, and personal development strategies. Through inspiring stories, expert advice, and practical tips, we guide you through the process of self-discovery, helping you to embrace your strengths, understand your values, and navigate your unique journey toward a more fulfilling and authentic life.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/magical-journey-to-self-dicovery-orignals.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/magical-journey-to-self-dicovery-orignals.mp3",
    thumbnail: "/assets/images/magical-journey-to-self-discovery.jpg",
    category: "teen emotions",
    age: "6-12",
    author: "Kisha Kothari",
    duration: "",
  },
  {
    id: 12,
    topic: "Maintaining relationship with teenager",
    description:
      "Podcast on Maintaining a Relationship with Your Teenager explores effective strategies for building and sustaining strong connections with adolescents. Each episode addresses common challenges in parent-teen relationships, such as communication barriers, conflicts, and evolving dynamics. Through expert advice, real-life experiences, and practical tips, we provide guidance on fostering trust, understanding, and open dialogue. Whether you're navigating tricky conversations or seeking ways to support and connect with your teenager, this podcast offers valuable insights for maintaining a healthy and positive relationship throughout the teenage years.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/maintaining-relationship-with-teenager-orignals.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/maintaining-relationship-with-teenager-orignals.mp3",
    thumbnail: "/assets/images/maintain-relationship-with-teen.jpg",
    category: "teen emotions",
    age: "6-12",
    author: "Kisha Kothari",
    duration: "",
  },
  {
    id: 13,
    topic:
      "Phrases and sentences parents should not speak in front of children",
    description:
      "Podcast on Phrases and Sentences Parents Should Not Speak in Front of Children focuses on the impact of language on a child's emotional and psychological development. Each episode examines common phrases and statements that can negatively affect self-esteem, behavior, and family dynamics. Through expert insights, real-life examples, and practical advice, we guide parents on how to communicate more effectively and positively. We offer alternative approaches to help foster a supportive and nurturing environment for children to thrive emotionally and mentally.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/phrases-sentences-orignals.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/phrases-sentences-orignals.mp3",
    thumbnail: "/assets/images/Phrases_and_sentences_parents.jpg",
    category: "teen emotions",
    age: "6-12",
    author: "Kisha Kothari",
    duration: "",
  },
  {
    id: 14,
    topic: "Role Model For Kids",
    description:
      "Podcast on Role Model for Kids explores the vital role that positive role models play in a child's development. Each episode highlights how behaviors, values, and attitudes demonstrated by parents, caregivers, and other influential figures can shape a child's character and aspirations. Through expert interviews, inspiring stories, and actionable advice, we discuss ways to model integrity, resilience, and kindness. This podcast provides practical tips for adults to embody the qualities they hope to instill in children, helping them become confident, responsible, and compassionate individuals.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/role-models-for-kid-orignals.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/role-models-for-kid-orignals.mp3",
    thumbnail: "/assets/images/Role_Model_For_Kids_.jpg",
    category: "teen emotions",
    age: "2-6",
    author: "Kisha Kothari",
    duration: "",
  },
  {
    id: 15,
    topic: "Things parents do that annoy kids",
    description:
      "Podcast on Things Parents Do That Annoy Kids dives into the everyday behaviors and habits that can frustrate or alienate children and teens. Each episode explores common parental actions and comments—such as overbearing advice, inconsistent rules, or interruptions of personal space—that can lead to conflicts and misunderstandings. Through expert insights, real-life anecdotes, and practical tips, we offer strategies for parents to improve communication, foster mutual respect, and build stronger, more harmonious relationships with their children.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/things-parents-do-that-annoy-kids-orignals.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/things-parents-do-that-annoy-kids-orignals.mp3",
    thumbnail: "/assets/images/Things_parents_do_that_annoy_kids 2.jpg",
    category: "teen emotions",
    age: "2-6",
    author: "Kisha Kothari",
    duration: "",
  },
  {
    id: 16,
    topic: "Electronic gadgets and kids.",
    description:
      "Podcast on Electronic Gadgets and Kids examines the impact of digital devices on children's development and daily lives. Each episode explores how smartphones, tablets, and other gadgets influence aspects such as cognitive development, social skills, and physical health. Through expert interviews, research findings, and practical advice, we address the benefits and potential drawbacks of technology use, offering strategies for setting healthy boundaries and encouraging balanced screen time. Our goal is to help parents and caregivers navigate the digital landscape to support their children's overall well-being and growth.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/electronic-gadgets-and-kids-orignals.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/electronic-gadgets-and-kids-orignals.mp3",
    thumbnail: "/assets/images/Electronic_Gadgets_.jpg",
    category: "mobile addiction",
    age: "2-6",
    author: "Haaris Rueben",
    duration: "",
  },

  {
    id: 17,
    topic: "Reconnecting Gen-Z with value beyond the screen.",
    description:
      "Helping Gen-Z rediscover meaningful connections and life experiences beyond digital screens, fostering deeper relationships and personal growth in a tech-driven world.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/reconnecting-genz-with-value-beyond-the-screen.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/reconnecting-genz-with-value-beyond-the-screen.mp3",
    thumbnail: "/assets/images/reconnecting-genz-with-value-beyond-screen.jpg",
    category: "mobile addiction",
    age: "2-6",
    author: "Haaris Rueben",
    duration: "",
  },
  {
    id: 18,
    topic: "Fun beyond video games",
    description:
      "Helping Gen-Z rediscover meaningful connections and life experiences beyond digital screens, fostering deeper relationships and personal growth in a tech-driven world.",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/fun-beyond-video-game.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/fun-beyond-video-game.mp3",
    thumbnail: "/assets/images/reconnecting-genz-with-value-beyond-screen.jpg",
    category: "gaming addiction",
    age: "2-6",
    author: "Kisha Kothari",
    duration: "",
  },
  {
    id: 19,
    topic: "How to Maintain Healthy Relations",
    description:
      "Podcast on maintaining healthy relationship .A healty realtionship is where you feel the comfort trusted support each other and wellcome",
    audioPodcastSampleSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/how-to-maintain-healthy-relations.mp3",
    audioPodcastSrc:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/how-to-maintain-healthy-relations.mp3",
    thumbnail: "/assets/images/reconnecting-genz-with-value-beyond-screen.jpg",
    category: "teen emotions",
    age: "2-6",
    author: "Kisha Kothari",
    duration: "",
  },
];

export const AGE_CATEGORY = [
  {
    id: 20,
    minAge: 2,
    maxAge: 5,
    ageCategoryBannerImgSrc: "/assets/images/age_2-5.jpg",
    description:
      "Tiny Explorers Gazette: Discoverying the Wonder of The World for Little Ones",
  },
  {
    id: 21,
    minAge: 6,
    maxAge: 12,
    ageCategoryBannerImgSrc: "/assets/images/age_6-12.jpg",
    description:
      "Junior Discoverers Chornicles: Unraveling the Marvels of Knowledge for Young Minds",
  },
  {
    id: 22,
    minAge: 13,
    maxAge: 19,
    ageCategoryBannerImgSrc: "/assets/images/age_13-19.jpg",
    description: "Youth Horizan: Breaking News and Trend for Teens. ",
  },
  {
    id: 23,
    minAge: 20,
    maxAge: "+",
    ageCategoryBannerImgSrc: "/assets/images/age_20+.jpg",
    description: "Beyond Boundaries: News for the Grown-Up Generation.",
  },
];

export const WORKSHOP = [
  {
    id: 33,
    label: "Buddy Camp",
    imageURL: "/assets/images/buddy-camp.png",
    pageUrl: "/mentoons-workshops?workshop=buddy",
  },
  {
    id: 34,
    label: "Teen Camp",
    imageURL: "/assets/images/teen-camp.png",
    pageUrl: "/mentoons-workshops?workshop=teen",
  },
  {
    id: 35,
    label: "Family Camp",
    imageURL: "/assets/images/family-camp.png",
    pageUrl: "/mentoons-workshops?workshop=family",
  },
];

export const SHEET_FILTER = [
  {
    id: 36,
    label: "Comic",
  },
  {
    id: 37,
    label: "Podcast",
  },
  {
    id: 38,
    label: "Workshop",
  },
];

export const OPEN_POSITION = [
  {
    id: 39,
    jobId: "JOB001",
    jobTitle: "MERN Developer",
    jobDescription: `We are currently seeking a Backend Developer to join our
     dynamic team. This individual will play a vital role 
     enabling the development of e-commerce, managing databases, 
     assisting in podcast creation and supporting YouTube channel
      content. The ideal candidate will have an extensive experience of working with full Stack MERN and managing MongoDB databases.
    `,
    jobRequirement: [
      ` Experience working as a Full stack Engineer on product(s) with 1
            million + users across web and mobile applications`,
      ` Experience with React/Node; including: MySQL/MySQL, Express, React,
            Redux, Node.js, TypeScript and hands on experience of developing
            with Google Firebase`,
      ` An exceptional understanding of secure and scalable application
            development, including the full lifecycle of API microservices
            services, including authentication, API gateways and versioning`,
      `Strong enthusiasm for technology, you enjoy developing code in your
            own time and are up to date with current tools and best practices
            around development, DevOps and software management`,
      `  Detailed, hands-on knowledge of CI/CD pipelines to automate builds
            and quality checks – ideally using Azure DevOps`,
    ],

    skills: [
      "HTML",
      "CSS",
      "JAVSCRIPT",
      "REACT",
      "NODE.JS",
      "EXPRESS.JS",
      "MONGODB",
      "TYPESCRIPT",
    ],
    jobIllustration: "/assets/images/developer.png",
    jobType: "On-site",
    jobDuration: "Full-time",
    salary: 500000,
  },
  {
    id: 40,
    jobId: "JOB002",
    jobTitle: "Anchor",
    jobDescription:
      "Join Mentoons as an Anchor, where you'll connect with our audience through YouTube videos and social media Your role includes introducing new products and conducting insightful interviews with experts. We seek excellent communication skills, video hosting experience, and a passion for our mission. Familiarity with LinkedIn, Facebook, Instagram, and Pinterest is a plus. We embrace diversity and are proud to be an equal opportunity employer. Ready to make learning fun and easy? Apply now and let's explore potential together",
    jobRequirement: [],
    jobIllustration: "/assets/images/anchor.png",
    skills: [],
    jobType: "On-site",
    jobDuration: "Full-time",
    salary: 500000,
  },
  {
    id: 41,
    jobId: "JOB003",
    jobTitle: "Actor",
    jobDescription:
      "We are currently seeking an Actor/Model to become the face of our creative projects.This versatileindividual will play a pivotal role in bringing our stories and concepts to life through performanceand visual representation. Your responsibilities will include embodying characters, conveyingemotions, and participating in photoshoots or video productions. The ideal candidate will possessexceptional acting or modeling skills, a strong stage or on-camera presence, and a passion forstorytelling through performance. Join us in showcasing our vision through your talent and charisma,creating a lasting impact on our audience.",
    jobRequirement: [],
    jobIllustration: "/assets/images/actor.png",
    skills: [],
    jobType: "On-site",
    jobDuration: "Full-time",
    salary: 500000,
  },
  {
    id: 42,
    jobId: "JOB004",
    jobTitle: "Filmmaker",
    jobDescription:
      "We are currently seeking a Filmmaker to join our creative team. This individual will be responsiblefor bringing our stories to life through the art of film. Your role involves concept development,scriptwriting, directing, and overseeing the production process. The ideal candidate will have astrong passion for filmmaking, a keen eye for visual storytelling, and experience in creatingcompelling cinematic content. Join us in producing films that captivate, entertain, and inspire ouraudience",
    jobRequirement: [],
    jobIllustration: "/assets/images/filmmaker.png",
    skills: [],
    jobType: "On-site",
    jobDuration: "Full-time",
    salary: 500000,
  },
  {
    id: 43,
    jobId: "JOB004",
    jobTitle: "Storyteller",
    jobDescription:
      "We are currently seeking a Storyteller to join our creative team. This individual will be the heart ofour narrative, weaving captivating stories to engage our audience. Your role involves craftingcompelling content for various platforms, evoking emotions, and conveying messages effectively.The ideal candidate will have a passion for storytelling, a vivid imagination, and the ability to bringstories to life. Experience in content creation, whether through writing, video, or other mediums, ishighly valued. Join us in creating and sharing stories that leave a lasting impact on our audience.",
    jobRequirement: [],
    jobIllustration: "/assets/images/storyteller.png",
    skills: [],
    jobType: "On-site",
    jobDuration: "Full-time",
    salary: 500000,
  },
];

export const PODCAST_SLIDER = [
  "emotions.png",
  "creative.png",
  "independent.png",
  "memories.png",
  "mindfull.png",
  "knowledge.png",
  "creative.png",
  "understand-feelings.png",
];

export const PODCAST_CATEGORY = [
  {
    categroy: "6-12",
    podcastCategoryTopics: [
      {
        title: "Where It All Began?",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/where-it-all-begin.mp4",
      },
      {
        title: "Parents Want To Buy Peace",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/parent-want-to-buy-peace.mp4",
      },
      {
        title: "How To Use Gadgets Effectively",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/how-to-use-gadgets.mp4",
      },
      {
        title: "How to build Confidence",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/Build+Confidence.mp4",
      },
      {
        title: "Performance Addiction",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/Performance+Addiction+6-12.mp4",
      },
      {
        title: "Entertainment Addiction",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/Copy+of+ENTERTAINMENT_ADDICTION_01.mp4",
      },
      {
        title: "A Day With and Without a Phone",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/A+Day+Without+Phone+June+12.mp4",
      },
    ],
  },
  {
    categroy: "13-19",
    podcastCategoryTopics: [
      {
        title:
          "Statistic of (Teenage suicide rate Teen pregnancy Gaming Addiction Social media addiction)",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/teenage-statistics.mp4",
      },
      {
        title: "How AI Impacts Our Learning and Focus",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/how-ai-impact-our-learning.mp4",
      },
      {
        title: "Performance Addiction",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/Performance+Addiction+13-19.mp4",
      },
      {
        title: "Entertainment Addiction",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/Entertainment+Addiction+01.mp4",
      },
      {
        title: "AI Impact Learning and Focus",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/AI+Impacts+Learning+and+Focus.mp4",
      },
      {
        title: "Betting Apps Risking Teen Careers",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/Betting+Apps+Risking+Teen+Careers.mp4",
      },

      {
        title: "How Social Media Creates FOMO",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/How+Social+Media+Creates+FOMO.mp4",
      },
    ],
  },
  {
    categroy: "20+ & Parent's",
    podcastCategoryTopics: [
      {
        title: "Why work from home is preferred",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/work-from-home.mp4",
      },
      {
        title: "Pornography De-Addiction",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/pornography-de-addiction.mp4",
      },
      {
        title: "Challenges Parents Face Today",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+20%2B/Challenges+Parents+Face+Today.mp4",
      },
      {
        title: "How Parents Can Bond with Kids",
        description: "",
        videoSrc:
          "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+20%2B/How+Parents+Can+Bond+with+Kids.mp4",
      },
    ],
  },
];

export const videoData = [
  {
    id: "0_1",
    title: "Rajesh K 42 Years old (IT Manager)",
    thumbnail: "/assets/images/rajesh.jpg",
    url: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Flat+Image+Stories+for+Mentoons/Rajesh+K+42+Years+old+(IT+Manager).mp4",
  },
  {
    id: "0_2",
    title: "Samantha, 35 Years, Elementary School Teacher",
    thumbnail: "/assets/images/samantha.jpg",
    url: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Flat+Image+Stories+for+Mentoons/Samantha%2C+35+Years%2C+Elementary+School+Teacher(1).mp4",
  },
  {
    id: "0_3",
    title: "Sarah, 35 Years, Elementary School Teacher",
    thumbnail: "/assets/images/sarah.jpg",
    url: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Flat+Image+Stories+for+Mentoons/Sarah%2C+35+Years%2C+Elementary+School+Teacher(1).mp4",
  },
  {
    id: "0_4",
    title: "Olivia, 28 Years, Psychologist",
    thumbnail: "/assets/images/olivia.webp",
    url: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Flat+Image+Stories+for+Mentoons/Olivia%2C+28+Years%2C+Psychologist(1).mp4",
  },
  {
    id: "0_5",
    title: "Raj, 42 Years, IT Manager, Podcast & Convo Ca ",
    thumbnail: "/assets/images/raj.jpg",
    url: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/Flat+Image+Stories+for+Mentoons/Raj%2C+42+Years%2C+IT+Manager%2C+Podcast+%26+Convo+Ca.mp4",
  },
];

export const companyImg = [
  {
    id: "C_1",
    image: "/assets/images/activelistener-logo.png",
    url: "https://www.activelisteners.in/",
  },
  {
    id: "C_2",
    image: "/assets/images/toonland-logo.png",
    url: "https://toonland.in/",
  },
  {
    id: "C_3",
    image: "/assets/images/storyclub-logo.png",
    url: "https://storyclub.in/",
  },
  {
    id: "C_4",
    image: "/assets/images/cxobranding-logo.png",
    url: "https://cxobranding.com/",
  },
  {
    id: "C_5",
    image: "/assets/images/propellingstory-logo.png",
    url: "http://www.propellingstories.com/",
  },
];
export const SOCIAL_LINKS = [
  {
    id: "S_1",
    icon: "linkedin",
    color: "text-blue-700",
    link: "https://www.linkedin.com/company/mentoons",
  },
  {
    id: "S_2",
    icon: "facebook",
    color: "text-blue-500",
    link: "https://www.facebook.com/profile.php?id=100078693769495",
  },
  {
    id: "S_3",
    icon: "instagram",
    color: "text-rose-500",
    link: "https://www.instagram.com/toonmentoons?igsh=aTZvejJqYWM4YmFq",
  },
  {
    id: "S_4",
    icon: "youtube",
    color: "text-red-600",
    link: "https://youtube.com/@mentoons3544?si=4Nr6surjgZaLM0YS",
  },
  {
    id: "S_5",
    icon: "whatsapp",
    color: "text-green-500",
    link: "https://wa.me/+919036033300",
  },
];

export const FOOTER_NAVLINKS = [
  {
    id: "L_1",
    title: "Home",
    url: "/",
  },
  {
    id: "L_2",
    title: "Comics",
    url: "/mentoons-comics?option=comic",
  },
  {
    id: "L_3",
    title: "Podcasts",
    url: "/mentoons-podcast",
  },
  {
    id: "L_4",
    title: "Workshops",
    url: "/mentoons-workshops",
  },
];

export const FOOTER_PAGELINKS = [
  {
    id: "FP_1",
    title: "About",
    url: "#",
    items: [
      {
        id: "AB_1",
        label: "About Mentoons",
        url: "/about-mentoons",
      },
      {
        id: "AB_2",
        label: "Free Downloads",
        url: "/free-download",
      },
      {
        id: "AB_3",
        label: "Help & FAQ's",
        url: "/faq",
      },
      {
        id: "AB_5",
        label: "Mentoons Privacy Policy",
        url: "/mentoons-privacy-policy",
      },
      {
        id: "AB_6",
        label: "Hiring",
        url: "/hiring",
      },
    ],
  },
  {
    id: "FP_2",
    title: "Mentoons Products",
    url: "/product-page",
    items: [
      {
        id: "S_1",
        label: "Conversation Starter Cards",
        url: `/product-page?productType=${ProductType.MENTOONS_CARDS}&cardType=${CardType.CONVERSATION_STARTER_CARDS}#product`,
      },
      {
        id: "S_2",
        label: "Story Re-Teller Cards",
        url: `/product-page?productType=${ProductType.MENTOONS_CARDS}&cardType=${CardType.STORY_RE_TELLER_CARD}#product`,
      },
      {
        id: "S_3",
        label: "Silent Stories",
        url: `/product-page?productType=${ProductType.MENTOONS_CARDS}&cardType=${CardType.SILENT_STORIES}#product`,
      },
      {
        id: "S_4",
        label: "Conversataion Story Card",
        url: `/product-page?productType=${ProductType.MENTOONS_CARDS}&cardType=${CardType.CONVERSATION_STORY_CARDS}#product`,
      },
    ],
  },

  {
    id: "FP_3",
    title: "Contact Us",
    url: "#",
    items: [
      {
        id: "AB_1",
        label: "info@mentoons.com",
        url: "#",
      },
      {
        id: "AB_2",
        label: "+919036033300",
        url: "#",
      },
    ],
  },
];

export const WORKSHOP_FEATURES = [
  {
    id: "WF_1",
    heading: "Portfolio Management",
    subHeading: "To help individual present themseleves professionally",
    imageUrl: "/assets/images/portfolio-management.png",
    color: "#B38FD8",
    textColor: "#271481",
    features: [
      {
        id: "pm_01",
        label: "Resume Creation",
        description:
          "Crafting customized resumes that showcase relevant skills and experiences.",
      },
      {
        id: "pm_02",
        label: "Video Introduction",
        description:
          "Guidance for creating engaging, professional video introductions.",
      },
      {
        id: "pm_03",
        label: "Scrip Editing:",
        description:
          "Support for refining presentation scripts for clear, impactful communication.",
      },
    ],
  },
  {
    id: "WF_2",
    heading: "Interviewing Skills",
    subHeading: "Prepare users for various interview formats and expectations",
    imageUrl: "/assets/images/interviewing-skill.png",
    color: "#EB4B7B",
    textColor: "#66001F",
    features: [
      {
        id: "is_01",
        label: "Interview Etiquette",
        description: "Guidance on professional demeanor and behaviour",
      },
      {
        id: "is_02",
        label: "Scheduling Interview",
        description: "Tips for managing interview timings and confirmations.",
      },
      {
        id: "is_03",
        label: "Face-to-face and Video Interviewing",
        description: "Best practices for in-persong and virtual interviews",
      },
    ],
  },
  {
    id: "WF_3",
    heading: "Grooming and Professional Image",
    subHeading:
      "Guide users on professional appearance and behavior to make a positive impression",
    imageUrl: "/assets/images/grooming-professional.png",

    color: "#FFBC05",
    textColor: "#4A3602",
    features: [
      {
        id: "gpi_01",
        label: "Dressing and Styling Recommendataions",
        description: "Advice on appropriate attire for professional setting. ",
      },
      {
        id: "gpi_02",
        label: "Image Management",
        description: "Strategies for cultivating a professional image.",
      },
      {
        id: "gpi_03",
        label: "Grooming Tips:",
        description:
          "Suggestions from maintaining a polished professional appearance",
      },
    ],
  },
  {
    id: "WF_4",
    heading: "WhatsApp Manners",
    subHeading: "Educate users on professional WhatsApp etiquette",
    imageUrl: "/assets/images/whatsapp-manner.png",
    color: "#F96A00",
    textColor: "#582702",
    features: [
      {
        id: "wm_01",
        label: "Texting Etiquette",
        description: "Guidelines for respectfull and concise communication. ",
      },
      {
        id: "wm_02",
        label: "Content Appropriateness",
        description:
          "Recommendataions on what to share and avoid in a professional setting.",
      },
      {
        id: "wm_03",
        label: "Communication Limits",
        description:
          "Advice on maintaining a professional tone and volume of communication",
      },
    ],
  },
  {
    id: "WF_5",
    heading: "Career Support Services",
    subHeading:
      "Provide access to top career advice, guidance on trending domains and expert insights",
    imageUrl: "/assets/images/career-support.png",
    color: "#0CC5BD",
    textColor: "#003533",
    features: [
      {
        id: "css_01",
        label: "Trending Domains and Career Paths",
        description: "Tips on building a career in high-demand fields",
      },
      {
        id: "css_02",
        label: "Social Media Guidance",
        description: "Support for managing professional social media presence",
      },
      {
        id: "css_03",
        label: "10-minute Complimentary Calls",
        description: "Short consultations with industry experts.",
      },
    ],
  },
];

export const EMPLOYEES = [
  {
    id: "EMP_1",
    name: "Mahesh",
    designation: "Founder & CEO",
    imageUrl: "/assets/images/mahesh-sir.jpg",
  },
  {
    id: "EMP_2",
    name: "Mahetalat",
    designation: "Content Writer & Illustrator",
    imageUrl: "/assets/images/mahetalat.jpg",
  },
  {
    id: "EMP_3",
    name: "Nupur",
    designation: "UI/UX Designer",
    imageUrl: "/assets/images/nupur.png",
  },

  {
    id: "EMP_4",
    name: "Dhanasekar",
    designation: "Sketch Artist & Illustrator",
    imageUrl: "/assets/images/dhanasekar.jpg",
  },
  {
    id: "EMP_6",
    name: "Devan",
    designation: "Fullstack Developer",
    imageUrl: "/assets/images/devan.png",
  },
  {
    id: "EMP_5",
    name: "Dheeraj",
    designation: "Fullstack Developer",
    imageUrl: "/assets/images/dheeraj.png",
  },
];

export const PRODUCT_FILTERS = [
  {
    id: "PF_01",
    lable: "Trending",
    value: "trending",
  },
  {
    id: "PF_02",
    lable: "Latest",
    value: "latest",
  },
  {
    id: "PF_03",
    lable: "Most Popular",
    value: "most-popular",
  },
];

export const PRODUT_CAROUSEL_ITEM = [
  {
    id: "pci_01",
    imageURL: "/assets/images/conversation-starter-card.png",
  },
  {
    id: "pci_02",
    imageURL: "/assets/images/story-re-teller-card.png",
  },
  {
    id: "pci_03",
    imageURL: "/assets/images/silent-stories.png",
  },
];

export interface NavLink {
  id: string;
  label: string;
  icon?: string | IconType;
  url: string;
  items?: NavLink[];
}

export const NAV_LINKS: NavLink[] = [
  {
    id: "NL_01",
    label: "Date",
    icon: "date_range",
    url: "",
  },
  {
    id: "NL_02",
    label: "Call us",
    icon: FaPhone,
    url: "",
  },
  {
    id: "NL_03",
    label: "Join Us",
    icon: "group",
    url: "/hiring",
  },
  {
    id: "NL_04",
    label: "Store",
    icon: "store",
    url: "/mentoons-store",
  },
  {
    id: "NL_05",
    label: "Plans",
    icon: "description",
    url: "/membership",
  },
  {
    id: "NL_06",
    label: "Comics and Audio Comics",
    icon: "book",
    url: "/mentoons-comics",
  },
  {
    id: "NL_07",
    label: "Podcast",
    icon: "mic",
    url: "/mentoons-podcast",
  },
  {
    id: "NL_08",
    label: "Workshops",
    icon: FaChalkboard,
    url: "/mentoons-workshops",
  },
  {
    id: "NL_09",
    label: "Audio Comics",
    icon: "info",
    url: "/mentoons-comics/audio-comics",
    items: [
      {
        id: "AC_01",
        label: "Audio Comics",
        url: "/mentoons-comics/audio-comics",
        icon: "info",
      },
      {
        id: "AC_02",
        label: "Audio Podcast",
        url: "/mentoons-comics/audio-comics",
        icon: "info",
      },
    ],
  },
  {
    id: "NL_10",
    label: "Cart",
    icon: "shopping_cart",
    url: "/cart",
  },
  {
    id: "NL_11",
    label: "User",
    icon: "User",
    url: "/user",
  },
  {
    id: "NL_12",
    label: "Mythos",
    icon: FaMoon,
    url: "/mythos",
  },
  {
    id: "NL_13",
    label: "Products",
    icon: FaShoppingCart,
    url: "/mentoons-store",
    items: [
      {
        id: "AC_01",
        label: "6-12",
        url: "/mentoons-store",
      },
      {
        id: "AC_01",
        label: "13-16",
        url: "/mentoons-store",
      },
      {
        id: "AC_01",
        label: "17-19",
        url: "/mentoons-store",
      },
      {
        id: "AC_01",
        label: "20+",
        url: "/mentoons-store",
      },
    ],
  },
  {
    id: "NL_14",
    label: "Assessments",
    icon: FaChartBar,
    url: "/assesment-page",
  },
  {
    id: "NL_15",
    label: "Browse Plans",
    icon: FaCreditCard,
    url: "#subscription",
  },
  {
    id: "NL_16",
    label: "Book Sessions",
    icon: FaCalendarCheck,
    url: "/bookings",
  },
];

export const ADDA_NAV_LINKS: NavLink[] = [
  {
    id: "NL_01",
    label: "Assessments",
    icon: FaUsers,
    url: "/assesment-page",
  },
  {
    id: "NL_02",
    label: "Community",
    icon: FaUsers,
    url: "/adda/community",
  },
  {
    id: "NL_13",
    label: "Products",
    icon: FaShoppingCart,
    url: "/mythos",
  },
  {
    id: "NL_15",
    label: "Browse Plans",
    icon: FaCreditCard,
    url: "#subscription",
  },
  {
    id: "NL_08",
    label: "Workshops",
    icon: FaChalkboard,
    url: "/mentoons-workshops",
  },
  {
    id: "NL_09",
    label: "Collect Coins",
    icon: FaCoins,
    url: "#",
  },
  {
    id: "NL_10",
    label: "Share",
    icon: FaShare,
    url: "#",
  },
];

export const AddictionCardsData = [
  {
    title: "Mobile Addiction",
    description: "Digital addiction is real, and it's spreading like wildfire!",
    image: "/assets/LandingPage/mob.png",
    background: "#FED651",
    gradient:
      "linear-gradient(168.78deg, rgba(217, 217, 217, 0.6) 11.69%, #A6830E 91.5%)",
    text: "#6F5500",
  },
  {
    title: "Social Media Addiction",
    description:
      "Prolonged screen exposure may cause vision issues, mental stress, and disrupted sleep patterns.",
    image: "/assets/LandingPage/som.png",
    background: "#A3DF3C",
    gradient:
      "linear-gradient(168.78deg, rgba(217, 217, 217, 0.6) 11.69%, #6C981F 91.5%)",
    text: "#3E6102",
  },
  {
    title: "Excessive Gaming Addiction",
    description:
      "Hours spent in games can take away from real-word connections.",
    image: "/assets/LandingPage/game.png",
    background: "#83C4EE",
    gradient:
      "linear-gradient(168.78deg, rgba(217, 217, 217, 0.6) 11.69%, #4D85AA 91.5%)",
    text: "#07456C",
  },
  {
    title: "Difficulty in forming friendships",
    description: "Making and keeping friends isn't always easy.",
    image: "/assets/LandingPage/frnd.png",
    background: "#FF6D72",
    gradient:
      "linear-gradient(168.78deg, rgba(220, 193, 193, 0.6) 11.69%, #C85357 91.5%)",
    text: "#5B0205",
  },
  {
    title: "Lack of Self-Awareness",
    description:
      "Not understanding oneself can lead to difficulties in personal and professional life.",
    image: "/assets/LandingPage/sa.png",
    background: "#AD73A5",
    gradient:
      "linear-gradient(168.78deg, rgba(183, 152, 178, 0.55) 11.69%, #563852 91.5%)",
    text: "#3E0035",
  },
  {
    title: "Life's Transitions",
    description: "Navigating changes can be overwhelming.",
    image: "/assets/LandingPage/lt.png",
    background: "#FF9162",
    gradient:
      "linear-gradient(168.78deg, rgba(255, 183, 152, 0.32) 11.69%, #D67850 91.5%)",
    text: "#6B2100",
  },
];

export const PODCAST_OFFERINGS = [
  {
    id: "PO_01",
    label: "Expert-Crafted Content",
    imgeUrl: "/assets/podcastv2/expert-crafted-content.png",
    accentColor: "#4285F4",
  },
  {
    id: "PO_02",
    label: "Age-Appropriate Discussion",
    imgeUrl: "/assets/podcastv2/age-appropriate-discussion.png",
    accentColor: "#EF4444",
  },
  {
    id: "PO_03",
    label: "Engaging Story-telling",
    imgeUrl: "/assets/podcastv2/engaging-story-telling.png",
    accentColor: "#22C55E",
  },
  {
    id: "PO_04",
    label: "Valuable Life Lessons",
    imgeUrl: "/assets/podcastv2/valuable-life-lession.png",
    accentColor: "#F7941D",
  },
];

export const PODCAST_V2_CATEGORY = [
  {
    id: "PCV2_01",
    lable: "mobile addiction",
    imgeUrl: "/assets/podcastv2/mobile-addiction.png",
  },
  {
    id: "PCV2_02",
    lable: "gaming addiction",
    imgeUrl: "/assets/podcastv2/gaming-addiction.png",
  },
  {
    id: "PCV2_03",
    lable: "teen emotions",
    imgeUrl: "/assets/podcastv2/teen-emotion.png",
  },
];

export const PODCAST_CARD_DATA = [
  {
    id: "PCD_01",
    title: "Teen emotions and Behavioural Problems",
    imageUrl: "/assets/podcastv2/teen-emotions-and-behavioural-problem.png",
    date: "JAN 2024",
    duration: "30 MIN",
    isPaid: true,
    price: 10,
  },
  {
    id: "PCD_02",
    title: "Teen emotions and Behavioural Problems",
    imageUrl: "/assets/podcastv2/teen-emotions-and-behavioural-problem.png",
    date: "JAN 2024",
    duration: "30 MIN",
    isPaid: true,
    price: 25,
  },
  {
    id: "PCD_03",
    title: "Teen emotions and Behavioural Problems",
    imageUrl: "/assets/podcastv2/teen-emotions-and-behavioural-problem.png",
    date: "JAN 2024",
    duration: "30 MIN",
    isPaid: true,
    price: 20,
  },
  {
    id: "PCD_04",
    title: "Teen emotions and Behavioural Problems",
    imageUrl: "/assets/podcastv2/teen-emotions-and-behavioural-problem.png",
    date: "JAN 2024",
    duration: "30 MIN",
    isPaid: true,
    price: 10,
  },
  {
    id: "PCD_05",
    title: "Teen emotions and Behavioural Problems",
    imageUrl: "/assets/podcastv2/teen-emotions-and-behavioural-problem.png",
    date: "JAN 2024",
    duration: "30 MIN",
  },
  {
    id: "PCD_06",
    title: "Teen emotions and Behavioural Problems",
    imageUrl: "/assets/podcastv2/teen-emotions-and-behavioural-problem.png",
    date: "JAN 2024",
    duration: "30 MIN",
  },
  {
    id: "PCD_07",
    title: "Teen emotions and Behavioural Problems",
    imageUrl: "/assets/podcastv2/teen-emotions-and-behavioural-problem.png",
    date: "JAN 2024",
    duration: "30 MIN",
  },
  {
    id: "PCD_08",
    title: "Teen emotions and Behavioural Problems",
    imageUrl: "/assets/podcastv2/teen-emotions-and-behavioural-problem.png",
    date: "JAN 2024",
    duration: "30 MIN",
  },
  {
    id: "PCD_09",
    title: "Teen emotions and Behavioural Problems",
    imageUrl: "/assets/podcastv2/teen-emotions-and-behavioural-problem.png",
    date: "JAN 2024",
    duration: "30 MIN",
  },
  {
    id: "PCD_10",
    title: "Teen emotions and Behavioural Problems",
    imageUrl: "/assets/podcastv2/teen-emotions-and-behavioural-problem.png",
    date: "JAN 2024",
    duration: "30 MIN",
    isPaid: true,
    price: 15,
  },
];

export const WORKSHOPS = [
  {
    id: "WD_01",
    category: "6-12",
    title: "Buddy Camp",
    workshopLogo: "/assets/workshopv2/buddycamp/buddy-camp-logo.png",
    workshopSubTitle: "Fun Learning Workshop For Kids (6-12 Years)",
    workshopAim: "Social Skills",
    workshopAimDescription:
      "Nurture your child's creativity and learning with our engaging Buddy Camp workshop",
    workshopOfferings: [
      {
        id: "WO_01",
        title: "Interactive group discussions",
        description:
          "Engaging activities to encourage social interaction and communication",
        imageUrl: "/assets/workshopv2/interactive-group-discussions.png",
        accentColor: "#4285F4",
      },
      {
        id: "WO_02",
        title: "Peer learning activities",
        description:
          "Collaborative exercises to foster teamwork and cooperation",
        imageUrl: "/assets/workshopv2/peer-learning-activities.png",
        accentColor: "#EF4444",
      },
      {
        id: "WO_03",
        title: "Practical workshops",
        description:
          "Hands-on activities to develop problem-solving and critical thinking skills",
        imageUrl: "/assets/workshopv2/practical-workshops.png",
        accentColor: "#22C55E",
      },
      {
        id: "WO_04",
        title: "Expert guidance",
        description:
          "Insightful sessions led by industry experts and experienced mentors",
        imageUrl: "/assets/workshopv2/expert-guidance.png",
        accentColor: "#F7941D",
      },
    ],
    addressedIssues: [
      {
        id: "AI_01",
        title: "Low confidence",
        description: "Building self-esteem and confidence in social settings",
        imageUrl: "/assets/workshopv2/low-confidance.png",
      },
      {
        id: "AI_02",
        title: "Aggressive behaviour",
        description: "Developing empathy and understanding towards others",
        imageUrl: "/assets/workshopv2/aggressive-behaviour.png",
      },
      {
        id: "AI_03",
        title: "LACK OF COMMUNICATION",
        description: "Developing effective communication skills",
        imageUrl: "/assets/workshopv2/lack-of-communication.png",
      },
      {
        id: "AI_04",
        title: "Disobedience",
        description: "Encouraging positive behaviour and respect for authority",
        imageUrl: "/assets/workshopv2/disobedience.png",
      },
    ],
    workshopAccentColor: "#FFE0A9",

    registerFormIllustration:
      "/assets/workshopv2/buddycamp/buddy-camp-register-illustration.png",
    registerFormbgColor: "#F7941D",
  },

  {
    id: "WD_02",
    category: "13-19",
    title: "Teen Camp",
    workshopLogo: "/assets/workshopv2/teencamp/teen-camp-logo.png",
    workshopSubTitle: "Interactive Workshop For Teenagers (13-19 Years)",
    workshopAim: "Substance De-addiction",
    workshopAimDescription:
      "Help your teenager navigate the challenges of adolescence with our comprehensive Teen Camp workshop.",
    workshopOfferings: [
      {
        id: "WO_01",
        title: "Personal Development",
        description: "Guidance on building self-confidence and self-awareness",
        imageUrl: "/assets/workshopv2/interactive-group-discussions.png",
        accentColor: "#4285F4",
      },
      {
        id: "WO_02",
        title: "Peer learning activities",
        description:
          "Collaborative exercises to foster teamwork and cooperation",
        imageUrl: "/assets/workshopv2/peer-learning-activities.png",
        accentColor: "#EF4444",
      },
      {
        id: "WO_03",
        title: "Practical workshops",
        description:
          "Hands-on activities to develop problem-solving and critical thinking skills",
        imageUrl: "/assets/workshopv2/practical-workshops.png",
        accentColor: "#22C55E",
      },
      {
        id: "WO_04",
        title: "Expert guidance",
        description:
          "Insightful sessions led by industry experts and experienced mentors",
        imageUrl: "/assets/workshopv2/expert-guidance.png",
        accentColor: "#F7941D",
      },
    ],
    addressedIssues: [
      {
        id: "AI_01",
        title: "Substance addiction",
        description:
          "Understanding the risks and consequences of substance abuse",
        imageUrl: "/assets/workshopv2/substance-addiction.png",
      },
      {
        id: "AI_02",
        title: "Aggressive behaviour",
        description: "Developing empathy and understanding towards others",
        imageUrl: "/assets/workshopv2/aggressive-behaviour.png",
      },
      {
        id: "AI_03",
        title: "Hormonal changes",
        description:
          "Navigating the physical and emotional changes of adolescence",
        imageUrl: "/assets/workshopv2/hormonal-changes.png",
      },
      {
        id: "AI_04",
        title: "Disobedience",
        description: "Encouraging positive behaviour and respect for authority",
        imageUrl: "/assets/workshopv2/disobedience.png",
      },
    ],
    workshopAccentColor: "#FFB5B5",
    registerFormIllustration:
      "/assets/workshopv2/teencamp/teen-camp-register-illustration.png",
    registerFormbgColor: "#EF4444",
  },

  {
    id: "WD_03",
    category: "parent",
    title: "Family Camp",
    workshopLogo: "/assets/workshopv2/familycamp/family-camp-logo.png",
    workshopSubTitle: "Interactive & Engaging Workshop For Family ",
    workshopAim: "Digital Parenting",
    workshopAimDescription:
      "Empower yourself with effective parenting strategies for the digital age.",
    workshopOfferings: [
      {
        id: "WO_01",
        title: "Personal Development",
        description: "Guidance on building self-confidence and self-awareness",
        imageUrl: "/assets/workshopv2/interactive-group-discussions.png",
        accentColor: "#4285F4",
      },
      {
        id: "WO_02",
        title: "Parenting Guidance",
        description:
          "Insightful sessions on effective parenting strategies and techniques",
        imageUrl: "/assets/workshopv2/peer-learning-activities.png",
        accentColor: "#EF4444",
      },
      {
        id: "WO_03",
        title: "Practical workshops",
        description:
          "Hands-on activities to develop problem-solving and critical thinking skills",
        imageUrl: "/assets/workshopv2/practical-workshops.png",
        accentColor: "#22C55E",
      },
      {
        id: "WO_04",
        title: "Expert guidance",
        description:
          "Insightful sessions led by industry experts and experienced mentors",
        imageUrl: "/assets/workshopv2/expert-guidance.png",
        accentColor: "#F7941D",
      },
    ],
    addressedIssues: [
      {
        id: "AI_01",
        title: "Substance addiction",
        description:
          "Understanding the risks and consequences of substance abuse",
        imageUrl: "/assets/workshopv2/substance-addiction.png",
      },
      {
        id: "AI_02",
        title: "Aggressive behaviour",
        description: "Developing empathy and understanding towards others",
        imageUrl: "/assets/workshopv2/aggressive-behaviour.png",
      },
      {
        id: "AI_03",
        title: "Hormonal changes",
        description:
          "Navigating the physical and emotional changes of adolescence",
        imageUrl: "/assets/workshopv2/hormonal-changes.png",
      },
      {
        id: "AI_04",
        title: "Disobedience",
        description: "Encouraging positive behaviour and respect for authority",
        imageUrl: "/assets/workshopv2/disobedience.png",
      },
    ],
    workshopAccentColor: "#A0FFBA",

    registerFormIllustration:
      "/assets/workshopv2/familycamp/family-camp-register-illustration.png",
    registerFormbgColor: "#22C55E",
  },

  {
    id: "WD_04",
    category: "20+",
    title: "Career Corner",
    workshopLogo: "/assets/workshopv2/careercorner/career-corner-logo.png",
    workshopSubTitle: "Workshops on Career Guidance for 20 +",
    workshopAim: "Career Exploration",
    workshopAimDescription:
      "We provide practical tips on creating impactful video resumes, writing attention-grabbing cover letters, and designing effective emailers to ensure your application stands out from the rest.",
    workshopOfferings: [
      {
        id: "WO_01",
        title: "Interview Tips & Tricks",
        description: "Learn how to ace your interviews with our expert tips.",
        imageUrl: "/assets/workshopv2/interactive-group-discussions.png",
        accentColor: "#4285F4",
      },
      {
        id: "WO_02",
        title: "Networking Guidance",
        description:
          "Learn how to build a strong professional network and leverage it to your advantage.",
        imageUrl: "/assets/workshopv2/peer-learning-activities.png",
        accentColor: "#EF4444",
      },
      {
        id: "WO_03",
        title: "Skill Assessments",
        description:
          "Identify your strengths and weaknesses with our comprehensive skill assessments.",
        imageUrl: "/assets/workshopv2/practical-workshops.png",
        accentColor: "#22C55E",
      },
      {
        id: "WO_04",
        title: "Expert guidance",
        description:
          "Insightful sessions led by industry experts and experienced mentors",
        imageUrl: "/assets/workshopv2/expert-guidance.png",
        accentColor: "#F7941D",
      },
    ],
    addressedIssues: [
      {
        id: "AI_01",
        title: "Interviewing Skills",
        description:
          "Learn how to prepare for interviews and make a lasting impression.",
        imageUrl: "/assets/workshopv2/careercorner/interviewing-skills.png",
      },
      {
        id: "AI_02",
        title: "Professional Image",
        description: "Learn how to present yourself professionally.",
        imageUrl: "/assets/workshopv2/careercorner/professional-image.png",
      },
      {
        id: "AI_03",
        title: "Portfolio Management",
        description:
          "Learn how to create a professional portfolio that showcases your skills and experiences.",
        imageUrl: "/assets/workshopv2/careercorner/portfolio-management.png",
      },
      {
        id: "AI_04",
        title: "Lack of career support",
        description:
          "Get access to top career advice, guidance on trending domains, and expert insights.",
        imageUrl: "/assets/workshopv2/careercorner/lack-of-career-support.png",
      },
    ],
    workshopAccentColor: "#8CB8FF",
    registerFormIllustration:
      "/assets/workshopv2/careercorner/career-corner-register-illustration.png",
    registerFormbgColor: "#4285F4",
  },
];

export const WORKSHOP_MATTERS_POINTS = [
  {
    id: "WM_01",
    lable: "Engaging Learning",
    description: "Complex topics presented in an easy-to-understand format",
    icon: "/assets/workshopv2/engaging-learning.png",
  },
  {
    id: "WM_02",
    lable: "Character Development",
    description: "Stories that inspire positive behavior and values.",
    icon: "/assets/workshopv2/character-development.png",
  },
  {
    id: "WM_03",
    lable: "Relatable Scenarios",
    description: "Real-life situations that resonate with young readers",
    icon: "/assets/workshopv2/relatable-scenario.png",
  },
  {
    id: "WM_04",
    lable: "Family Bonding",
    description:
      "Perfect for shared reading experiences between parents and children",
    icon: "/assets/workshopv2/family-bonding.png",
  },
];

export const WORKSHOP_FAQ = [
  {
    id: "WF_01",
    question: "How do I register for these Workshops?",
    answer:
      "Simply sign up with your email or social media account. Once registered, you buy our membership and become a part of the community, ask questions, and connect with other community members.",
  },
  {
    id: "WF_02",
    question: "What types of topics can I discuss here?",
    answer:
      "We offer workshops on a wide range of topics, including career guidance, personal development, and social skills. You can find detailed information about each workshop on our website or mobile app.",
  },
  {
    id: "WF_03",
    question: "What activities are done in workshops?",
    answer:
      "Our workshops include interactive group discussions, peer learning activities, practical workshops, and expert guidance sessions. Each workshop is designed to be engaging and informative, with a focus on skill-building and personal development.",
  },
  {
    id: "WF_04",
    question: "How do I engage with other users?",
    answer:
      "You can engage with other users by participating in group discussions, sharing your thoughts and experiences, and asking questions. You can also connect with other users through private messages and group chats.",
  },
  {
    id: "WF_05",
    question: "Can experts contribute to the platform?",
    answer:
      "Yes, we welcome contributions from experts in various fields. If you are an expert and would like to share your knowledge and insights with our community, please contact us for more information.",
  },
];

export const PRODUCT_DATA = [
  {
    id: "P_01",
    title: "Conversation Starter Cards",
    type: "conversation starter cards",
    description:
      "Help kids overcome the fear of express themeseleves and improve their communication skills.",
    age: "6-12",
    imageUrl: "/assets/productv2/conversation-starter-cards-13-16.png",
    price: 199,
    accentColor: "#F9A411",
  },
  {
    id: "P_02",
    title: "Story Re-teller Cards",
    type: "story re-teller cards",
    description:
      "Help kids to practice their communication skills and grow stronger in their storytelling abilities.",
    age: "6-12",
    imageUrl: "/assets/productv2/story-reteller-cards-13-16.png",
    price: 199,
    accentColor: "#A7DE5C",
  },
  {
    id: "P_03",
    title: "Silent Stories",
    type: "silent stories",
    description:
      "Help kids to improve focus and logical thinking with our engaging silent stories.",
    age: "6-12",
    imageUrl: "/assets/productv2/silent-stories-17-19.png",
    price: 199,
    accentColor: "#69A1FF",
  },
  {
    id: "P_04",
    title: "Conversation Story Cards",
    type: "conversation story cards",
    description:
      "Help kids overcome the fear of express themeseleves and improve their communication skills.",
    age: "6-12",
    imageUrl: "/assets/productv2/silent-stories-17-19.png",
    price: 199,
    accentColor: "#FF6A5F",
  },
  {
    id: "P_05",
    title: "Coloring Book",
    type: "coloring book",
    description:
      "Spark creativity and imagination with our fun and engaging coloring book.",
    age: "6-12",
    imageUrl: "/assets/productv2/colouring-book-6-12.png",
    price: 199,
    accentColor: "#B454FE",
  },
];

export const ISSUES_FACED_BY_USERS = [
  {
    id: "IFU_01",
    title: "Low confidence",
    ageCategory: "6-12",
    description: "Building self-esteem and confidence in social settings",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/low-confidence.png",
  },
  {
    id: "IFU_02",
    title: "Aggressive behaviour",
    ageCategory: "6-12",
    description: "Developing empathy and understanding towards others",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/aggressive-behaviour.png",
  },
  {
    id: "IFU_03",
    title: "LACK OF COMMUNICATION",
    ageCategory: "6-12",
    description: "Developing effective communication skills",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/lack-of-communication.png",
  },
  {
    id: "IFU_04",
    title: "Disobedience",
    ageCategory: "6-12",
    description: "Encouraging positive behaviour and respect for authority",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/disobidience.png",
  },
  {
    id: "IFU_06",
    title: "Depression",
    ageCategory: "13-16",
    description: "Developing empathy and understanding towards others",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/dipression.png",
  },
  {
    id: "IFU_07",
    title: "Bullying",
    ageCategory: "13-16",
    description: "Bullying in the workplace and how to deal with it",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/bullying.png",
  },
  {
    id: "IFU_05",
    title: "Cyber addiction",
    ageCategory: "13-16",
    description: "Understanding the risks and consequences of cyber addiction",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/cyber-addiction.png",
  },
  {
    id: "IFU_08",
    title: "Peer Pressure",
    ageCategory: "13-16",
    description:
      "Understanding peer pressure and how to make decisions that are right for you",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/peer-pressure.png",
  },
  {
    id: "IFU_09",
    title: "Alcoholism",
    ageCategory: "17-19",
    description:
      "Learn how to prepare for interviews and make a lasting impression",
    imageUrl: "/assets/issues/Alcoholism.png",
  },
  {
    id: "IFU_10",
    title: "Gaming Addiction",
    ageCategory: "17-19",
    description: "Learn how to present yourself professionally",
    imageUrl: "/assets/issues/gaming-addiction.png",
  },
  {
    id: "IFU_11",
    title: "Puberty",
    ageCategory: "17-19",
    description:
      "Learn how to create a professional portfolio that showcases your skills and experiences",
    imageUrl: "/assets/issues/puberty.png",
  },
  {
    id: "IFU_12",
    title: "Relationships",
    ageCategory: "17-19",
    description:
      "Get access to top career advice, guidance on trending domains, and expert insights",
    imageUrl: "/assets/issues/relationship.png",
  },
  {
    id: "IFU_09",
    title: "Interviewing Skills",
    ageCategory: "20+",
    description:
      "Learn how to prepare for interviews and make a lasting impression",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/interview-skill.png",
  },
  {
    id: "IFU_10",
    title: "Professional Image",
    ageCategory: "20+",
    description: "Learn how to present yourself professionally",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/professional-image.png",
  },
  {
    id: "IFU_11",
    title: "Portfolio Management",
    ageCategory: "20+",
    description:
      "Learn how to create a professional portfolio that showcases your skills and experiences",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/portfolio-managment.png",
  },
  {
    id: "IFU_12",
    title: "Lack of career support",
    ageCategory: "20+",
    description:
      "Get access to top career advice, guidance on trending domains, and expert insights",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/lack-of-career-support.png",
  },
  {
    id: "IFU_13",
    title: "Managing Screentime",
    ageCategory: "parents",
    description: "Description for the new issue",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/manage-screen-time.png", // Add image URL for IFU_13
  },
  {
    id: "IFU_14",
    title: "Overspending Money",
    ageCategory: "parents",
    description: "Learn effective strategies for managing time efficiently",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/over-spending-money.png",
  },
  {
    id: "IFU_15",
    title: "Handling Tantrums",
    ageCategory: "parents",
    description: "Learn effective strategies for managing time efficiently",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/handling-tantrum.png",
  },
  {
    id: "IFU_16",
    title: "Online Safety",
    ageCategory: "parents",
    description: "Learn effective strategies for managing time efficiently",
    imageUrl:
      "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/online-safety.png",
  },
];
