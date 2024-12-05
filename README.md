<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./web/src/assets/logo/logo-w.svg">
  <img width="250px" alt="Zisk logo" src="./web/src/assets/logo/logo-b.svg">
</picture>

## Database migrations
```
make clean
make generate
make migrate
make seed
make db
```

## Starting the backend
```
make clean
make db
```

## Starting the frontend
```
cd web
bun run dev
```
