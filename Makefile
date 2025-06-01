# Database
db-build:
	DOCKER_BUILDKIT=1 docker build \
		--secret id=env_file,src=.env \
		-t zisk-couchdb \
		-f packaging/database/database.Dockerfile \
		packaging/database

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
app-build:
	DOCKER_BUILDKIT=1 docker build \
		--secret id=env_file,src=.env \
		-t zisk-app \
		-f packaging/app/app.Dockerfile \
		.

app-run:
	docker run \
		-d \
		--name zisk-app \
		--env-file .env \
		-p 9475:9475 \
		zisk-app

app-stop:
	docker stop zisk-app || true

app-clean: app-stop
	docker rm zisk-app || true
	docker image rm zisk-app || true

app: app-build app-run

# View logs
logs-db:
	docker logs -f zisk-couchdb

logs-app:
	docker logs -f zisk-app

# Clean
clean: app-clean db-clean
	docker volume rm zisk-couchdb-data || true

.PHONY: \
	db-build db-run db db-stop db-clean \
	app-build app-run app app-stop app-clean \
	logs-db logs-app clean
