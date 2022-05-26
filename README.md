## CRM - Backend

### auth routes

### [POST] /api/v1/auth/signup

- register a new user - required fields [name, userId, password, email, userType]

### [POST] /api/v1/auth/signin

- validate the userId and password and return a token

###########################################################################

### user routes

### [GET] /api/v1/users

- fetch list of all users only admin can access this feature
- admin can filter based on
  - name
  - userType
  - userStatus

### [GET] /api/v1/users/:userId

- fetch the user info using the userId
- only admin is allowed to access this method

### [PUT] /api/v1/users/:userId

- update a specific user
- only admin is allowed to access this method
- name, userType, newUserId, userStatus can be updated

###########################################################################

### ticket routes

### [POST] /api/v1/tickets

- create a new ticket - required fields [title, description, priority]
- TODO
  - create a middleware for this route
  - extend feature -> if an engineer is not available for ticket allotment

### [GET] /api/v1/tickets

- get all the tickets
  - admin should get the list of all the tickets
  - customer gets a list of all the tickets created by him/her
  - engineer gets a list of all the tickets created and assigned to him/her
- query filters available status [OPEN, CLOSED, IN_PROGRESS]

### [GET] /api/v1/tickets/:id

- get a specific ticket

### [PATCH] /api/v1/tickets/:id

-
