const {Provider} = require('../models');

exports.getAllProviders = async (req, res) => {
    try {
        const providers = await Provider.findAll();
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProvider = async (req, res) => {
    try {
        const provider = await Provider.create(req.body);
        res.status(201).json(provider);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProviderById = async (req, res) => {
    try {
        const { id } = req.params;
        const provider = await Provider.findByPk(id);
        if (provider) {
            res.status(200).json(provider);
        } else {
            res.status(404).json({ error: 'Provider not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Provider.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedProvider = await Provider.findByPk(id);
            res.status(200).json(updatedProvider);
        } else {
            res.status(404).json({ error: 'Provider not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};