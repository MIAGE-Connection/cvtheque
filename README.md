# CVTheque de Miage Connection

## Fonctionnalités

- Dépôt de CV
- Consultation de CV avec filtres

## Commands

Créer une base de données en local via docker
```
docker-compose up -d
```

Lancez la stack, à chaque lancement une vérification est faite et les migrations sont lancées si nécessaires.
```
pnpm dev
```

Nuke la db:
```
pnpm db-nuke
```

## Prisma commands

Mise à jour du client prisma
```
pnpm prisma generate
```

Lancement d'une migration en local
```
pnpm prisma migrate dev
```


