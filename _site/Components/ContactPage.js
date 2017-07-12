var ContactPage = React.createClass({
  getInitialState: function() {
    return {
      contactMethods: [
        {
          label: "Email me",
          link: "mailto:kevin.ch.hou@gmail.com",
          iconPath: "../../../media/site/icons/email_bw.png"
        },
        {
          label: "Connect on LinkedIn",
          link: "https://www.linkedin.com/in/kevinhou22",
          iconPath: "../../../media/site/icons/logos/LinkedIn_bw.png"
        }
      ]
    }
  },
  render: function() {
    return (
      <div>
        <div className="contact-header">
          <h1 className="contact-header-title">
              Let's <span className="contact-header-title-fill-in font-handwritten">create</span> together.
          </h1>
          <h3 className="contact-header-subtitle">Project idea? Suggestion? Feedback? Let me know</h3>
        </div>
        <br />
        <div className="contact-info">
          <div className="contact-info-left">
            <ContactInfo contactMethods={this.state.contactMethods[0]} />
          </div>
          <div className="contact-info-right">
            <ContactInfo contactMethods={this.state.contactMethods[1]} />
          </div>
        </div>
      </div>
    );
  }
})

var ContactInfo = React.createClass({
  render: function() {
    var backgroundURL = this.props.contactMethods.iconPath;
    var label = this.props.contactMethods.label;
    var link = this.props.contactMethods.link;
    iconStyle = { "backgroundImage": "url(" + backgroundURL + ")" }
    return (
      <a href={link}>
        <div className="contact-info-block">
          <div className="contact-icon" style={iconStyle}>
          </div>
          <div className="contact-details">
            { label }
          </div>
        </div>
      </a>
    );
  }
})

React.render(
  React.createElement(ContactPage, null),
  document.getElementById('content')
);
