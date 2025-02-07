require("dotenv").config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para manejar el cuerpo de la solicitud (en formato JSON)
app.use(bodyParser.json());

// Configurar el transporte SMTP para tu servidor privado
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP,  // Dirección de tu servidor SMTP
    //port: 26,                    // Usualmente el puerto 587 para STARTTLS, si tu servidor usa otro puerto, cámbialo
    //secure: false,               // Usar TLS (STARTTLS)
    port: 465,                     // Usualmente el puerto 587 para STARTTLS, si tu servidor usa otro puerto, cámbialo
    secure: true,                  // Usar TLS (STARTTLS)


    auth: {
        user: process.env.EMAIL_USER,  // Tu correo en el servidor privado
        pass: process.env.EMAIL_PASS,            // Tu contraseña del correo
    },
    tls: {
        rejectUnauthorized: false,  // Si el servidor usa un certificado auto-firmado
    },
});

// Ruta para enviar correo
app.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;
    //console.log(req.body);
    // Configuración del correo a enviar
    const mailOptions = {
        from: process.env.EMAIL_USER,     // Dirección del remitente
        to: process.env.EMAIL_TO,                           // Dirección del destinatario
        subject: subject || process.env.EMAIL_SUBJECT,                 // Asunto
        text: text,                       // Cuerpo del mensaje
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ success: false, message: error.toString() });
        }
        res.status(200).send({ success: true, message: 'Correo enviado correctamente', info: info });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});