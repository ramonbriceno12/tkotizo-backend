const {Provider, ProviderEstimate} = require('../models');

exports.getAllProviderEstimates = async (req, res) => {
    try {
        const providerEstimates = await ProviderEstimate.findAll({
            include: [
                {
                    model: Provider,
                    as: 'provider',
                },
            ],
            order: [['id', 'ASC']],
        });

        res.status(200).json(providerEstimates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProviderEstimate = async (req, res) => {
    try {
        const providerEstimate = await ProviderEstimate.create(req.body);
        res.status(201).json(providerEstimate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProviderEstimateById = async (req, res) => {
    try {
        const { id } = req.params;
        const providerEstimate = await ProviderEstimate.findByPk(id);
        if (providerEstimate) {
            res.status(200).json(providerEstimate);
        } else {
            res.status(404).json({ error: 'Provider Estimate not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProviderEstimate = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await ProviderEstimate.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedProviderEstimate = await ProviderEstimate.findByPk(id);
            res.status(200).json(updatedProviderEstimate);
        } else {
            res.status(404).json({ error: 'Provider Estimate not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProviderEstimate = async (req, res) => {
    try {
        const { id } = req.params;
        const providerEstimate = await ProviderEstimate.findByPk(id);
        if (providerEstimate) {
            await providerEstimate.destroy();
            res.status(200).json({ message: 'Provider Estimate deleted successfully' });
        } else {
            res.status(404).json({ error: 'Provider Estimate not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProviderEstimatesByProviderId = async (req, res) => {
    try {
        const { id } = req.params;
        const providerEstimates = await ProviderEstimate.findAll({
            where: { provider_id: id },
            include: [
                {
                    model: Provider,
                    as: 'provider',
                },
            ],
            order: [['id', 'ASC']],
        });

        res.status(200).json(providerEstimates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProviderEstimatesByPurchaseOrderId = async (req, res) => {
    try {
        const { purchaseOrderId } = req.params;
        const providerEstimates = await ProviderEstimate.findAll({
            where: { purchase_order_id: purchaseOrderId },
            include: [
                {
                    model: Provider,
                    as: 'provider',
                },
            ],
            order: [['id', 'ASC']],
        });

        res.status(200).json(providerEstimates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.approveProviderEstimate = async (req, res) => {
    try {
        const { id } = req.params;

        const providerEstimate = await ProviderEstimate.findByPk(id, {
            include: [
                {
                    model: Provider,
                    as: 'provider',
                },
            ],
        });

        if (!providerEstimate) {
            return res.status(404).json({ error: 'Provider Estimate not found' });
        }

        await providerEstimate.update({ status: 'approved' });

        res.status(200).json(providerEstimate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.rejectProviderEstimate = async (req, res) => {
    try {
        const { id } = req.params;

        const providerEstimate = await ProviderEstimate.findByPk(id, {
            include: [
                {
                    model: Provider,
                    as: 'provider',
                },
            ],
        });

        if (!providerEstimate) {
            return res.status(404).json({ error: 'Provider Estimate not found' });
        }

        await providerEstimate.update({ status: 'rejected' });

        res.status(200).json(providerEstimate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};