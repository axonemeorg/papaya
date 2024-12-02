clean:
	docker-compose down -v

close:
	docker-compose down

db:
	docker-compose up --build -d

web:
	cd ./web && bun run dev


.PHONY: clean, db, web, close
