# user-management-api

Node.js app with MVC architecture implementing a RESTful API for user management. Features include user registration, authentication, role management, and boss changes. Uses Express, Mongoose, and JWT.

## Setup

To run this project with Docker Compose, follow these steps:

1. Make sure Docker and Docker Compose are installed on your machine.
2. Clone the repository to your local machine.
3. Navigate to the project directory in your terminal.
4. Create a **`.env`** file with environment variables needed for the project. For example:

```
PORT = 3000
MONGODB_URI = ""
JWT_SECRET = ""
```

5. Run the following command to start the containers:

```
docker-compose up
```

6. Once the containers are up and running, you should be able to access the application at **`http://localhost:3000`** in your web browser.

## Documentation

[API Documentation](DOC.md)
