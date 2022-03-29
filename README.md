# Sample

## Gestion des applications avec pebbleapp

Il est préférable d'utiliser le script pebbleapp pour créer, mettre à jour, lancer et compiler les projets d'applications basés sur Sample.

### Récupérer le script pebbleapp
```shell
sudo wget https://storage.googleapis.com/pebble-public-cdn/pebbleapp -O /usr/local/sbin/pebbleapp && sudo chmod +x /usr/local/sbin/pebbleapp
```
Cette commande est à exécuter une seule fois par poste. Pour mettre à jour le programme, voir pebbleapp upgrade.

**Dernière version de pebbleapp : 1.0.4**

### Créer un nouveau projet d'application

*Version supportée : 1.0.1*

Par convention, on développera les projets d'application dans le dossier /srv/www/apps/<nom_application>

```shell
cd /srv/www/apps
```

Lancez pebbleapp pour créer une nouvelle application basée sur sample.

```shell
pebbleapp create <nom_application>
```

Un nouveau dépôt est initialisé dans le dossier <nom_application>. Par défaut, ce dépôt est local, c'est à dire qu'il n'est lié à aucun serveur sur github. Il sera nécessaire de créer manuellement le dépôt sur github afin de lier au nouveau projet :

```shell
cd <nom_application>
```

```shell
git remote add origin git@github.com:<account_name>/<app_name>.git
```

Vous pouvez contrôler la bonne connexion avec votre dépôt github :

```shell
git remote -v
```

Le résultat doit être le suivant :

```shell
origin git@github.com:<account_name>/<app_name>.git (fetch)
origin git@github.com:<account_name>/<app_name>.git (push)
```

Une fois la connexion établie, il est possible d'envoyer le premier commit sur le dépôt distant.

```shell
git push -u origin main
```

### Mettre à jour les sous modules

*Version supportée : 1.0.4*

L'application utilise des sous-modules distants qui peuvent être mis à jour depuis le dossier de travail :

```shell
cd /srv/www/apps/<nom_application>
```

```shell
pebbleapp update
```

### Lancer le serveur

*Version supportée : 1.0*

```shell
pebbleapp serve
```

### Compiler l'application

*Version supportée : 1.0*

```shell
pebbleapp build
```

### Version de pebbleapp

*Version supportée : 1.0.3*

```shell
pebbleapp version
```

### Mise à jour de pebbleapp

*Version supportée : 1.0.2*

```shell
pebbleapp upgrade
```

### Release logs

| Version | Mise à jour                                          |
|---------|------------------------------------------------------|
| 1.0     | Création initiale de l'application.                  |
| 1.0.1   | Ajout des arguments `version`, `upgrade`                       |
|         | Mise à jour de la documentation en lançant le programme sans argument |
|         | Correction de bug : initialisation de l'historique du dépôt avec l'argument `create` afin de pouvoir connecter un serveur github |
| 1.0.2   | Correction de bug : démultiplication des fichiers avec l'argument `upgrade` |
| 1.0.3   | Correction de bug : argument `version` non fonctionnel |
| 1.0.4   | Correction de bug : update ne prenait pas en compte les branches détachées (detached HEAD) |

## Configuration initiale de l'application

Ouvrir le fichier **src/config.json**.

| Clé de configuration      | Type      | Usage                                                                    | Défaut        |
|---------------------------|-----------|--------------------------------------------------------------------------|---------------|
| `cfg.module`              | String    | Nom du module ou de l'application tel que référencé au niveau du serveur | *sample*      |
| `cfg.moduleLabel`         | String    | Nom du module ou de l'application pour l'affichage                       | *Sample Module* |
| `cfg.aside`               | Boolean   | Affiche ou non la barre latérale des raccourcis                          | *true* |
| `cfg.app_mode`            | String    | *default* : Affichage de l'application avec l'ensemble des éléments d'interface. *standalone* Affichage de l'application avec une interface n'autorisant pas la navigation vers d'autres modules | *default* |
| `cfgMenu.href`            | String    | Lien du menu de configuration du module. Si null, le module n'a pas de vue de configuration | *null* |
| `cfgSlots.menu`           | Boolean   | Affiche l'espace Menu | *true* |
| `cfgSlots.list`           | Boolean   | Affiche l'espace Liste des éléments chargés | *true* |
| `cfgSlots.core`           | Boolean   | Affiche l'espace principal de l'application | *true* |
| `cfgSlots.header`         | Boolean   | Affiche la barre d'outil en en-tête de l'application | *true* |
| `api.baseURL`             | String    | URL de base pour se connecter à l'API | *http://local.fe.tld/api/* |
| `api.elements`            | String    | Nom de l'API de base à utiliser pour lister, afficher et enregistrer les éléments principaux (Ex : *projet*) | *sample* |
| `firebaseConfig`          | Object    | Configuration publique du compte firebase | *null* |

## Paramétrage du serveur local

Pour un développement local optimal, voici les pré-requis indispensables :

- Le serveur contenant l'API doit être sur local.fe.tld
- Le serveur NE DOIT PAS nécessiter un certificat SSL (https désactivé, voir https://github.com/cairnmanagement/docker#d%C3%A9sactiver-le-https-du-serveur-de-production)
- La machine locale doit disposer de git et npm (`sudo apt install git npm`)
