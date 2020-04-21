# Task-Manager-API
This API was built using node.js, express, mongodb and mongoose.

### This App support:
* Sign-up
* Login - Logout.
* Authentication.
* File uploading.
* Sending E-mails.
* Deleting user account.
* Adding, deleting, reading and fetching tasks.
* Sorting Tasks depending on time created or whether they are completed or not.


### API endpoits:

>POST   /users 

>POST   /users/login

>POST   /users/logout

>POST   /users/logoutAll/

>GET    /users/me

>PATCH  /users/me

>DEL    /users/me

>POST  /users/me/avatar

>GET   /users/me/avatar

>DEL   /users/me/avatar

>POST  /tasks

>GET   /tasks

>GET   /tasks/:id

>PATCH /tasks/:id

>DEL   /tasks/:id
