
web-build:
	cd papaya-web && npm ci && npm run build

server-assets: web-build
	rm -rf packages/papaya-server/web-assets/*
	cp -r packages/papaya-web/dist/* packages/papaya-server/web-assets/
	@echo "Web assets populated successfully"

# Build server
build-server:
	cd packages/papaya-server && npm ci && npm run build

# Build both client and server
build: web-build server-assets build-server

# Development commands
dev-client:
	cd packages/papaya-web && npm run dev

dev-server:
	cd packages/papaya-server && npm run dev

# Docker commands for production build
docker-build-prod:
	DOCKER_BUILDKIT=1 docker build -t papaya -f docker/Dockerfile.build .

# Docker compose commands for development
docker-dev:
	docker-compose -f docker/docker-compose.dev.yaml up --build

docker-dev-detached:
	docker-compose -f docker/docker-compose.dev.yaml up -d --build

docker-stop:
	docker-compose -f docker/docker-compose.dev.yaml down

docker-clean: docker-stop
	docker-compose -f docker/docker-compose.dev.yaml down -v
	docker system prune -f

# Clean commands
clean-client:
	rm -rf packages/papaya-web/node_modules packages/papaya-web/dist

clean-server:
	rm -rf packages/papaya-server/node_modules packages/papaya-server/dist packages/papaya-server/web-assets/*

clean: clean-client clean-server

# Install dependencies
install:
	cd packages/papaya-web && npm ci
	cd packages/papaya-server && npm ci

.PHONY: \
	build-client populate-web-assets build-server build \
	dev-client dev-server \
	docker-build-prod docker-dev docker-dev-detached docker-stop docker-clean \
	clean-client clean-server clean install
