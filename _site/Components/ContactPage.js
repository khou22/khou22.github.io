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
            <div className="contact-header-image" />
          <h1 className="contact-header-title">
              Let's <div className="contact-header-title-fill-in font-handwritten">create</div> together.
          </h1>
        </div>
        <br />
        <div className="contact-left-half">
            <ContactForm />
        </div>
      </div>
    );
  }
})

var ContactForm = React.createClass({
  render: function() {
    return (
        <form className="contact-form">
            <input type="text" placeholder="Your email address" className="contact-form-email" />
            <input type="text" placeholder="Subject" className="contact-form-subject" />
            <textarea placeholder="Leave a note" className="contact-form-body" />
        </form>
    );
  }
})

React.render(
  React.createElement(ContactPage, null),
  document.getElementById('content')
);
