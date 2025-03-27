include .env

build:
	sudo docker buildx build -t "grigandal625/at-simulation-subsystem-front:latest" .
start:
	sudo docker run --name at-simulation-subsystem-front -d -p "${PORT}:${PORT}" --env-file .env grigandal625/at-simulation-subsystem-front:latest
stop:
	if sudo docker kill at-simulation-subsystem-front; then echo "killed"; fi
	if sudo docker container rm at-simulation-subsystem-front; then echo "removed"; fi
push:
	sudo docker push grigandal625/at-simulation-subsystem-front:latest