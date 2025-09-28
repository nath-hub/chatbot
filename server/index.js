import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// require("dotenv").config();
import express from "express";
import axios from "axios";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

import mysql from "mysql2/promise";

const app = express();
import jwt from "jsonwebtoken";
import path from "path";
import { type } from "os";
const router = express.Router();

const dbConfig = {
  host: process.env.DB_HOST, // L'hôte de la base de données
  user: process.env.DB_USERNAME, // Votre nom d'utilisateur MySQL
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE, // Nom de votre base de données
};

const JWT_SECRET = "YOUR_SECRET_KEY";

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mount API router base path
app.use("/api", router);

// Base de données simple en mémoire (remplacez par une vraie BDD)
let users = [];

// Fonction pour générer un OTP à 6 chiffres
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.warn("OPENAI_API_KEY not set. Using OpenRouter only.");
}

// Configurer nodemailer (exemple avec Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USERNAME_GMAIL,
    pass: process.env.PASSWORD, // mot de passe d’application Gmail
  },
});

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Récupérer le token depuis les en-têtes

  if (!token) {
    return res.status(401).json({ success: false, message: "Token manquant" });
  }

  jwt.verify(token, "YOUR_SECRET_KEY", (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Token invalide" });
    }

    req.user = decoded; // Assurez-vous que les informations de l'utilisateur sont attachées ici
    next();
  });
};

// Route pour servir la page principale
app.get("/api/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

app.post("/api/register", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const userId = uuidv4();
    const { username, email } = req.body;

    if (!username || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Tous les champs sont requis" });
    }

    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    let result;
    let user;
    const otp = generateOTP();

    if (existingUsers.length > 0) {
      await connection.execute(
        "UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?",
        [otp, new Date(Date.now() + 10 * 60000), email]
      );
      result = { insertId: existingUsers[0].id };
      user = existingUsers[0];
    } else {
      const [insertResult] = await connection.execute(
        "INSERT INTO users (id, username, email, otp, otp_expiry, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userId,
          username,
          email,
          otp,
          new Date(Date.now() + 10 * 60000),
          0,
          new Date(),
          new Date(),
        ]
      );
      result = insertResult;
      const [userRows] = await connection.execute(
        "SELECT * FROM users WHERE id = ?",
        [userId]
      );
      user = userRows[0];
    }

     // Créer un abonnement pour l'utilisateur
    const subscriptionId = uuidv4(); // Générer un nouvel ID d'abonnement
    await connection.execute(
      "INSERT INTO subscriber (id, user_id, type_abonnement, mode_paiement, date_debut, date_fin, statut, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        subscriptionId,
        user.id,
        'free',
        'monthly',
        new Date(), 
       new Date(new Date().setMonth(new Date().getMonth() + 1)), // Date de fin
        'active',
        new Date(),
        new Date(),
      ]
    );

    // Si transporter n'est pas configuré correctement, ça peut planter
    await transporter.sendMail({
      from: "no_reply@gmail.com",
      to: email,
      subject: "Votre code de validation",
      html: getEmailTemplate(user.username, otp),
    });

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      token,
      user: { id: result.insertId, username, email },
    });
  } catch (err) {
    console.error("Erreur register:", err);
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: err.message });
  }
});

app.post("/api/verify", async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);

  try {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email et code requis",
    });
  }

  const [users] = await connection.execute(
    "SELECT * FROM users WHERE email = ? AND otp = ?",
    [email, otp]
  );

  if (users.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Code invalide",
    });
  }

  const user = users[0];

  // Vérifier expiration
  if (new Date() > new Date(user.otp_expiry)) {
    return res.status(400).json({
      success: false,
      message: "Code expiré",
    });
  }

  // Activer compte
  await connection.execute(
    "UPDATE users SET is_active = 1, otp = NULL, otp_expiry = NULL, email_verified_at = ?, last_connection_date = ? WHERE email = ?",
    [new Date(), new Date(), email]
  );

 
    // Générer JWT
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "24h" });

  res.json({
    success: true,
    message: "Compte activé",
    id: user.id,
    token,
  });
  } catch (error) {
    console.error("Erreur verify:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  } finally {
    connection.end();
  }
});

const LEGAL_KEYWORDS = [
  "droit",
  "loi",
  "contrat",
  "procès",
  "tribunal",
  "avocat",
  "justice",
  "juridique",
  "litige",
  "code civil",
  "code pénal",
  "constitution",
  "arbitrage",
  "jugement",
  "recours",
];

// ✅ Sauvegarde message
app.post("/api/messages", async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);

  try {
    let { user_id, conversation_id, role, message, metadata } = req.body;

     if (!conversation_id) {
      conversation_id = uuidv4();
    }

    let id = uuidv4();

    if (!user_id || !role || !message) {
      return res
        .status(400)
        .json({ error: "Champs user_id, role et message sont requis" });
    }

    await connection.execute(
      "INSERT INTO chat_messages (id, user_id, conversation_id, role, message, metadata) VALUES (?, ?, ?, ? ,?, ?)",
      [id, user_id, conversation_id, role, message, JSON.stringify(metadata || {})]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/messages", authMiddleware, async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const { user_id } = req.user;

    const [rows] = await connection.execute(
      "SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
      [user_id]
    );
    res.json(rows.reverse()); // pour avoir dans l’ordre chronologique
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await connection.end();
  }
});


app.post("/api/chat", authMiddleware,  async (req, res) => {
   const connection = await mysql.createConnection(dbConfig);
  try {
    const { prompt } = req.body || {};
    const user_id = req.user.id;

    let { conversation_id } = req.body || {};
    if (!conversation_id) {
      conversation_id = uuidv4();
    }

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt manquant" });
    }

    // Vérifier si la question est liée au droit
    const lowerPrompt = prompt.toLowerCase();
    const isLegal = LEGAL_KEYWORDS.some((keyword) =>
      lowerPrompt.includes(keyword)
    );

    if (!isLegal) {
      return res.json({
        reply:
          "⚖️ Je suis un assistant spécialisé en droit. Merci de poser uniquement des questions liées au domaine juridique.",
      });
    }

    // const [lastMessages] = await connection.execute(
    //   "SELECT role, message FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
    //   [user_id]
    // );

    // // Préparer le contexte
    // const messages = [
    //   { role: "system", content: "Tu es un assistant juridique." },
    //   ...lastMessages.reverse(),
    //   { role: "user", content: prompt },
    // ];

    const API_KEY = process.env.OPEN_ROUTER_KEY;
    if (!API_KEY) {
      return res
        .status(500)
        .json({ error: "OPEN_ROUTER_KEY manquant dans l'environnement" });
    }

  
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "x-ai/grok-4-fast:free",
          messages: [
            {
              role: "system",
              content:
                "Tu es un assistant juridique. Réponds uniquement aux questions liées au droit. Si une question sort du domaine du droit, dis poliment que tu ne peux répondre qu’aux questions juridiques.",
            },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

     
    if (!response.ok) {
      const errText = await response.text();
      return res
        .status(502)
        .json({ error: "Echec appel OpenRouter", detail: errText });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "";

      // Sauvegarder le prompt de l’utilisateur
    // await connection.execute(
    //   "INSERT INTO chat_messages (user_id, conversation_id, role, content) VALUES (?, ?, ?, ?)",
    //   [user_id, conversation_id, "user", prompt]
    // );

    // // Sauvegarder la réponse de GPT
    // await connection.execute(
    //   "INSERT INTO chat_messages (user_id, conversation_id, role, content) VALUES (?, ?, ?, ?)",
    //   [user_id, conversation_id, "assistant", reply]
    // );


    if (!reply) {
      return res.status(502).json({ error: "Réponse vide d'OpenRouter" });
    }
    return res.json({ reply });
  } catch (e) {
    console.error("/api/chat error:", e);
    return res
      .status(500)
      .json({ error: "Erreur serveur", detail: e?.message || e });
  }
});

function getEmailTemplate(username, otp) {
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Code d'authentification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #f9f6fb;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 500px;
        margin: 30px auto;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 30px;
      }
      .header {
        text-align: center;
        color: #6c2399ff;
      }
      .otp {
        font-size: 32px;
        font-weight: bold;
        color: #6c2399ff;
        text-align: center;
        margin: 20px 0;
        letter-spacing: 4px;
      }
      .content {
        color: #333;
        font-size: 16px;
        line-height: 1.5;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2 class="header">🔒 Authentification</h2>
      <p class="content">Bonjour <strong>${username}</strong>,</p>
      <p class="content">Voici votre code d'authentification :</p>
      <div class="otp">${otp}</div>
      <p class="content">
        Vous devez copier ce code pour le saisir sur la plateforme et continuer l'utilisation de l'application.
      </p>
      <p class="content">
        Ce code est valable <strong>10 minutes</strong>.
      </p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Chat - Tous droits réservés.
      </div>
    </div>
  </body>
  </html>
  `;
}


app.get("/api/users/:user_id", authMiddleware, async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const { user_id } = req.params;
    
    if (!user_id) {
      return res.status(400).json({ error: "ID utilisateur manquant" });
    }
    const [rows] = await connection.execute(
      "SELECT id, username, otp, otp_expiry, is_active, email, google_id, theme, font_size, language, animation, avatar, biographie, type_abonnement, subscriber, email_verified_at, last_connection_date, created_at FROM users WHERE id = ?",
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("Erreur get user:", err);
    res.status(500).json({ error: "Erreur serveur", detail: err.message });
  } finally {
    await connection.end();
  }
});


app.put("/api/users/",authMiddleware, async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const { id } = req.user.id;
    const fields = req.body; // données envoyées depuis le front

    if (!id || Object.keys(fields).length === 0) {
      return res.status(400).json({ error: "ID manquant ou aucune donnée à mettre à jour" });
    }

    // Construction dynamique de la requête SQL
    const allowedFields = [
      "username", "otp", "otp_expiry", "is_active", "email", "google_id",
      "theme", "font_size", "language", "animation", "avatar", "biographie",
      "type_abonnement", "subscriber", "email_verified_at", "last_connection_date"
    ];

    const updates = [];
    const values = [];

    for (const key of Object.keys(fields)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "Aucun champ valide à mettre à jour" });
    }

    values.push(id); // dernier paramètre pour WHERE

    const sql = `
      UPDATE users 
      SET ${updates.join(", ")}, updated_at = NOW()
      WHERE id = ?`;

    const [result] = await connection.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({ success: true, message: "Utilisateur mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur update user:", err);
    res.status(500).json({ error: "Erreur serveur", detail: err.message });
  } finally {
    await connection.end();
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));

// 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
