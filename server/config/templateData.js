const templates = {
    SIH: {
        tasks: [
            { title: 'Problem Statement Analysis', description: 'Deep dive into the SIH problem statement requirements.', priority: 'High' },
            { title: 'PPT Preparation (Internal)', description: 'Create the initial pitch deck for internal rounds.', priority: 'Medium' },
            { title: 'UI/UX Wireframing', description: 'Design Figma wireframes for the solution.', priority: 'Medium' },
            { title: 'MVP Core Backend', description: 'Set up Express API and basic DB schema.', priority: 'High' }
        ],
        checklist: [
            'Problem statement selected',
            'Team members registered on SIH portal',
            'Abstract submitted',
            'Internal college nomination received',
            'Mentor selected'
        ]
    },
    'Generic Hackathon': {
        tasks: [
            { title: 'Repo Initialization', description: 'Set up GitHub repo and CI/CD basics.', priority: 'Low' },
            { title: 'Landing Page v1', description: 'Build a basic landing page to show the concept.', priority: 'Medium' },
            { title: 'Pitch Deck v1', description: 'Outline the problem, solution, and tech stack.', priority: 'High' }
        ],
        checklist: [
            'Git repo created',
            'Readme updated',
            'Discord/Slack joined',
            'Initial pitch ready'
        ]
    },
    'SaaS MVP': {
        tasks: [
            { title: 'Auth Implementation', description: 'Firebase or JWT setup.', priority: 'High' },
            { title: 'Subscription Model Plan', description: 'Decide on pricing tiers.', priority: 'Medium' },
            { title: 'Dashboard UI', description: 'Main user interface construction.', priority: 'Medium' }
        ],
        checklist: [
            'Domain selected',
            'Logo designed',
            'Database connected'
        ]
    }
};

module.exports = templates;
