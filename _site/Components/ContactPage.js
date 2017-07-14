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
    getInitialState: function() {
        return {
            data: { email: "", subject: "", body: "" }
        }
    },

    // On input change
    formChange: function(event) {
        const target = event.target.id;
        const data = this.state.data; // Get current data
        data[target] = event.target.value; // Update property
        this.setState({ data: data }); // Update local state
        // console.log(`Updating ${target} to: ${event.target.value}`);
    },

    // On form submit
    submitForm: function(event) {
        event.preventDefault(); // Prevent reload
        console.log('Submitting form');
    },

    render: function() {
        return (
            <form className="contact-form">
                <input type="text" placeholder="Your email address" className="contact-form-email" id="email" value={this.state.data.email} onChange={this.formChange} />
                <input type="text" placeholder="Subject" className="contact-form-subject" id="subject" value={this.state.data.subject} onChange={this.formChange} />
                <textarea placeholder="Leave a note" className="contact-form-body" id="body" value={this.state.data.body} onChange={this.formChange} />
                <input type="submit" className="contact-form-submit" onClick={this.submitForm}/>
            </form>
        );
    }
})

React.render(
  React.createElement(ContactPage, null),
  document.getElementById('content')
);
