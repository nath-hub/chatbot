require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid'); 

const mysql = require("mysql2/promise");

const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const dbConfig = {
  host: process.env.DB_HOST, // L'hôte de la base de données
  user: process.env.DB_USERNAME, // Votre nom d'utilisateur MySQL
  password: "", // Votre mot de passe MySQL
  database: process.env.DB_DATABASE, // Nom de votre base de données
};

const JWT_SECRET = "votre_secret_jwt_super_securise";

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Base de données simple en mémoire (remplacez par une vraie BDD)
let users = [];

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error("Missing OPENAI_API_KEY in env");
  process.exit(1);
}

// Route pour servir la page principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route d'inscription
app.post("/api/register", async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);

  try {
     const userId = uuidv4();
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Les mots de passe ne correspondent pas",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }
 

    // Vérifier si l'utilisateur existe déjà
    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Un utilisateur avec ce nom ou cet email existe déjà",
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const [result] = await connection.execute(
      "INSERT INTO users (id, username, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, username, email, hashedPassword, new Date(), new Date()]
    );

    // Générer le token JWT
    const token = jwt.sign({ userId: result.insertId, username }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      token,
      user: {
        id: result.insertId,
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});


// Route de connexion
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email et mot de passe requis' 
            });
        }

        // Connexion à la base de données
        const connection = await mysql.createConnection(dbConfig);

        // Trouver l'utilisateur
        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email ou mot de passe incorrect' 
            });
        }

        // Vérifier le mot de passe
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email ou mot de passe incorrect' 
            });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
        });
    }
});


app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body; // expects array {role, content}
    if (!messages) return res.status(400).json({ error: "messages required" });

    // Transform to OpenAI format
    const openaiMessages = messages.map((m) => ({
      role:
        m.role === "user"
          ? "user"
          : m.role === "assistant"
          ? "assistant"
          : "system",
      content: m.content,
    }));

    // Example using Chat Completions (GPT-4/3.5)
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // ou "gpt-4" / "gpt-3.5-turbo" selon ton accès
        messages: openaiMessages,
        temperature: 0.2,
        max_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const assistantMsg = response.data.choices?.[0]?.message?.content || "";
    return res.json({ assistant: assistantMsg, raw: response.data });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({
      error: "OpenAI request failed",
      detail: err?.response?.data || err.message,
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));
