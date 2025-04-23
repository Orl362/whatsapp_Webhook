const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Tu token de verificación para Meta
const VERIFY_TOKEN = 'AKASHA';
// URL de Make (reemplázala si tienes otra)
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/71n1hyy6946e3n6cv29baar8ktcu4bj0';

// Necesario para leer JSON en los POST
app.use(express.json());

// Ruta GET para verificación de Webhook
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Verificación de Webhook exitosa');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Verificación fallida');
    res.sendStatus(403);
  }
});

// Ruta POST para mensajes entrantes
app.post('/', async (req, res) => {
  try {
    console.log('📩 Mensaje recibido:', JSON.stringify(req.body, null, 2));

    // Reenvía el body completo a Make
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (response.ok) {
      console.log('✅ Enviado a Make con éxito');
      res.sendStatus(200);
    } else {
      console.error('❌ Error al enviar a Make:', response.statusText);
      res.sendStatus(500);
    }
  } catch (error) {
    console.error('❌ Error en el servidor:', error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
