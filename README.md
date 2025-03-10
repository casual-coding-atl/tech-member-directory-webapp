# Tech-Member-Directory-Webapp

## What are we building?

This repository contains node/js/ejs code for the Member Profile Website of the Casual Coding Group. The webapp has been deployed in digitalocean and can be found at  https://casual-app-sa242.ondigitalocean.app/. It is for use by Casual Coding members and provides a forum for collaboration on individual member coding projects and app development. Members are able to record and share information on:

* Details of member app projects, started or in progress. See the project card and project table webpages of the webapp.

* For experienced coders, contact information, summary of coding skills (front end, backend, full stack, etc.) and time availability of experienced coders, to mentor novice developers and complete coding tasks.

* Basic contact information provided by novice developers, interested in learning specific coding skills, or building experience.

The Casual Coding webapp, itself, facilitates collaboration by members. It is a work-in-progress and allows experienced coders and novice coders to actively collaborate in its development. Coding tasks for the project can be found at: 

https://github.com/orgs/casual-coding-atl/projects/

Members interested in participating in this project will be assigned coding tasks from this list.

## App Development Process

Developers wishing to contribute to development of the webapp need to work from the task list in the Projects folder for the account holding the repository: https://github.com/orgs/casual-coding-atl/projects. 

Experienced coders can select a task and get it assigned. Novice coders will need to team with an experienced coder as a mentor and work under the supervision of the mentor coder. 

This section of Readme.md covers basic process to setup a development environment to work on the app. Use of Docker images/containers are essential to working on app tasks, on your laptop.

The App uses [NPM](https://www.npmjs.com/) Node Package Manager to manage it's dependencies and packages.

Developers should clone the repository and load the folder into Visual Studio Code. Install the Docker extension of VS Code. You will build the Docker app image and containers in VS Code.

Acquire a copy of the repository by cloning the main branch, use ```git clone -b main [git url]```.

From the root directory run ```npm install``` to install all of the node dependencies.

Remember to create a .env file and add ```node_modules``` along with any other values you might need.

For the app to handle images for the projects loaded in the Mongo Database, install the multer package, using npm i multer.

### Local Development with Docker

To work on development tasks for the app, on your local machine, we encourage you to install docker and use entire development environment inside **containers** using Docker.  

### What Are Containers, and Why Use Them?  

Containers are lightweight, isolated environments that package everything your application needs to run—including code, dependencies, and configuration.  

**Benefits of using containers:**  
- **Consistency:** Ensures the app runs the same way on all systems, avoiding "it works on my machine" issues.  
- **Simplicity:** No need to manually install Node.js, MongoDB, or other dependencies on your machine.  
- **Easy Cleanup:** Containers can be stopped and removed without leaving behind system-wide changes.  

---

### Getting Started with Docker  

#### 1. Install Docker  
- The easiest way is to install **Docker Desktop**, which includes Docker Compose.  
- Alternatively, install Docker Engine and `docker-compose` separately.  

#### 2. (Optional) Install the VS Code Docker Extension  
- If you're using VS Code, this extension helps manage containers and images.  

#### 3. Run the Development Environment  
1. Follow the instructions in `docker-compose-local.yaml` to start and stop all containerized services.  
2. Once running:  
   - The Express server and MongoDB database will be containerized.  
   - Logs from both services will appear in the same terminal.  

#### 4. Stopping and Cleaning Up  
- To stop the containers:  
  ```sh
  docker-compose -f docker-compose-local.yaml down
  ```


### Docker Troubleshooting
If you think your code and configuration is correct, but the app or Mongo isn't working correctly, try one of the following: 
1. Run the following to rebuild Docker layers:
```
docker-compose -f docker-compose-local.yaml up --build
```
2. Reset the environment volumes:
```
docker compose -f docker-compose-local.yaml down -v
docker compose -f docker-compose-local.yaml up
```


## Tech Stack

mongoose: https://mongoosejs.com
mongodb: https://www.mongodb.com/atlas/database
node.js: http://nodejs.org
express: http://expressjs.com
ejs: http://ejs.com

Authentication is implemented through the use of hashing, salting, Sessions, and Passport.
The website is built using Javascript and has a Mongo database, which stores three attributes for the user: email, project, and percent_done.

### GitHub workflow

- Creator: Create a new issue

- Dev: Pick an issue and assign it to themselves

- Dev: Make a branch named with the issue number and description

- Dev: Make and commit changes

- Dev: Create a pull request (PR)

- Creator: Review PR

- Creator: Request changes

- Dev: Complete requested changes, commit and submit PR

- Creator: Approve changes, request merge

- Dev: Merge PR

- Dev: Delete issue-specific branch

- Creator: Close issue

_Credit for list_ : **puffalo**


## Documentation folder contents in tech-member-directory-webapp repository

This folder is for the developer to review and analyze the routes of the app, and other technical aspects of the code. These are png, pdf and puml files.

## Codespace

To further facilitate work, developers can setup codespace for a repository branch created for by the developer for task completion from the task list. Once created, the codespace for the branch will require the programmer to run docker to launch the app. Reference github help documentation to create the codespace.

## CodeOwner file

To assist project leadership to manage the development process of the app, a Git CodeOwner file has been created to track ownership of the development branches. Again, reference github documentation online for help.
