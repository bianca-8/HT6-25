import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';

// Login page component (unchanged)
function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated) return null;

  return (
    <div>
      <h1>Please log in</h1>
      <button onClick={() => loginWithRedirect()}>Log In</button>
    </div>
  );
}

// Dashboard page (with link to LeetCode page)
function Dashboard() {
  const { logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div>
      <h1>You logged in!</h1>
      <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
      <br /><br />
      <Link to="/leetcode">Go to LeetCode Profile</Link>
    </div>
  );
}

// LeetCode profile fetching component
function LeetCodeProfile() {
  const { isAuthenticated } = useAuth0();

  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch profile from LeetCode GraphQL API
  async function fetchLeetCodeProfile(username) {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            userAvatar
            realName
            aboutMe
            school
            websites
            countryName
            company
            skillTags
            starRating
            reputation
            ranking
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    const variables = { username };

    try {
      const response = await fetch('http://localhost:4000/api/leetcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });
      const data = await response.json();
      if (data.errors) {
        setError('User not found or error fetching data');
        setProfile(null);
        return;
      }
      setProfile(data.data.matchedUser);
      setError(null);
    } catch (e) {
      setError('Fetch failed: ' + e.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  const handleFetch = () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    setProfile(null);
    fetchLeetCodeProfile(username);
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h2>Fetch LeetCode Profile</h2>
      <input
        type="text"
        placeholder="Enter LeetCode username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button onClick={handleFetch} disabled={!username || loading}>
        {loading ? 'Loading...' : 'Fetch Profile'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {profile && (
        <div>
          <h3>{profile.username}</h3>
          <img src={profile.profile.userAvatar} alt="Avatar" width={100} />
          <p>Real name: {profile.profile.realName || 'N/A'}</p>
          <p>Country: {profile.profile.countryName || 'N/A'}</p>
          <p>Ranking: {profile.profile.ranking || 'N/A'}</p>
          <p>Star Rating: {profile.profile.starRating || 'N/A'}</p>
          <p>Reputation: {profile.profile.reputation || 'N/A'}</p>

          <h4>Submission Stats:</h4>
          <ul>
            {profile.submitStatsGlobal.acSubmissionNum.map(({ difficulty, count }) => (
              <li key={difficulty}>
                {difficulty}: {count} accepted solutions
              </li>
            ))}
          </ul>
        </div>
      )}

      <br />
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
}

// Main App component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leetcode" element={<LeetCodeProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



/*
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated) return null;

  console.log("Loading:", isLoading, "Authenticated:", isAuthenticated, "User:", user); //hiihihi

  return (
    <div>
      <h1>Please log in</h1>
      <button onClick={() => loginWithRedirect()}>Log In</button>
    </div>
  );
}

function Dashboard() {
  const { logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div>
      <h1>You logged in!</h1>
      <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
*/