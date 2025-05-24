
db:
	docker build \
		--secret id=env_file,src=.env \
		-t zisk-couchdb \
		-f docker/database/Dockerfile \
		docker/database

.PHONY: db
