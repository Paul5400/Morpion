# 🎮 Morpion - Application Vue.js

> Projet réalisé dans le cadre du TD4 - Web Client Avancé  
> IUT Charlemagne - Université de Lorraine

##  Équipe

- **Andrieu Paul**
- **Lambert Valentino**
- **Groupe** : DWM-2

---

##  Description du projet

Application web de jeu de Morpion (Tic-Tac-Toe) multijoueur en temps réel, développée avec **Vue.js 3** et utilisant l'API REST fournie par l'IUT. Le projet implémente une architecture SPA (Single Page Application) avec gestion du routing et communication WebSocket pour la synchronisation en temps réel entre joueurs.

###  Fonctionnalités implémentées

####  Exercices 3 à 8 

- **Configuration API** : Instance Axios pré-configurée avec authentification
- **Page d'accueil** : Navigation vers les différentes sections de l'application
- **Gestion du profil** : Modification du nom et de l'email utilisateur
- **Création de partie** : Génération d'un code unique pour inviter un adversaire
- **Rejoindre une partie** : Accès à une partie via son code
- **Vue de jeu** : Affichage de la grille et synchronisation WebSocket
  - Détection de l'arrivée d'un adversaire
  - Actualisation automatique de l'état de la partie
  - Affichage des symboles (X et O) sur la grille

---

##  Technologies utilisées

- **Framework** : Vue.js 3 (Composition API et Options API)
- **Build Tool** : Vite
- **HTTP Client** : Axios
- **Routing** : Vue Router 4
- **WebSockets** : API WebSocket native
- **Linting** : ESLint
- **Langage** : JavaScript (ES6+)

---

##  Structure du projet

```
vue/
├── src/
│   ├── api/
│   │   └── index.js           # Configuration Axios
│   ├── assets/
│   │   └── main.css           # Styles globaux
│   ├── components/
│   │   └── ErrorDisplay.vue   # Composant d'affichage d'erreurs
│   ├── router/
│   │   └── index.js           # Configuration des routes
│   ├── views/
│   │   ├── Home.vue           # Page d'accueil
│   │   ├── Profile.vue        # Gestion du profil
│   │   ├── Join.vue           # Rejoindre une partie
│   │   └── Game.vue           # Vue de la partie
│   ├── App.vue                # Composant racine
│   └── main.js                # Point d'entrée
├── package.json
└── vite.config.js
```

---

##  Installation et lancement

### Prérequis

- **Node.js** : version 20.19.0 ou supérieure
- **npm** : installé avec Node.js

### Installation des dépendances

```bash
cd vue
npm install
```

### Lancement du serveur de développement

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:5173/**

### Build de production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

---

## Configuration de l'API

### Obtenir une clé API

1. Utiliser un client HTTP (Postman, Insomnia, etc.)
2. Effectuer une requête POST sur : `https://morpion-api.edu.netlor.fr/api/apikeys`
3. Body (JSON) :
   ```json
   {
     "name": "Votre nom",
     "email": "votre.email@example.com"
   }
   ```
4. Récupérer la clé dans la réponse

### Configurer la clé dans le projet

Modifier le fichier `src/api/index.js` :

```javascript
headers: {
  'Authorization': 'key=VOTRE_CLE_API'
}
```

>  **Note** : Chaque membre du binôme doit utiliser sa propre clé API pour être identifié distinctement.

---

##  API Endpoints utilisés

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/ping` | Vérifier la disponibilité de l'API |
| `POST` | `/api/apikeys` | Créer une clé API |
| `GET` | `/api/profile` | Récupérer le profil utilisateur |
| `PUT` | `/api/profile` | Mettre à jour le profil |
| `POST` | `/api/games` | Créer une nouvelle partie |
| `PATCH` | `/api/games/:code/join` | Rejoindre une partie |
| `GET` | `/api/games/:id` | Récupérer l'état d'une partie |
| `PATCH` | `/api/games/:id/play/:row/:col` | Jouer un coup *(à implémenter)* |

### WebSocket

- **URL** : `wss://morpion-api.edu.netlor.fr/websockets`
- **Messages** :
  - `opponent-join` : Un adversaire a rejoint la partie
  - `opponent-play` : L'adversaire a joué un coup
  - `opponent-quit` : L'adversaire a quitté la partie

---

## Guide d'utilisation

### 1. Créer une partie

1. Sur la page d'accueil, cliquer sur **"NOUVELLE PARTIE"**
2. Vous êtes redirigé vers la vue de jeu
3. Un code unique est affiché (ex: `1R3G55`)
4. Communiquer ce code à votre adversaire

### 2. Rejoindre une partie

1. Sur la page d'accueil, cliquer sur **"REJOINDRE UNE PARTIE"**
2. Saisir le code reçu de votre adversaire
3. Cliquer sur **"REJOINDRE"**
4. Vous êtes redirigé vers la partie

### 3. Modifier son profil

1. Cliquer sur **"MON PROFIL"**
2. Modifier le nom et/ou l'email
3. Cliquer sur **"ENREGISTRER"**
4. Les erreurs de validation sont affichées si nécessaire

---

## Architecture technique

### Routing

Le projet utilise **Vue Router** avec les routes suivantes :

- `/` → Redirection vers `/home`
- `/home` → Page d'accueil
- `/profile` → Gestion du profil
- `/join` → Rejoindre une partie
- `/games/:id` → Vue de la partie

### Gestion d'état

- Utilisation de l'**Options API** pour les composants
- Hooks de navigation (`beforeRouteEnter`, `beforeUnmount`)
- Gestion locale de l'état dans chaque composant

### Communication temps réel

- **WebSocket** pour la synchronisation entre joueurs
- Connexion établie au chargement de la vue `Game.vue`
- Fermeture automatique lors de la sortie du composant


### Exercice 9 : Jouer une partie complète

- [ ] Implémenter la méthode `play(row, col)` dans `Game.vue`
- [ ] Gérer les clics sur les cellules de la grille
- [ ] Vérifier le tour du joueur avant de jouer
- [ ] Afficher le résultat de la partie (victoire/match nul)
- [ ] Bloquer les interactions en fin de partie

### Exercice 10 : Refactorisation

- [ ] Créer un composant générique `ErrorDisplay.vue`
- [ ] Mutualiser l'affichage des erreurs dans `Profile.vue` et `Join.vue`



##  Ressources

- [Documentation Vue.js 3](https://vuejs.org/)
- [Documentation Vue Router](https://router.vuejs.org/)
- [Documentation Axios](https://axios-http.com/)
- [API Morpion - IUT](https://morpion-api.edu.netlor.fr)


