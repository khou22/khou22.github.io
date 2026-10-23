export enum TalkCompany {
  Codeium = "Codeium",
  Windsurf = "Windsurf",
  Antigravity = "Antigravity",
}

export enum TalkType {
  Talk = "talk",
  Podcast = "podcast",
  Interview = "interview",
  Demo = "demo",
  Panel = "panel",
  Livestream = "livestream",
}

export type TalkRecord = {
  /**
   * YouTube video ID (the `v=` query param).
   */
  youtubeId: string;
  title: string;

  /**
   * YouTube channel that published the video, if known.
   */
  channel?: string;

  /**
   * Publish date as `YYYY-MM-DD` or `YYYY-MM`.
   */
  date: string;
  type: TalkType;
  company: TalkCompany;

  /**
   * Conference, podcast, or series the appearance was part of.
   */
  event?: string;

  /**
   * Custom cover image. Falls back to the YouTube thumbnail when omitted.
   */
  image?: string;
};

export const getYouTubeUrl = (youtubeId: string) =>
  `https://www.youtube.com/watch?v=${youtubeId}`;

export const getYouTubeThumbnail = (youtubeId: string) =>
  `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

/**
 * Speaking appearances on YouTube: talks, podcasts, interviews, and demos.
 */
export const talks: TalkRecord[] = [
  {
    youtubeId: "buHC7bQE1X4",
    title: "Get Out of the Model's Way — Kevin Hou, Google Antigravity",
    channel: "AI Engineer",
    date: "2026-09-27",
    type: TalkType.Talk,
    company: TalkCompany.Antigravity,
    event: "AI Engineer World's Fair 2026",
  },
  {
    youtubeId: "xsVD9_cJNYs",
    title: "Google DeepMind's Vision for Agent-First Development",
    date: "2026-03-31",
    type: TalkType.Interview,
    company: TalkCompany.Antigravity,
    event: "Builders",
  },
  {
    youtubeId: "9eesXjCHlOo",
    title: "Google Cloud Live: Getting started with Antigravity",
    channel: "Google Cloud Tech",
    date: "2026-02-24",
    type: TalkType.Livestream,
    company: TalkCompany.Antigravity,
    event: "Google Cloud Live",
  },
  {
    youtubeId: "HN-F-OQe6j0",
    title: "Defying Gravity - Kevin Hou, Google DeepMind",
    channel: "AI Engineer",
    date: "2025-12",
    type: TalkType.Talk,
    company: TalkCompany.Antigravity,
    event: "AI Engineer Code Summit 2025",
  },
  {
    youtubeId: "nTOVIGsqCuY",
    title: "Learn the basics of Google Antigravity",
    channel: "Google Antigravity",
    date: "2025-11-18",
    type: TalkType.Demo,
    company: TalkCompany.Antigravity,
    event: "Antigravity Launch",
  },
  {
    youtubeId: "OzY9ud0RBLY",
    title:
      "The Oral History of Windsurf (ft. Varun Mohan, Scott Wu, Jeff Wang, Kevin Hou, Anshul R)",
    channel: "Latent Space",
    date: "2025-07-28",
    type: TalkType.Podcast,
    company: TalkCompany.Windsurf,
  },
  {
    youtubeId: "JVuNPL5QO8Q",
    title:
      "Windsurf everywhere, doing everything, all at once - Kevin Hou, Windsurf",
    channel: "AI Engineer",
    date: "2025-06",
    type: TalkType.Talk,
    company: TalkCompany.Windsurf,
    event: "AI Engineer World's Fair 2025",
  },
  {
    youtubeId: "xIUTsNHouWA",
    title:
      "Ceux qui font l'#ia en 2025 - Interview exclusive de Kevin Hou de Windsurf",
    date: "2025",
    type: TalkType.Interview,
    company: TalkCompany.Windsurf,
  },
  {
    youtubeId: "TXpFV0uKdu8",
    title: "How Windsurf Breaks Through the Ceiling for Retrieval",
    channel: "GitNation",
    date: "2025-03-27",
    type: TalkType.Talk,
    company: TalkCompany.Windsurf,
    event: "Productivity Conf 2025",
  },
  {
    youtubeId: "bVNNvWq6dKo",
    title:
      "How Windsurf writes 90% of your code with an Agentic IDE - Kevin Hou, Windsurf",
    channel: "AI Engineer",
    date: "2025-03",
    type: TalkType.Talk,
    company: TalkCompany.Windsurf,
    event: "AI Engineer Summit 2025",
  },
  {
    youtubeId: "ptekg6GNzIQ",
    title:
      "Windsurf forked VS Code to compete with Cursor. Talking the future of AI + Coding",
    channel: "Syntax",
    date: "2025-01-22",
    type: TalkType.Podcast,
    company: TalkCompany.Windsurf,
    event: "Syntax #870",
  },
  {
    youtubeId: "moIySJ4d0UY",
    title:
      "Web Search Best Practices: Save Credits and Optimize Your Workflow - Windsurf Editor",
    channel: "Windsurf",
    date: "2025-01-17",
    type: TalkType.Demo,
    company: TalkCompany.Windsurf,
  },
  {
    youtubeId: "WYb2aMVnuYY",
    title: "The Future of AI Code Editors with Kevin Hou (Codeium, Windsurf)",
    channel: "Yifan - Beyond the Hype",
    date: "2025-01",
    type: TalkType.Podcast,
    company: TalkCompany.Windsurf,
  },
  {
    youtubeId: "sN4eizAYWPQ",
    title: "Introducing the Windsurf Editor",
    date: "2024-11-13",
    type: TalkType.Demo,
    company: TalkCompany.Codeium,
    event: "Windsurf Launch",
  },
  {
    youtubeId: "7SAkmdXJccU",
    title: "Working at Codeium",
    channel: "Codeium",
    date: "2024",
    type: TalkType.Interview,
    company: TalkCompany.Codeium,
  },
  {
    youtubeId: "DuZXbinJ4Uc",
    title: "How Codeium Breaks Through the Ceiling for Retrieval: Kevin Hou",
    channel: "AI Engineer",
    date: "2024-07",
    type: TalkType.Talk,
    company: TalkCompany.Codeium,
    event: "AI Engineer World's Fair 2024",
  },
  {
    youtubeId: "mDKFNanphfE",
    title: "Can AI Turn Us Into 10x Developers?",
    channel: "GitNation",
    date: "2024-06-13",
    type: TalkType.Talk,
    company: TalkCompany.Codeium,
    event: "JSNation 2024",
  },
  {
    youtubeId: "lYXYmcDjGMA",
    title: "AI Superpowers with Kevin Hou and Codeium",
    channel: "Syntax",
    date: "2024-02-09",
    type: TalkType.Podcast,
    company: TalkCompany.Codeium,
    event: "Syntax #728",
  },
];
