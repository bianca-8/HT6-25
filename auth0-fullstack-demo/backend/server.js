const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Apply middleware BEFORE routes
app.use(cors());
app.use(express.json()); // This must be above the route

// ✅ Working route for LeetCode GraphQL
app.post('/api/leetcode', async (req, res) => {
  const { query, variables } = req.body;

  try {
    const response = await fetch('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong when querying LeetCode' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from backend');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
