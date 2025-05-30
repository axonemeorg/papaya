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
		-v zisk-couchdb-data:/opt/couchdb/data \
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
		--env-file .env \
		-p 9475:9475 \
		zisk-web

web-stop:
	docker stop zisk-web || true

web-clean: web-stop
	docker rm zisk-web || true
	docker image rm zisk-web || true

web: web-build web-run

# View logs
logs-db:
	docker logs -f zisk-couchdb

logs-web:
	docker logs -f zisk-web

# Clean
clean: web-clean db-clean
	docker volume rm zisk-couchdb-data || true

.PHONY: \
	db-build db-run db db-stop db-clean \
	web-build web-run web web-stop web-clean \
	logs-db logs-web clean
