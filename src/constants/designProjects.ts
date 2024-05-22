import { getCdnAsset } from "@/utils/cdn/cdnAssets";

import { ProjectCategory } from "./programmingProjects";
import { siteMetadata } from "./siteMetadata";

export type DesignProjectType = {
  title: string;
  subtitle: string;
  slug?: string;
  image: string;
  category: string;
  description: string;
};

export const designProjects: DesignProjectType[] = [
  {
    title: "Personal Website & Blog",
    subtitle: "Always Iterating",
    slug: siteMetadata.siteUrl,
    image: getCdnAsset("media/programming/thumbnails/personal_website_png"),
    category: ProjectCategory.Website,
    description:
      "Redesigned and rebuilt from scratch 3 (ish) times over the last 10 years to showcase my photography, personal projects, and more.",
  },
  {
    title: "Codeium Website",
    subtitle: "AI Developer Tools: Autocomplete & Chat",
    slug: "https://codeium.com",
    image: getCdnAsset("media/programming/thumbnails/codeium_website_png"),
    category: ProjectCategory.Website,
    description:
      "Designed and built from scratch. I am now a full time engineer but I built a lot of the site as a freelancer in 2021. Currently has 2m hits / month.",
  },
  {
    title: "Lookbook",
    subtitle: "Photo curation",
    slug: "https://www.getlookbook.com",
    image: getCdnAsset("media/projects/lookbook/hero_png"),
    category: ProjectCategory.WebApp,
    description:
      "Helping marketers and photographers currate massive collections of images using computer vision.",
  },
  {
    title: "Overview Satellite Camera",
    subtitle: "Overview & Airbus Partnership",
    slug: "https://over-view.com",
    image: getCdnAsset("media/projects/overview/overview_homepage_png"),
    category: ProjectCategory.WebApp,
    description:
      "Equip consumers with a tool to capture and print their own satellite images",
  },
  {
    title: "Slate Scheduler",
    subtitle: "Painlessly schedule calendar events.",
    slug: "http://slate.khou22.com",
    image: getCdnAsset("media/projects/slate/slate_scheduler_png"),
    category: ProjectCategory.iOSApp,
    description:
      "Publically available on the Apple app store! A fun UX and iOS engineering project to make scheduling calendar events a smoother and more enjoyable experience. It uses basic machine learning to build a model of your calendar and predict your event so you don't need to type anything in. It also does away with a lot of poor UI elements like date pickers.",
  },
  {
    title: "SoFly Scanner",
    subtitle: "HackPrinceton Spring 2017 Winner",
    slug: "https://devpost.com/software/sofly-scanner",
    image: getCdnAsset("media/programming/thumbnails/so_fly_scanner_png"),
    category: ProjectCategory.iOSApp,
    description:
      "An app that allows the user to snap a picture of a flyer, extract relevant information, and make a calendar event with the event name, location, time, date, and more. This will allow users to digitize flyers, and hopefully provide a decentralized mechanism for communities to grow close again. It won 2nd place for best Princeton app at HackPrinceton Spring 2017.",
  },
  {
    title: "Paw Printers",
    subtitle: "An app for Princeton students.",
    slug: "https://pawprinters.herokuapp.com",
    image: getCdnAsset("media/programming/thumbnails/paw_printers_png"),
    category: ProjectCategory.WebApp,
    description:
      "Paw Printers is an app that helps you find the nearest printer on campus. Simply choose whether you want a black and white printer, color printer, or scanner, and it will navigate you to the closest option! I built this over one of my breaks using ExpressJS, Heroku, and ReactJS.",
  },
  {
    title: "Freelance Web Design Company",
    subtitle: "Personal Venture",
    slug: "https://www.kamsky.com",
    image: getCdnAsset("media/programming/thumbnails/kamsky_png"),
    category: ProjectCategory.Website,
    description:
      "Started freelance venture to design and develop client websites.",
  },
  {
    title: "Princeton University Snapchat Geofilter",
    subtitle: "Social Media Filter",
    image: getCdnAsset(
      "media/design/snapchat_geofilters/whitman_geofilter_png",
    ),
    category: ProjectCategory.Other,
    description:
      "I designed a geofilter for Princeton students and visitors alike after noticing that my residential college was the only one out of 6 that didn't have one. It serves the 6000 undergraduate students.",
  },
  {
    title: "Uber Scheduler",
    subtitle: "MenloHacks 2016 Winner",
    image: getCdnAsset(
      "media/projects/uberScheduler/screenshots/home_screen_png",
    ),
    category: ProjectCategory.iOSApp,
    description:
      "An iOS app to call Ubers ahead of time or on a recurring schedule. I was the frontend engineer and designer. We built this at a hackathon and won 1st place overall.",
  },
  {
    title: "Princeton Tonight Website",
    subtitle: "Princeton's first and only broadcast show.",
    slug: "http://princetontonight.com",
    image: getCdnAsset(
      "media/programming/thumbnails/princeton_tonight_thumbnail_png",
    ),
    category: ProjectCategory.Website,
    description:
      "I designed and built Princeton Tonight's website to showcase episodes, blog posts, photos, and  upcoming events as well as an email subscription service. Founded in 2015, we are the only student TV production show on Princeton's campus and have hosted guests ranging from Art Garfunkel and Mike Houston to Mike Delguidice and Dave Coulier.",
  },
  {
    title: "Discover Artist Betting Platform",
    subtitle: "Stanford Treehacks 2020",
    slug: "https://devpost.com/software/discover-artist-betting",
    image: getCdnAsset(
      "media/programming/thumbnails/discover_artist_betting_jpg",
    ),
    category: ProjectCategory.WebApp,
    description:
      "A betting platform that uses Spotify's monthly listeners as a stock ticker.",
  },
  {
    title: "Website on East Asian Stereotypes",
    subtitle: "Lick-Wilmerding High School 2016",
    slug: "{{ site.baseurl }}/school/east-asian-relations",
    image: getCdnAsset("media/programming/thumbnails/china_background_webp"),
    category: ProjectCategory.Website,
    description:
      "This is a website I built from scratch for my East Asian Relations class. I was responsible for putting content online so that members of our school community could see the work we'd done that year. Because I only had a couple days to complete it, I wasn't able to add as many features as I would've liked.",
  },
  {
    title: "City Strong Training",
    subtitle: "Personal training and fitness.",
    // slug: "http://citystrongtraining.com/",
    slug: "#",
    image: getCdnAsset("media/programming/thumbnails/city_strong_training_png"),
    category: ProjectCategory.Website,
    description:
      "Freelance work for a friend of mine. I designed and built a website for his new personal training business, City Strong Training.",
  },
  {
    title: "Princeton Film Festival Website",
    subtitle:
      "A website for film executives and hobbyists to discover more about the festival.",
    // slug: "http://filmfestival.princetontonight.com/",
    slug: "#",
    image: getCdnAsset("media/programming/thumbnails/film_festival_png"),
    category: ProjectCategory.Website,
    description:
      "This was a site built for the Princeton Film Festival — a brand new conference to bring executives from top film companies to Princeton's campus to mentor, educate, and speak to high school and college students interested in the film industry.",
  },
  {
    title: "MusicViz",
    subtitle: "A live music visualizer programmed in Java.",
    slug: "http://youtu.be/sbJhaRZhsZo",
    image: getCdnAsset("media/programming/thumbnails/musicviz_png"),
    category: ProjectCategory.JavaApp,
    description:
      "This is a music visualizer I programmed in Processing. You can input any music file and it will analyze the sound for beat drops, etc.",
  },
];
