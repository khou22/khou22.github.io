import { getCdnAsset } from "@/utils/cdn/cdnAssets";

export enum ProjectCategory {
  iOSApp = "iOS App",
  Website = "Website",
  WebApp = "Web App",
  JavaApp = "Java App",
  Other = "Other",
}

export type ProgrammingProjectType = {
  name: string;
  subtitle: string;
  slug: string;
  image: string;
  category: ProjectCategory;
  description: string;
};

export const programmingProjects: ProgrammingProjectType[] = [
  {
    name: "Lookbook",
    subtitle: "Photo curation",
    slug: "https://www.getlookbook.com",
    image: getCdnAsset("media/projects/lookbook/hero_png"),
    category: ProjectCategory.WebApp,
    description:
      "Helping marketers and photographers currate massive collections of images using computer vision.",
  },
  {
    name: "Async Post Message",
    subtitle: "Open Source Library",
    slug: "https://async-post-message.vercel.app/",
    image: getCdnAsset("media/projects/lookbook/hero_png"),
    category: ProjectCategory.WebApp,
    description:
      "Library to enable `window.postMessage` calls to be asynchronous.",
  },
  {
    name: "Overview Satellite Camera",
    subtitle: "Overview & Airbus Partnership",
    slug: "https://over-view.com",
    image: getCdnAsset("media/projects/lookbook/hero_png"),
    category: ProjectCategory.WebApp,
    description:
      "Equip consumers with a tool to capture and print their own satellite images",
  },
  {
    name: "Slate Scheduler",
    subtitle: "Painlessly schedule calendar events.",
    slug: "http://slate.khou22.com",
    image: getCdnAsset("media/projects/slate/slate_scheduler_png"),
    category: ProjectCategory.iOSApp,
    description:
      "Publically available on the Apple app store! A fun UX and iOS engineering project to make scheduling calendar events a smoother and more enjoyable experience. It uses basic machine learning to build a model of your calendar and predict your event so you don't need to type anything in. It also does away with a lot of poor UI elements like date pickers.",
  },
  {
    name: "HTMLexa",
    subtitle: "HackPrinceton Fall 2017 Finalist",
    slug: "https://devpost.com/software/htmlexa",
    image: getCdnAsset("media/programming/thumbnails/htmlexa_png"),
    category: ProjectCategory.WebApp,
    description:
      "An Alexa Skill and Web App that allows people to build full-scale websites with his or her voice. We aimed to improve the accessibility of website creation through machine learning and a well-crafted user-experience spanning both the voice and digital spectrums.",
  },
  {
    name: "SoFly Scanner",
    subtitle: "HackPrinceton Spring 2017 Winner",
    slug: "https://devpost.com/software/sofly-scanner",
    image: getCdnAsset("media/programming/thumbnails/so_fly_scanner_png"),
    category: ProjectCategory.iOSApp,
    description:
      "An app that allows the user to snap a picture of a flyer, extract relevant information, and make a calendar event with the event name, location, time, date, and more. This will allow users to digitize flyers, and hopefully provide a decentralized mechanism for communities to grow close again. It won 2nd place for best Princeton app at HackPrinceton Spring 2017.",
  },
  {
    name: "Paw Printers",
    subtitle: "An app for Princeton students.",
    slug: "https://pawprinters.herokuapp.com",
    image: getCdnAsset("media/programming/thumbnails/paw_printers_png"),
    category: ProjectCategory.WebApp,
    description:
      "Paw Printers is an app that helps you find the nearest printer on campus. Simply choose whether you want a black and white printer, color printer, or scanner, and it will navigate you to the closest option! I built this over one of my breaks using ExpressJS, Heroku, and ReactJS.",
  },
  {
    name: "Freelance Web Design Company",
    subtitle: "Personal Venture",
    slug: "https://www.kamsky.com",
    image: getCdnAsset("media/programming/thumbnails/kamsky_png"),
    category: ProjectCategory.Website,
    description:
      "Started freelance venture to design and develop client websites.",
  },
  {
    name: "Photo Analysis Content Management System",
    subtitle: "Intelligent photo CMS in the cloud",
    slug: "http://khou22.herokuapp.com/",
    image: getCdnAsset("media/programming/thumbnails/photo_analysis_png"),
    category: ProjectCategory.WebApp,
    description:
      "A content manager with object detection, facial recognition, color analysis, meta-data stripping, etc. for photos to provide intelligent querying and safe S3 image retrieval for websites. Powers my photography store.",
  },
  {
    name: "Ask Ava",
    subtitle: "Y-Combinator Hacks 2019",
    slug: "https://devpost.com/software/ava-69yuo1",
    image: getCdnAsset("media/programming/thumbnails/ask_ava_jpeg"),
    category: ProjectCategory.WebApp,
    description:
      "A voice assistant that will answer your questions using an exerpt from your favorite podcasts. Implenents a BERT QA system.",
  },
  {
    name: "Tile Layout Library",
    subtitle: "My first open-source library.",
    slug: "https://github.com/khou22/Tile-Layout-Web",
    image: getCdnAsset(
      "media/programming/thumbnails/tile_layout_thumbnail_png",
    ),
    category: ProjectCategory.WebApp,
    description:
      "A ReactJS-based NPM package for a tile grid UI — what my programming portfolio page (the page you're on) is actually actively using.",
  },
  {
    name: "Uber Scheduler",
    subtitle: "MenloHacks 2016 Winner",
    slug: "Uber-Scheduler",
    image: getCdnAsset(
      "media/projects/uberScheduler/Screenshots/Home_Screen_png",
    ),
    category: ProjectCategory.iOSApp,
    description:
      "An iOS app to call Ubers ahead of time or on a recurring schedule. I was the frontend engineer and designer. We built this at a hackathon and won 1st place overall.",
  },
  {
    name: "Princeton Tonight Website",
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
    name: "Discover Artist Betting Platform",
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
    name: "Website on East Asian Stereotypes",
    subtitle: "Lick-Wilmerding High School 2016",
    slug: "{{ site.baseurl }}/school/east-asian-relations",
    image: getCdnAsset("media/programming/thumbnails/china_background_webp"),
    category: ProjectCategory.Website,
    description:
      "This is a website I built from scratch for my East Asian Relations class. I was responsible for putting content online so that members of our school community could see the work we'd done that year. Because I only had a couple days to complete it, I wasn't able to add as many features as I would've liked.",
  },
  {
    name: "City Strong Training",
    subtitle: "Personal training and fitness.",
    // slug: "http://citystrongtraining.com/",
    slug: "#",
    image: getCdnAsset("media/programming/thumbnails/city_strong_training_png"),
    category: ProjectCategory.Website,
    description:
      "Freelance work for a friend of mine. I designed and built a website for his new personal training business, City Strong Training.",
  },
  {
    name: "Handwriting Font App",
    subtitle: "One of my first projects.",
    // slug: "http://filmfestival.princetontonight.com",
    slug: "#",
    image: getCdnAsset("media/programming/thumbnails/handwriting_font_app_png"),
    category: ProjectCategory.JavaApp,
    description:
      "This is a handwriting app that I programmed using java. It asks for the user's handwriting then creates a font out of it. The user can type in their handwriting and export their document to be written out using the WaterColor Bot.",
  },
  {
    name: "Princeton Film Festival Website",
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
    name: "MusicViz",
    subtitle: "A live music visualizer programmed in Java.",
    slug: "http://youtu.be/sbJhaRZhsZo",
    image: getCdnAsset("media/programming/thumbnails/musicviz_png"),
    category: ProjectCategory.JavaApp,
    description:
      "This is a music visualizer I programmed in Processing. You can input any music file and it will analyze the sound for beat drops, etc.",
  },
  {
    name: "Online Sandwich Ordering Machine",
    subtitle: "",
    slug: "https://www.flickr.com/photos/khou22/albums/72157668990077812",
    image: getCdnAsset(
      "media/programming/thumbnails/online_sandwich_ordering_jpg",
    ),
    category: ProjectCategory.Other,
    description:
      "This is a project I made for my school. I used an Arduino Ethernet board and a receipt printer to make a machine that could process online sandwich orders for the school cafeteria.",
  },
  {
    name: "Text Analysis App",
    subtitle: "See how you speak on Facebook",
    slug: "text-analysis",
    image: getCdnAsset("media/programming/thumbnails/wordle_png"),
    category: ProjectCategory.WebApp,
    description:
      "An app to analyze the user's text for patterns, word choice, etc. It accepts text files as well as Facebook user data.",
  },
  {
    name: "Open-Source VIM Configuration",
    subtitle: "My personal, well-documented VIM configuration",
    slug: "https://github.com/khou22/dev-tools",
    image: getCdnAsset("media/programming/thumbnails/vim_png"),
    category: ProjectCategory.Other,
    description:
      "This is the complete documentation of my VIM configuration. It includes support for various languages such as Babel and Typescript as well as autocomplete, file grepping, etc. I decided to write extensive documentation per the request of my coworkers and friends.",
  },
  {
    name: "Drag and Drop Interface",
    subtitle: "",
    slug: "drag-drop-interface",
    image: getCdnAsset("media/programming/thumbnails/drag_and_drop_png"),
    category: ProjectCategory.WebApp,
    description:
      "A simple drag and drop interface that uses ReactJS and HTML5 to mimic the Desmos equation editor.",
  },
  {
    name: "Stats Test Score Calculator",
    subtitle: "Calculate test scores using the AP standard",
    slug: "stats-test-score-calculator",
    image: getCdnAsset(
      "media/programming/thumbnails/stats_test_score_calculator_png",
    ),
    category: ProjectCategory.WebApp,
    description:
      "An app to automatically calculate test scores and apply a grading curve. Built for Triggs Honors Stats Classes.",
  },
  {
    name: "Time Calculator",
    subtitle: "Sports timer to average multiple times",
    slug: "time-calculator",
    image: getCdnAsset("media/programming/thumbnails/time_calculator_png"),
    category: ProjectCategory.WebApp,
    description:
      "An app that takes in an ambiguous number of times and outputs the average of those times. Made this for my friend who does crew.",
  },
  {
    name: "Presidential Election Forecast 2016",
    subtitle: "A proof of concept for a statistics concept",
    slug: "presidential-election-forecast-2016",
    image: getCdnAsset("media/programming/thumbnails/election_forecaster_jpeg"),
    category: ProjectCategory.WebApp,
    description:
      "Runs simulations and forecasts who will win the 2016 presidential election. Right now it only simulates who will win the Republican candidacy.",
  },
  {
    name: "Browser Home Page",
    subtitle: "A custom homepage",
    slug: "browser-home-page",
    image: getCdnAsset("media/programming/thumbnails/browser_homepage_png"),
    category: ProjectCategory.Website,
    description:
      "Custom browser home page with useful information and links. I set it to my tab/browser home page.",
  },
  {
    name: "Honors Physics Optics Lab",
    subtitle: "Honors Physics 2016",
    slug: "{{ site.baseurl }}/school/optics/",
    image: getCdnAsset(
      "media/programming/thumbnails/honors_physics_optics_lab_png",
    ),
    category: ProjectCategory.Website,
    description:
      "A website I made from scratch for a physics lab on optics and waves. It was neat being able to make a website instead of a traditional website.",
  },
  {
    name: "Hollywood's Portrayal of Africa",
    subtitle: "Postcolonial Africa 2015",
    slug: "{{ site.baseurl }}/school/postcolonial-africa/",
    image: getCdnAsset(
      "media/programming/thumbnails/hollywood_africa_stereotypes_png",
    ),
    category: ProjectCategory.Website,
    description:
      "A website I made to highlight the stereotypes and microaggressions present in Hollywood films towards Africa. It was an interesting topic that isn't often thought about.",
  },
  {
    name: "Execute Order 66",
    subtitle: "Block profanity in GitHub",
    slug: "https://chrome.google.com/webstore/detail/execute-order-66/hgoanjhaboccoaefceiebdodiillhone?hl=en-US",
    image: getCdnAsset("media/projects/executeOrder66/GitHub_Logo_png"),
    category: ProjectCategory.WebApp,
    description:
      "A Google Chrome Extension that cleanses the profanity out of your GitHub repos.",
  },
  {
    name: "Random Number Assignment",
    subtitle: "Assign random numbers to each person",
    slug: "random-number-assignment",
    image: getCdnAsset("media/programming/thumbnails/random_number_jpg"),
    category: ProjectCategory.WebApp,
    description: "Assigns a random number to inputted elements.",
  },
];
