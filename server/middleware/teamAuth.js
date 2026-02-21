const Team = require('../models/Team');

const checkTeamRole = (roles) => {
    return async (req, res, next) => {
        try {
            const team = await Team.findById(req.params.teamId);

            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            }

            if (!req.mongoUser) {
                return res.status(401).json({ message: 'User profile not synced. Please link your account first.' });
            }

            // Check if user is a member of the team
            const member = team.members.find(
                (m) => m.user.toString() === req.mongoUser._id.toString()
            );

            if (!member) {
                return res.status(403).json({ message: 'Access denied. Not a team member.' });
            }

            if (!roles.map(r => r.toLowerCase()).includes(member.role.toLowerCase())) {
                return res.status(403).json({ message: `Access denied. Requires one of these roles: ${roles.join(', ')}` });
            }

            req.team = team;
            req.memberRole = member.role;
            next();
        } catch (error) {
            console.error('Team Auth Error:', error);
            res.status(500).json({ message: 'Server Error during team authorization' });
        }
    };
};

module.exports = { checkTeamRole };
