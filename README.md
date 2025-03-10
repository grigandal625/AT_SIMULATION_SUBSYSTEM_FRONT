# Build in docker

Dockerfile: [Dockerfile](./Dockerfile)

## `.env` variables

Before build, you can complete `.env` file with:

```bash
REACT_APP_API_PROTOCOL=http # backend api protocol
REACT_APP_API_HOST=localhost # backend api host
REACT_APP_API_PORT=8888 # backend api port
REACT_APP_MOCKING=true # use mock data instead api requests
```

## Build

Building into image with name `ailab/at-sim-front:alpha`:

```bash
docker buildx build -t "ailab/at-sim-front:alpha" .
```
or
```bash
make build
```

## Run

Running container of built image on port `5000`:

```bash
docker run --name at-sim -d -p 5000:5000 ailab/at-sim-front:alpha 
```
or

```bash
make start
```

To change port - modify it in [docker/nginx.conf](docker/nginx.conf) and rebuild docker image

## Stop

Stopping container:

```bash
if docker kill at-sim; then echo "killed"; fi
if docker container rm at-sim; then echo "removed"; fi
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