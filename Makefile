# Create Docker network
network-create:
	docker network create zisk-network || true

network-remove:
	docker network rm zisk-network || true

# Database
db-build:
	DOCKER_BUILDKIT=1 docker build \
		-t zisk-couchdb \
		-f packaging/database/database.Dockerfile \
		.

db-run: network-create
	@echo "Running CouchDB container on port 5984..."; \
	docker run \
		-d \
		--name zisk-couchdb \
		--network zisk-network \
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
		-t zisk-app \
		-f packaging/app/app.Dockerfile \
		.

app-run: network-create
	@echo "Running app container on port 9475..."; \
	docker run \
		-d \
		--name zisk-app \
		--network zisk-network \
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
	rm -rf app/node_modules app/client/node_modules app/client/dist app/server/node_modules app/server/dist

.PHONY: \
	db-build db-run db db-stop db-clean \
	app-build app-run app app-stop app-clean \
	logs-db logs-app clean
