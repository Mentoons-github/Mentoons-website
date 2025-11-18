import { Hiring } from "@/types";

export const ASSESSMENTS = [
  {
    img: "/assets/assesments/thumbnails/Excercise.png",
    title: "Exercise Awareness Assessment",
    description:
      "Discover your current state of mind, self-conduct, family values, willingness to change, and spiritual journey.",
    details: {
      Time: "10 minutes",
      "Reading Level": "College Students",
      Age: "20+",
    },
    price: 10,
    color: "#F7941D",
  },
  {
    img: "/assets/assesments/thumbnails/Physical Emotions .png",
    title: "Emotions Assessment",
    description:
      "Explore your emotional well-being, family values, and relationship dynamics.",
    details: {
      Time: "10 minutes",
      "Reading Level": "Individuals from any background",
      Age: "20+",
    },
    price: 15,
    color: "#652D90",
  },
  {
    img: "/assets/assesments/thumbnails/Self Reflection.png",
    title: "Skills Assessment",
    description:
      "Assess your interpersonal, analytical, and professional skills to enhance your career, communication, and overall growth.",
    details: {
      Time: "10 minutes",
      "Reading Level": "Individuals from any background",
      Age: "20+",
    },
    price: 15,
    color: "#F7941D",
  },
  {
    img: "/assets/assesments/thumbnails/Therapy.png",
    title: "Addiction Awareness Assessment",
    description:
      "Evaluate your habits and identify areas of addiction, from mobile and social media to gaming, shopping, and substance abuse.",
    details: {
      Time: "10 minutes",
      "Reading Level": "College Students",
      Age: "20+",
    },
    price: 10,
    color: "#652D90",
  },
  {
    img: "/assets/assesments/thumbnails/Behaviours.png",
    title: "Behaviour Assessment",
    description:
      "Understand your behavioral patterns, social interactions, and response mechanisms to improve self-awareness and decision-making.",
    details: {
      Time: "10 minutes",
      "Reading Level": "College Students",
      Age: "20+",
    },
    price: 10,
    color: "#F7941D",
  },
  {
    img: "/assets/assesments/thumbnails/Eat Healthy.png",
    title: "Eat Healthy Assessment",
    description:
      "Evaluate your dietary habits, nutritional choices, and overall approach to maintaining a balanced and healthy lifestyle.",
    details: {
      Time: "10 minutes",
      "Reading Level": "College Students",
      Age: "20+",
    },
    price: 10,
    color: "#652D90",
  },
  {
    img: "/assets/assesments/thumbnails/Meditation.png",
    title: "Meditation Assessment",
    description:
      "Discover your mindfulness levels, stress management skills, and ability to stay present through meditation practices.",
    details: {
      Time: "10 minutes",
      "Reading Level": "College Students",
      Age: "20+",
    },
    price: 10,
    color: "#F7941D",
  },
  {
    img: "/assets/assesments/thumbnails/Opinions.png",
    title: "Opinions Assessment",
    description:
      "Analyze how you form opinions, handle differing perspectives, and express your thoughts in various social and professional settings.",
    details: {
      Time: "10 minutes",
      "Reading Level": "College Students",
      Age: "20+",
    },
    price: 10,
    color: "#652D90",
  },
];

export const HIRING: Hiring[] = [
  {
    _id: "67e2819c3850a2a118e77ad9",
    job: "Astrologers",
    description:
      "Are you a passionate Astrologer ready to guide others toward self-discovery? We’re looking for talented professionals to be a part of Mentoons Mythos!",
    image: "/assets/home/contests/Astrologer.png",
    bg: "#EC9600",
  },
  {
    _id: "68b6a61e8e80f30190a5f568",
    job: "Psychologists",
    description:
      "Are you a passionate Psychologist ready to guide others toward self-discovery? We’re looking for talented professionals to be a part of Mentoons Mythos!",
    image: "/assets/home/contests/Psychology 3.png",
    bg: "#4285F4",
  },
];

export const ASSESSMENT_DATA = [
  {
    id: 1,
    name: "Psychological Emotions (Therapy) ",
    desc: "Valuable insights into maintaining professional behavior and building career success.",
    details: {
      Time: "10 minutes",
      "Reading Level": "College Students",
      Age: "20+",
    },
    price: 10,
    color: "#652D90",
    thumbnail: "/assets/assesments/thumbnails/therapy.png",
    credits: "Mentoons",
    questionGallery: [
      {
        id: "thqs_01",
        imageUrl: "/assets/assesments/Therapy/therapy-01.JPG",
        options: [
          "Everyone approaches me with their problems.",
          "I don't allow anyone to share their problems with me.",
        ],
        correcAnswer: "Everyone approaches me with their problems.",
      },
      {
        id: "thqs_02",
        imageUrl: "/assets/assesments/Therapy/therapy-02.JPG",
        options: [
          "The teacher recommended therapy for everyone.",
          "A few students and i were exempted from therapy.",
        ],
        correctAnswer: "A few students and i were exempted from therapy.",
      },
      {
        id: "thqs_03",
        imageUrl: "/assets/assesments/Therapy/therapy-03.JPG",
        options: [
          "Very few are seeking therpay.",
          "None of us gose for therapy.",
        ],
        correctAnswer: "None of us gose for therapy.",
      },
      {
        id: "thqs_04",
        imageUrl: "/assets/assesments/Therapy/therapy-04.JPG",
        options: ["It works wonderful on me.", "It has no impact on me."],
        corrctAnswer: "It works wonderful on me.",
      },
      {
        id: "thqs_05",
        imageUrl: "/assets/assesments/Therapy/therapy-05.JPG",
        options: [
          "I feel sorted and peaceful.",
          "Therapy makes me more confused",
        ],
        correctAnswer: "Therapy makes me more confused",
      },
      {
        id: "thqs_06",
        imageUrl: "/assets/assesments/Therapy/therapy-06.JPG",
        options: ["Absolutely", "Not necessarily"],
        correctAnswer: "Absolutely",
      },

      {
        id: "thqs_07",
        imageUrl: "/assets/assesments/Therapy/therapy-07.JPG",
        options: ["But it's very expensive", "My parents won't allow it."],
        correctAnswer: "My parents won't allow it.",
      },
      {
        id: "thqs_08",
        imageUrl: "/assets/assesments/Therapy/therapy-08.JPG",
        options: [
          "I feel better after spending time with my friends.",
          "Even my friends cannot help with my situation.",
        ],
        correctAnswer: "Even my friends cannot help with my situation.",
      },
      {
        id: "thqs_09",
        imageUrl: "/assets/assesments/Therapy/therapy-09.JPG",
        options: ["Therapy helped me.", "Nothing worked on me."],
        correctAnswer: "Nothing worked on me.",
      },
      {
        id: "thqs_10",
        imageUrl: "/assets/assesments/Therapy/therapy-10.JPG",
        options: [
          "I am scared to tell my parents",
          "My parents gladdly welcomed me sharing the idea.",
        ],
        correctAnswer: "My parents gladdly welcomed me sharing the idea.",
      },
    ],
  },
  {
    id: 2,
    name: "Psychological Emotions (Self Reflection) ",
    desc: "Uncover your strengths, traits, and behaviors to better understand yourself.",
    details: {
      Time: "10 minutes",
      "Reading Level": "Individuals from any background",
      Age: "20+",
    },
    price: 15,
    color: "#F7941D",
    thumbnail: "/assets/assesments/thumbnails/self-reflection.png",
    credits: "Mentoons",
    questionGallery: [
      {
        id: "srqs_01",
        imageUrl: "/assets/assesments/Self Reflection/self-reflection-01.JPG",
        options: [
          "I wish i continue my career.",
          "I have a balanced life now.",
        ],
        correctAnswer: "I wish i continue my career.",
      },
      {
        id: "srqs_02",
        imageUrl: "/assets/assesments/Self Reflection/self-reflection-02.JPG",
        options: ["I miss being a pilot", "I am happy serving as a doctor."],
        correctAnswer: "I am happy serving as a doctor.",
      },
      {
        id: "srqs_03",
        imageUrl: "/assets/assesments/Self Reflection/self-reflection-03.JPG",
        options: [
          "To save my friendship, I will listen adn console.",
          "I will fight for my rights even at the cost of my friendship.",
        ],
        correctAnswer:
          "I will fight for my rights even at the cost of my friendship.",
      },
      {
        id: "srqs_04",
        imageUrl: "/assets/assesments/Self Reflection/self-reflection-04.JPG",
        options: [
          "I miss my friend and try to reconnect.",
          "I focus on making new friends.",
        ],
        correctAnswer: "I focus on making new friends.",
      },
      {
        id: "srqs_05",
        imageUrl: "/assets/assesments/Self Reflection/self-reflection-05.JPG",
        options: [
          "I think about what to do next.",
          "I feel bad and do nothing.",
        ],
        correctAnswer: "I think about what to do next.",
      },
      {
        id: "srqs_06",
        imageUrl: "/assets/assesments/Self Reflection/self-reflection-06.JPG",
        options: ["I am diet conscious.", "I am a foodie."],
        correctAnswer: "I am diet conscious.",
      },
      {
        id: "srqs_07",
        imageUrl: "/assets/assesments/Self Reflection/self-reflection-07.JPG",
        options: [
          "I am okay with hugging once in while.",
          "I hate beign touched or hugged.",
        ],
        correctAnswer: "I hate beign touched or hugged.",
      },
      {
        id: "srqs_08",
        imageUrl: "/assets/assesments/Self Reflection/self-reflection-08.JPG",
        options: [
          "I celebrate with my friends",
          "I just share my happiness online.",
        ],
        correctAnswer: "I celebrate with my friends",
      },
      {
        id: "srqs_09",
        imageUrl: "/assets/assesments/Self Reflection/self-reflection-09.JPG",
        options: ["I have will to fight back", "I sulk and accept defeat."],
        correctAnswer: "I have will to fight back",
      },
      {
        id: "srqs_10",
        imageUrl: "/assets/assesments/Self Reflection/self-reflection-10.JPG",
        options: [
          "I know i won't be able to finish task, so I won't even try.",
          " I'll listen to my father and complete it.",
        ],
        correctAnswer: " I'll listen to my father and complete it.",
      },
    ],
  },
  {
    id: 3,
    name: "Psychological Emotions (Meditation) ",
    desc: "Evaluate your emotional intelligence and social skills for better relationships and interactions.",
    details: {
      Time: "10 minutes",
      "Reading Level": "College Students",
      Age: "20+",
    },
    price: 10,
    color: "#F7941D",
    thumbnail: "/assets/assesments/thumbnails/meditation.png",
    credits: "Mentoons",
    questionGallery: [
      {
        id: "mdqs_01",
        imageUrl: "/assets/assesments/Meditation/meditation-01.JPG",
        options: ["Meditation helps me.", "Meditation doesn't help me."],
        correctAnswer: "Meditation helps me.",
      },
      {
        id: "mdqs_02",
        imageUrl: "/assets/assesments/Meditation/meditation-02.JPG",
        options: [
          "Meditation helps me overcome stress.",
          "Meditation does not helps me",
        ],
        correctAnswer: "Meditation helps me overcome stress.",
      },
      {
        id: "mdqs_03",
        imageUrl: "/assets/assesments/Meditation/meditation-03.JPG",
        options: [
          "I remember things better.",
          "I forgot things even after meditating.",
        ],
        correctAnswer: "I remember things better.",
      },
      {
        id: "mdqs_04",
        imageUrl: "/assets/assesments/Meditation/meditation-04.JPG",
        options: ["Reduce stress and anxiety", "Get better sleep"],
        correctAnswer: "Reduce stress and anxiety",
      },
      {
        id: "mdqs_05",
        imageUrl: "/assets/assesments/Meditation/meditation-05.JPG",
        options: [
          "I feel pain in my lower back",
          "I feel calm and deeply relaxed.",
        ],
        correctAnswer: "I feel calm and deeply relaxed.",
      },
      {
        id: "mdqs_06",
        imageUrl: "/assets/assesments/Meditation/meditation-06.JPG",
        options: ["Very effective.", "Didn't work for me."],
        correctAnswer: "Very effective.",
      },
      {
        id: "mdqs_07",
        imageUrl: "/assets/assesments/Meditation/meditation-07.JPG",
        options: [
          "Helps me understand myself better",
          "Increase positive feeling toward other.",
        ],
        correctAnswer: "Helps me understand myself better",
      },
      {
        id: "mdqs_08",
        imageUrl: "/assets/assesments/Meditation/meditation-08.JPG",
        options: ["It works for me.", "It doesn't work for me."],
        correctAnswer: "It works for me.",
      },
      {
        id: "mdqs_09",
        imageUrl: "/assets/assesments/Meditation/meditation-09.JPG",
        options: ["It boosts my thinking.", "It's not effective. for me."],
        correctAnswer: "It boosts my thinking.",
      },
      {
        id: "mdqs_10",
        imageUrl: "/assets/assesments/Meditation/meditation-10.JPG",
        options: ["It improves my focus.", "It doesn't help me."],
        correctAnswer: "It improves my focus.",
      },
    ],
  },
  {
    id: 4,
    name: "Physical Emotion  ",
    desc: "Valuable insights into maintaining professional behavior and building career success.",
    details: {
      Time: "10 minutes",
      "Reading Level": "Individuals from any background",
      Age: "20+",
    },
    price: 15,
    color: "#652D90",
    thumbnail: "/assets/assesments/thumbnails/physical-emotion.png",
    credits: "Mentoons",
    questionGallery: [
      {
        id: "peqs_01",
        imageUrl:
          "/assets/assesments/Physical emotions/physical-emotion-01.jpg",
        options: [
          "The girl dosen't have any issue with kissing",
          "In an engagement, the girl avoids kissing in front of relatives.",
        ],
        correctAnswer: "The girl dosen't have any issue with kissing",
      },
      {
        id: "peqs_02",
        imageUrl:
          "/assets/assesments/Physical emotions/physical-emotion-02.jpg",
        options: [
          "In my house, I prefer to study. My parents take care of my grandmother and take her to regular checkups",
          "I will take medical responsibility and give my parents a break",
        ],
        correctAnswer:
          "I will take medical responsibility and give my parents a break",
      },
      {
        id: "peqs_03",
        imageUrl:
          "/assets/assesments/Physical emotions/physical-emotion-03.jpg",
        options: [
          "I get to take a body massage, I feel relaxed.",
          "I don't enjoy body massage.",
        ],
        correctAnswer: "I get to take a body massage, I feel relaxed.",
      },
      {
        id: "peqs_04",
        imageUrl:
          "/assets/assesments/Physical emotions/physical-emotion-04.jpg",
        options: [
          "I follow a proper gym routine and take proteins on time.",
          "I avoid taking proteins.",
        ],
        correctAnswer:
          "I follow a proper gym routine and take proteins on time.",
      },
      {
        id: "peqs_05",
        imageUrl:
          "/assets/assesments/Physical emotions/physical-emotion-05.jpg",
        options: [
          "I enjoy holding hands while walking, It feels so good.",
          "I don't like holding hands in public.",
        ],
        correctAnswer: "I enjoy holding hands while walking, It feels so good.",
      },
    ],
  },
  {
    id: 5,
    name: "Physical Emotion (Eat Healthy) ",
    desc: "Uncover your strengths, traits, and behaviors to better understand yourself.",
    details: {
      Time: "10 minutes",
      "Reading Level": "College Students",
      Age: "20+",
    },
    price: 10,
    color: "#652D90",
    thumbnail: "/assets/assesments/thumbnails/eat-healthy.png",
    credits: "Mentoons",
    questionGallery: [
      {
        id: "ehqs_01",
        imageUrl: "/assets/assesments/Eat healthy/eat-healthy-01.jpg",
        options: ["I'll make a quick salad.", "I'll order a fried chicken."],
        correctAnswer: "I'll make a quick salad.",
      },
      {
        id: "ehqs_02",
        imageUrl: "/assets/assesments/Eat healthy/eat-healthy-02.jpg",
        options: ["I'll enjoy a fruit salad", "I'll eat ice cream or cake."],
        correctAnswer: "I'll enjoy a fruit salad",
      },
      {
        id: "ehqs_03",
        imageUrl: "/assets/assesments/Eat healthy/eat-healthy-03.jpg",
        options: [
          "I'll use olive oil or avocado as a topping",
          "I'll add mayonnaise or creamy dressings",
        ],
        correctAnswer: "I'll use olive oil or avocado as a topping",
      },
      {
        id: "ehqs_04",
        imageUrl: "/assets/assesments/Eat healthy/eat-healthy-04.jpg",
        options: [
          "I dringk water or buttermilk.",
          "I drink cola or sugary drinks.",
        ],
        correctAnswer: "I dringk water or buttermilk.",
      },
      {
        id: "ehqs_05",
        imageUrl: "/assets/assesments/Eat healthy/eat-healthy-05.jpg",
        options: [
          "I eat roti, rice, dal, and sabzi",
          "I eat biryani or fried snacks.",
        ],
        correctAnswer: "I eat roti, rice, dal, and sabzi",
      },
      {
        id: "ehqs_06",
        imageUrl: "/assets/assesments/Eat healthy/eat-healthy-06.jpg",

        options: ["I'll eat fresh fruit", "I'll have a milkshake."],
        correctAnswer: "I'll eat fresh fruit",
      },
      {
        id: "ehqs_07",
        imageUrl: "/assets/assesments/Eat healthy/eat-healthy-07.jpg",
        options: ["I'll cook veggies and chicken", "I'll order pizza."],
        correctAnswer: "I'll cook veggies and chicken",
      },
      {
        id: "ehqs_08",
        imageUrl: "/assets/assesments/Eat healthy/eat-healthy-08.jpg",
        options: [
          "I have a piece of dark chocolate",
          "I have laddu and or a lot of sweets.",
        ],
        correctAnswer: "I have a piece of dark chocolate",
      },
      {
        id: "ehqs_09",
        imageUrl: "/assets/assesments/Eat healthy/eat-healthy-09.JPG",
        options: [
          "I ordered a single slice to satisfy craving.",
          "I ordered three slices of pizza to feel full.",
        ],
        correctAnswer: "I ordered a single slice to satisfy craving.",
      },
      {
        id: "ehqs_10",
        imageUrl: "/assets/assesments/Eat healthy/eat-healthy-10.JPG",
        options: [
          "Low-fat noodles and snacks with Diet Coke.",
          "A proper balanced meal full of nutrients.",
        ],
        correctAnswer: "A proper balanced meal full of nutrients.",
      },
    ],
  },
  {
    id: 6,
    name: "Opinion Assesment",
    desc: "Evaluate your emotional intelligence and social skills for better relationships and interactions.",
    details: {
      Time: "10 minutes",
      "Reading Level": "College Students",
      Age: "20+",
    },
    price: 10,
    color: "#652D90",
    thumbnail: "/assets/assesments/thumbnails/opinions.png",
    credits: "Mentoons",
    questionGallery: [
      {
        id: "oaqs_01",
        imageUrl: "/assets/assesments/opinions/opinion-01.png",
        options: ["I give one clear opinion.", "I give 2 or 3 opinions."],
        correctAnswer: "I give one clear opinion.",
      },
      {
        id: "oaqs_02",
        imageUrl: "/assets/assesments/opinions/opinion-02.png",
        options: ["I share it, no matter what.", "I share it only when asked."],
        correctAnswer: "I share it, no matter what.",
      },
      {
        id: "oaqs_03",
        imageUrl: "/assets/assesments/opinions/opinion-03.png",
        options: ["Real friends.", "Online friends."],
        correctAnswer: "Real friends.",
      },
      {
        id: "oaqs_04",
        imageUrl: "/assets/assesments/opinions/opinion-04.png",
        options: ["I ignore it.", "I give my opinion."],
        correctAnswer: "I give my opinion.",
      },
      {
        id: "oaqs_05",
        imageUrl: "/assets/assesments/opinions/opinion-05.png",
        options: ["I feel scared.", "I feel comfortable."],
        correctAnswer: "I feel comfortable.",
      },
      {
        id: "oaqs_06",
        imageUrl: "/assets/assesments/opinions/opinion-06.png",
        options: ["I ignore all of them.", "I take selectively"],
        correctAnswer: "I take selectively",
      },
      {
        id: "oaqs_07",
        imageUrl: "/assets/assesments/opinions/opinion-07.png",
        options: ["I'm very vocal about it.", "I prefer to keep it to myself"],
        correctAnswer: "I'm very vocal about it.",
      },
      {
        id: "oaqs_08",
        imageUrl: "/assets/assesments/opinions/opinion-08.png",
        options: ["Yes, it is", "No, it's isn't"],
        correctAnswer: "Yes, it is",
      },
      {
        id: "oaqs_09",
        imageUrl: "/assets/assesments/opinions/opinion-09.png",
        options: ["Yes, it is.", "No it isn't."],
        correctAnswer: "Yes, it is.",
      },
      {
        id: "oaqs_10",
        imageUrl: "/assets/assesments/opinions/opinion-10.png",
        options: ["I give my own opinion.", "I follow other's opinions."],
        correctAnswer: "I give my own opinion.",
      },
    ],
  },
  {
    id: 7,
    name: "Exercise Assesment",
    desc: "Valuable insights into maintaining professional behavior and building career success.",
    details: {
      Time: "10 minutes",
      "Reading Level": "College Students",
      Age: "20+",
    },
    price: 10,
    color: "#F7941D",
    thumbnail: "/assets/assesments/thumbnails/exercise.png",
    credits: "Mentoons",
    questionGallery: [
      {
        id: "eaqs_01",
        imageUrl: "/assets/assesments/Exercise/exercise-01.jpg",
        options: ["I'm ready to exercise", "I want to sleep more"],
        correctAnswer: "I'm ready to exercise",
      },
      {
        id: "eaqs_02",
        imageUrl: "/assets/assesments/Exercise/exercise-02.jpg",
        options: ["I'm excited", "I don't feel likt it"],
        correctAnswer: "I'm excited",
      },
      {
        id: "eaqs_03",
        imageUrl: "/assets/assesments/Exercise/exercise-03.jpg",
        options: ["I'm motivated", "I feel lazy."],
        correctAnswer: "I'm motivated",
      },
      {
        id: "eaqs_04",
        imageUrl: "/assets/assesments/Exercise/exercise-04.jpg",
        options: ["I feel strong", "I want to stop"],
        correctAnswer: "I feel strong",
      },
      {
        id: "eaqs_05",
        imageUrl: "/assets/assesments/Exercise/exercise-05.jpg",
        options: ["I feel great", "I'm exhausted"],
        correctAnswer: "I feel great",
      },
      {
        id: "eaqs_06",
        imageUrl: "/assets/assesments/Exercise/exercise-06.jpg",
        options: ["I stretch or walk", "I sit and relax"],
        correctAnswer: "I stretch or walk",
      },
      {
        id: "eaqs_07",
        imageUrl: "/assets/assesments/Exercise/exercise-07.jpg",
        options: [
          "I feel good and want to exercise",
          "I feel tired and prefer to rest.",
        ],
        correctAnswer: "I feel good and want to exercise",
      },
      {
        id: "eaqs_08",
        imageUrl: "/assets/assesments/Exercise/exercise-08.jpg",
        options: [
          "I'll do it in the evening",
          "I'll skip it for today and rest",
        ],
        correctAnswer: "I'll do it in the evening",
      },
      {
        id: "eaqs_09",
        imageUrl: "/assets/assesments/Exercise/exercise-09.jpg",
        options: ["I'll skip the workout", "I'll try to work out anyway"],
        correctAnswer: "I'll try to work out anyway",
      },
      {
        id: "eaqs_10",
        imageUrl: "/assets/assesments/Exercise/exercise-10.JPG",
        options: [
          "I go to sleep by 9 PM and wake up in the morining",
          "I have irregular sleep because I wake up at night due to notificaitons.",
        ],
        correctAnswer: "I go to sleep by 9 PM and wake up in the morining",
      },
    ],
  },
  {
    id: 8,
    name: "Behavioural Assesment",
    desc: "Uncover your strengths, traits, and behaviors to better understand yourself.",
    details: {
      Time: "10 minutes",
      "Reading Level": "College Students",
      Age: "20+",
    },
    price: 10,
    color: "#F7941D",
    thumbnail: "/assets/assesments/thumbnails/behaviour.png",
    credits: "Mentoons",
    questionGallery: [
      {
        id: "baqs_01",
        imageUrl: "/assets/assesments/Behaviours/behavioural-01.jpg",
        options: [
          "I worry I can't finish everything on time.",
          "I feel I have to do everything perfectly.",
        ],
        correctAnswer: "I worry I can't finish everything on time.",
      },
      {
        id: "baqs_02",
        imageUrl: "/assets/assesments/Behaviours/behavioural-02.jpg",
        options: [
          "I try to stay polite and calm.",
          "I struggle to control my behaviour because of how i feel.",
        ],
        correctAnswer: "I try to stay polite and calm.",
      },
      {
        id: "baqs_03",
        imageUrl: "/assets/assesments/Behaviours/behavioural-03.jpg",
        options: [
          "How can i help you? Are you hurt?",
          "Why weren't you paying attention?",
        ],
        correctAnswer: "How can i help you? Are you hurt?",
      },
      {
        id: "baqs_04",
        imageUrl: "/assets/assesments/Behaviours/behavioural-04.jpg",
        options: [
          "I feel really sad all the time",
          "I feel like everything is too hard to enjoy",
        ],
        correctAnswer: "I feel really sad all the time",
      },
      {
        id: "baqs_05",
        imageUrl: "/assets/assesments/Behaviours/behavioural-05.jpg",
        options: [
          "I will simply put the balance in my wallet without checking",
          "I will check the balance twice",
        ],
        correctAnswer:
          "I will simply put the balance in my wallet without checking",
      },
      {
        id: "baqs_06",
        imageUrl: "/assets/assesments/Behaviours/behavioural-06.jpg",
        options: [
          "I engage in my hobbies, and I feel happy and fulfilled",
          "I don't have any particular hobbies that interest me.",
        ],
        correctAnswer: "I engage in my hobbies, and I feel happy and fulfilled",
      },
      {
        id: "baqs_07",
        imageUrl: "/assets/assesments/Behaviours/behavioural-07.jpg",
        options: [
          "I am very comfortable staying alone",
          "I am not comfortable being with others",
        ],
        correctAnswer: "I am very comfortable staying alone",
      },
      {
        id: "baqs_08",
        imageUrl: "/assets/assesments/Behaviours/behavioural-08.jpg",
        options: [
          "I can recall things, but it take effort",
          "I struggle to remember even simple things",
        ],
        correctAnswer: "I can recall things, but it take effort",
      },
      {
        id: "baqs_09",
        imageUrl: "/assets/assesments/Behaviours/behavioural-09.jpg",
        options: [
          "I have to many thoughts running through my mind",
          "I don't feel tired enough to sleep",
        ],
        correctAnswer: "I have to many thoughts running through my mind",
      },
      {
        id: "baqs_10",
        imageUrl: "/assets/assesments/Behaviours/behavioural-10.jpg",
        options: [
          "I chat with the person next",
          "You keep your eye on the phone",
        ],
        correctAnswer: "I chat with the person next",
      },
    ],
  },
];

export const REPORTS = [
  {
    icon: "/assets/assesments/report/115764_light_idea_bulb_icon 1.png",
    title: "Known issues",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.",
  },
  {
    icon: "/assets/assesments/report/811497_exclamation_point_attention_danger_problem_icon 1.png",
    title: "Potential risks",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.",
  },
  {
    icon: "/assets/assesments/report/465070_article_blog_content_news_note_icon 1.png",
    title: "Change request",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.",
  },
];
