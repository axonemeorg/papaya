clean:
	docker-compose down -v

db:
	docker-compose up -d

generate:
	cd ./web && bun run generate

migrate:
	cd ./web && bun run migrate

seed:
	cd ./web && bun run seed

dev:
	cd ./web && bun run dev

.PHONY: clean, db, dev, generate, migrate, seed
