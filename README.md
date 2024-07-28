# Url-Shortener

### This documentaion provides details about the Url Shortening and redirection, implemented using Node.js and Express. This API allows you to manage  user SignUp , Login , Forgot Password , Reset Password and Delete calls.And also Create mini Urls of longer one,Updating originalUrl.The shortened Url will redirect you to the longer Url,the one you shortened.

## URL - https://miniurl-noru.onrender.com ##

## Features :-
### bcryptjs - For Password hashing,your data is safe and secure.
### JWT - For Authorization in our website.

### Note: Since I'm deployed the apis in render's free tier, The initial request is taking time, Please wait little longer for initial request


# API Endpoints:-
## For Users -

## Login
### https://miniurl-noru.onrender.com/users/ - POST method<br/>
Description : This method check whether the user with given EmailId and Password exists.If exists means it will allow the users to Login,else not.

## Signup
### https://miniurl-noru.onrender.com/users/Signup - POST method<br/>
Description : This method will allow new users to register if Email Id not registered already.

## Verify User Link -Two step Authentication
### https://miniurl-noru.onrender.com/users/UserVerification - PUT method<br/>
Description : This method will send User verification link to the User Email after which the user can use url shortening service.
This method generates a random string and stores in database for later verification,if the user exists<br/>
             It allows sends email with reset link(Using ***Nodemailer***) for the verified user

## User Verification
### https://miniurl-noru.onrender.com/users/verifyUser/:id/:pin/:token - GET Method<br/>
Description : This method will verify the user credentials,only after the user can use the url shortening service.
 **( id - user Id , pin - randomly generated , token - JWT)**


## Delete User
### https://miniurl-noru.onrender.com/users/delete/:id  - DELETE method<br/>
Description : This method enables users to delete their account  (**give Email as id**)

## Forgot Password
### https://miniurl-noru.onrender.com/users/ForgotPassword - PUT method<br/>
Description : This method generates a random string and stores in database for later verification,if the user exists<br/>
             It allows sends email with reset link(Using ***Nodemailer***) for the verified user

## Reset Password link
### https://miniurl-noru.onrender.com/users/ResetPassword/:id/:pin/:token - GET method<br/>
Description : This method verifies the random string in database and the link are same.Also verifies the **JsonWebToken** for the link validity.
              This link is valid for 5mins which will allow users to reset password only in that stipulated time.<br/>
              **( id - user Id , pin - randomly generated , token - JWT)**

## Reset Password 
### https://miniurl-noru.onrender.com/users/ResetPassword/:id/:pin/:token - PUT method<br/>
Description : After the verification is done in GET method.It will allow users to reset their Pasword and the same will be uploaded in database after deleting the randomly generated string which is used for verification purpose.
 **( id - user Id , pin - randomly generated , token - JWT)**


 # API Endpoints:-
## For Url shortening -

## Create a Short Url
### https://miniurl-noru.onrender.com/CreateMiniUrl - POST method<br/>
Description : This method allows users to get the short Url by providing the Original Url in req.body

## Getting Url created by the Logged in User
### https://miniurl-noru.onrender.com/FetchUrl/:id - GET method<br/>
Description - This will fetch all urls shortened by the Logged in user.
**( id - user Id)**

## Updating Original Url 
### https://miniurl-noru.onrender.com/UpdateUrl/:id - PUT method<br/>
Description: This allow users to update the Original Url for the same mini url that already exists.
**( id - Url Id)**

## Searching for Original Url Globally
### https://miniurl-noru.onrender.com/getMiniUrl - POST method<br/>
Description: This will allow users to get the long urls already shortened by other users or service provider by providing the Original Url in req.body.

## Mini Url Redirection to Original Url
### https://miniurl-noru.onrender.com/:id - GET method<br/>
Description-The short Url direct you to the destination Url.
**( id - Url Id)**

## Delete a Url
### https://miniurl-noru.onrender.com/delete/:id - delete method<br/>
Description: This method will allow users to delete the shortened Url.
**( id - Url Id)**
