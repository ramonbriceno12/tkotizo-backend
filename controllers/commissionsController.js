const { Commission } = require('../models');

exports.getAllCommissions = async (req, res) => {
    try {
        const commissions = await Commission.findAll({
            order: [['id', 'ASC']],
        });

        res.status(200).json(commissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCommissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const commission = await Commission.findByPk(id);
        if (commission) {
            res.status(200).json(commission);
        } else {
            res.status(404).json({ error: 'Commission not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCommission = async (req, res) => {
    try {
        const commission = await Commission.create(req.body);
        res.status(201).json(commission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCommission = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Commission.update(req.body, {
            where: { id: id },
        });
        if (updated) {
            const updatedCommission = await Commission.findByPk(id);
            res.status(200).json(updatedCommission);
        } else {
            res.status(404).json({ error: 'Commission not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCommission = async (req, res) => {
    try {
        const { id } = req.params;
        const commission = await Commission.findByPk(id);
        if (commission) {
            await commission.destroy();
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Commission not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCommissionByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const commissions = await Commission.findAll({
            where: { userId },
            order: [['id', 'ASC']],
        });
        res.status(200).json(commissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCommissionByInvoiceId = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const commission = await Commission.findOne({
            where: { invoiceId },
        });
        if (commission) {
            res.status(200).json(commission);
        } else {
            res.status(404).json({ error: 'Commission not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}