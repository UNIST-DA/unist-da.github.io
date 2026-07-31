// Lab events. Ported from the legacy Jekyll _data/activity.yml.
// Seminars moved to content/seminars/*.json (see src/data/seminars.ts).
// Free of node:fs so Client components can import the type.
export type EventItem = { date: string; title: string; image?: string; detail?: string };

export const events: EventItem[] = [
  {
    "date": "2026-07-28",
    "title": "Visiting Students from Thailand",
    "image": "/assets/activity/Lab_Events/visiting_students_thailand_1.jpg",
    "detail": "Visiting students from Thailand took a photo with the professor after their final presentation."
  },
  {
    "date": "2026-06-04",
    "title": "2026 KIIE Spring Joint Conference",
    "image": "/assets/activity/Lab_Events/KIIE_2026_spring_1.jpg",
    "detail": "Lab members presented their research at the 2026 Korean Institute of Industrial Engineers Spring Joint Conference in Gyeongju."
  },
  {
    "date": "2026-05-19",
    "title": "QCRE Competition Awards",
    "image": "/assets/activity/Lab_Events/QCRE_awards_2026.jpg",
    "detail": "DA Lab teams won second place and honorable mentions at the IISE QCRE Data Competition."
  },
  {
    "date": "2026-05-19",
    "title": "ICQSR Data Challenge Award",
    "image": "/assets/activity/Lab_Events/ICQSR_award_2026_1.jpg",
    "detail": "Team Everpurple won third place at the 2026 ICQSR Data Challenge in Hong Kong."
  },
  {
    "date": "2026-04-30",
    "title": "Professor's Birthday Celebration",
    "image": "/assets/activity/Lab_Events/prof_birthday_2026_1.jpg",
    "detail": "Lab members celebrated our professor's birthday together."
  },
  {
    "date": "2026-04-07",
    "title": "Cherry Blossom Pizza Picnic",
    "image": "/assets/activity/Lab_Events/Picnic.jpg",
    "detail": "Lab Members enjoyed picnic with delicious pizza."
  },
  {
    "date": "2026-04-07",
    "title": "Cherry Blossom Lab Photo",
    "image": "/assets/activity/Lab_Events/cherry_1.jpg",
    "detail": "Lab Members took picture under beautiful cherry blossom."
  },
  {
    "date": "2026-02-27",
    "title": "Spring Unity Get-Together",
    "image": "/assets/activity/Lab_Events/spring_unity_2026.jpg",
    "detail": "Enjoyed borad games, team games at the arcade together with lab members."
  },
  {
    "date": "2025-11-14",
    "title": "CIKM 2025 Participation",
    "image": "/assets/activity/Lab_Events/CIKM_group_11_14.jpg",
    "detail": "DA Lab members gathered together at CIKM 2025 Seoul."
  },
  {
    "date": "2025-11-14",
    "title": "2025 DA Lab Homecoming",
    "image": "/assets/activity/Lab_Events/Homecoming_11_14.jpg",
    "detail": "Held the 2025 DA Lab Homecoming event with professors, students, and alumni."
  },
  {
    "date": "2025-11-12",
    "title": "CIKM 2025 Poster Presentation",
    "image": "/assets/activity/Lab_Events/CIKM_poster_11_12.jpg",
    "detail": "Presented a short research paper on Modeling Irregular Astronomical Time Series at CIKM 2025."
  },
  {
    "date": "2025-11-11",
    "title": "CIKM 2025 Tutorial Session",
    "image": "/assets/activity/Lab_Events/CIKM_tutorial_11_11_prof.jpg",
    "detail": "Tutorial sessions at CIKM 2025 in Seoul."
  },
  {
    "date": "2025-11-08",
    "title": "2025 KIIE Fall Conference",
    "image": "/assets/activity/Lab_Events/KIIE_11_8.jpg",
    "detail": "Participated in the 2025 KIIE Fall Conference held in KAIST."
  },
  {
    "date": "2025-10-30",
    "title": "IE Talk Concert",
    "image": "/assets/activity/Lab_Events/talk_concert.jpg",
    "detail": "Professor introduced DA lab at Talk concert."
  },
  {
    "date": "2025-10-28",
    "title": "INFORMS 2025",
    "image": "/assets/activity/Lab_Events/INFORMS_10_28.jpg",
    "detail": "Lab members attended the INFORMS 2025."
  },
  {
    "date": "2025-07-11",
    "title": "Lab Movie Night",
    "image": "/assets/activity/Lab_Events/movie_night_2025.webp",
    "detail": "Enjoyed a movie night with lab members & U-SURF."
  },
  {
    "date": "2025-05-01",
    "title": "Professor's Birthday Celebration",
    "image": "/assets/activity/Lab_Events/Prof_birth.webp",
    "detail": "The lab celebrated our professor's birthday."
  },
  {
    "date": "2025-04-08",
    "title": "Cherry Blossom Picnic",
    "image": "/assets/activity/Lab_Events/spring_2025.webp",
    "detail": "Enjoyed an outdoor picnic among the campus cherry blossoms."
  },
  {
    "date": "2025-02-20",
    "title": "Lab Graduation Ceremony",
    "image": "/assets/activity/Lab_Events/graduation_2025.webp",
    "detail": "Celebrated the graduation of our lab members."
  },
  {
    "date": "2024-11-12",
    "title": "Lab BBQ Party",
    "image": "/assets/activity/Lab_Events/bbq_2024.webp",
    "detail": "Held lab BBQ party."
  },
  {
    "date": "2024-09-06",
    "title": "Lab Homecoming Day",
    "image": "/assets/activity/Lab_Events/homecoming_2024.webp",
    "detail": "Held our annual lab homecoming day event."
  },
  {
    "date": "2024-02-15",
    "title": "Lab Graduation Ceremony",
    "image": "/assets/activity/Lab_Events/graduation_2024.webp",
    "detail": "Celebrated the graduation of our lab members."
  },
  {
    "date": "2024-01-13",
    "title": "Lab Year-End Party",
    "image": "/assets/activity/Lab_Events/year_end_party_2024.webp",
    "detail": "Held our annual lab year-end party."
  },
  {
    "date": "2023-07-22",
    "title": "Lab Membership Training",
    "image": "/assets/activity/Lab_Events/membership_training_2023.png",
    "detail": "Conducted membership training."
  },
  {
    "date": "2023-04-03",
    "title": "Lab Cherry Blossom Picnic",
    "image": "/assets/activity/Lab_Events/blossom_2023.webp",
    "detail": "Enjoyed a picnic under the cherry blossoms."
  },
  {
    "date": "2023-02-17",
    "title": "Lab Graduation Ceremony",
    "image": "/assets/activity/Lab_Events/graduation_2023.webp",
    "detail": "Celebrated the graduation of our lab members."
  },
  {
    "date": "2022-07-10",
    "title": "Lab Membership Training",
    "image": "/assets/activity/Lab_Events/membership_training_2022.webp",
    "detail": "Conducted membership training."
  },
  {
    "date": "2022-06-01",
    "title": "KIIE Conference",
    "image": "/assets/activity/Lab_Events/KIIE_2022.webp",
    "detail": "Attended the KIIE conference."
  },
  {
    "date": "2022-04-20",
    "title": "Lab Picnic",
    "image": "/assets/activity/Lab_Events/picnic_2022.webp",
    "detail": "Enjoyed a Picnic with lab members."
  },
  {
    "date": "2021-04",
    "title": "Lab Cherry Blossom Picnic",
    "image": "/assets/activity/Lab_Events/blossom_2021.webp",
    "detail": "Enjoyed a picnic under the cherry blossoms."
  }
];
