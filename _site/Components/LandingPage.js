//Landing page for my website

var LandingPage = React.createClass({
  getInitialState: function() {
    return {
      backgroundURL: [
        "./../media/site/images/backgrounds/Walnut_Poplar_Salad_Bowl.jpg", //Background
      ],
      currentBackground: 0 //Index in array of backgrounds
    };
  },
  nextBackground: function() {
    this.setState({
      currentBackground: this.state.currentBackground++ //Go to next background index
    })
  },
  render: function() {
    var URL = this.state.backgroundURL[this.state.currentBackground];
    var backgroundStyle = {
      backgroundImage: 'url(' + URL + ')'
    };
    return (
      <div>
        <div className="content-area">
          <ProfileBox />
          <ModalBox showModal={false} />
        </div>
        <div className="landing-background" style={backgroundStyle}></div>
      </div>
    );
  }
});

var ProfileBox = React.createClass({
  render: function() {
    return (
      <div>
        <div className="profile-name">
          Kevin Hou
        </div>
        <div className="profile-picture"></div>
        Click <a href="/blog">here</a> for my blog
      </div>
    );
  }
});

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