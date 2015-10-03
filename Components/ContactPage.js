var ContactPage = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className="contact-header">Contact Me</h1>
        <h3>Got a project idea? Suggestion? Feedback? Let me know</h3>
        <br />
        <div className="contact-main-column">
          <ContactInfo />
        </div>
        <div className="contact-profile-column">
          <ProfilePicture />
        </div>
      </div>
    );
  }
})

var ContactInfo = React.createClass({
  render: function() {
    return (
      <span>
        <h4>Email me at: <a href="mailto:kevin.ch.hou@gmail.com">kevin.ch.hou@gmail.com</a></h4>
        <h4>Message me on <a href="https://www.linkedin.com/in/kevinhou22">LinkedIn</a></h4>
      </span>
    );
  }
})

var ProfilePicture = React.createClass({
  render: function() {
    return (
      <span>
        <img src="../../media/site/images/Profile.jpg" />
      </span>
    );
  }
})

React.render(
  React.createElement(ContactPage, null),
  document.getElementById('content')
);