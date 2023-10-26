# CVTheque de Miage Connection

## Fonctionnalités

- Dépôt de CV
- Consultation de CV avec filtres

## Pré-requis

- [Docker](https://www.docker.com/)
- [pnpm](https://pnpm.io/fr/installation)

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

## Email commands

Pour le développement d'email, la librarie react-email nous permet de tester et visualiser ces derniers facilement.

Une seule commande: ( la première fois est longue le temps de l'installation ).
```
pnpm mail
```


