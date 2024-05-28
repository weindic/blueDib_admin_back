const NewsletterService = require('../Service/newsletters.service');
exports.getNewsletterWithUsers = async (req, res) => {
    try {
        const { newsletterId } = req.params; 
        const newsletter = await mainService.getNewsletterWithUsers(newsletterId);
        res.status(200).json(newsletter);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};  