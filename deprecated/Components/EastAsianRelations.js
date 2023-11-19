// console.log("TinyURL link: http://tinyurl.com/eastAsianRelations"); // So I remember
var EastAsianRelations = React.createClass({
  getInitialState: function() {
    var countryIndex = 0;
    var currentURL = window.location.href;
    for (var i = 0; i < pageData.length; i++) {
      var parameterIndex = currentURL.indexOf('?'); // Beginning of parameter
      var parameters = currentURL.substring(parameterIndex, currentURL.length); // Keep only last bit
      // console.log("Looking for:", pageData[i].countrySlug, "in", parameters); // Feedback
      var index = parameters.indexOf(pageData[i].countrySlug);
      if (index != -1) { // If url contains slug
        // console.log("Country:", pageData[i].countryName); // Feedback
        countryIndex = i;
      }
    }
    return {
      countryIndex: countryIndex,
      data: pageData
    }
  },
  render: function() {
    var currentCountryIndex = this.state.countryIndex;
    var countryData = this.state.data[currentCountryIndex]
    var articleNodes = countryData.articles.map(function(article) {
      return (
        <Article article={article} />
      )
    });
    var takeawaysNodes = [countryData.countrySlug].map(function(countrySlug) {
      if (countrySlug == "ov") { // If on overview page
        // Only show if on overview page
        return (
          <IndividualTakeaways />
        )
      }
    });
    return (
      <div>
        <Header data={countryData} />
        <WelcomeSection data={countryData}/>
        { articleNodes }
        { takeawaysNodes }
      </div>
    );
  }
})

var Article = React.createClass({
  render: function() {
    var title = this.props.article.title;
    var author = this.props.article.author;
    var youTubeVideos = this.props.article.youTubeVideos;
    var images = this.props.article.images;
    var indent = this.props.article.indent; // If true, 50px indent. If false, 10px padding left
    var indentStyle = indent == true ? { "textIndent": "50px" } : { "paddingLeft": "10px" }; // Apply indent

    var paragraphNodes = this.props.article.content.map(function(paragraph) {
      return (
        <div className="ea-paragraph" style={ indentStyle }>
          { paragraph }
          <br className="ea-paragraph-br"/>
        </div>
      )
    });
    var authorNodes = [author].map(function(author) {
      if (author != "NA") { // If assigned an author
        return (
          <h3 className="ea-article-author">
            <i>Written by: { author }</i>
          </h3>
        )
      } else { // Return nothing
        return (
          <span></span>
        )
      }
    });
    var videoNodes = youTubeVideos.map(function(video) {
      var videoID = video.link.substring(video.link.indexOf('=') + 1, video.link.length); // Get only video ID
      var videoEmbedLink = "https://www.youtube.com/embed/" + videoID; // Concatinate link
      // console.log("Video embed link:", videoEmbedLink); // Feedback
      return (
        <div className="ea-youTubeVideo">
          <iframe width="100%" height="300" src={videoEmbedLink} frameborder="0" allowfullscreen></iframe>
          <br />
        </div>
      )
    });
    var imageNodes = images.map(function(image) {
      return (
        <div>
          <br />
          <img width="40%" height="40%" src={image.link} />
          <br />
          { image.title }
        </div>
      )
    })
    return (
      <div className="ea-article-div">
        <h1 className="ea-article-title">
          { title}
        </h1>
        { authorNodes }
        <div className="ea-article-content">
          { paragraphNodes }
        </div>
        { videoNodes }
        { imageNodes }
      </div>
    )
  }
});

var IndividualTakeaways = React.createClass({
  render: function() {
    var takeaways = individualTakeaways; // From data.js
    var takeawaysNodes = takeaways.map(function(takeaway) {
      var author = takeaway.name;
      var content = takeaway.content;
      if (content != "NA") { // If the person actually wrote one
        return (
          <span>
            <div className="ea-takeaway">
              { content }
              <br />
              <i>- { author }</i>
            </div>
            <br className="ea-paragraph-br" />
          </span>
        )
      };
    })
    return (
      <div className="ea-article-div">
        <h1 className="ea-article-title">
          Individual Takeaways
        </h1>
        <br />
        { takeawaysNodes }
      </div>
    )
  }
});

var Header = React.createClass({
  render: function() {
    var headerColor = this.props.data.themeColor;
    var headerStyle = { "backgroundColor": headerColor };
    return (
      <div className="site-header" style={ headerStyle }>
        <div className="site-title">
          <a href="http://khou22.github.io/school/east-asian-relations/" className="site-title-link">
            <h1>East Asian Relations</h1>
          </a>
        </div>

        <div className="main-menu">
          <a href="?c=ov" className="nav-link">Overview</a>
          <a href="?c=cn" className="nav-link">China</a>
          <a href="?c=jp" className="nav-link">Japan</a>
          <a href="?c=nk" className="nav-link">North Korea</a>
          <a href="?c=sk" className="nav-link">South Korea</a>
          <a href="http://khou22.github.io/school/east-asian-relations/sources" className="nav-link">Sources</a>
        </div>
      </div>
    )
  }
})

var WelcomeSection = React.createClass({
  render: function() {
    var countryName = this.props.data.countryName;
    var countrySlogan = this.props.data.countrySlogan;
    var backgroundStyle = { "backgroundImage": "url(../media/" + this.props.data.welcomeBackground + ")"}
    return (
      <span>
        <div className="ea-welcome" style={backgroundStyle}>
          <div className="ea-welcome-content">
            <h1 className="ea-welcome-header">{ countryName }</h1>
            <h3 className="ea-welcome-subheader"><i>{ countrySlogan }</i></h3>
          </div>
        </div>
        <div className="ea-welcome-filler"></div>
      </span>
    )
  }
})

React.render(
  React.createElement(EastAsianRelations, null),
  document.getElementById('content')
);
