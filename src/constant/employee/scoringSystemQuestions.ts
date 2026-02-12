import { ScoringSystem } from "@/types/employee/scoringSystemTypes";

export const SCROING_SYSTEM: ScoringSystem = [
  {
    teenCamp: [
      {
        heading: "Active participation",
        point: 10,
        questions: [
          {
            question:
              "Was the menteen on time and present throughout the session?",
            point: 2,
          },
          {
            question:
              "Did they respond when called upon (verbally / chat / activity)?",
            point: 2,
          },
          {
            question:
              "Did they ask at least one relevant question or seek clarification?",
            point: 2,
          },
          {
            question:
              "Did they participate in activities/exercises (polls, tasks, games)?",
            point: 2,
          },
          {
            question:
              "Did they stay focused (minimal distraction, camera/chat presence)?",
            point: 2,
          },
        ],
      },
      {
        heading: "Emotional honesty & openness",
        point: 10,
        questions: [
          {
            question:
              "Did they express real feelings instead of “safe” or generic answers?",
            point: 3,
          },
          {
            question:
              "Did they acknowledge discomfort/confusion honestly when present?",
            point: 2,
          },
          {
            question:
              "Did they share a personal example or lived experience (age appropriate)?",
            point: 3,
          },
          {
            question:
              "Did they show respectful vulnerability without mocking or shutting down?",
            point: 2,
          },
        ],
      },

      {
        heading: "Thoughtful reflection",
        point: 10,
        questions: [
          {
            question: "Reflection shows self-awareness?",
            point: 3,
          },
          {
            question: "Connects learning to own behaviour/emotions?",
            point: 3,
          },
          {
            question: "Mentions specific moment/activity from session?",
            point: 2,
          },
          {
            question: "Shows learning or growth insight (even small)?",
            point: 2,
          },
        ],
      },
      {
        heading: "Willingness to share / participate",
        point: 10,
        questions: [
          {
            question: "Volunteered to share without being forced",
            point: 3,
          },
          {
            question: "Participated in group discussions/breakouts",
            point: 3,
          },
          {
            question:
              "Respected others while sharing (no interruptions/judgement)",
            point: 2,
          },
          {
            question: "Continued participating even after initial hesitation",
            point: 2,
          },
        ],
      },

      {
        heading: "Originality & expression",
        point: 10,
        questions: [
          {
            question: "Did they bring a unique idea or personal twist?",
            point: 3,
          },
          {
            question: "Expressed themselves beyond the “expected” answer?",
            point: 3,
          },
          {
            question: "Used emotion, imagery, or storytelling effectively?",
            point: 2,
          },
          {
            question: "Took a creative risk (even if imperfect)?",
            point: 2,
          },
        ],
      },
      {
        heading: "Conceptual understanding",
        point: 15,
        questions: [
          {
            question: "Correctly identifies key concept/theme ",
            point: 5,
          },
          {
            question: "Explains it in their own words",
            point: 5,
          },
          {
            question: "Applies concept to real-life situation ",
            point: 5,
          },
        ],
      },

      {
        heading: "Confidence in communication",
        point: 10,
        questions: [
          {
            question: "Speaks clearly and audibly (voice/chat)",
            point: 2,
          },
          {
            question:
              "Maintains eye contact / presence (camera or body language)",
            point: 2,
          },
          {
            question: "Expresses opinions without excessive apology/fear",
            point: 3,
          },
          {
            question: "Recovers after mistakes or nervousness",
            point: 3,
          },
        ],
      },
      {
        heading: "Collaboration & support for peers",
        point: 10,
        questions: [
          {
            question: "Listens when others speak",
            point: 2,
          },
          {
            question: "Encourages or validates peers",
            point: 3,
          },
          {
            question: "Works cooperatively in group tasks",
            point: 3,
          },
          {
            question: "Avoids dominating or dismissing others",
            point: 2,
          },
        ],
      },

      {
        heading: "Calm response under pressure",
        point: 8,
        questions: [
          {
            question: "Manages frustration without emotional outburst",
            point: 3,
          },
          {
            question: "Responds respectfully under stress",
            point: 3,
          },
          {
            question: "Accepts feedback without shutdown/defensiveness",
            point: 2,
          },
        ],
      },
      {
        heading: "Use of regulation tools (breathing, tone, pause)",
        point: 7,
        // main: "What did you do when you felt overwhelmed?",
        questions: [
          {
            question: "Uses breathing/pausing consciously",
            point: 3,
          },
          {
            question: "Adjusts tone/body language when emotional",
            point: 2,
          },
          {
            question: "Names the tool they used (“I paused”, “I breathed”)",
            point: 2,
          },
        ],
      },
    ],
  },
  {
    instantKatha: [
      {
        heading: "Creativity & Originality",
        point: 25,
        questions: [
          {
            question: "Did the story feel new and interesting?",
            point: 5,
          },
          {
            question: "Was imagination clearly used in the story?",
            point: 5,
          },
          {
            question: "Did the story avoid copying common plots?",
            point: 5,
          },
          {
            question: "Was there a creative twist or idea?",
            point: 5,
          },
          {
            question: " Did this story stand out from others?",
            point: 5,
          },
        ],
      },
      {
        heading: "Structure & Flow",
        point: 20,
        questions: [
          {
            question: "Did the story feel new and interesting?",
            point: 4,
          },
          {
            question: "Was imagination clearly used in the story?",
            point: 4,
          },
          {
            question: "Did the story avoid copying common plots?",
            point: 4,
          },
          {
            question: "Was there a creative twist or idea?",
            point: 4,
          },
          {
            question: " Did this story stand out from others?",
            point: 4,
          },
        ],
      },
      {
        heading: "Message / Moral",
        point: 20,
        questions: [
          {
            question: "Could you clearly understand the message?",
            point: 4,
          },
          {
            question: "Was the message meaningful for teens?",
            point: 4,
          },
          {
            question: "Did the story stay focused on the message?",
            point: 4,
          },
          {
            question: "Did the ending reinforce the message?",
            point: 4,
          },
          {
            question: "Did the story make you think or reflect?",
            point: 4,
          },
        ],
      },
      {
        heading: "Expression & Voice",
        point: 20,
        questions: [
          {
            question: "Was the voice clear and audible?",
            point: 4,
          },
          {
            question: "Did tone match the emotions of the story?",
            point: 4,
          },
          {
            question: "Were pauses used well?",
            point: 4,
          },
          {
            question: "Was speech expressive?",
            point: 4,
          },
          {
            question: "Did the voice keep you engaged?",
            point: 4,
          },
        ],
      },
      {
        heading: "Confidence & Stage Presence",
        point: 15,
        questions: [
          {
            question: "Did they look confident?",
            point: 3,
          },
          {
            question: "Was posture relaxed? ",
            point: 3,
          },
          {
            question: "Did they connect with the audience?",
            point: 3,
          },
          {
            question: "Was nervousness handled well?",
            point: 3,
          },
          {
            question: "Did confidence grow during the performance?",
            point: 3,
          },
        ],
      },
    ],
  },
  {
    kalakrithi: [
      {
        heading: "Concept & Interpretation",
        point: 25,
        questions: [
          {
            question: "Did the creation clearly reflect the theme?",
            point: 5,
          },
          {
            question: "Was the idea intentional and well thought out?",
            point: 5,
          },
          {
            question: "Did it show understanding beyond surface level?",
            point: 5,
          },
          {
            question: "Was symbolism or meaning evident?",
            point: 5,
          },
          {
            question: "Did the concept feel purposeful?",
            point: 5,
          },
        ],
      },
      {
        heading: "Creativity & Innovation",
        point: 20,
        questions: [
          {
            question: "Was the approach original?",
            point: 4,
          },
          {
            question: "Did the participant experiment creatively?",
            point: 4,
          },
          {
            question: "Was the medium used effectively?",
            point: 4,
          },
          {
            question: "Did the work stand out visually or conceptually?",
            point: 4,
          },
          {
            question: "Was there a personal creative touch?",
            point: 4,
          },
        ],
      },
      {
        heading: "Emotional Expression",
        point: 20,
        questions: [
          {
            question: "Did the work convey emotions clearly?",
            point: 4,
          },
          {
            question: "Could the audience connect emotionally?",
            point: 4,
          },
          {
            question: "Did the work evoke thought or feeling?",
            point: 4,
          },
          {
            question: "Was emotional depth visible?",
            point: 4,
          },
          {
            question: "Did expression align with the theme?",
            point: 4,
          },
        ],
      },
      {
        heading: "Effort & Detailing",
        point: 20,
        questions: [
          {
            question: "Was the work complete and polished?",
            point: 4,
          },
          {
            question: "Was sufficient effort clearly visible?",
            point: 4,
          },
          {
            question: "Were details thoughtfully added?",
            point: 4,
          },
          {
            question: "Was time used effectively?",
            point: 4,
          },
          {
            question: "Did effort match the idea’s complexity?",
            point: 4,
          },
        ],
      },
      {
        heading: "Explanation / Presentation",
        point: 15,
        questions: [
          {
            question: "Could the participant explain the idea clearly?",
            point: 3,
          },
          {
            question: "Was the explanation structured?",
            point: 3,
          },
          {
            question: "Did they justify creative choices?",
            point: 3,
          },
          {
            question: "Was communication confident?",
            point: 3,
          },
          {
            question: "Did they respond clearly to questions?",
            point: 3,
          },
        ],
      },
    ],
  },
  {
    hasyaras: [
      {
        heading: "Timing & Delivery",
        point: 25,
        questions: [
          {
            question: "Were punchlines delivered at the right moment?",
            point: 5,
          },
          {
            question: "Were pauses used effectively for humour?",
            point: 5,
          },
          {
            question: "Was pacing appropriate?",
            point: 5,
          },
          {
            question: "Did delivery feel natural?",
            point: 5,
          },
          {
            question: "Was confidence maintained throughout?",
            point: 5,
          },
        ],
      },
      {
        heading: "Originality of Content",
        point: 20,
        questions: [
          {
            question: "Were punchlines delivered at the right moment?",
            point: 4,
          },
          {
            question: "Were pauses used effectively for humour?",
            point: 4,
          },
          {
            question: "Was pacing appropriate?",
            point: 4,
          },
          {
            question: "Did delivery feel natural?",
            point: 4,
          },
          {
            question: "Was confidence maintained throughout?",
            point: 4,
          },
        ],
      },
      {
        heading: "Audience Engagement",
        point: 20,
        questions: [
          {
            question: "Did the audience respond with laughter/ smiles?",
            point: 4,
          },
          {
            question: "Was attention sustained?",
            point: 4,
          },
          {
            question: "Did the performer read the room well?",
            point: 4,
          },
          {
            question: "Did they adapt based on reactions?",
            point: 4,
          },
          {
            question: "Was engagement consistent till the end?",
            point: 4,
          },
        ],
      },
      {
        heading: "Expression & Body Language",
        point: 20,
        questions: [
          {
            question: "Were facial expressions clear?",
            point: 4,
          },
          {
            question: "Did gestures support the humour",
            point: 4,
          },
          {
            question: "Was body movement confident?",
            point: 4,
          },
          {
            question: "Did expressions add to the joke?",
            point: 4,
          },
          {
            question: "Was energy balanced?",
            point: 4,
          },
        ],
      },
      {
        heading: "Respect & Sensitivity",
        point: 15,
        questions: [
          {
            question: "Was the humour respectful?",
            point: 3,
          },
          {
            question: "Was content age-appropriate?",
            point: 3,
          },
          {
            question: "Did it avoid hurtful jokes?",
            point: 3,
          },
          {
            question: "Was language clean?",
            point: 3,
          },
          {
            question: "Did humour promote positivity?",
            point: 3,
          },
        ],
      },
    ],
  },
  {
    swar: [
      {
        heading: "Voice Control & Clarity",
        point: 25,
        questions: [
          {
            question: "Was the voice clear and steady?",
            point: 5,
          },
          {
            question: "Were notes sung clearly?",
            point: 5,
          },
          {
            question: "Was pitch mostly accurate?",
            point: 5,
          },
          {
            question: "Did the voice stay strong throughout?",
            point: 5,
          },
          {
            question: "Was clarity maintained?",
            point: 5,
          },
        ],
      },
      {
        heading: "Rhythm & Timing",
        point: 20,
        questions: [
          {
            question: "Was the voice clear and steady?",
            point: 4,
          },
          {
            question: "Were notes sung clearly?",
            point: 4,
          },
          {
            question: "Was pitch mostly accurate?",
            point: 4,
          },
          {
            question: "Did the voice stay strong throughout?",
            point: 4,
          },
          {
            question: "Was clarity maintained?",
            point: 4,
          },
        ],
      },
      {
        heading: " Expression & Feeling",
        point: 20,
        questions: [
          {
            question: "Did the voice show emotion?",
            point: 4,
          },
          {
            question: "Did the song feel heartfelt?",
            point: 4,
          },
          {
            question: "Did expression match the lyrics?",
            point: 4,
          },
          {
            question: "Did emotion enhance the performance?",
            point: 4,
          },
          {
            question: "Did it connect with listeners?",
            point: 4,
          },
        ],
      },
      {
        heading: "Confidence & Stage Comfort",
        point: 20,
        questions: [
          {
            question: "Did they look confident?",
            point: 4,
          },
          {
            question: "Was posture relaxed?",
            point: 4,
          },
          {
            question: "Did they connect with the audience?",
            point: 4,
          },
          {
            question: "Was nervousness handled well?",
            point: 4,
          },
          {
            question: "Did confidence grow during the performance?",
            point: 4,
          },
        ],
      },
      {
        heading: "Creativity / Personal Style",
        point: 15,
        questions: [
          {
            question: "Did they add a personal touch?",
            point: 3,
          },
          {
            question: "Were variations or creativity used?",
            point: 3,
          },
          {
            question: "Did creativity improve the song?",
            point: 3,
          },
          {
            question: "Was experimentation controlled?",
            point: 3,
          },
          {
            question: "Did their style feel unique?",
            point: 3,
          },
        ],
      },
    ],
  },
];
