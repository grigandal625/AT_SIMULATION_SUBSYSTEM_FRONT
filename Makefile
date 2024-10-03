build:
	sudo docker buildx build -t "ailab/at-sim-front:alpha" .
start:
	sudo docker run --name at-sim -d -p 5000:5000 ailab/at-sim-front:alpha 
stop:
	sudo docker kill at-sim