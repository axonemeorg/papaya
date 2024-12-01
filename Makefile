clean:
	docker-compose down -v

db:
	docker-compose up -d

web:
	cd ./web && bun run dev


.PHONY: clean, db, web
