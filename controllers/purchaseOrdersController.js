const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const s3 = new AWS.S3();

const { User, PurchaseOrder, Invoice } = require('../models');
const { sendCreatePurchaseOrderEmailToClient, sendFileToProviderEmail } = require('../utils/mailer');

// Configure AWS S3
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION, // Example: 'us-east-1'
});

// Get all purchase orders
exports.getPurchaseOrders = async (req, res) => {
    try {
        const purchaseOrders = await PurchaseOrder.findAll({
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email'], // Specify required fields
            },
            order: [['id', 'ASC']],
        });
        res.status(200).json({ purchaseOrders });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get a single purchase order by ID
exports.getPurchaseOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const purchaseOrder = await PurchaseOrder.findByPk(id);
        if (purchaseOrder) {
            res.status(200).json({ purchaseOrder });
        } else {
            res.status(404).json({ message: 'Purchase order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Create a new purchase order
exports.createPurchaseOrder = async (req, res) => {
    try {
        const { userId } = req.body;

        console.log(userId);

        if (!userId || !req.file) {
            return res.status(400).json({ error: 'User ID and file are required.' });
        }

        // Prepare S3 upload parameters
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
            Key: `purchase-orders/${userId}/${Date.now()}-${req.file.originalname}`, // File path in S3
            Body: req.file.buffer, // File content
            ContentType: req.file.mimetype, // File MIME type
        };

        // Upload the file to S3
        const uploadResult = await s3.upload(params).promise();

        // Fetch user details from the database (update this as per your user model)
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Save the purchase order to the database
        const purchaseOrder = await PurchaseOrder.create({
            user_id: userId,
            description: req.body.description,
            file_url: uploadResult.Location,
            total_amount: req.body.amount,
        });

        await sendCreatePurchaseOrderEmailToClient({
            to: user,
            subject: 'Orden de Compra Creada',
            purchaseOrder: purchaseOrder
        })

        // Respond with the file URL
        res.status(201).json({
            message: 'Purchase order created successfully.',
            purchaseOrder: purchaseOrder.id,
            fileUrl: purchaseOrder.file_url,
        });

    } catch (error) {
        console.error('Error uploading to S3 or sending email:', error);
        res.status(500).json({ error: 'Failed to process purchase order.' });
    }
};

//Send file to provider
exports.sendFileToProvider = async (req, res) => {
    try {

        const {id} = req.params;
        const {email, selectedPurchaseOrderFile} = req.body;

        if (!email || !selectedPurchaseOrderFile) {
            return res.status(400).json({ error: 'Email and file are required.' });
        }

        await sendFileToProviderEmail({
            id: id,
            to: email,
            file: selectedPurchaseOrderFile
        })

        res.status(200).json({ message: 'File sent to provider successfully.' });

    } catch (error) {
        console.error('Error uploading to S3 or sending email:', error);
        res.status(500).json({ error: 'Failed to process purchase order.' });
    }
}
// Update a purchase order by ID
exports.updatePurchaseOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const purchaseOrder = await PurchaseOrder.findByPk(id);
        if (purchaseOrder) {
            await purchaseOrder.update({ total_amount: amount });
            res.status(200).json({ purchaseOrder });
        } else {
            res.status(404).json({ message: 'Purchase order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// cancel a purchase order by ID
exports.cancelPurchaseOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const purchaseOrder = await PurchaseOrder.findByPk(id, {
            include: [{ model: User, as: 'user' }], // Assuming you have a User model associated with PurchaseOrder
        });
        if (purchaseOrder) {
            // Update the purchase order status to "approved"
            await purchaseOrder.update({ status: 'cancelled' });

            // Configure Nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'Gmail', // Replace with your email provider
                auth: {
                    user: process.env.EMAIL_USERNAME, // Your email address
                    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
                },
            });

            // Email content
            const emailContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
                <h1 style="color:rgb(207, 50, 50);">Orden de Compra Cancelada</h1>
                <p>Hola ${purchaseOrder.user?.name || "Usuario"},</p>
                <p>Tu orden de compra ha sido cancelada. Aquí tienes los detalles:</p>
                <ul>
                    <li><strong>ID de la Orden:</strong> ${purchaseOrder.id}</li>
                    <li><strong>Descripción:</strong> ${purchaseOrder.description}</li>
                    <li><strong>Monto Total:</strong> $${purchaseOrder.total_amount}</li>
                    <li><strong>Estado:</strong> ${purchaseOrder.status}</li>
                </ul>
                <p>Puedes descargar el archivo relacionado con tu orden de compra desde el siguiente enlace:</p>
                <a href="${purchaseOrder.file_url}" style="color: rgb(207, 50, 50); text-decoration: none; font-weight: bold;">Descargar Archivo</a>
                <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                <p>¡Gracias por confiar en nosotros!</p>
                <p>Saludos,<br>El Equipo</p>
                <footer style="margin-top: 20px; font-size: 12px; color: #777;">
                    <p>Este correo es generado automáticamente. Por favor, no respondas directamente a este mensaje.</p>
                </footer>
            </div>
        `;

            // Send the email
            await transporter.sendMail({
                from: '"Tkotizo" <ramonbriceno12@gmail.com>', // Sender address
                to: purchaseOrder.user?.email || "email@example.com", // Recipient email
                subject: 'Orden de Compra Cancelada', // Subject
                html: emailContent, // HTML body
            });

            res.status(200).json({ message: 'Purchase order cancelled and email sent.', purchaseOrder });
        } else {
            res.status(404).json({ message: 'Purchase order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get all purchase orders by user ID
exports.getPurchaseOrdersByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const purchaseOrders = await PurchaseOrder.findAll({ where: { user_id } });
        res.status(200).json({ purchaseOrders });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.approvePurchaseOrder = async (req, res) => {

    try {
        const { id } = req.params;

        // Fetch the purchase order
        const purchaseOrder = await PurchaseOrder.findByPk(id, {
            include: [{ model: User, as: 'user' }], // Assuming you have a User model associated with PurchaseOrder
        });

        if (purchaseOrder) {
            // Update the purchase order status to "approved"
            await purchaseOrder.update({ status: 'approved' });

            const createdInvoice = await Invoice.create({
                purchase_order_id: purchaseOrder.id,
                total_amount: purchaseOrder.total_amount,
                status: 'unpaid'
            });

            // Configure Nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'Gmail', // Replace with your email provider
                auth: {
                    user: process.env.EMAIL_USERNAME, // Your email address
                    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
                },
            });

            // Email content
            const emailContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
                <h1 style="color: #4CAF50;">Orden de Compra Aprobada</h1>
                <p>Hola ${purchaseOrder.user?.name || "Usuario"},</p>
                <p>Tu orden de compra ha sido aprobada con éxito. Aquí tienes los detalles:</p>
                <ul>
                    <li><strong>ID de la Orden:</strong> ${purchaseOrder.id}</li>
                    <li><strong>Descripción:</strong> ${purchaseOrder.description}</li>
                    <li><strong>Monto Total:</strong> $${purchaseOrder.total_amount}</li>
                    <li><strong>Estado:</strong> ${purchaseOrder.status === 'approved' ? 'Aprobada' : purchaseOrder.status}</li>
                    <li><strong>Factura:</strong> #${createdInvoice.id}</li>
                </ul>
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

            // Send the email
            await transporter.sendMail({
                from: '"Tkotizo" <ramonbriceno12@gmail.com>', // Sender address
                to: purchaseOrder.user?.email || "email@example.com", // Recipient email
                subject: 'Orden de Compra Aprobada', // Subject
                html: emailContent, // HTML body
            });

            res.status(200).json({ message: 'Purchase order approved and email sent.', purchaseOrder });
        } else {
            res.status(404).json({ message: 'Purchase order not found' });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error.' });
    }

}

