import { GamesData } from "@/pages/FreeDownload";
import { AudioComic, Comic } from "@/redux/comicSlice";
import workshopImg4 from "@/assets/imgs/Workshops_Page_ 8.png";
import workshopImg5 from "@/assets/imgs/Workshops_Page_ 9.png";
import { WorkshopItems } from "@/pages/WorkshopsPage";

export const gamesData: GamesData[] = [
  {
    name: "Hangman",
    desc: "Hangman is a game",
    image: "/hangman.png",
    imgStyling: "bg-gradient-to-t from from-rose-200 to-white",
    cardStyling: "bg-purple-200",
    thumbnail_url:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/board-games/thumbnail/hangman.png",
    pdf_url:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/board-games/pdf/Hangman+game.pdf",
  },
  {
    name: "Word Game",
    desc: "Word Game is a game",
    image: "/wordGame.png",
    imgStyling: "bg-gradient-to-b from from-purple-200 to-white",
    cardStyling: "bg-lime-200",
    thumbnail_url:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/board-games/thumbnail/word+game.png",
    pdf_url:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/board-games/pdf/word+game.pdf",
  },
  {
    name: "Insta Board",
    desc: "Instaboard is a game",
    image: "/Instaboard.png",
    imgStyling: "bg-gradient-to-l from from-amber-200 to-white",
    cardStyling: "bg-rose-200",
    thumbnail_url:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/board-games/thumbnail/Instaboard.png",
    pdf_url:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/board-games/pdf/Insta+Board.pdf",
  },
  {
    name: "Word Quest",
    desc: "Word Quest is a game",
    image: "/wordQuest.png",
    imgStyling: "bg-gradient-to-r from from-green-200 to-white",
    cardStyling: "bg-amber-200",
    thumbnail_url:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/board-games/thumbnail/word+quest.png",
    pdf_url:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/board-games/pdf/Word+Quest.pdf",
  },
  {
    name: "Emergency Contact Numbers",
    desc: "Emergency Contact Numbers is a game",
    image: "/wordQuest.png",
    imgStyling: "bg-gradient-to-r from from-green-200 to-white",
    cardStyling: "bg-amber-200",
    thumbnail_url:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/board-games/thumbnail/emergency+numbers.png",
    pdf_url:
      "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/board-games/pdf/emergency++contact+numbers.pdf",
  },
];

// export const workshopData: WorkshopItems[] = [
//   {
//     name: "Buddy Camp",
//     img: WorkshopImg1,
//     desc: "Buddy Camp is a fun and educational workshop designed to help children ages 6-12 build lasting friendships and develop important social skills.",
//     video:
//       "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Workshops/videos/Kids+Camp_01.mp4",
//     features: [
//       "Engaging activities that promote friendship and teamwork",
//       "Age-appropriate lessons on moral values and ethical decision-making",
//       "Practical exercises to improve conversation skills",
//       "Safe and supportive environment for children to practice social interactions",
//       "Experienced facilitators trained in child development",
//     ],
//     expectations: [
//       "Friendship-building games and exercises",
//       "Discussions on moral values and their importance in daily life",
//       "Role-playing scenarios to practice conversation starters",
//       "Group projects that encourage collaboration and communication",
//       "Reflection sessions to reinforce learned concepts",
//     ],
//     benefits: [
//       "Increased self-confidence in social situations",
//       "Better understanding of moral values and their application",
//       "Improved ability to initiate and maintain friendships",
//       "Enhanced communication skills for academic and personal success",
//       "Positive peer interactions in a structured setting",
//     ],
//   },
//   {
//     name: "Teen Camp",
//     img: WorkshopImg2,
//     desc: "Help your teenager navigate the challenges of adolescence De-Addiction, Scrolling De-Addiction & Hormonal Changes with our comprehensive Teen Camp workshop.",
//     video:
//       "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Workshops/videos/Teen+Camp_01.mp4",
//     features: [
//       "Identity Exploration: Guides teens in understanding and developing their personal identity",
//       "Hormonal Changes: Educates on physical and emotional changes during puberty",
//       "Substance De-Addiction: Provides information and strategies to avoid or overcome substance use",
//       "Scrolling De-Addiction: Teaches healthy digital habits and reducing screen time",
//       "Age-Appropriate Content: Tailored for teenagers between 13-19 years old",
//       "Expert-Led Sessions: Conducted by qualified professionals in adolescent development",
//     ],
//     expectations: [
//       "Interactive group discussions",
//       "Informative presentations",
//       "Practical exercises and activities",
//       "Safe and supportive environment",
//       "Take-home resources for continued learning",
//     ],
//     benefits: [
//       "Gain confidence in their changing bodies and emotions",
//       "Learn to make informed decisions about substance use",
//       "Develop healthier relationships with technology",
//       "Improve communication skills with peers and adults",
//       "Build a stronger sense of self",
//     ],
//   },
//   {
//     name: "Family Camp",
//     img: WorkshopImg3,
//     desc: "Help your teenager navigate the challenges of adolescence De-Addiction, Scrolling De-Addiction & Hormonal Changes with our comprehensive Teen Camp workshop.",
//     video:
//       "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Workshops/videos/Family+Camp_01.mp4",
//     features: [
//       "Engaging activities that promote friendship and teamwork",
//       "Age-appropriate lessons on moral values and ethical decision-making",
//       "Practical exercises to improve conversation skills",
//       "Safe and supportive environment for children to practice social interactions",
//       "Experienced facilitators trained in child development",
//     ],
//     expectations: [
//       "Friendship-building games and exercises",
//       "Discussions on moral values and their importance in daily life",
//       "Role-playing scenarios to practice conversation starters",
//       "Group projects that encourage collaboration and communication",
//       "Reflection sessions to reinforce learned concepts",
//     ],
//     benefits: [
//       "Increased self-confidence in social situations",
//       "Better understanding of moral values and their application",
//       "Improved ability to initiate and maintain friendships",
//       "Enhanced communication skills for academic and personal success",
//       "Positive peer interactions in a structured setting",
//     ],
//   },
// ];

export const jokes: { setup: string; punchline: string }[] = [
  {
    setup: "Why don't skeletons fight each other?",
    punchline: "Because they don't have the guts!",
  },
  {
    setup: "What do you call cheese that isn't yours?",
    punchline: "Nacho cheese!",
  },
  {
    setup: "Why did the math book look sad?",
    punchline: "It had too many problems.",
  },
  {
    setup: "What do you get when you cross a snowman and a dog?",
    punchline: "Frostbite!",
  },
  {
    setup: "Why can't Elsa have a balloon?",
    punchline: "Because she'll let it go!",
  },
  { setup: "What kind of tree fits in your hand?", punchline: "A palm tree!" },
  {
    setup: "Why don't eggs tell jokes?",
    punchline: "Because they might crack up.",
  },
  { setup: "Why did the bicycle fall over?", punchline: "It was two-tired!" },
  {
    setup: "What does a cloud wear under its raincoat?",
    punchline: "Thunderwear!",
  },
  {
    setup: "How do you make a tissue dance?",
    punchline: "You put a little boogie in it!",
  },
  {
    setup: "Why did the golfer bring two pairs of pants?",
    punchline: "In case he got a hole in one!",
  },
  {
    setup: "Why did the student eat his homework?",
    punchline: "Because the teacher said it was a piece of cake!",
  },
  {
    setup: "How does a cucumber become a pickle?",
    punchline: "It goes through a jarring experience!",
  },
  {
    setup: "What did one plate say to the other?",
    punchline: "Lunch is on me!",
  },
  {
    setup: "Why did the teddy bear say no to dessert?",
    punchline: "Because it was stuffed!",
  },
  {
    setup: "What do you call a bear with no teeth?",
    punchline: "A gummy bear!",
  },
  {
    setup: "What is a pirate's favorite letter?",
    punchline: "You'd think it's 'R,' but it's the 'C'!",
  },
  {
    setup: "What time is it when the clock strikes 13?",
    punchline: "Time to get a new clock!",
  },
  {
    setup: "How do you catch a squirrel?",
    punchline: "Climb a tree and act like a nut!",
  },
  { setup: "What do you call a cow with no legs?", punchline: "Ground beef!" },
  {
    setup: "Why did the scarecrow win an award?",
    punchline: "Because he was outstanding in his field!",
  },
  { setup: "What has ears but cannot hear?", punchline: "A cornfield!" },
  {
    setup: "Why did the tomato turn red?",
    punchline: "Because it saw the salad dressing!",
  },
  { setup: "What do you call fake spaghetti?", punchline: "An impasta!" },
  {
    setup: "Why did the computer go to the doctor?",
    punchline: "Because it had a virus!",
  },
  { setup: "What do elves learn in school?", punchline: "The elf-abet!" },
  { setup: "What is brown and sticky?", punchline: "A stick!" },
  {
    setup: "Why can't you give Elsa a balloon?",
    punchline: "Because she'll let it go!",
  },
  { setup: "What animal is always at a baseball game?", punchline: "A bat!" },
  { setup: "What's orange and sounds like a parrot?", punchline: "A carrot!" },
  {
    setup: "Why do fish live in saltwater?",
    punchline: "Because pepper makes them sneeze!",
  },
  {
    setup: "Why are ghosts bad at lying?",
    punchline: "Because you can see right through them!",
  },
  {
    setup: "What do you call an alligator in a vest?",
    punchline: "An investigator!",
  },
  { setup: "What do you call a sleeping bull?", punchline: "A bulldozer!" },
  {
    setup: "How do you make an octopus laugh?",
    punchline: "With ten-tickles!",
  },
  {
    setup: "What did one eye say to the other?",
    punchline: "Between us, something smells!",
  },
  {
    setup: "Why did the cookie go to the hospital?",
    punchline: "Because it felt crummy!",
  },
  {
    setup: "Why did the frog take the bus to work?",
    punchline: "His car got toad away!",
  },
  {
    setup: "Why did the banana go to the doctor?",
    punchline: "Because it wasn't peeling well!",
  },
  {
    setup: "Why did the chicken go to the seance?",
    punchline: "To talk to the other side!",
  },
  {
    setup: "What do you call a pig that knows karate?",
    punchline: "A pork chop!",
  },
  {
    setup: "Why are frogs so happy?",
    punchline: "They eat whatever bugs them!",
  },
  {
    setup: "Why don't oysters share their pearls?",
    punchline: "Because they're shellfish!",
  },
  {
    setup: "What did the big flower say to the little flower?",
    punchline: "Hey, bud!",
  },
  {
    setup: "Why did the fish blush?",
    punchline: "Because it saw the ocean's bottom!",
  },
  { setup: "How do you talk to a giant?", punchline: "Use big words!" },
  {
    setup: "What do you call an elephant that doesn't matter?",
    punchline: "Irrelephant!",
  },
  {
    setup: "What's brown, hairy, and wears sunglasses?",
    punchline: "A coconut on vacation!",
  },
  { setup: "What did the zero say to the eight?", punchline: "Nice belt!" },
];

export enum Category {
  sm = "groupSmall",
  md = "groupMedium",
  lg = "groupLarge",
}

export enum ComicType {
  comic = "comic",
  audioComic = "audioComic",
}

export const workshopDetails: WorkshopItems[] = [
  {
    name: "Buddy Camp",
    desc: "Buddy Camp is a fun and educational workshop designed to help children ages 6-12 build lasting friendships and develop important social skills.",
    img: "/assets/camps/Buddy.png",
    video:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Workshops/videos/Kids+Camp_01.mp4",
    pageUrl: "/mentoons-workshops?workshop=6-12",
  },
  {
    name: "Teen Camp",
    desc: "Help your teenager navigate the challenges of adolescence De-Addiction, Scrolling De-Addiction & Hormonal Changes with our comprehensive Teen Camp workshop.",
    img: "/assets/camps/Teen.png",
    video:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Workshops/videos/Teen+Camp_01.mp4",
    pageUrl: "/mentoons-workshops?workshop=13-19",
  },
  {
    name: "Family Camp",
    desc: "Help your teenager navigate the challenges of adolescence De-Addiction, Scrolling De-Addiction & Hormonal Changes with our comprehensive Teen Camp workshop.",
    img: "/assets/camps/Family.png",
    video:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Workshops/videos/Family+Camp_01.mp4",
    pageUrl: "/mentoons-workshops?workshop=Parents",
  },
  {
    name: "How to make your own Comic",
    desc: "Buddy Camp is a fun and educational workshop designed to help children ages 6-12 build lasting friendships and develop important social skills.",
    img: workshopImg4,
    video:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Workshops/videos/How+to+make+your+Own+Comic+Workshop+Trailer_01.mp4",
    pageUrl: "/mentoons-workshops?workshop=comic",
  },
  {
    name: "How to make your own Character",
    desc: "Help your teenager navigate the challenges of adolescence De-Addiction, Scrolling De-Addiction & Hormonal Changes with our comprehensive Teen Camp workshop.",
    img: workshopImg5,
    video:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Workshops/videos/how+to+make+your+own+character+workshop.mp4",
    pageUrl: "/mentoons-workshops?workshop=character",
  },
];

export const audioComicsData: AudioComic[] = [
  // groupSmall = 6 - 12, groupMedium = 13 - 19, groupLarge = 20+
  {
    name: "Bet Your Life",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "2:17",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-09.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+37.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/BET_YOUR_LIFE.mp4",
    category: Category.sm,
    type: ComicType.audioComic,
  },
  {
    name: "The Cell Life of Soniya",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "2:31",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-12.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+27.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/CELL_LIFE_OF_SONIYA_02.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "Choose Wisely",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "4:27",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-08.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+33.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/CHOOSE_WISELY.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "Come out of Gaming",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "5:51",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-05.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+36.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/COME_OUT_OF_GAMING_02.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "Comic on Divorce",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "2:04",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-07.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+1+4.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/COMIC_ON_DIVORCE_01.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "Don't Fade Away",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "2:54",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-04.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+35.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/DONT_FADE_AWAY_02.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "Hungry for Likes Not Life",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "2:10",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-15.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+34.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/HUNGRY_FOR_LIKES_NOT_LIFE_01.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "One Way Trip",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "4:09",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-22.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+38.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/ONE-WAY-TRIP_1.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "Rishi and Rohit",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "2:20",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-16.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+29.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/RISHI+AND+ROHIT.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "Rohan and the Puppies",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "2:09",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-17.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+28.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/Rohan+and+the+Puppies_01.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "Think Before You Act",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "3:45",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/Think_Before_You_Act!.png",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Think_Before_You_Act!.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/Think+Before+You+Act.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "Tanya's Downfall",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "1:53",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-06.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+26.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/TANYA_DOWN-FALL_02.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "How Teenagers Lose Their Jobs Part-1",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "1:13",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-23.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+1+3.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+20%2B/SANKAR_INTERVIEW.mp4",
    category: Category.lg,
    type: ComicType.audioComic,
  },
  {
    name: "How Teenagers Lose Their Jobs Part-2",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "0:58",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-24.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+19.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+20%2B/Sana+Comic+Interview.mp4",
    category: Category.lg,
    type: ComicType.audioComic,
  },
  {
    name: "I can Manage (Time Management)",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "1:29",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-02.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+24.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/Asha+%26+Simran-+Time+management+(6-12)_1.mp4",
    category: Category.sm,
    type: ComicType.audioComic,
  },
  {
    name: "Comic on Honesty",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "1:16",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-01.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+40.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/COMIC_ON_HONESTY.mp4",
    category: Category.sm,
    type: ComicType.audioComic,
  },
  {
    name: "Greeting Comic",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "1:44",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/comic_4.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+39.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/GREETING_COMIC.mp4",
    category: Category.sm,
    type: ComicType.audioComic,
  },
  {
    name: "Live and Let Live",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "2:02",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-21.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+23.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/SAY+SORRY+COMIC.mp4",
    category: Category.sm,
    type: ComicType.audioComic,
  },
  {
    name: "Say Sorry",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "2:08",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-10.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+20.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/SAY+SORRY+COMIC.mp4",
    category: Category.sm,
    type: ComicType.audioComic,
  },
  {
    name: "My Daily Routine",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "0:47",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-01.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+25.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/SUPRIYA_TIME_MANAGEMENT_1.mp4",
    category: Category.sm,
    type: ComicType.audioComic,
  },
  {
    name: "Do You Know",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "3:44",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-20.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+31.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/BOOKS/BOOK+3+DO+YOU+KNOW_FINAL.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "Electronic Gadgets And Kids",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "5:21",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-13.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+32.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/BOOKS/BOOK_02_GADGETS_AND_KIDS_01.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "How to Handle Relationships",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "5:11",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-14.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+30.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/BOOKS/HOW+TO+HANDLE+RELATIONSHIP.mp4",
    category: Category.md,
    type: ComicType.audioComic,
  },
  {
    name: "Listen To Me",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    duration: "2:12",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-19.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+22.jpg",
    videoLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/Comic+on+Listen+to+me_01.mp4",
    category: Category.sm,
    type: ComicType.audioComic,
  },
];

export const comicsData: Comic[] = [
  {
    name: "Don't Fade Away",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-04.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+35.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/dont+fade+away.pdf",
    category: Category.md,
    type: ComicType.comic,
  },
  {
    name: "One Way Trip",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-22.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+38.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/one+way+trip.pdf",
    category: Category.md,
    type: ComicType.comic,
  },
  {
    name: "Bet Your Life",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-09.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+37.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/bet+your+life.pdf",
    category: Category.sm,
    type: ComicType.comic,
  },
  {
    name: "Come out of Gaming",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-05.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+36.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/Come+Out+Of+Game.pdf",
    category: Category.md,
    type: ComicType.comic,
  },
  {
    name: "The Cell Life of Soniya",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-12.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+27.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/Cell+Life+of+Soniya.pdf",
    category: Category.md,
    type: ComicType.comic,
  },
  {
    name: "Tanya's Downfall",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-06.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+26.jpg",
    category: Category.md,
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/tanya_s+downfall.pdf",
    type: ComicType.comic,
  },
  {
    name: "Live and Let Live",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-21.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+23.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/live+or+let+live.pdf",
    category: Category.sm,
    type: ComicType.comic,
  },
  {
    name: "I can Manage (Time Management)",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-02.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+24.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/Asha+_+Simran-+Time+management+(6-9)+.pdf",
    category: Category.sm,
    type: ComicType.comic,
  },
  {
    name: "Choose Wisely",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-08.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+33.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/choose+wisely.pdf",
    category: Category.md,
    type: ComicType.comic,
  },
  {
    name: "Rohan and the Puppies",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-17.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+28.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/rohan+and+the+puppies.pdf",
    category: Category.md,
    type: ComicType.comic,
  },
  {
    name: "Rishi and Rohit",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-16.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+29.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/rohit+and+rishi.pdf",
    category: Category.md,
    type: ComicType.comic,
  },
  {
    name: "My Daily Routine",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-01.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+25.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/supriya-time+management+copy.pdf",
    category: Category.sm,
    type: ComicType.comic,
  },
  {
    name: "Comic on Divorce",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-07.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+1+4.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/Divorce.pdf",
    category: Category.md,
    type: ComicType.comic,
  },
  {
    name: "Say Sorry",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-10.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+20.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/Say+Sorry.pdf",
    category: Category.sm,
    type: ComicType.comic,
  },
  {
    name: "How Teenagers Lose Their Jobs Part-2",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-24.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+19.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/20%2B+script+2+story.pdf",
    category: Category.lg,
    type: ComicType.comic,
  },
  {
    name: "Hungry for Likes Not Life",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-15.jpg",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Untitled_Artwork+34.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/Hungry+for+likes+not+life.pdf",
    category: Category.md,
    type: ComicType.comic,
  },
  {
    name: "Think Before You Act",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit sapiente maiores eius libero a commodi.",
    mini_thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/Think_Before_You_Act!.png",
    thumbnail:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/Audio+comics+thumbnails/Think_Before_You_Act!.jpg",
    comicLink:
      "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/Comics-Pdf/Preppers+Story+(Think+Before+You+Act)+(1).pdf",
    category: Category.md,
    type: ComicType.comic,
  },
];
