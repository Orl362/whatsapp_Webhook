const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "AKASHA"; // Token de verificación para Meta

app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Verificación fallida");
    res.sendStatus(403);
  }
});

app.post('/', (req, res) => {
  console.log("📩 Mensaje recibido:", JSON.stringify(req.body, null, 2));

  fetch('https://hook.us2.make.com/71n1hyy6946e3n6cv29baar8ktcu4bj0', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  })
  .then(r => {
    console.log("✅ Enviado a Make");
    res.sendStatus(200);
  })
  .catch(err => {
    console.error("❌ Error al enviar a Make:", err);
    res.sendStatus(500);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor activo en puerto ${PORT}`);
});
