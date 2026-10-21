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
   * YouTube channel that published the video.
   */
  channel: string;

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
};

export const getYouTubeUrl = (youtubeId: string) =>
  `https://www.youtube.com/watch?v=${youtubeId}`;

export const getYouTubeThumbnail = (youtubeId: string) =>
  `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

/**
 * Speaking appearances on YouTube: talks, podcasts, interviews, and demos.
 */
export const talks: TalkRecord[] = [];
