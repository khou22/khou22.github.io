var ContactPage = React.createClass({

    componentDidMount: function() {
        // TheaterJS typing effect
        var theater = theaterJS({ local: 'fr' })
        theater.addActor('action-text', { speed: 1.0, accuracy: 0.8 });
        const actions = ['build', 'develop', 'startup']; // Actions to type into blank
        for (let i = 0; i < actions.length; i++) {
            theater.addScene('action-text:' + actions[i], 1000);
        }
        theater.addScene(theater.replay.bind(theater));
    },

  render: function() {
    return (
      <div>
        <div className="contact-header">
            <div className="contact-header-image" />
          <h1 className="contact-header-title">
              Let's <div className="contact-header-title-fill-in">&#160;<span id="action-text" className="font-handwritten">create</span>&#160;</div> together.
          </h1>
        </div>
        <br />
        <div className="contact-left-half">
            <ContactForm />
        </div>
        <div className="contact-right-half">
            <div className="contact-tile">
                <img className="contact-tile-icon" src="../media/site/icons/iphone_icon.png" />
                <br />
                iOS Development
            </div>
            <div className="contact-tile">
                <img className="contact-tile-icon" src="../media/site/icons/web_icon.png" />
                <br />
                Websites & Dynamic<br />
                Web Apps
            </div>
            <div className="contact-tile">
                <img className="contact-tile-icon" src="../media/site/icons/design_icon.png" />
                <br />
                UI/UX Design
            </div>
            <div className="contact-tile">
                <img className="contact-tile-icon" src="../media/site/icons/photography_icon.png" />
                <br />
                Photography
            </div>
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

    emailValidity(email) {
        if (email === '') return true;
        // Email regex: https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email);
    },

    // On form submit
    submitForm: function(event) {
        event.preventDefault(); // Prevent reload

        let validEntry = true;

        if (!this.emailValidity(this.state.data.email)) {
            validEntry = false;
            alert('Please enter a valid email');
        }

        if (this.state.data.email == "") {
            validEntry = false;
            alert('Please fill out the email field');
        } else if (this.state.data.subject == "") {
            validEntry = false;
            alert('Please fill out the subject field');
        } else if (this.state.data.body == "") {
            validEntry = false;
            alert('Please fill out the body of the email');
        }

        if (validEntry) {
            $.post("https://khou22.herokuapp.com/api/khou22/contact",
            // $.post("http://localhost:5000/api/khou22/contact",
            {
                email: this.state.data.email,
                subject: this.state.data.subject,
                body: this.state.data.body
            },
            function(data, status) {
                console.log("Data: " + data + "\nStatus: " + status);
                if (status == 'success') {
                    alert('Thank you for reaching out! I will be in touch shortly.');
                } else {
                    alert('Email failed. If the problem persists, please contact me via LinkedIn.');
                }
            });
        }
    },

    render: function() {
        const emailValidityClass = !this.emailValidity(this.state.data.email) ? 'contact-form-invalid' : '';
        return (
            <form className="contact-form">
                <input type="text" placeholder="Your email address" className={`contact-form-email ${emailValidityClass}`} id="email" value={this.state.data.email} onChange={this.formChange} />
                <input type="text" placeholder="Subject" className="contact-form-subject" id="subject" value={this.state.data.subject} onChange={this.formChange} />
                <textarea placeholder="Leave a note" className="contact-form-body" id="body" value={this.state.data.body} onChange={this.formChange} />
                <input type="submit" className="contact-form-submit" onClick={this.submitForm} />
            </form>
        );
    }
})

React.render(
  React.createElement(ContactPage, null),
  document.getElementById('content')
);
