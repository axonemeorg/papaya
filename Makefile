# Database
db-build:
	DOCKER_BUILDKIT=1 docker build \
		--secret id=env_file,src=.env \
		-t zisk-couchdb \
		-f docker/database/database.Dockerfile \
		docker/database

db-run:
	docker run \
		-d \
		--name zisk-couchdb \
		-p 5984:5984 \
		zisk-couchdb

db-stop:
	docker stop zisk-couchdb || true

db-clean: db-stop
	docker rm zisk-couchdb || true
	docker image rm zisk-couchdb || true

db: db-build db-run

# Web Server
web-build:
	DOCKER_BUILDKIT=1 docker build \
		--secret id=env_file,src=.env \
		-t zisk-web \
		-f docker/web/web.Dockerfile \
		.

web-run:
	docker run \
		-d \
		--name zisk-web \
		-p 9475:9475 \
		zisk-web

web-stop:
	docker stop zisk-web || true

web-clean: web-stop
	docker rm zisk-web || true
	docker image rm zisk-web || true

web: web-build web-run

# Clean
clean: db-clean web-clean

.PHONY: \
	db-build db-run db db-stop db-clean \
	web-build web-run web web-stop web-clean \
	clean
