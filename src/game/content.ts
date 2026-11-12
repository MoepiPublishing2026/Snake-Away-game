import type { School } from "../storage";

export type QuizItem = { q: string; options: string[]; correct: number; explain: string };

export type Level = {
  id: number;
  heading: string;
  need: number;
  tickMs: number;
  maxPos: number;
  startAdvance: number;
  push: number;
  pull: number;
  harmShow: number;
  safeShow: number;
  decoyShow: number;
  harm: string[];
  safe: string[];
  decoys: string[];
  quiz: QuizItem[];
};

export type WheelSlice = {
  label: string;
  icon: string;
  type: "hint" | "shuffle" | "freeze" | "life" | "points" | "none";
  amount?: number;
  color: string;
  ink: string;
};

export const PASS_BASE = 100;
export const PASS_PER_LIFE = 25;
export const QUIZ_PENALTY = 50;
export const FAIL_PENALTY = 25;
export const TILE_COLORS: string[] = ["#38b6ff","#7b5cff","#ff6ad5","#c7da30","#a78bfa","#22d3ee","#f472b6","#4ade80"];
export const WHEEL: WheelSlice[] = [
  {
    "label": "Hint",
    "icon": "💡",
    "type": "hint",
    "color": "#ffe14a",
    "ink": "#2a1a00"
  },
  {
    "label": "50",
    "icon": "✦",
    "type": "points",
    "amount": 50,
    "color": "#5ee0a0",
    "ink": "#06301c"
  },
  {
    "label": "Nothing",
    "icon": "✕",
    "type": "none",
    "color": "#b7c0dc",
    "ink": "#1a2038"
  },
  {
    "label": "Shuffle",
    "icon": "⟲",
    "type": "shuffle",
    "color": "#ff7ad9",
    "ink": "#3a0830"
  },
  {
    "label": "Life",
    "icon": "❤",
    "type": "life",
    "color": "#ff5d73",
    "ink": "#fff"
  },
  {
    "label": "Freeze",
    "icon": "❄",
    "type": "freeze",
    "color": "#49c4ff",
    "ink": "#042033"
  },
  {
    "label": "Nothing",
    "icon": "✕",
    "type": "none",
    "color": "#d4c8f8",
    "ink": "#24124a"
  },
  {
    "label": "100",
    "icon": "★",
    "type": "points",
    "amount": 100,
    "color": "#d6ef4a",
    "ink": "#1c2404"
  }
];
export const SCHOOLS: Record<School, { label: string; lede: string }> = {
  "primary": {
    "label": "Primary",
    "lede": "Simple scenarios about kindness, bullying, online meanness, and telling a grown-up."
  },
  "secondary": {
    "label": "Secondary",
    "lede": "Scenarios for secondary and high school — bullying, peer pressure, unsafe comments, and how to speak up."
  }
};
export const TRACKS: Record<School, Level[]> = {
  "primary": [
    {
      "id": 1,
      "heading": "MEAN WORDS",
      "need": 4,
      "tickMs": 3200,
      "maxPos": 14,
      "startAdvance": 0,
      "push": 1,
      "pull": 2,
      "harmShow": 4,
      "safeShow": 0,
      "decoyShow": 2,
      "harm": [
        "Mean names",
        "Teasing",
        "Laughing at you",
        "Unkind words",
        "Being mean",
        "Nasty jokes"
      ],
      "safe": [],
      "decoys": [
        "Please",
        "Thank you",
        "Sharing",
        "Helping",
        "Kind words",
        "Fair play"
      ],
      "quiz": [
        {
          "q": "Someone calls a child mean names every day. What is that?",
          "options": [
            "Just a joke",
            "Being mean",
            "A fun game"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "You see a child being called names. What helps?",
          "options": [
            "Laugh too",
            "Stand with them and tell a teacher",
            "Call them a name too"
          ],
          "correct": 1,
          "explain": ""
        }
      ]
    },
    {
      "id": 2,
      "heading": "Some bigger children push Lerato and take her lunch.",
      "need": 5,
      "tickMs": 2600,
      "maxPos": 12,
      "startAdvance": 1,
      "push": 1,
      "pull": 2,
      "harmShow": 3,
      "safeShow": 3,
      "decoyShow": 2,
      "harm": [
        "Pushing",
        "Hitting",
        "Taking lunch",
        "Being rough",
        "Hurting"
      ],
      "safe": [
        "Tell a teacher",
        "Get a grown-up",
        "Stay with a friend"
      ],
      "decoys": [
        "Hit back",
        "Keep quiet",
        "Laugh",
        "Join in",
        "Hide",
        "Run and hide it"
      ],
      "quiz": [
        {
          "q": "You see someone being pushed. What is the safe thing to do?",
          "options": [
            "Push them too",
            "Tell a teacher",
            "Start a fight"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Is it okay to take someone's lunch?",
          "options": [
            "No",
            "Yes, if you are hungry",
            "Yes, if it is a joke"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 3,
      "heading": "The group will not let Aisha play with them.",
      "need": 5,
      "tickMs": 2200,
      "maxPos": 11,
      "startAdvance": 1,
      "push": 2,
      "pull": 2,
      "harmShow": 3,
      "safeShow": 3,
      "decoyShow": 3,
      "harm": [
        "Left out",
        "Not talking to her",
        "Telling others to stay away",
        "Being unkind"
      ],
      "safe": [
        "Ask her to play",
        "Sit with her",
        "Tell a teacher"
      ],
      "decoys": [
        "Leave her out",
        "Laugh at her",
        "Say it is her fault",
        "Walk away",
        "Join the mean group",
        "Tell tales for fun"
      ],
      "quiz": [
        {
          "q": "Leaving someone out on purpose is…",
          "options": [
            "Kind",
            "Mean",
            "Just a game"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "What helps a child who is left out?",
          "options": [
            "Ask them to play and tell a teacher",
            "Ignore them",
            "Laugh with the group"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 4,
      "heading": "Mean words about Thandi are sent in the class chat.",
      "need": 6,
      "tickMs": 1900,
      "maxPos": 10,
      "startAdvance": 2,
      "push": 2,
      "pull": 1,
      "harmShow": 3,
      "safeShow": 3,
      "decoyShow": 3,
      "harm": [
        "Mean messages",
        "Unkind pictures",
        "Fake name",
        "Passing it on"
      ],
      "safe": [
        "Do not send it on",
        "Tell a grown-up",
        "Be kind to Thandi"
      ],
      "decoys": [
        "Send it on",
        "Laugh",
        "Be mean back",
        "Add a joke",
        "Show everyone",
        "Do nothing"
      ],
      "quiz": [
        {
          "q": "A mean message about a classmate is in the chat. What do you do?",
          "options": [
            "Send it to more people",
            "Do not send it on. Tell a grown-up",
            "Add a mean joke"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Is it kind to share a picture to make fun of someone?",
          "options": [
            "Yes",
            "No",
            "Only if it is funny"
          ],
          "correct": 1,
          "explain": ""
        }
      ]
    },
    {
      "id": 5,
      "heading": "A touch feels wrong. Lindi is told never to tell.",
      "need": 5,
      "tickMs": 2400,
      "maxPos": 12,
      "startAdvance": 1,
      "push": 1,
      "pull": 2,
      "harmShow": 3,
      "safeShow": 3,
      "decoyShow": 2,
      "harm": [
        "Wrong touch",
        "Scary secret",
        "Says never tell",
        "Touch you do not want"
      ],
      "safe": [
        "Say no",
        "Tell a grown-up",
        "It is not your fault"
      ],
      "decoys": [
        "Keep the secret",
        "Say nothing",
        "Blame yourself",
        "Hide",
        "Pretend it is fine",
        "Forget it"
      ],
      "quiz": [
        {
          "q": "A touch feels wrong and someone says never tell. What do you do?",
          "options": [
            "Keep the secret",
            "Tell a grown-up you trust",
            "Keep it to yourself"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "If someone touches you in a way that feels wrong, whose fault is it?",
          "options": [
            "Yours",
            "Not yours",
            "Only if you did not smile"
          ],
          "correct": 1,
          "explain": ""
        }
      ]
    },
    {
      "id": 6,
      "heading": "Friends dare Neo to take a snack from another child's bag.",
      "need": 5,
      "tickMs": 2200,
      "maxPos": 11,
      "startAdvance": 1,
      "push": 1,
      "pull": 2,
      "harmShow": 3,
      "safeShow": 3,
      "decoyShow": 2,
      "harm": [
        "Taking what is not yours",
        "A dare to steal",
        "Peer pressure",
        "Sneaking a snack"
      ],
      "safe": [
        "Say no",
        "Give it back",
        "Tell a teacher"
      ],
      "decoys": [
        "Take it",
        "Hide the snack",
        "Laugh",
        "Do the dare",
        "Blame someone else",
        "Keep it"
      ],
      "quiz": [
        {
          "q": "Friends dare you to take someone's snack. What is the safe choice?",
          "options": [
            "Take it so they like you",
            "Say no and tell a teacher",
            "Hide it and share it later"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Is a dare okay if nobody sees you?",
          "options": [
            "Yes",
            "No. Taking someone's things is still wrong",
            "Only if you are hungry"
          ],
          "correct": 1,
          "explain": ""
        }
      ]
    },
    {
      "id": 7,
      "heading": "Someone follows Sipho at break and will not leave him alone.",
      "need": 6,
      "tickMs": 2000,
      "maxPos": 11,
      "startAdvance": 2,
      "push": 2,
      "pull": 2,
      "harmShow": 3,
      "safeShow": 3,
      "decoyShow": 3,
      "harm": [
        "Following him",
        "Will not stop",
        "Blocking his way",
        "Scaring him"
      ],
      "safe": [
        "Stay with a friend",
        "Tell a teacher",
        "Ask a grown-up for help"
      ],
      "decoys": [
        "Follow him back",
        "Keep it a secret",
        "Laugh it off",
        "Run and hide all day",
        "Push him",
        "Ignore every adult"
      ],
      "quiz": [
        {
          "q": "Someone keeps following you and will not stop. What helps?",
          "options": [
            "Stay with a friend and tell a teacher",
            "Follow them back",
            "Keep it secret"
          ],
          "correct": 0,
          "explain": ""
        },
        {
          "q": "If a friend is being followed and looks scared, what can you do?",
          "options": [
            "Walk with them and get a grown-up",
            "Watch and laugh",
            "Tell them to deal with it alone"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 8,
      "heading": "A photo of Zanele is passed around so the class can laugh.",
      "need": 6,
      "tickMs": 1800,
      "maxPos": 10,
      "startAdvance": 2,
      "push": 2,
      "pull": 1,
      "harmShow": 3,
      "safeShow": 3,
      "decoyShow": 3,
      "harm": [
        "Passing the photo",
        "Laughing at her",
        "Mean comments",
        "Sharing without asking"
      ],
      "safe": [
        "Do not pass it on",
        "Tell a teacher",
        "Sit with Zanele"
      ],
      "decoys": [
        "Send it to more people",
        "Add a mean caption",
        "Laugh along",
        "Save it",
        "Show the next class",
        "Say she deserves it"
      ],
      "quiz": [
        {
          "q": "A photo is shared so people can laugh at someone. What do you do?",
          "options": [
            "Pass it on",
            "Do not share it and tell a teacher",
            "Add a joke"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Is it kind to share a photo someone did not agree to?",
          "options": [
            "Yes, if it is funny",
            "No",
            "Yes, if lots of people already saw it"
          ],
          "correct": 1,
          "explain": ""
        }
      ]
    }
  ],
  "secondary": [
    {
      "id": 1,
      "heading": "CYBER",
      "need": 5,
      "tickMs": 2400,
      "maxPos": 12,
      "startAdvance": 1,
      "push": 1,
      "pull": 2,
      "harmShow": 4,
      "safeShow": 1,
      "decoyShow": 3,
      "harm": [
        "Mean posts",
        "Humiliating pictures",
        "Fake account",
        "Shared without consent",
        "Cyberbullying"
      ],
      "safe": [
        "Don't reply"
      ],
      "decoys": [
        "Reply with insults",
        "Share it on",
        "Join the joke",
        "Post it publicly",
        "Do nothing",
        "Delete the proof"
      ],
      "quiz": [
        {
          "q": "You see a cruel post about a classmate. What helps most?",
          "options": [
            "Reply with something mean",
            "Save a screenshot and tell an adult",
            "Delete it and forget it"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Can you report cyberbullying on Safe Space?",
          "options": [
            "Yes, as a bullying report",
            "No, only physical harm",
            "Only if a teacher agrees"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 2,
      "heading": "Learners keep calling Sipho names at break and laugh when he reacts.",
      "need": 6,
      "tickMs": 2000,
      "maxPos": 11,
      "startAdvance": 1,
      "push": 2,
      "pull": 2,
      "harmShow": 3,
      "safeShow": 3,
      "decoyShow": 3,
      "harm": [
        "Name-calling",
        "Insults",
        "Mocking",
        "Repeated",
        "Humiliating",
        "Verbal bullying"
      ],
      "safe": [
        "Walk away calmly",
        "Say stop firmly",
        "Stand with Sipho",
        "Tell a teacher",
        "Report it"
      ],
      "decoys": [
        "Insult back",
        "Laugh along",
        "Start a fight",
        "Pretend it is fine",
        "Spread the nickname",
        "Wait for it to stop"
      ],
      "quiz": [
        {
          "q": "Name-calling that happens again and again is…",
          "options": [
            "Just banter",
            "Bullying",
            "Always harmless"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "What can you do if you see someone being called names?",
          "options": [
            "Laugh so you stay safe",
            "Stand with them and tell an adult",
            "Add your own name for them"
          ],
          "correct": 1,
          "explain": ""
        }
      ]
    },
    {
      "id": 3,
      "heading": "A group keeps leaving Aisha out and telling others not to talk to her.",
      "need": 6,
      "tickMs": 1700,
      "maxPos": 10,
      "startAdvance": 2,
      "push": 2,
      "pull": 1,
      "harmShow": 4,
      "safeShow": 3,
      "decoyShow": 3,
      "harm": [
        "Left out on purpose",
        "Silent treatment",
        "Rumours",
        "Ganging up",
        "Isolation",
        "Social bullying"
      ],
      "safe": [
        "Include Aisha",
        "Sit with her",
        "Invite her in",
        "Tell a trusted adult",
        "Report it"
      ],
      "decoys": [
        "Ignore her too",
        "Spread the rumour",
        "Laugh at her",
        "Say it is her fault",
        "Join the group",
        "Call it drama"
      ],
      "quiz": [
        {
          "q": "Which of these is social bullying?",
          "options": [
            "Disagreeing with a friend",
            "Leaving someone out on purpose",
            "Playing different games at break"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "What helps someone who is being left out?",
          "options": [
            "Including them and telling an adult",
            "Ignoring it",
            "Joining the group against them"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 4,
      "heading": "Friends pass around a vape and push Kagiso to try it.",
      "need": 7,
      "tickMs": 1500,
      "maxPos": 9,
      "startAdvance": 2,
      "push": 2,
      "pull": 1,
      "harmShow": 4,
      "safeShow": 3,
      "decoyShow": 4,
      "harm": [
        "Peer pressure",
        "Vaping",
        "Alcohol",
        "Drugs",
        "Substance abuse"
      ],
      "safe": [
        "Say no",
        "Walk away",
        "Tell a trusted adult",
        "Get help for a friend",
        "Report it"
      ],
      "decoys": [
        "Just try once",
        "Everyone does it",
        "Hide it for them",
        "Accept the dare",
        "Keep it secret",
        "Sell some"
      ],
      "quiz": [
        {
          "q": "Friends pressure you to try a vape. A safe response is…",
          "options": [
            "Try it once so they stop",
            "Say no and leave",
            "Take some to sell"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "A friend is struggling with drugs or alcohol. What can you do?",
          "options": [
            "Tell a trusted adult or get help",
            "Keep it secret",
            "Dare them to stop"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 5,
      "heading": "Older learners push Lerato in the corridor and take her lunch money.",
      "need": 7,
      "tickMs": 1300,
      "maxPos": 8,
      "startAdvance": 2,
      "push": 2,
      "pull": 1,
      "harmShow": 4,
      "safeShow": 3,
      "decoyShow": 4,
      "harm": [
        "Hitting",
        "Pushing",
        "Stealing",
        "Intimidation",
        "Physical bullying"
      ],
      "safe": [
        "Get an adult",
        "Tell a teacher",
        "Report it"
      ],
      "decoys": [
        "Hit back",
        "Take revenge",
        "Film it for fun",
        "Keep quiet",
        "Join in",
        "Hide the money"
      ],
      "quiz": [
        {
          "q": "Someone is being pushed and robbed. Safest first step?",
          "options": [
            "Join in",
            "Get an adult",
            "Fight the bullies"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Is taking someone's things by force bullying?",
          "options": [
            "Yes",
            "No, it is a prank",
            "Only if it is expensive"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 6,
      "heading": "A rumour about Lindi is posted in the class group chat.",
      "need": 6,
      "tickMs": 1400,
      "maxPos": 9,
      "startAdvance": 2,
      "push": 2,
      "pull": 1,
      "harmShow": 3,
      "safeShow": 3,
      "decoyShow": 3,
      "harm": [
        "Spreading a rumour",
        "Mean posts",
        "Fake story",
        "Public shame"
      ],
      "safe": [
        "Do not share it",
        "Tell a teacher",
        "Check with Lindi"
      ],
      "decoys": [
        "Forward it",
        "Add details",
        "Screenshot for laughs",
        "Stay silent",
        "Like the post",
        "Make a poll"
      ],
      "quiz": [
        {
          "q": "A rumour is posted about a classmate. What is the fair response?",
          "options": [
            "Forward it",
            "Do not share it and tell a teacher",
            "Add your own comment"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Passing on a story you have not checked can…",
          "options": [
            "Hurt someone",
            "Always be harmless",
            "Only matter if it is true"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 7,
      "heading": "A teammate is told not to report cheating or they will be dropped.",
      "need": 6,
      "tickMs": 1300,
      "maxPos": 9,
      "startAdvance": 2,
      "push": 2,
      "pull": 1,
      "harmShow": 4,
      "safeShow": 3,
      "decoyShow": 3,
      "harm": [
        "Threat",
        "Cheating",
        "Silence by fear",
        "Leaving them out",
        "Pressure"
      ],
      "safe": [
        "Tell the coach",
        "Support the teammate",
        "Report it"
      ],
      "decoys": [
        "Keep the secret",
        "Help hide the cheat",
        "Drop them yourself",
        "Laugh",
        "Say it is not your team",
        "Join the threat"
      ],
      "quiz": [
        {
          "q": "Someone is threatened so they will not report cheating. What helps?",
          "options": [
            "Keep quiet with them",
            "Tell a coach or teacher",
            "Help hide it"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "A threat to keep someone silent is…",
          "options": [
            "Team loyalty",
            "A way of controlling them",
            "Only a joke"
          ],
          "correct": 1,
          "explain": ""
        }
      ]
    },
    {
      "id": 8,
      "heading": "Someone keeps asking Thabo for private photos and gets angry at no.",
      "need": 7,
      "tickMs": 1200,
      "maxPos": 8,
      "startAdvance": 2,
      "push": 2,
      "pull": 1,
      "harmShow": 4,
      "safeShow": 3,
      "decoyShow": 4,
      "harm": [
        "Pressure for photos",
        "Anger at no",
        "Threats to share",
        "Not taking no",
        "Private images"
      ],
      "safe": [
        "No is a full answer",
        "Tell a trusted adult",
        "Block and report"
      ],
      "decoys": [
        "Send one photo",
        "Keep it secret",
        "Say yes to stop the anger",
        "Send it to friends",
        "Blame yourself",
        "Hide the messages"
      ],
      "quiz": [
        {
          "q": "Someone gets angry because you will not send a private photo. What is true?",
          "options": [
            "You owe them a photo",
            "No is a full answer. Tell a trusted adult",
            "Send one so they stop"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "If they threaten to share pictures of you, what should you do?",
          "options": [
            "Deal with it alone",
            "Save the messages and tell an adult",
            "Send more so they stay quiet"
          ],
          "correct": 1,
          "explain": ""
        }
      ]
    },
    {
      "id": 9,
      "heading": "CYBER",
      "need": 5,
      "tickMs": 2200,
      "maxPos": 11,
      "startAdvance": 1,
      "push": 1,
      "pull": 2,
      "harmShow": 4,
      "safeShow": 2,
      "decoyShow": 3,
      "harm": [
        "Mean posts",
        "Humiliating pictures",
        "Fake account",
        "Shared without consent",
        "Cyberbullying"
      ],
      "safe": [
        "Don't reply",
        "Tell a trusted adult",
        "Support Thandi",
        "Report it"
      ],
      "decoys": [
        "Reply with insults",
        "Share it on",
        "Delete the proof",
        "Join the joke",
        "Post it publicly",
        "Do nothing"
      ],
      "quiz": [
        {
          "q": "You see a cruel post about a classmate. What helps most?",
          "options": [
            "Reply with something mean",
            "Save a screenshot and tell an adult",
            "Delete it and forget it"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Why is it better not to hit back online?",
          "options": [
            "It makes you look weak",
            "It can make things worse",
            "Nobody will see it"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Can you report cyberbullying on Safe Space?",
          "options": [
            "Yes, as a bullying report",
            "No, only physical harm",
            "Only if a teacher agrees"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 10,
      "heading": "Friends pass a vape around and push Kagiso to try it.",
      "need": 6,
      "tickMs": 1800,
      "maxPos": 10,
      "startAdvance": 2,
      "push": 2,
      "pull": 1,
      "harmShow": 4,
      "safeShow": 3,
      "decoyShow": 3,
      "harm": [
        "Peer pressure",
        "Vaping",
        "Alcohol",
        "Drugs",
        "Substance abuse"
      ],
      "safe": [
        "Say no",
        "Walk away",
        "Tell a trusted adult",
        "Get help for a friend",
        "Report it"
      ],
      "decoys": [
        "Just try once",
        "Everyone does it",
        "Hide it for them",
        "Accept the dare",
        "Keep it secret",
        "Sell some"
      ],
      "quiz": [
        {
          "q": "Friends pressure you to try a vape. A safe response is…",
          "options": [
            "Try it once so they stop",
            "Say no and leave",
            "Take some to sell"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "A friend is struggling with drugs or alcohol. What can you do?",
          "options": [
            "Tell a trusted adult or get help",
            "Keep it secret",
            "Dare them to stop"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 11,
      "heading": "A classmate keeps making unwanted comments to Naledi after she says stop.",
      "need": 7,
      "tickMs": 1500,
      "maxPos": 9,
      "startAdvance": 2,
      "push": 2,
      "pull": 1,
      "harmShow": 4,
      "safeShow": 3,
      "decoyShow": 4,
      "harm": [
        "Unwanted comments",
        "Ignoring stop",
        "Sexual remarks",
        "Pressure",
        "Unwanted attention",
        "Harassment"
      ],
      "safe": [
        "Say stop clearly",
        "Tell a trusted adult",
        "Keep a record",
        "Stay near friends",
        "Report it"
      ],
      "decoys": [
        "Laugh it off",
        "Blame Naledi",
        "Say nothing",
        "Joke back",
        "Share the comments",
        "Confront alone"
      ],
      "quiz": [
        {
          "q": "Unwanted comments continue after stop. What is this?",
          "options": [
            "Harmless flirting",
            "Harassment",
            "A compliment"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Whose fault is sexual harassment?",
          "options": [
            "The person targeted",
            "The person doing it",
            "Nobody's"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "What is a good next step?",
          "options": [
            "Tell a trusted adult or report it",
            "Keep it to yourself",
            "Deal with it alone"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 12,
      "heading": "Ayanda is afraid and does not know who to trust.",
      "need": 7,
      "tickMs": 1400,
      "maxPos": 9,
      "startAdvance": 2,
      "push": 2,
      "pull": 1,
      "harmShow": 3,
      "safeShow": 4,
      "decoyShow": 4,
      "harm": [
        "Fear",
        "Shame",
        "Pressure",
        "Being forced",
        "Rumours",
        "Feeling alone"
      ],
      "safe": [
        "Talk to a trusted adult",
        "Visit a clinic",
        "Talk to a counsellor",
        "Get support",
        "Report pressure"
      ],
      "decoys": [
        "Hide it",
        "Try unsafe remedies",
        "Drop out of school",
        "Spread rumours",
        "Blame her",
        "Trust anyone online"
      ],
      "quiz": [
        {
          "q": "Someone may be pregnant and scared. A good first step?",
          "options": [
            "Hide it",
            "Talk to a trusted adult or clinic",
            "Try something from the internet"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Classmates hear a rumour. They should…",
          "options": [
            "Spread it",
            "Be kind and not gossip",
            "Tease her"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "If someone was pressured or forced, can it be reported?",
          "options": [
            "Yes",
            "No",
            "Only after a year"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 13,
      "heading": "Mpho sees something that looks like a weapon in a bag.",
      "need": 7,
      "tickMs": 1200,
      "maxPos": 8,
      "startAdvance": 2,
      "push": 2,
      "pull": 1,
      "harmShow": 4,
      "safeShow": 3,
      "decoyShow": 4,
      "harm": [
        "Weapon at school",
        "Knife",
        "Gun",
        "Threat",
        "Hidden in a bag"
      ],
      "safe": [
        "Don't confront",
        "Tell a teacher",
        "Report on Safe Space",
        "Stay calm",
        "Keep your distance"
      ],
      "decoys": [
        "Take it yourself",
        "Confront them",
        "Tell the whole class",
        "Dare them",
        "Hide it for them",
        "Wait and see"
      ],
      "quiz": [
        {
          "q": "You think a classmate has a weapon. What should you do?",
          "options": [
            "Take it",
            "Confront them",
            "Report it to an adult"
          ],
          "correct": 2,
          "explain": ""
        },
        {
          "q": "Can you report without giving your name?",
          "options": [
            "Yes, you can be anonymous",
            "No, never",
            "Only if you are sure"
          ],
          "correct": 0,
          "explain": ""
        },
        {
          "q": "What useful details can you share?",
          "options": [
            "What you saw, where and when",
            "Only the learner's name",
            "Nothing"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 14,
      "heading": "Tebogo is scared of what is happening at home.",
      "need": 7,
      "tickMs": 1100,
      "maxPos": 8,
      "startAdvance": 3,
      "push": 2,
      "pull": 1,
      "harmShow": 4,
      "safeShow": 4,
      "decoyShow": 4,
      "harm": [
        "Violence at home",
        "Threats",
        "Fear",
        "Psychological harm",
        "Domestic violence"
      ],
      "safe": [
        "Tell a trusted adult",
        "Talk to a counsellor",
        "It's not your fault",
        "Report it",
        "Stay safe"
      ],
      "decoys": [
        "Keep it secret",
        "Blame yourself",
        "Fix it alone",
        "Fight back",
        "Ignore the signs",
        "Hide all day"
      ],
      "quiz": [
        {
          "q": "A friend is scared of what happens at home. What can you say?",
          "options": [
            "Keep it secret",
            "It's not your fault. Tell someone who can help",
            "Fix it yourself"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Is violence at home only about hitting?",
          "options": [
            "Yes",
            "No. Threats and fear can be harm too",
            "Only if there is a mark"
          ],
          "correct": 1,
          "explain": ""
        }
      ]
    },
    {
      "id": 15,
      "heading": "A fake account shares a private photo of Naledi.",
      "need": 7,
      "tickMs": 1100,
      "maxPos": 8,
      "startAdvance": 3,
      "push": 2,
      "pull": 1,
      "harmShow": 4,
      "safeShow": 3,
      "decoyShow": 4,
      "harm": [
        "Fake account",
        "Private photo shared",
        "Image abuse",
        "Humiliation",
        "No consent"
      ],
      "safe": [
        "Do not share it",
        "Report the account",
        "Tell a trusted adult"
      ],
      "decoys": [
        "Save the photo",
        "Send it on",
        "Comment on it",
        "Say she posted it",
        "Ignore her",
        "Make another fake account"
      ],
      "quiz": [
        {
          "q": "A private photo is shared from a fake account. What is the right move?",
          "options": [
            "Share it so more people see",
            "Do not share it, report it, and tell an adult",
            "Save it for later"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Sharing a private image without consent is…",
          "options": [
            "Harm",
            "Just gossip",
            "Fine if the account is fake"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    },
    {
      "id": 16,
      "heading": "Friends plan to jump a learner after school and want you there.",
      "need": 7,
      "tickMs": 1000,
      "maxPos": 8,
      "startAdvance": 3,
      "push": 2,
      "pull": 1,
      "harmShow": 4,
      "safeShow": 4,
      "decoyShow": 4,
      "harm": [
        "Planned attack",
        "Ambush",
        "Threat of violence",
        "Group pressure",
        "Hurt after school"
      ],
      "safe": [
        "Do not go",
        "Warn a teacher now",
        "Tell the learner to get help",
        "Report the plan"
      ],
      "decoys": [
        "Go and watch",
        "Film it",
        "Keep the plan secret",
        "Say it is not your problem",
        "Bring more people",
        "Dare them on"
      ],
      "quiz": [
        {
          "q": "You hear a plan to attack someone after school. What do you do?",
          "options": [
            "Go along so you are not next",
            "Tell a teacher before it happens",
            "Film it"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "Staying quiet about a planned attack…",
          "options": [
            "Keeps you neutral",
            "Lets someone get hurt",
            "Is the loyal choice"
          ],
          "correct": 1,
          "explain": ""
        }
      ]
    },
    {
      "id": 17,
      "heading": "A partner checks the phone, cuts off friends, and says love means no secrets.",
      "need": 7,
      "tickMs": 1000,
      "maxPos": 8,
      "startAdvance": 3,
      "push": 2,
      "pull": 1,
      "harmShow": 4,
      "safeShow": 4,
      "decoyShow": 4,
      "harm": [
        "Checking the phone",
        "Cutting off friends",
        "Control",
        "No secrets rule",
        "Isolation"
      ],
      "safe": [
        "Love is not control",
        "Talk to a counsellor",
        "Tell a trusted adult",
        "Keep your friends"
      ],
      "decoys": [
        "Hand over every password",
        "Drop all your friends",
        "Hide it",
        "Say this is normal love",
        "Check their phone back",
        "Deal with it alone"
      ],
      "quiz": [
        {
          "q": "A partner demands your phone and tells you to drop your friends. That is…",
          "options": [
            "Proof of love",
            "Control. Talk to a trusted adult",
            "Normal if you care"
          ],
          "correct": 1,
          "explain": ""
        },
        {
          "q": "What can you keep even in a relationship?",
          "options": [
            "Friends, privacy, and the right to say no",
            "Nothing. Love means no secrets",
            "Only what they allow"
          ],
          "correct": 0,
          "explain": ""
        }
      ]
    }
  ]
};
