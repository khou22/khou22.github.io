---
layout: post
title: "Getting Started with Login Sessions: Express, Client Sessions, and React"
author: "Kevin Hou"
date: 2017-08-29 21:33:04
description: "A tutorial on how to set up your own web app with login authentication, cookies, and sessions using Node and Express."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: web
tags: []
featured: "yes"
---
## Introduction

### What is a cookie?
A cookie is a piece of data attached to the header of an Internet request. It's the browsers way of storing data about a website. A site might use cookies to track what's in your shopping cart, when your last visit was, or who's logged in to your site which is what we will be covering in this blog post.

### How does it work?
In short, the user logs in and sends their username and password to an API endpoint on the server. If authenticated, the server will send back and set a cookie with the session on the browser (ie. client). Until the cookie expires, all communication between the client and the server will include a cookie, or encrypted string, that can be used for authentiction, sessions, etc.

### My Stack
I'm running an ES6, React-Redux-Router client web app compiled with Webpack and served by my server. My server is an Express, Typescript, Webpack, NodeJS app connected to a Postgres database and Sequelize as my database API interface. My entire setup runs on Heroku.

## Server-Side

### Middleware: Enabling Cookies
We must first setup the infrastructure for cookies using `client-sessions`. This involves using middleware to both configure and "enable" cookies. We use create a middleware with the specified configuration:

``` javascript
app.use(sessions({
	cookieName: 'session', // cookie name dictates the key name added to the request object
	secret: 'somecrazykeythatyoushouldkeephidden', // store in environment variables
	duration: 60 * 60 * 1000, // how long the session will stay valid in ms
	activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));
```

The `secret` key should be kept secret for security reasons. This serves as the encryption method for the cookie contents. Because a cookie is just a string attached to a header, it can be theoretically available to the public; however, you don't want your user or curious browsers to see what you are setting as it could contain sensitive information. It often contains email addresses, authentication tokens, and if the developer really has no sense of security, passwords.

In order to keep all this information confidential, we use a long string as our key and perform an LFSR (Linear Feedback Shift Register) — an effective type of encryption. Because the key is stored on the server (keep it as an `process.env` variable if your code is open-source), the server can decrypt it as well. If you are curious about LFSR, feel free to check out a [version I wrote](https://github.com/khou22/Coding-Techniques-and-Algorithms/blob/master/Linear%20Feedback%20Shift%20Register.py) in python.

### Restricting access based on cookies
Once a cookie is set, you can easily use this cookie to restrict access to various parts of your app. `client-sessions` handles the decryption so the cooke simply becomes another variable that you can read in that is attached to the `request` variable in `Express`. Instead of adding logic to every individual route or controller, I added my authentication logic to my middleware like so:

``` javascript
app.use((req, res, next) => {
    // APIs that client must be logged in for
    // Best practice: APIs that are accessible via the client but require a login
    // APIs are already protected by a Basic Auth, this is just a safegaurd
    const blacklisted = [
        '\/api\/users\/create',
    ]
    const path = req.originalUrl;
    if (!req.session.user) {
        console.log('No session');
        if (new RegExp(blacklisted.join('|'), 'i').test(path)) { // If on the blacklist
            res.status(401).send('Please log in');
        } else { // Allowed
            next();
        }
    } else {
        next();
    }
});
```

Because I already encrypt my server and client with [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication), I did not need to have restricted access on every part of my app. I instead created a blacklist of url regexes that require authentication. If a request is made to that URL or set of URLs, the request will be cut short and a 401 unauthorized response will be returned telling the user/client ot log in.

## Client-Side

### Logging In
In order to set a cookie on the client-side, we need a `/api/login` endpoint that checks against a database of users and sets a cookie. I'm using `Sequelize` so the database management is fairly straightforward. My login route hits this function below:

``` javascript
export const login = (req: Request, res: express.Response) => {
    const data = req.body; // Takes in values in the body
    if (data.username === undefined || data.password === undefined) { // Empty authentication
        res.status(200).send({
            success: false,
            error: 'Please submit a username and password',
        });
        return; // Terminate
    }
    return User // Sequelize - perform a lookup in the database
        .findOne({
            where: {
                username: data.username,
                password: data.password,
            }
        })
        .then((user: User) => {
            if (user == null) { // No user — Invalid credentials
                res.status(200).send({ // Send response
                    success: false,
                    error: 'Invalid username & password',
                });
                return;
            }

            // Valid credentials
            console.log(`Successfully logged in user: ${user.username}`);
            delete user.password; // Don't send back password for security reasons
            req.session.user = user; // Set the cookie

            // Send a message back to the client
            res.status(200).send({
                success: true,
                user, // Send user
            });
        })
        // Error with sequelize
        .catch((error: Error) => {
            console.log(error);
            res.status(400).send({
                success: false,
                error,
            });
        }); // Error in request
}
```

### Set a browser cookie from an API response
Now that we know how to send a cookie back from the server, we must now inject that cookie into the browser so the session can actually be tied to a browser. The `client-session` package automatically sets the appropriate cookie on the response header as `Set-Cookie`. This indicates to the browser to store the response as a cookie. Any response with the property `Set-Cookie`, as seen below, will do just that. 

[Screenshot 'Set-Cookie Response.png']

In order for the client to allow setting a cookie, the `fetch` request must be `same-origin`. This is a security feature that ensures malicious cookies have a harder time. I'm using `whatwg-fetch` and in my fetch request, I set `credentials: 'same-origin'`:

```javascript
return fetch(url, {
	method: 'POST',
   	headers: {
   		Accept: 'application/json',
	   	"Content-Type": "application/json"
    },
    credentials: 'same-origin', // Will set cookie 'set-cookie' only if this is set to 'same-origin'
}
```

In this situtation, there was a successful login from the login page that sent back a cookie. The browser set this cookie in the header so every request to my domain will include this cookie in the future — at least until it expires. The cookie was encrypted on the server side and can only be decrypted by the server. It also has an expiration date so a user's session will expire.

### Logging Out
Logging out is much more straightforward. It simply involves removing the cookie from the headers — thus reseting the cookie on the client-side.

``` javascript
export const logout = (req: Request, res: express.Response) => {
    const previousUser = req.session.user; // Save the previous user
    req.session.reset(); // Reset the cookies
    
    // Response to client
    res.status(200).send({
        success: false,
        user: previousUser,
    });
}
```

### Getting User Information after Load
Cookies only allow information to be sent back from the server, so we need a seperate method to get information _about_ the user like their name, email, etc. We do this by creating a method that returns unencrypted data about the user based on the session cookie. It's also a helpful API for determining if a user is currently signed in. Here's an example:

``` javascript
export const currentUser = (req: Request, res: express.Response) => {
    if (req.session.user) {
        delete req.session.user.password; // Remove password
        const data = {
            logged_in: true,
            user: req.session.user,
        };
        res.status(200).send(data);
    } else {
        const data = {
            logged_in: false,
        };
        res.status(200).send(data);
    }
}
```

In my React-Redux-Router app, I make this API request on entry so that my local redux state contains information about my user right on load. This allows me to populate sections of my app like a 'Profile' section as well as restricting certain routes.