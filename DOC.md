# Organization User Structure Management API

This API allows for simple organization user structure management operations. It is based on a server app written in Node.js. The app supports three user roles: Administrator, Boss, and Regular user.

## **Authentication**

To access the API endpoints, users need to authenticate themselves by sending a POST request to the **`/auth/login`** endpoint. The request should include the user's email address and password in the request body in JSON format. The response will contain a JSON Web Token (JWT) that the user can use to access the other endpoints, and an user object.

### **POST /auth/login**

Authenticate a user and generate a JSON Web Token.

### Request

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user2",
    "email": "user@example.com",
    "role": "boss",
    "boss": "user1"
  }
}
```

### **POST /auth/register**

Create a new user.

### Request

```
POST /auth/register
Content-Type: application/json

{
    "email": "bob@example.com",
    "password": "password",
    "role":"role",
    "boss?":"user3"
}
```

### Response

```
HTTP/1.1 201 Created
Content-Type: application/json

{
    "email": "bob@example.com",
    "_id": "user1",
    "role":"role",
    "boss?":"user3"
}
```

## **Users**

### **User Object**

A User object has the following properties:

- **`_id`** (string): The unique identifier for the user.
- **`email`** (string): The user's email address.
- **`role`** (string): The user's role. Possible values are **`admin`**, **`boss`**, and **`regular`**.
- **`boss`** (string): The ID of the user's boss. Only applicable to **`boss`** and **`regular`** roles.

### **GET /users**

Return a list of users.

The response will contain an array of User objects.

### Request

```
GET /users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response

```
HTTP/1.1 200 OK
Content-Type: application/json

"list":[
  {
    "id": "user1",
    "email": "alice@example.com",
    "role": "admin"
  },
  {
    "id": "user2",
    "email": "bob@example.com",
    "role": "boss",
    "boss": "user1"
  },
  {
    "id": "user3",
    "email": "charlie@example.com",
    "role": "regular",
    "boss": "user2"
  }
]

```

### **PATCH /users/:id/boss**

Change a user's boss.

Only a Boss and Admin can change the boss of one of her subordinates.

### Request

```
PATCH /users/user3/boss
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "boss": "user9"
}

```

### Response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "user3",
  "email": "charlie@example.com",
  "role": "regular",
  "boss": "user9"
}

```

## **Error Responses**

The API will return an error response if something goes wrong. The response will have a JSON body with an **`error`** property containing a human-readable error message.

### **Example Error Response**

```
HTTP/1.1 401
Content-Type: application/json

{
  "error": "This Email already in use"
}

```
