# Create Docker network
network-create:
	docker network create papaya-network || true

network-remove:
	docker network rm papaya-network || true

# Database
db-build:
	DOCKER_BUILDKIT=1 docker build \
		-t papaya-couchdb \
		-f packaging/database/database.Dockerfile \
		.

db-run: network-create
	@echo "Running CouchDB container on port 5984..."; \
	docker run \
		-d \
		--name papaya-couchdb \
		--network papaya-network \
		-p 5984:5984 \
		-v papaya-couchdb-data:/opt/couchdb/data \
		papaya-couchdb

db-stop:
	docker stop papaya-couchdb || true

db-clean: db-stop
	docker rm papaya-couchdb || true
	docker image rm papaya-couchdb || true

db: db-build db-run

# Web Server
app-build:
	DOCKER_BUILDKIT=1 docker build \
		-t papaya-app \
		-f packaging/app/app.Dockerfile \
		.

app-run: network-create
	@echo "Running app container on port 9475..."; \
	docker run \
		-d \
		--name papaya-app \
		--network papaya-network \
		-p 9475:9475 \
		papaya-app

app-stop:
	docker stop papaya-app || true

app-clean: app-stop
	docker rm papaya-app || true
	docker image rm papaya-app || true

app: app-build app-run

# View logs
logs-db:
	docker logs -f papaya-couchdb

logs-app:
	docker logs -f papaya-app

# Clean
clean: app-clean db-clean network-remove
	docker volume rm papaya-couchdb-data || true

rm:
	rm -rf app/node_modules app/client/node_modules app/client/dist app/server/node_modules app/server/dist

.PHONY: \
	db-build db-run db db-stop db-clean \
	app-build app-run app app-stop app-clean \
	logs-db logs-app clean rm
