var PortfolioCategory = React.createClass({
  getInitialState: function() {
    return {
      categories: [
        {
          name: "Programming",
          image: "./../media/site/images/code_screenshot.png",
          link: "{{ site.baseurl }}/programming"
        },
        {
          name: "Woodshop",
          image: "./../media/site/images/woodshop_background.png",
          link: "https://www.flickr.com/photos/khou22/albums"
        },
        {
          name: "Design",
          image: "./../media/site/images/design_background.png",
          link: "{{ site.baseurl }}/design"
        },
        {
          name: "Photography",
          image: "./../media/site/images/photography_background.png",
          link: "{{ site.baseurl }}/photography"
        }
      ]
    }
  },
  render: function() {
    var categoryNodes = this.state.categories.map(function(category) {
      return (
        <CategorySection data={category} />
      )
    })
    return (
      <div>
        {categoryNodes}
      </div>
    );
  }
})

var CategorySection = React.createClass({
  getInitialState: function() {
    return {
      hover: false
    }
  },

  // Start hover
  onMouseEnter: function() {
    this.setState({
      hover: true
    })
  },

  // End hover
  onMouseLeave: function() {
    this.setState({
      hover: false
    })
  },

  render: function() {
    var style = {
      backgroundImage: "url(" + this.props.data.image + ")"
    }

    var baseURL = window.location.href;
    var endIndex = baseURL.indexOf("categories");
    baseURL = baseURL.substring(0, endIndex);

    var finalURL = this.props.data.link.replace("{{ site.baseurl }}/", baseURL); // Replace

    var portfolioCategoryClass = "portfolio-category-background";
    var tileTextClass = "portfolio-category-text"

    if (this.state.hover) { // If hovering
      portfolioCategoryClass += " portfolio-category-background-hover"
      tileTextClass += " portfolio-category-text-hover"
    }
    return (
      <a href={finalURL}
          className="portfolio-category-div"
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}>
        <div className={tileTextClass}>{this.props.data.name}</div>
        <div className={portfolioCategoryClass} style={style}></div>
      </a>
    );
  }
})

React.render(
  React.createElement(PortfolioCategory, null),
  document.getElementById('main')
);
