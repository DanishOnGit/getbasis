# [Basis App](https://getbasis27.netlify.app)
## Assumptions
* To Sign up, the user clicks Sign up button. If referral code is provided,then the code will be validated first and only then Signup API will be hit!
* The 'source: WEB_APP' key-value pair is hard-coded during Signup
* The 'agreeToPrivacyPolicy: true' is also hard-coded, but, I have included a checkbox for the user during signup.User must agree to privacy policy to proceed signing up!
## Installation

Follow the steps below to setup our React+Redux project:

```
npx create-react-app ./ --template redux
 ```

 ## Working steps:
 * Enter your email to get a verification mail
 * Then enter the token received (6 characters)
 * If you enter the corect token then, two cases emerge:
 
    1)If you are a new user, then you will be redirected to Signup page

2) If you are existing user then you will be logged in directly

* On Signup page the referral code is optional. But if entered, then it should be alphanumeric ! Any incorrect referral code prevents you from signing up !

* Finally, when logged in, you can view your profile or simply Logout.

## Deployment

* Go to [Netlify](https://www.netlify.com/) and login to your account
* Click on `New Site from Git` button
* Here choose your repo you want to host (in our case, it is "getBasis")
* Then simply click on Deploy button with default settings.
* And our site should be hosted now if build succeeds!