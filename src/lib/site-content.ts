export const SITE = {
  name: "PUSAB",
  fullName: "Public University Students' Association of Bishwambarpur",
  founded: "July 30, 2014",
  foundedAt: "Govt. Digendra Barman College, Bishwambarpur Upazila, Sunamganj",
  members: "300+",
  email: "info.pusab@gmail.com",
  phone: "01948223639",
  facebook: "https://www.facebook.com/info.pusab/",
  youtube: "https://www.youtube.com/@info.pusab1",
  location: "Bishwambarpur Upazila, Sunamganj, Bangladesh",
};

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  {
    to: "/programs",
    label: "Programs",
    children: [
      { to: "/programs", label: "All Programs" },
      { to: "/felicitation", label: "Felicitation & Freshers" },
    ],
  },
  { to: "/sayor", label: "SAYOR" },
  { to: "/publicity", label: "Publicity" },
  {
    to: "/leadership",
    label: "Leadership",
    children: [
      {
        to: "/leadership",
        label: "Executive Committee",
        children: [
          { to: "/leadership", label: "Present EC" },
          {
            to: "/leadership",
            label: "Previous EC",
            children: [
              // Convening Committee + past sessions injected at runtime in FloatingNavbar.
            ],
          },
        ],
      },
      {
        to: "/honor-board",
        label: "Honor Board",
        children: [
          { to: "/convening-committee", label: "Ex Convenor & Member Secretary" },
          {
            to: "/honor-board",
            label: "Ex President & GS",
            children: [
              // Per-session links injected at runtime in FloatingNavbar.
            ],
          },
        ],
      },
      { to: "/president-message", label: "President's Message" },
      { to: "/secretary-message", label: "Secretary's Message" },
    ],
  },
  { to: "/moments", label: "Moments" },
  { to: "/contact", label: "Contact" },
] as const;

// Demo Executive Committee history (2014 -> 2026). Used on the frontend when the
// database has no ec_members yet; real data from the admin panel takes over once
// added. Replace with real members/photos any time.
export type EcMember = {
  id: string;
  name: string;
  role: string;
  university: string | null;
  year: number;
  is_current: boolean;
  photo_url: string | null;
};

const ec = (
  name: string,
  role: string,
  university: string,
  year: number,
  is_current = false,
): EcMember => ({ id: `${year}-${role}-${name}`, name, role, university, year, is_current, photo_url: null });

const SUST = "Shahjalal University of Science & Technology";
const DU = "University of Dhaka";

export const DEMO_EC_MEMBERS: EcMember[] = [
  // 2026 — current
  ec("Tanvir Ahmed Rafi", "President", SUST, 2026, true),
  ec("Mahir Tajwar", "General Secretary", DU, 2026, true),
  ec("Nusrat Jahan Mim", "Vice President", "Jahangirnagar University", 2026, true),
  ec("Sadia Islam", "Treasurer", "Rajshahi University", 2026, true),
  ec("Rakibul Hasan", "Organizing Secretary", "CUET", 2026, true),
  // 2025
  ec("Sabbir Hossain", "President", "BUET", 2025),
  ec("Imran Kabir", "General Secretary", SUST, 2025),
  ec("Farzana Yeasmin", "Vice President", DU, 2025),
  ec("Mehedi Hasan Joy", "Treasurer", "Chittagong University", 2025),
  // 2024
  ec("Mahmudul Hasan", "President", DU, 2024),
  ec("Tasnim Rahman", "General Secretary", SUST, 2024),
  ec("Jubayer Alam", "Vice President", "CUET", 2024),
  ec("Anika Tabassum", "Treasurer", "Khulna University", 2024),
  // 2023
  ec("Md. Rahim Uddin", "President", DU, 2023),
  ec("Tanvir Hasan", "General Secretary", "BUET", 2023),
  ec("Mahbubur Rahman", "Organizing Secretary", "Rajshahi University", 2023),
  ec("Nusrat Jahan", "Treasurer", DU, 2023),
  ec("Sadia Akter", "Vice President", "Jahangirnagar University", 2023),
  // 2022
  ec("Arifur Rahman", "President", "BUET", 2022),
  ec("Shakil Ahmed", "General Secretary", "Jahangirnagar University", 2022),
  ec("Rumana Parvin", "Treasurer", "Chittagong University", 2022),
  ec("Farzana Yasmin", "Vice President", DU, 2022),
  // 2021
  ec("Kamrul Islam", "President", DU, 2021),
  ec("Sumaiya Islam", "General Secretary", "BUET", 2021),
  ec("Mahmuda Khatun", "Organizing Secretary", SUST, 2021),
  ec("Jahidul Hoque", "Treasurer", SUST, 2021),
  // 2020
  ec("Habibur Rahman", "President", DU, 2020),
  ec("Selina Akter", "General Secretary", "Jahangirnagar University", 2020),
  ec("Mizanur Rahman", "Treasurer", "BUET", 2020),
  // 2019
  ec("Nazmul Haque", "President", DU, 2019),
  ec("Rezaul Karim", "General Secretary", SUST, 2019),
  ec("Shahidul Islam", "Organizing Secretary", "Rajshahi University", 2019),
  // 2018
  ec("Asaduzzaman Noor", "President", "BUET", 2018),
  ec("Tania Sultana", "General Secretary", "Chittagong University", 2018),
  ec("Forhad Hossain", "Treasurer", DU, 2018),
  // 2017
  ec("Mizanur Rahman Sumon", "President", DU, 2017),
  ec("Sanjida Akter", "General Secretary", "Jahangirnagar University", 2017),
  ec("Rasel Ahmed", "Vice President", SUST, 2017),
  // 2016
  ec("Jahangir Alam", "President", SUST, 2016),
  ec("Mehedi Hasan", "General Secretary", DU, 2016),
  ec("Sabuj Mia", "Organizing Secretary", "BUET", 2016),
  // 2015
  ec("Abdul Karim", "President", DU, 2015),
  ec("Roknuzzaman", "General Secretary", "Rajshahi University", 2015),
  ec("Shamima Nasrin", "Treasurer", "Chittagong University", 2015),
  // 2014 — founding committee (convening leadership + first office-bearers)
  ec("Shahjalal Mia", "Convenor", DU, 2014),
  ec("Abdul Hannan", "Member Secretary", SUST, 2014),
  ec("Nurul Amin", "Founding President", "BUET", 2014),
  ec("Kamal Uddin", "Founding General Secretary", DU, 2014),
  ec("Ruhul Amin", "Founding Treasurer", "Rajshahi University", 2014),
];

export const OBJECTIVES = [
  {
    title: "Student Unity",
    desc: "Foster cooperation among public university students from Bishwambarpur.",
  },
  {
    title: "Holistic Development",
    desc: "Engage youth in the upazila's overall educational and social uplift.",
  },
  {
    title: "Achievement Recognition",
    desc: "Honor students who bring pride to the region through merit.",
  },
  {
    title: "Educational Campaigns",
    desc: "Run awareness drives on study skills, careers and higher education.",
  },
  {
    title: "Admission Support",
    desc: "Guide and mentor aspirants through university admission processes.",
  },
  {
    title: "PUSAB Scholarship",
    desc: "Provide financial aid to deserving students from underserved families.",
  },
  {
    title: "Career Counseling",
    desc: "Connect students with mentors across professions and universities.",
  },
  {
    title: "Annual Magazine — SAYOR",
    desc: "Publish an annual magazine showcasing the region's literary and intellectual life.",
  },
  { title: "Medical Camps", desc: "Organize free health camps for the local community." },
  { title: "Humanitarian Aid", desc: "Stand beside families hit by floods and natural disasters." },
  {
    title: "Cultural Programs",
    desc: "Celebrate the heritage of Bishwambarpur through reunions and cultural events.",
  },
  {
    title: "Public Awareness",
    desc: "Run social campaigns on hygiene, environment and civic responsibility.",
  },
  { title: "Networking", desc: "Build a lifelong network of Bishwambarpur students and alumni." },
  {
    title: "Pioneer Spirit",
    desc: "Remain the first organization of its kind in Sunamganj district.",
  },
];

export const PROGRAMS = [
  {
    key: "reunion",
    title: "Annual Reunion",
    desc: "Once a year, hundreds of members reunite to celebrate shared roots.",
  },
  {
    key: "schooling",
    title: "Schooling Program",
    desc: "Tutorial and mentoring sessions for school students of the upazila.",
  },
  {
    key: "scholarship",
    title: "PUSAB Scholarship",
    desc: "Need-based financial support to deserving local students.",
  },
  {
    key: "picnic",
    title: "Annual Picnic",
    desc: "A day of bonding, games and warm food across generations of members.",
  },
  {
    key: "humanity",
    title: "PUSAB for Humanity",
    desc: "Disaster relief, blanket distribution and medical camps.",
  },
  {
    key: "online",
    title: "Online Events",
    desc: "Webinars, AMAs and admission Q&As that reach members anywhere.",
  },
  {
    key: "sayor",
    title: "SAYOR Magazine",
    desc: "Our flagship annual publication, six sections wide.",
  },
  {
    key: "others",
    title: "Other Initiatives",
    desc: "Cultural nights, sports tournaments and community partnerships.",
  },
];

export const SAYOR_SECTIONS = [
  "Education & Career",
  "Social & Cultural",
  "Science & Technology",
  "History & Research",
  "Literature & Creative",
  "Student Directory",
];

export const STATS = [
  { value: 300, suffix: "+", label: "Members" },
  { value: 2014, label: "Established", noPlus: true, raw: true },
  { value: 14, label: "Core Objectives" },
  { value: 1, label: "Pioneer in Sunamganj", suffix: "st" },
];
