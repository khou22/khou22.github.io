//Landing page for my website

var images = new Array() //Declare array
function preload() { //Preload the images ahead of time so they don't lag
  for (i = 0; i < preload.arguments.length; i++) {
    // console.log("Preloading:", images[i]); //Feedback
    images[i] = new Image() //Creates the image tag for each image
    images[i].src = preload.arguments[i]
  }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex; //Arguments
  while (0 !== currentIndex) { //If still elements to shuffle
    randomIndex = Math.floor(Math.random() * currentIndex); //Pick random element
    currentIndex -= 1; //Subtract from total
    temporaryValue = array[currentIndex]; //Store
    array[currentIndex] = array[randomIndex]; //Set replacement
    array[randomIndex] = temporaryValue; //Set replacement
  }
  return array;
}

/****************************** Start of components ******************************/

var LandingPage = React.createClass({
  getInitialState: function() {
    var shuffleBackgrounds = true;
    var notificationData = {
      // Types are 'alert', 'notice'
      type: "notice",
      // message: "New video released: Wood Turned Segmented Bowl with Inlaid Letters",
      message: "New wood project: Wood Turned Segmented Bowl with Inlaid Letters",
      link: "https://youtu.be/_ZSztfYnnC8"
    };
    var firstImage = { // Set first image — not working
      name: "Walnut and Aged Redwood Biometric Lock Box",
      imageURL: "./../media/site/images/backgrounds/Walnut_and_Aged_Redwood_Biometric_Lock_Box.jpg",
      link: "https://www.flickr.com/photos/khou22/albums/72157668938950255"
    };
    var backgrounds = [
      {
        name: "Walnut Poplar Salad Bowl",
        imageURL: "./../media/site/images/backgrounds/Walnut_Poplar_Salad_Bowl.jpg",
        link: "http://kevinhou.wix.com/projects#!walnut-and-poplar-segmented-salad-bowl/c1jkm"
      },
      {
        name: "Wood Turned Pens",
        imageURL: "./../media/site/images/backgrounds/Wood_Pens_May_2016.jpg",
        link: "https://www.flickr.com/photos/khou22/albums/72157660707733426"
      },
      {
        name: "Wenge and Jara Wood Cable Manager",
        imageURL: "./../media/site/images/backgrounds/Wenge_Jara_Cable_Manager.jpg",
        link: "https://www.flickr.com/photos/khou22/albums/72157668939240165"
      },
      {
        name: "White Mahogany Plaque",
        imageURL: "./../media/site/images/backgrounds/White_Mahogany_Plaque.jpg",
        link: "https://www.flickr.com/photos/khou22/albums/72157666393433584"
      },
      {
        name: "Olive Wood Pencil Case",
        imageURL: "./../media/site/images/backgrounds/Olive_Wood_Pencil_Case.jpg",
        link: "https://www.flickr.com/photos/khou22/albums/72157668937781395"
      },
      {
        name: "Maple iPhone Stand",
        imageURL: "./../media/site/images/backgrounds/Maple_iPhone_Stand.jpg",
        link: "https://www.flickr.com/photos/khou22/albums/72157668938950275"
      },
      {
        name: "Walnut and Aged Redwood Biometric Lock Box",
        imageURL: "./../media/site/images/backgrounds/Walnut_and_Aged_Redwood_Biometric_Lock_Box.jpg",
        link: "https://www.flickr.com/photos/khou22/albums/72157668938950255"
      },
      {
        name: "Walnut and Aluminum Headphone Stand",
        imageURL: "./../media/site/images/backgrounds/Walnut_and_Aluminum_Headphone_Stand.jpg",
        link: "https://www.flickr.com/photos/khou22/albums/72157658462097054"
      },
      {
        name: "Basket Weave Cutting Board",
        imageURL: "./../media/site/images/backgrounds/Basket_Weave_Cutting_Board.jpg",
        link: "https://www.flickr.com/photos/khou22/albums/72157652887421218"
      },
      {
        name: "Bulbish Sapele Bowl",
        imageURL: "./../media/site/images/backgrounds/Bulbish_Sapele_Bowl.jpg",
        link: "http://kevinhou.wix.com/projects#!bublish-sapele-wood-bowl/c1444"
      },
      {
        name: "Walnut and Maple Amplifier",
        imageURL: "./../media/site/images/backgrounds/Walnut_and_Maple_Amplifier.jpg",
        link: "https://www.flickr.com/photos/khou22/albums/72157660781288855"
      },
      {
        name: "Tropical Wood Phone Stand",
        imageURL: "./../media/site/images/backgrounds/Tropical_Wood_Phone_Stand.jpg",
        link: "https://www.flickr.com/photos/khou22/albums/72157659369093144"
      },
      {
        name: "Maple Baseball Bat",
        imageURL: "./../media/site/images/backgrounds/Maple_Baseball_Bat.jpg",
        link: "http://kevinhou.wix.com/projects#!maple-baseball-bat/ce0i"
      },
      {
        name: "Sapele Wood Gavel",
        imageURL: "./../media/site/images/backgrounds/Gavel.jpg",
        link: "http://kevinhou.wix.com/projects#!chichipate-and-sapele-gavel/c1ryp"
      },
      {
        name: "Walnut and Maple Single Speaker",
        imageURL: "./../media/site/images/backgrounds/Walnut_and_Maple_Single_Speaker.jpg",
        link: "https://www.flickr.com/photos/khou22/albums/72157660781288855"
      },
      {
        name: "Maple and Walnut Speakers with Music Visualizer",
        imageURL: "./../media/site/images/backgrounds/Maple_and_Walnut_Visualizer.jpg",
        link: "https://www.flickr.com/photos/khou22/albums/72157660781288855"
      },
      {
        name: "Bulbish Sapele Wood Bowl",
        imageURL: "./../media/site/images/backgrounds/Fruit_Tart.jpg",
        link: "http://kevinhou.wix.com/projects#!bublish-sapele-wood-bowl/c1444"
      },
      {
        name: "Wood Turned Pens",
        imageURL: "./../media/site/images/backgrounds/Wood_Pens.jpg",
        link: "http://kevinhou.wix.com/projects#!wood-pens/cn8u"
      },
      {
        name: "MusicViz - A Music Visualizer",
        imageURL: "./../media/site/images/backgrounds/MusicViz.png",
        link: "http://kevinhou.wix.com/projects#!musicviz/c1ku2"
      },
      {
        name: "Japanese Square Plate",
        imageURL: "./../media/site/images/backgrounds/Japanese_Square_Plate.jpg",
        link: "http://kevinhou.wix.com/projects#!japanese-square-plate/czt2"
      },
      {
        name: "Online Sandwich Ordering Machine",
        imageURL: "./../media/site/images/backgrounds/Online_Sandwich_Ordering_Machine.jpg",
        link: "http://kevinhou.wix.com/projects#!online-sandwich-ordering-machine/clla"
      },
      {
        name: "Turning a Chaote Viga Bowl",
        imageURL: "./../media/site/images/backgrounds/Kevin_Turning_Chaote_Viga.jpg",
        link: "#"
      },
      {
        name: "Turning a Chaote Vig Bowl",
        imageURL: "./../media/site/images/backgrounds/Turning_Chaote_Viga.jpg",
        link: "#"
      }
    ];
    setTimeout(function() {document.getElementById("mainDiv").classList.add('div-fade-in');}, 1);
    preload("./../media/site/images/Profile.jpg"); //Preload profile picture
    if (shuffleBackgrounds) { //If shuffle
      shuffle(backgrounds); //Shuffle backgrounds
    }
    var finalRay = [firstImage]; //Add first image
    for (var i = 0; i < backgrounds.length; i++) {
      finalRay.push(backgrounds[i]); //Add shuffled to the final array of images
    }
    setTimeout(function() { //Start slideshow after 10 seconds
      document.getElementById("backgroundDiv").classList.add('background-fade'); //Add the fade animation
      setInterval(this.nextBackground.bind(this), 5000);
    }.bind(this), 7000);
    for (var i = 0; i < finalRay.length; i++) { //Cycle through backgrounds
      preload(finalRay[i].imageURL); //Preload every background
    }
    return {
      notificationData: notificationData,
      backgroundURLs: finalRay,
      currentBackground: 0 //Index in array of backgrounds
    };
  },
  nextBackground: function() {
    document.getElementById("backgroundDiv").classList.remove('background-fade');
    if (this.state.currentBackground < this.state.backgroundURLs.length - 1) { //if not the last background in array
      this.setState({
        currentBackground: this.state.currentBackground + 1 //Go to next background index
      });
    } else {
      this.setState({
        currentBackground: 0 //Reset index
      })
    }
    setTimeout(function() {document.getElementById("backgroundDiv").classList.add('background-fade');}, 25);
  },
  render: function() {
    var URL = this.state.backgroundURLs[this.state.currentBackground].imageURL;
    var BackURL = this.state.currentBackground >= this.state.backgroundURLs.length-1 ? this.state.backgroundURLs[0] : this.state.backgroundURLs[this.state.currentBackground + 1];
    BackURL = BackURL.imageURL;
    var backgroundStyle = {
      backgroundImage: 'url(' + URL + ')',
    };
    // console.log("Current background image:", backgroundStyle); // Feedback
    var backgroundStyleBack = {
      backgroundImage: 'url(' + BackURL + ')',
    };
    return (
      <div id="mainDiv">
        <div className="content-area">
          <ProfileBox />
          <ModalBox showModal={false} />
        </div>
        <NotificationBar notificationData={this.state.notificationData} />
        <ProjectInfo projectData ={this.state.backgroundURLs[this.state.currentBackground]} />
        <div className="landing-background" style={backgroundStyleBack}></div>
        <div id="backgroundDiv" className="landing-background" style={backgroundStyle}></div>
      </div>
    );
  }
});

var NotificationBar = React.createClass({
  render: function() {
    var message = this.props.notificationData.message;
    var iconClass = ""; // Using bootstrap glyphicons
    switch(this.props.notificationData.type) {
      case "alert":
        iconClass = "glyphicon glyphicon-alert"; // Set to alert sign
        iconClass += " landing-alert-sign"; // Add custom class
        break;
      case "notice":
        iconClass = "glyphicon-info-sign"; // Set to info sign
        iconClass += " landing-info-sign"; // Add custom class
        break;
      default:
        iconClass = "glyphicon-info-sign"; // Default is info sign
    };
    return (
      <a href={this.props.notificationData.link} target="_blank" title="See more about this project">
        <div className="landing-notification-bar">
          <div className="landing-notification-symbol">
            <span className={"glyphicon " + iconClass} aria-hidden="true"></span>
          </div>
          <div className="landing-notification-content">
            {message}
          </div>
        </div>
      </a>
    )
  }
})

var ProjectInfo = React.createClass({
  render: function() {
    var projectName = this.props.projectData.name;
    var projectLink = this.props.projectData.link;
    return (
      <a href={projectLink} target="_blank" title="See more about this background">
        <div className="landing-project-info">
          {projectName}
        </div>
      </a>
    )
  }
})

var ProfileBox = React.createClass({
  redirect: function(page) {
    switch (page) {
      case "wood":
        window.open("https://kevinhou.wix.com/projects#!wood/c1han", '_blank);'); // Wix projects page
        break;
      case "blog":
        location.href="/blog";
        break;
      case "programming":
        location.href="/blog/projects"; // Project page on website
        window.open("http://kevinhou.wix.com/projects#!woodprojects/ckra", '_blank);'); // Wix projects page
        break;
      default:
    };
  },
  render: function() {
    return (
      <div>
        <div className="profile-name" id="kevin">
          Kevin Hou
        </div>
        <div className="cardDiv">
          <div className="flip-container" ontouchstart="this.classList.toggle('hover');">
            <div className="flipper">
              <div className="front">
                <div className="profile-picture"></div>
              </div>
              <div className="back">
                <div className="profile-about">
                  <div className="profile-about-text">
                    <p style={{"fontSize": "2rem", "lineHeight": "0rem"}}>Portfolio and Blog</p>
                    <hr style={{"marginTop": "14px"}}/>
                      Lick-Wilmerding &#39;16
                    <hr style={{"marginTop": "14px"}}/>
                    <p>Wood. Coding. Computers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-blog">
          <PageButton className="blog-button" redirect={this.redirect.bind(this, "wood")} iconClass="wood-icon" label="Wood" left={56}/>
          <PageButton className="blog-button" redirect={this.redirect.bind(this, "blog")} iconClass="blog-icon" label="Blog" left={160}/>
          <PageButton className="blog-button" redirect={this.redirect.bind(this, "programming")} iconClass="code-icon" label="Coding" left={264}/>
        </div>
      </div>
    );
  }
});

var PageButton = React.createClass({
  mouseHover: function() {
    // console.log("H")
  },
  render: function() {
    var buttonStyle = {
      left: this.props.left
    }
    return (
      <button className={this.props.className + " " + this.props.iconClass} onClick={this.props.redirect.bind(this)}>
        <div className="icon-label">{this.props.label}</div>
      </button>
    );
  }
})

var ModalBox = React.createClass({
  render: function() {
    if (this.props.showModal) {
      return (
        <div aria-hidden="false" role="dialog" className="modal">
          <div className="modal__container">
            <div className="modal__header">
              Header
            </div>
            <div className="modal__content">
              Content
            </div>
            <div className="modal__footer">
              Footer
            </div>
          </div>
          <div className="modal-backdrop">
          </div>
        </div>
      );
    } else {
      return (
        <span></span>
      )
    }
  }
})

React.render(
  React.createElement(LandingPage, null),
  document.getElementById('content')
);

var theater = theaterJS({ local: 'fr' })

theater
  .on('type:start, erase:start', function () {
    theater.getCurrentActor().$element.classList.add('actor__content--typing')
  })
  .on('type:end, erase:end', function () {
    theater.getCurrentActor().$element.classList.remove('actor__content--typing')
  })

theater
  .addActor('kevin', { speed: 0.6, accuracy: 0.7 })
  .addScene('kevin:Kevin Hou', 2000)
  .addScene('kevin:Welcome!', 1000)
  .addScene('kevin:Kevin Hou', 2000)
  .addScene(theater.replay.bind(theater))
