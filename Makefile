.PHONY dev docker

dev:
	docker container run --rm -ti -p 4567:4567 -w /root/projects/dfi -v $(shell pwd):/root/projects/dfi middleman /bin/bash

docker:
	docker build -t middleman .