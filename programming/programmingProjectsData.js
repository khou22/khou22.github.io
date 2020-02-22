console.log("Loaded programming projects");

// Color scheme
const blue = "#3286A8";
const red = "#D5491F";
const orange = "#DA8D0F";
const green = "#80A454";
const gray = "#9DB7C1";

// Set dictionary values
var categories = new Object(); // Create dictionary of categories
categories["iOS App"] = { name: "iOS App", color: blue };
categories["Website"] = { name: "Website", color: orange };
categories["Web App"] = { name: "Web App", color: red };
categories["Java App"] = { name: "Java App", color: green };
categories["Other"] = { name: "Other", color: gray };

programmingProjects = [
  {
    name: "Slate Scheduler",
    subtitle: "Painlessly schedule calendar events.",
    slug: "http://slate.khou22.com",
    image: "./../media/projects/slate/slate-scheduler.png",
    category: categories["iOS App"].name,
    categoryColor: categories["iOS App"].color,
    description:
      "Publically available on the Apple app store! A fun UX and iOS engineering project to make scheduling calendar events a smoother and more enjoyable experience. It uses basic machine learning to build a model of your calendar and predict your event so you don't need to type anything in. It also does away with a lot of poor UI elements like date pickers."
  },
  {
    name: "HTMLexa",
    subtitle: "HackPrinceton Spring 2017 Finalist",
    slug: "https://devpost.com/software/htmlexa",
    image: "./../media/programming/thumbnails/htmlexa.png",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description:
      "An Alexa Skill and Web App that allows people to build full-scale websites with his or her voice. We aimed to improve the accessibility of website creation through machine learning and a well-crafted user-experience spanning both the voice and digital spectrums."
  },
  {
    name: "SoFly Scanner",
    subtitle: "HackPrinceton Spring 2017 Winner",
    slug: "https://devpost.com/software/sofly-scanner",
    image: "./../media/programming/thumbnails/so-fly-scanner.png",
    category: categories["iOS App"].name,
    categoryColor: categories["iOS App"].color,
    description:
      "An app that allows the user to snap a picture of a flyer, extract relevant information, and make a calendar event with the event name, location, time, date, and more. This will allow users to digitize flyers, and hopefully provide a decentralized mechanism for communities to grow close again. It won 2nd place for best Princeton app at HackPrinceton Spring 2017."
  },
  {
    name: "Paw Printers",
    subtitle: "An app for Princeton students.",
    slug: "https://pawprinters.herokuapp.com",
    image: "./../media/programming/thumbnails/paw-printers.png",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description:
      "Paw Printers is an app that helps you find the nearest printer on campus. Simply choose whether you want a black and white printer, color printer, or scanner, and it will navigate you to the closest option! I built this over one of my breaks using ExpressJS, Heroku, and ReactJS."
  },
  {
    name: "Freelance Web Design Company",
    subtitle: "Personal Venture",
    slug: "https://www.kamsky.com",
    image: "./../media/programming/thumbnails/kamsky.png",
    category: categories["Website"].name,
    categoryColor: categories["Website"].color,
    description:
      "Started freelance venture to design and develop client websites."
  },
  {
    name: "Photo Analysis Content Management System",
    subtitle: "Intelligent photo CMS in the cloud",
    slug: "http://khou22.herokuapp.com/",
    image: "./../media/programming/thumbnails/photo-analysis.png",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description:
      "A content manager with object detection, facial recognition, color analysis, meta-data stripping, etc. for photos to provide intelligent querying and safe S3 image retrieval for websites. Powers my photography store."
  },
  {
    name: "Personal Heroku Server",
    subtitle: "Express, Typescript, PostGres, Sequelize, Heroku",
    slug: "http://khou22.herokuapp.com/",
    image: "./../media/programming/thumbnails/khou22-apis.png",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description:
      "A personal web app with a client, server, and database that implements Basic Auth security as well as user sessions using cookies, login/profile pages. The client hosts various web apps that I've built for clients — each page requires user authentication. The server hosts various RESTful API endpoints that I use for my various apps and projects. Stack: React-Redux-Router, Typescript, Webpack, Postgres, Express, Node, Heroku."
  },
  {
    name: "Ask Ava",
    subtitle: "Y-Combinator Hacks 2019",
    slug: "https://devpost.com/software/ava-69yuo1",
    image: "./../media/programming/thumbnails/ask-ava.jpeg",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description:
      "A voice assistant that will answer your questions using an exerpt from your favorite podcasts. Implenents a BERT QA system."
  },
  {
    name: "Tile Layout Library",
    subtitle: "My first open-source library.",
    slug: "https://github.com/khou22/Tile-Layout-Web",
    image: "./../media/programming/thumbnails/tile-layout-thumbnail.png",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description:
      "A ReactJS-based NPM package for a tile grid UI — what my programming portfolio page (the page you're on) is actually actively using."
  },
  {
    name: "Uber Scheduler",
    subtitle: "MenloHacks 2016 Winner",
    slug: "Uber-Scheduler",
    image: "./../media/projects/uberScheduler/Screenshots/Home%20Screen.png",
    category: categories["iOS App"].name,
    categoryColor: categories["iOS App"].color,
    description:
      "An iOS app to call Ubers ahead of time or on a recurring schedule. I was the frontend engineer and designer. We built this at a hackathon and won 1st place overall."
  },
  {
    name: "Princeton Tonight Website",
    subtitle: "Princeton's first and only broadcast show.",
    slug: "http://princetontonight.com",
    image: "./../media/programming/thumbnails/princeton-tonight-thumbnail.png",
    category: categories["Website"].name,
    categoryColor: categories["Website"].color,
    description:
      "I designed and built Princeton Tonight's website to showcase episodes, blog posts, photos, and  upcoming events as well as an email subscription service. Founded in 2015, we are the only student TV production show on Princeton's campus and have hosted guests ranging from Art Garfunkel and Mike Houston to Mike Delguidice and Dave Coulier."
  },
  {
    name: "Discover Artist Betting Platform",
    subtitle: "Stanford Treehacks 2020",
    slug: "https://devpost.com/software/discover-artist-betting",
    image: "./../media/programming/thumbnails/discover-artist-betting.jpg",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description:
      "A betting platform that uses Spotify's monthly listeners as a stock ticker."
  },
  {
    name: "Website on East Asian Stereotypes",
    subtitle: "Lick-Wilmerding High School 2016",
    slug: "{{ site.baseurl }}/school/east-asian-relations",
    image:
      "http://vignette2.wikia.nocookie.net/steamtradingcards/images/1/11/Guilty_Gear_Isuka_Background_China.jpg/revision/latest?cb=20140520060849",
    category: categories["Website"].name,
    categoryColor: categories["Website"].color,
    description:
      "This is a website I built from scratch for my East Asian Relations class. I was responsible for putting content online so that members of our school community could see the work we'd done that year. Because I only had a couple days to complete it, I wasn't able to add as many features as I would've liked."
  },
  {
    name: "City Strong Training",
    subtitle: "Personal training and fitness.",
    slug: "http://citystrongtraining.com/",
    image: "./../media/programming/thumbnails/city-strong-training.png",
    category: categories["Website"].name,
    categoryColor: categories["Website"].color,
    description:
      "Freelance work for a friend of mine. I designed and built a website for his new personal training business, City Strong Training."
  },
  {
    name: "Handwriting Font App",
    subtitle: "One of my first projects.",
    slug: "http://filmfestival.princetontonight.com",
    image: "./../media/programming/thumbnails/handwriting-font-app.png",
    category: categories["Java App"].name,
    categoryColor: categories["Java App"].color,
    description:
      "This is a handwriting app that I programmed using java. It asks for the user's handwriting then creates a font out of it. The user can type in their handwriting and export their document to be written out using the WaterColor Bot."
  },
  {
    name: "Princeton Film Festival Website",
    subtitle:
      "A website for film executives and hobbyists to discover more about the festival.",
    slug: "http://filmfestival.princetontonight.com/",
    image: "./../media/programming/thumbnails/film-festival.png",
    category: categories["Website"].name,
    categoryColor: categories["Website"].color,
    description:
      "This was a site built for the Princeton Film Festival — a brand new conference to bring executives from top film companies to Princeton's campus to mentor, educate, and speak to high school and college students interested in the film industry."
  },
  {
    name: "MusicViz",
    subtitle: "A live music visualizer programmed in Java.",
    slug: "http://youtu.be/sbJhaRZhsZo",
    image: "./../media/programming/thumbnails/musicviz.png",
    category: categories["Java App"].name,
    categoryColor: categories["Java App"].color,
    description:
      "This is a music visualizer I programmed in Processing. You can input any music file and it will analyze the sound for beat drops, etc."
  },
  {
    name: "Online Sandwich Ordering Machine",
    subtitle: "",
    slug: "https://www.flickr.com/photos/khou22/albums/72157668990077812",
    image: "./../media/programming/thumbnails/online-sandwich-ordering.jpg",
    category: "Arduino",
    categoryColor: categories["Other"].color,
    description:
      "This is a project I made for my school. I used an Arduino Ethernet board and a receipt printer to make a machine that could process online sandwich orders for the school cafeteria."
  },
  {
    name: "Text Analysis App",
    subtitle: "See how you speak on Facebook",
    slug: "text-analysis",
    image: "http://searchuserinterfaces.com/book/images/wordle.png",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description:
      "An app to analyze the user's text for patterns, word choice, etc. It accepts text files as well as Facebook user data."
  },
  {
    name: "Open-Source VIM Configuration",
    subtitle: "My personal, well-documented VIM configuration",
    slug: "https://github.com/khou22/dev-tools",
    image: "https://ucarecdn.com/18f71672-5e94-4f74-9cf4-b840507509b0/",
    category: categories["Other"].name,
    categoryColor: categories["Other"].color,
    description:
      "This is the complete documentation of my VIM configuration. It includes support for various languages such as Babel and Typescript as well as autocomplete, file grepping, etc. I decided to write extensive documentation per the request of my coworkers and friends."
  },
  {
    name: "Drag and Drop Interface",
    subtitle: "",
    slug: "drag-drop-interface",
    image: "https://i.stack.imgur.com/CJbiO.png",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description:
      "A simple drag and drop interface that uses ReactJS and HTML5 to mimic the Desmos equation editor."
  },
  {
    name: "Stats Test Score Calculator",
    subtitle: "Calculate test scores using the AP standard",
    slug: "stats-test-score-calculator",
    image: "./../media/programming/thumbnails/stats-test-score-calculator.png",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description:
      "An app to automatically calculate test scores and apply a grading curve. Built for Triggs Honors Stats Classes."
  },
  {
    name: "Time Calculator",
    subtitle: "Sports timer to average multiple times",
    slug: "time-calculator",
    image:
      "https://cdn.dribbble.com/users/15226/screenshots/411621/et_4-copy.png",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description:
      "An app that takes in an ambiguous number of times and outputs the average of those times. Made this for my friend who does crew."
  },
  {
    name: "Presidential Election Forecast 2016",
    subtitle: "A proof of concept for a statistics concept",
    slug: "presidential-election-forecast-2016",
    image:
      "https://g.foolcdn.com/editorial/images/185172/democrat-republican_large.jpg",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description:
      "Runs simulations and forecasts who will win the 2016 presidential election. Right now it only simulates who will win the Republican candidacy."
  },
  {
    name: "Browser Home Page",
    subtitle: "A custom homepage",
    slug: "browser-home-page",
    image: "./../media/programming/thumbnails/browser-homepage.png",
    category: categories["Website"].name,
    categoryColor: categories["Website"].color,
    description:
      "Custom browser home page with useful information and links. I set it to my tab/browser home page."
  },
  {
    name: "Honors Physics Optics Lab",
    subtitle: "Honors Physics 2016",
    slug: "{{ site.baseurl }}/school/optics/",
    image: "./../media/programming/thumbnails/honors-physics-optics-lab.png",
    category: categories["Website"].name,
    categoryColor: categories["Website"].color,
    description:
      "A website I made from scratch for a physics lab on optics and waves. It was neat being able to make a website instead of a traditional website."
  },
  {
    name: "Hollywood's Portrayal of Africa",
    subtitle: "Postcolonial Africa 2015",
    slug: "{{ site.baseurl }}/school/postcolonial-africa/",
    image: "./../media/programming/thumbnails/hollywood-africa-stereotypes.png",
    category: categories["Website"].name,
    categoryColor: categories["Website"].color,
    description:
      "A website I made to highlight the stereotypes and microaggressions present in Hollywood films towards Africa. It was an interesting topic that isn't often thought about."
  },
  {
    name: "Execute Order 66",
    subtitle: "Block profanity in GitHub",
    slug:
      "https://chrome.google.com/webstore/detail/execute-order-66/hgoanjhaboccoaefceiebdodiillhone?hl=en-US",
    image: "./../media/projects/executeOrder66/GitHub%20Logo.png",
    category: "Chrome Extension",
    categoryColor: categories["Other"].color,
    description:
      "A Google Chrome Extension that cleanses the profanity out of your GitHub repos."
  },
  {
    name: "Random Number Assignment",
    subtitle: "Assign random numbers to each person",
    slug: "random-number-assignment",
    image: "./../media/programming/thumbnails/random-number.jpg",
    category: categories["Web App"].name,
    categoryColor: categories["Web App"].color,
    description: "Assigns a random number to inputted elements."
  }
];
