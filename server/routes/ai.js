const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkTeamRole } = require('../middleware/teamAuth');
const { generateHackathonAssistance } = require('../config/aiService');

// @route   POST /api/ai/chat/:teamId
// @desc    Get AI assistance for a team project
// @access  Protected + Team Member
router.post('/chat/:teamId', protect, checkTeamRole(['admin', 'member']), async (req, res) => {
    try {
        const { prompt, type } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        const aiResponse = await generateHackathonAssistance(prompt, type);
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('AI Service Error:', error);
        res.status(500).json({
            message: 'AI assistance currently unavailable.',
            error: error.message
        });
    }
});

module.exports = router;
