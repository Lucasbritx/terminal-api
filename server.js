const express = require('express');
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Terminal Backend is running 🚀');
});

app.post("/exec", (req, res) => {
  const { command = "" } = req.body;

  const allowedCommands = ["ls", "pwd", "whoami", "echo", "mkdir"];
  if (!allowedCommands.includes(command.split(" ")[0])) {
    return res.status(400).json({ error: "Comando não permitido" });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});