build:
	sudo docker buildx build -t "ailab/at-sim-front:alpha" .
start:
	sudo docker run -d -p 5000:5000 ailab/at-sim-front:alpha --name at-sim
stop:
	sudo docker kill at-sim