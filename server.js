const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// In-memory store (replace with DB in production)
let profile = {
  name: 'Maya Chen',
  role: 'Product designer & developer',
  bio: 'I turn complex ideas into clear, useful digital experiences. Currently building thoughtful tools for people who care about how work gets done.',
  location: 'Toronto, Canada',
  email: 'maya@studiochen.co',
  availability: 'Available for select projects',
  username: 'mayachen',
  skills: ['Product design', 'React', 'Prototyping', 'Design systems']
};
let projects = [];

// GET public portfolio
app.get('/api/portfolio/:username', (req, res) => {
  if (req.params.username !== profile.username) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ profile, projects });
});

// Update profile
app.put('/api/portfolio/profile', (req, res) => {
  profile = { ...profile, ...req.body };
  res.json({ success: true, profile });
});

// Add a new project
app.post('/api/portfolio/projects', (req, res) => {
  const newProj = { id: crypto.randomUUID(), ...req.body };
  projects.push(newProj);
  res.status(201).json({ success: true, project: newProj });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`));
