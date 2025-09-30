// back/server.ts

import express from "express";
import cors from "cors";
import routes from "./src/routes/routes";

const app = express();

app.use(cors());

// Permettre à Express de parser le JSON dans le corps des requêtes
app.use(express.json());

// Permettre à Express de parser les données de formulaires URL-encodées
app.use(express.urlencoded({ extended: true }));

// Routes 
app.use('/api', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré et à l'écoute de http://localhost:${PORT}`);
});
