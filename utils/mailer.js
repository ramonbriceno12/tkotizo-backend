const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email provider
    auth: {
        user: process.env.EMAIL_USERNAME, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
    },
});


const sendEmailNewUser = async ({ to }) => {
    try {
        // Welcome email content
        const emailContent = `
       <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9; color: #333;">
           <h1 style="color: #4CAF50;">¡Bienvenido a Nuestra Plataforma, ${to.name}!</h1>
           <p>Hola ${to.name},</p>
           <p>Gracias por registrarte. ¡Estamos emocionados de tenerte con nosotros!</p>
           <p>Esto es lo que puedes hacer a continuación:</p>
           <ul style="list-style: none; padding: 0;">
               <li>⭐ Explora nuestras características.</li>
               <li>⭐ Actualiza tu perfil.</li>
               <li>⭐ ¡Empieza tu viaje con nosotros!</li>
           </ul>
           <p>Si tienes alguna pregunta, no dudes en responder a este correo.</p>
           <p>¡Saludos!<br>El Equipo</p>
           <footer style="margin-top: 20px; font-size: 12px; color: #777;">
               <p>Este correo es generado automáticamente. Por favor, no respondas directamente a este mensaje.</p>
           </footer>
       </div>
   `;

        // Send the email
        const info = await transporter.sendMail({
            from: '"Tkotizo" <ramonbriceno12@gmail.com>', // Sender address
            to: to.email, // Recipient email
            subject: 'Bienvenido a Tkotizo!', // Subject
            html: emailContent, // HTML body
        });

        return info;

    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};


const sendCreatePurchaseOrderEmailToClient = async ({ to, subject, purchaseOrder }) => {
    try {

        // Email content
        const emailContent = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9; color: #333;">
                <h1 style="color: #4CAF50;">Orden de Compra Creada</h1>
                <p>Hola ${to.name},</p>
                <p>Tu orden de compra ha sido creada con éxito. Aquí tienes los detalles:</p>
                <p><strong>Descripción:</strong> ${purchaseOrder.description}</p>
                <p>Puedes descargar el archivo relacionado con tu orden de compra desde el siguiente enlace:</p>
                <a href="${purchaseOrder.file_url}" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Descargar Archivo</a>
                <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                <p>¡Gracias por confiar en nosotros!</p>
                <p>Saludos,<br>El Equipo</p>
                <footer style="margin-top: 20px; font-size: 12px; color: #777;">
                    <p>Este correo es generado automáticamente. Por favor, no respondas directamente a este mensaje.</p>
                </footer>
            </div>
        `;

        const info = await transporter.sendMail({
            from: `"Tkotizo" ${process.env.EMAIL_USERNAME}`, // Sender address
            to: to.email, // Receiver address
            subject: subject, // Subject line
            html: emailContent, // HTML body
        });

        await sendCreatePurchaseOrderEmailToAdmins({ to, purchaseOrder });

        console.log(`Email sent: ${info.messageId}`);
        return info;

    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendCreatePurchaseOrderEmailToAdmins = async ({ to, purchaseOrder }) => {
    try {

        // Email content
        const emailContent = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9; color: #333;">
                <h1 style="color: #4CAF50;">Orden de Compra Creada</h1>
                <p>Usuario: ${to.name},</p>
                <p>Email: ${to.email}</p>
                <p>ID: ${to.id}</p>
                <p>Se ha generado una orden de compra. Aquí tienes los detalles:</p>
                <p><strong>Descripción:</strong> ${purchaseOrder.description}</p>
                <p>Puedes descargar el archivo relacionado con tu orden de compra desde el siguiente enlace:</p>
                <a href="${purchaseOrder.file_url}" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Descargar Archivo</a>
                <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                <p>¡Gracias por confiar en nosotros!</p>
                <p>Saludos,<br>El Equipo</p>
                <footer style="margin-top: 20px; font-size: 12px; color: #777;">
                    <p>Este correo es generado automáticamente. Por favor, no respondas directamente a este mensaje.</p>
                </footer>
            </div>
        `;

        const adminEmails = [
            'ramonbriceno12@gmail.com',
            'ramonbricenopaypal@gmail.com',
        ];

        const info = await transporter.sendMail({
            from: `"Tkotizo" ${process.env.EMAIL_USERNAME}`, // Sender address
            to: adminEmails.join(','), // Receiver address
            subject: 'Orden de Compra Creada', // Subject line
            html: emailContent, // HTML body
        });

        console.log(`Email sent: ${info.messageId}`);
        return info;

    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendFileToProviderEmail = async ({ id, to, file }) => {
    try {
        // Email content
        const emailContent = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9; color: #333;">
                <h1 style="color: #4CAF50;">Cotizacion Tkotizo</h1>
                <p>Se ha generado la Cotizacion #${id}.</p>
                <p>Puedes descargar el archivo relacionado con tu orden de compra desde el siguiente enlace:</p>
                <a href="${file}" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Descargar Archivo</a>
                <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                <p>¡Gracias por confiar en nosotros!</p>
                <p>Saludos,<br>El Equipo</p>
                <footer style="margin-top: 20px; font-size: 12px; color: #777;">
                    <p>Este correo es generado automáticamente. Por favor, no respondas directamente a este mensaje.</p>
                </footer>
            </div>
        `;

        const info = await transporter.sendMail({
            from: `"Tkotizo" ${process.env.EMAIL_USERNAME}`, // Sender address
            to: to, // Receiver address
            subject: 'Has recibido una Cotizacion de Tkotizo', // Subject line
            html: emailContent, // HTML body
        });

        console.log(`Email sent: ${info.messageId}`);
        return info;

    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = { sendCreatePurchaseOrderEmailToClient, sendEmailNewUser, sendFileToProviderEmail };