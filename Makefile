
web-build:
	cd papaya-web && npm ci && npm run build

server-build:
	cd packages/papaya-server && npm ci && npm run build

server-web-assets: web-build
	rm -rf packages/papaya-server/web-assets/*
	cp -r packages/papaya-web/dist/* packages/papaya-server/web-assets/
	@echo "Web assets populated successfully"

# Build both client and server
build: web-build server-build server-web-assets

# Development commands
image:
	DOCKER_BUILDKIT=1 docker build -t papaya -f Dockerfile.build .

image-run: image
	# Uses BuildKit to run the image detached, and pass all secrets from the .env file
	DOCKER_BUILDKIT=1 docker run -d --env-file .env -p 9475:9475 --name papaya papaya

image-stop:	
	docker stop papaya

image-clean: image-stop
	docker rm papaya || true

# Docker compose commands for development
dev:
	docker-compose -f docker/docker-compose.dev.yaml up -d --build

dev-stop:
	docker-compose -f docker/docker-compose.dev.yaml down

dev-clean: dev-stop
	docker-compose -f docker/docker-compose.dev.yaml down -v
	docker system prune -f

# Clean commands
client-clean:
	rm -rf packages/papaya-web/node_modules packages/papaya-web/dist

server-clean:
	rm -rf packages/papaya-server/node_modules packages/papaya-server/dist packages/papaya-server/web-assets/*

clean: client-clean server-clean

# Install dependencies
install:
	cd packages/papaya-web && npm ci
	cd packages/papaya-server && npm ci

.PHONY: \
	web-build server-build server-web-assets \
	image dev dev-stop dev-clean \
	clean client-clean server-clean install
