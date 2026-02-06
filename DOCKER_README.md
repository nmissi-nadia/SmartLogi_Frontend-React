# SmartLogi Frontend - Docker Deployment

## 🐳 Quick Start

### Development Mode
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

## 🚀 Docker Deployment avec Backend Existant

### Prérequis
Votre backend SmartLogi doit être en cours d'exécution sur le port **8084**.

### Option 1: Build et Run (Recommandé)

```bash
# Build l'image
docker build -t smartlogi-frontend:latest .

# Run le conteneur
docker run -d \
  -p 3000:80 \
  --name smartlogi-frontend \
  --add-host=host.docker.internal:host-gateway \
  -e VITE_API_URL=http://host.docker.internal:8084/api \
  smartlogi-frontend:latest
```

### Option 2: Docker Compose

```bash
# Démarrer le frontend
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

### Option 3: Frontend seul (sans compose)

```bash
docker-compose -f docker-compose.frontend-only.yml up -d
```

## ⚙️ Configuration Backend

### Si le backend est sur localhost (même machine)
```bash
# Utiliser host.docker.internal
VITE_API_URL=http://host.docker.internal:8084/api
```

### Si le backend est dans un autre conteneur Docker
```bash
# Utiliser le nom du conteneur backend
VITE_API_URL=http://nom-conteneur-backend:8084/api
```

Puis ajoutez le réseau dans `docker-compose.yml`:
```yaml
services:
  frontend:
    # ...
    networks:
      - nom-du-reseau-backend

networks:
  nom-du-reseau-backend:
    external: true
```

### Si le backend est sur un serveur distant
```bash
VITE_API_URL=https://api.votredomaine.com/api
```

## 📦 Build Optimization

Le Dockerfile utilise multi-stage builds:
- **Stage 1 (Builder)**: Installe les dépendances et build l'app
- **Stage 2 (Production)**: Sert les fichiers statiques avec nginx

**Avantages:**
- ✅ Image finale: ~25MB (vs ~1GB)
- ✅ Pas de code source en production
- ✅ Déploiements rapides

## 🔧 Nginx Configuration

Le `nginx.conf` inclut:
- ✅ SPA routing (toutes les routes servent `index.html`)
- ✅ Gzip compression
- ✅ Cache des assets statiques (1 an)
- ✅ Security headers
- ✅ Health check endpoint (`/health`)

## 🏗️ Architecture

```
┌─────────────────────┐
│   Frontend          │
│  (Docker Container) │
│   nginx:alpine      │
│   Port: 3000        │
└──────────┬──────────┘
           │
           │ HTTP via host.docker.internal
           │
┌──────────▼──────────┐
│   Backend           │
│  (Docker Container) │
│   Spring Boot       │
│   Port: 8084        │
└─────────────────────┘
```

## 🔍 Health Check

Vérifier que le frontend fonctionne:
```bash
curl http://localhost:3000/health
```

Réponse attendue: `healthy`

## 🛠️ Commandes Utiles

### Voir les logs
```bash
docker logs -f smartlogi-frontend
```

### Rebuild sans cache
```bash
docker build --no-cache -t smartlogi-frontend:latest .
```

### Accéder au conteneur
```bash
docker exec -it smartlogi-frontend sh
```

### Supprimer le conteneur
```bash
docker stop smartlogi-frontend
docker rm smartlogi-frontend
```

### Supprimer l'image
```bash
docker rmi smartlogi-frontend:latest
```

## 🐛 Troubleshooting

### Le frontend ne peut pas se connecter au backend

**Problème:** Erreur CORS ou connexion refusée

**Solutions:**
1. Vérifiez que le backend est bien sur le port 8084:
   ```bash
   curl http://localhost:8084/api/health
   ```

2. Vérifiez la configuration CORS du backend (doit autoriser `http://localhost:3000`)

3. Sur Windows, utilisez `host.docker.internal` au lieu de `localhost`

4. Vérifiez les logs du conteneur:
   ```bash
   docker logs smartlogi-frontend
   ```

### Le conteneur ne démarre pas

```bash
# Voir les logs d'erreur
docker logs smartlogi-frontend

# Vérifier que le port 3000 n'est pas déjà utilisé
netstat -ano | findstr :3000
```

### Rebuild complet

```bash
# Supprimer tout et recommencer
docker-compose down --rmi all --volumes
docker-compose up -d --build
```

## 📝 Notes Importantes

- Le frontend est servi par nginx sur le port 80 (mappé au port 3000 sur l'hôte)
- Le backend doit être accessible à l'URL spécifiée dans `VITE_API_URL`
- Les variables d'environnement `VITE_*` sont compilées au moment du build
- Pour changer l'URL de l'API, vous devez rebuild l'image

## 🚀 Déploiement Production

Pour la production, créez un `.env.production`:

```env
VITE_API_URL=https://api.production.com/api
```

Puis build avec:
```bash
docker build --build-arg ENV_FILE=.env.production -t smartlogi-frontend:prod .
```
