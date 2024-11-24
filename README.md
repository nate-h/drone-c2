# Drone C2

Drone C2 is a fake drone tracking application I created for fun. As of now it
does not have a backend and pulls data from some local json files. This is mostly
an exercise to mess around with react-leaflet.

My goal for this exercise as of now is to show the drones we have in a fleet
and track their location and status over a configurable time period.

This is built using: react, typescript, sass, react-leaflet, redux.

# TODO: Update this!

## Useful dev commands

```sh
npm start  # Runs the app in the development mode.
npm test  # Launches the test runner in the interactive watch mode.
npm run build  # Builds the app for production to the `build` folder.
```

## Example pic

![Example pic](./example_pic.jpg)

# How to use

Run: `docker-compose up --build`
View Frontend: http://localhost:3000/
Exercise Backend: http://localhost:8080/
Access DB: `psql -h localhost -U postgres -W` - it will prompt for a password - UPDATE!
Stop and remove containers + volumes: `docker compose down -v`

# Lint

go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
golangci-lint run
