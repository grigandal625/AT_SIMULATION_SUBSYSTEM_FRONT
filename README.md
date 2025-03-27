# Build in docker

Dockerfile: [Dockerfile](./Dockerfile)

## `.env` variables

Before build, you can complete `.env` file with:

```bash
PORT=5000 # REQUIRED - port of frontend server
API_PROTOCOL=http # backend api protocol (not required, default: http)
API_HOST=localhost # backend api host (not required, default: page location host)
API_PORT=8888 # backend api port (not required, default: page location port)
```

## Build

Building into image with name `grigandal625/at-simulation-subsystem-front:latest`:

```bash
docker buildx build -t "grigandal625/at-simulation-subsystem-front:latest" .
```
or
```bash
make build
```

## Run

Running container of built image on port `5000`:

```bash
docker run --name at-simulation-subsystem-front -d -p 5555:5555 --env-file .env grigandal625/at-simulation-subsystem-front:latest 
```
or

```bash
make start
```

## Stop

Stopping container:

```bash
if docker kill at-simulation-subsystem-front; then echo "killed"; fi
if docker container rm at-simulation-subsystem-front; then echo "removed"; fi
```

or

```bash
make stop
```

# Development: Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

#### Complete `.env` file

```ini
REACT_APP_API_PROTOCOL=http # backend api protocol
REACT_APP_API_HOST=localhost # backend api host
REACT_APP_API_PORT=8888 # backend api port
REACT_APP_MOCKING=true # use mock data instead api requests
```
#### Build

Command `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.