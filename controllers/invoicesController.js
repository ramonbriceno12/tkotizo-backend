const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const multer = require('multer');
const s3 = new AWS.S3();

const { User, PurchaseOrder, Invoice } = require('../models');
const { Op, fn, col, literal } = require('sequelize');


// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Configure AWS S3
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION, // Example: 'us-east-1'
});

exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            include: [
                {
                    model: PurchaseOrder,
                    as: 'purchaseOrder',
                    include: [
                        {
                            model: User,
                            as: 'user',
                        },
                    ],
                },
            ],
            order: [['id', 'ASC']],
        });

        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.approveInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findByPk(id, {
            include: [
                {
                    model: PurchaseOrder,
                    as: 'purchaseOrder',
                    include: [
                        {
                            model: User,
                            as: 'user',
                        },
                    ],
                },
            ],
        });

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        await invoice.update({ status: 'approved' });

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
                        <h1 style="color: #4CAF50;">Factura Aprobada</h1>
                        <p>Hola ${invoice.purchaseOrder.user?.name || "Usuario"},</p>
                        <p>Tu factura ha sido aprobada con éxito. Aquí tienes los detalles:</p>
                        <ul>
                            <li><strong>ID de la Factura:</strong> ${invoice.id}</li>
                            <li><strong>Descripción:</strong> ${invoice.purchaseOrder.description}</li>
                            <li><strong>Monto Total:</strong> $${invoice.total_amount}</li>
                            <li><strong>Estado:</strong> ${invoice.status === 'approved' ? 'Aprobada' : invoice.status}</li>
                        </ul>
                        <p>Puedes descargar el archivo relacionado con tu factura desde el siguiente enlace:</p>
                        <a href="${invoice.purchaseOrder.file_url}" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Descargar Archivo</a>
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
            to: invoice.purchaseOrder.user?.email || "email@example.com", // Recipient email
            subject: 'Factura Aprobada', // Subject
            html: emailContent, // HTML body
        });

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cancelInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findByPk(id, {
            include: [
                {
                    model: PurchaseOrder,
                    as: 'purchaseOrder',
                    include: [
                        {
                            model: User,
                            as: 'user',
                        },
                    ],
                },
            ],
        });

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        await invoice.update({ status: 'cancelled' });

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
                        <h1 style="color:rgb(207, 50, 50);">Factura Cancelada</h1>
                        <p>Hola ${invoice.purchaseOrder.user?.name || "Usuario"},</p>
                        <p>Tu factura ha sido cancelada. Aquí tienes los detalles:</p>
                        <ul>
                            <li><strong>ID de la Factura:</strong> ${invoice.id}</li>
                            <li><strong>Descripción:</strong> ${invoice.purchaseOrder.description}</li>
                            <li><strong>Monto Total:</strong> $${invoice.total_amount}</li>
                            <li><strong>Estado:</strong> ${invoice.status === "cancelled" ? "Cancelada" : invoice.status}</li>
                        </ul>
                        <p>Puedes descargar el archivo relacionado con tu factura desde el siguiente enlace:</p>
                        <a href="${invoice.purchaseOrder.file_url}" style="color: rgb(207, 50, 50); text-decoration: none; font-weight: bold;">Descargar Archivo</a>
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
            to: invoice.purchaseOrder.user?.email || "email@example.com", // Recipient email
            subject: 'Factura Cancelada', // Subject
            html: emailContent, // HTML body
        });


        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateInvoiceAmount = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const invoice = await Invoice.findByPk(id);

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        await invoice.update({ total_amount: amount })

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBarChartInvoices = async (req, res) => {
    try {
        // Query to group invoices by month and year using EXTRACT() for PostgreSQL
        const stats = await Invoice.findAll({
            attributes: [
                [literal("EXTRACT(MONTH FROM \"created_at\")"), 'month'],
                [literal("EXTRACT(YEAR FROM \"created_at\")"), 'year'],
                [fn('COUNT', col('id')), 'count'],
            ],
            where: {
                created_at: {
                    [Op.gte]: new Date('2025-01-01'), // Customize this date range as needed
                    [Op.lte]: new Date('2025-12-31'),
                },
            },
            group: [literal("EXTRACT(MONTH FROM \"created_at\")"), literal("EXTRACT(YEAR FROM \"created_at\")")],
            order: [
                [literal("EXTRACT(YEAR FROM \"created_at\")"), 'ASC'],
                [literal("EXTRACT(MONTH FROM \"created_at\")"), 'ASC'],
            ],
        });

        // Format the data for the chart
        const labels = [];
        const data = [];

        stats.forEach((stat) => {
            const month = stat.get('month');
            const year = stat.get('year');
            const count = stat.get('count');

            const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
            if (!labels.includes(monthName)) {
                labels.push(monthName);
                data.push(count);
            }
        });

        res.status(200).json({
            labels,
            datasets: [
                {
                    label: 'Invoices',
                    data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
            ],
        });
    } catch (error) {
        console.error('Error fetching invoice stats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.getLineChartInvoices = async (req, res) => {
    try {
        // Query to group invoices by month and year and sum the total_amount
        const stats = await Invoice.findAll({
            attributes: [
                [literal("EXTRACT(MONTH FROM \"created_at\")"), 'month'],
                [literal("EXTRACT(YEAR FROM \"created_at\")"), 'year'],
                [fn('SUM', col('total_amount')), 'total_amount'], // Sum the total_amount
            ],
            where: {
                created_at: {
                    [Op.gte]: new Date('2025-01-01'), // Customize this date range as needed
                    [Op.lte]: new Date('2025-12-31'),
                },
                status: 'paid',
            },
            group: [literal("EXTRACT(MONTH FROM \"created_at\")"), literal("EXTRACT(YEAR FROM \"created_at\")")],
            order: [
                [literal("EXTRACT(YEAR FROM \"created_at\")"), 'ASC'],
                [literal("EXTRACT(MONTH FROM \"created_at\")"), 'ASC'],
            ],
        });

        // Format the data for the chart
        const labels = [];
        const data = [];

        stats.forEach((stat) => {
            const month = stat.get('month');
            const year = stat.get('year');
            const totalAmount = stat.get('total_amount');

            const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
            if (!labels.includes(monthName)) {
                labels.push(monthName);
                data.push(totalAmount);
            }
        });

        res.status(200).json({
            labels,
            datasets: [
                {
                    label: 'Revenue',
                    data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
            ],
        });
    } catch (error) {
        console.error('Error fetching revenue stats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
