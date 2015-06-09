<a href="https://node-prelaunch.herokuapp.com"><img src="https://cloud.githubusercontent.com/assets/399776/8070534/d1f74496-0eb6-11e5-81b9-b70627d4340b.png" width="100%" alt="screenshot"></a>

# node-prelaunch

A prelaunch sign up app, written in node.js, powered by MongoDB & [Mailgun](http://www.mailgun.com/).

Live Demo: [node-prelaunch.herokuapp.com](https://node-prelaunch.herokuapp.com)

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Responsive transactional HTML email templates from [mailgun/transactional-email-templates](https://github.com/mailgun/transactional-email-templates)

Icon from [sketchappsources.com](http://www.sketchappsources.com/free-source/778-flat-rocket-sketch-freebie-resource.html).

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

### Prelaunch Sign Up Flow

- A user signs up on the site
- a confirmation email is sent - [image](https://cloud.githubusercontent.com/assets/399776/7790511/1ff89498-0240-11e5-897e-54dc2b7a3a75.png)
- the user receives the email and clicks the confirmation link
- the user is redirected to the site with a unique token and confirmation id
- if the token and id are valid, the user model is updated and a thank you email is sent - [image](https://cloud.githubusercontent.com/assets/399776/7790518/447cf53e-0240-11e5-86f5-5e5928ccd799.png)

### Sending Post Launch Emails

Need to send an update? An example of querying confirmed users and sending emails in batches can be found in [server/email/batch-demo.js](server/email/batch-demo.js). This uses Mailgun's [batch sending](https://documentation.mailgun.com/user_manual.html#batch-sending) feature.

To send the following [campaign update template](server/email/campaign/html.swig), run the following command. PLEAE NOTE: there is no dry run version of this yet, this command will send out emails to any confirmed users in your user collection.

```
node server/email/batch-demo.js
```
The campaign update email uses the [email alert template](https://github.com/mailgun/transactional-email-templates)

![image](https://cloud.githubusercontent.com/assets/399776/7790493/5faf3ff2-023f-11e5-9874-6c34bae5bda6.png)

### Contributing

If you're interested in contributing, please refer to the following project goals before submitting a pr or github issue.

Project Goals

- keep this as a starting point people can fork, redeploy, and persist their database while their app is built out
- make it easy to send email & track changes in email templates since they are checked into codebase
- be responsible for user data in database (not in some third party service), this also includes
    - tracking sign up dates
    - securing confirmations
    - keeping track of confirmations
- use transactional email provider - ex: Mailgun
- avoid creating something that can spam people and ruin email sending reputation for the owner
- use double opt in
- sending batch emails (max 1000 at a time) - ex: Mailgun
- post launch sending capabilities and integration (ex: send password reset codes when app is launched)

### Todo

- add flag to batch command for sending in [testmode](https://documentation.mailgun.com/user_manual.html#sending-in-test-mode)
- use tags to track transactional emails (`signups` vs `commercial` vs `password resets`)
