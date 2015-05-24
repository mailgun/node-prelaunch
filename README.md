<a href="https://node-prelaunch.herokuapp.com"><img src="https://cloud.githubusercontent.com/assets/399776/7552344/e4874bf8-f663-11e4-803b-bff9346f5607.png" width="100%" alt="screenshot"></a>

# node-prelaunch

A prelaunch sign up app, written in node.js, powered by MongoDB & [Mailgun](http://www.mailgun.com/).

Live Demo: [node-prelaunch.herokuapp.com](https://node-prelaunch.herokuapp.com)

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Responsive transactional HTML email templates from [mailgun/transactional-email-templates](https://github.com/mailgun/transactional-email-templates)

Icon from [sketchappsources.com](http://www.sketchappsources.com/free-source/778-flat-rocket-sketch-freebie-resource.html).

HTML/CSS mostly from [twbs/bootstrap](https://github.com/twbs/bootstrap/tree/2084791511182db5cb7c3a2b3d9b35bddabb5eed/docs/examples/cover) cover template.

### System Requirements

- mongodb
- nodejs
- [Mailgun](https://mailgun.com) account

### Getting Started

First update `/server/config/secrets.js` with the following credentials:

- [Mailgun](https://mailgun.com) for sending sign up confirmations and validating email addresses
- google analytics id

Install dependencies:

```
npm install
```

Make sure mongodb is running (`mongod`) then start the node server

```
node server
```

NOTE: In development mode, the confirmation link is not mailed out, it is output to the console logs.


