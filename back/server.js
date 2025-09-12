const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());

// Permettre à Express de parser le JSON dans le corps des requêtes
app.use(express.json());

// Permettre à Express de parser les données de formulaires URL-encodées
app.use(express.urlencoded({ extended: true }));


// === Routes ===
// Route principale pour tester si le serveur fonctionne
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur mon API !' });
});

app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré et à l'écoute sur le port ${PORT}`);
});
