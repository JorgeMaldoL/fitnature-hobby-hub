import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [selectedFlags, setSelectedFlags] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const availableFlags = ['Question', 'Opinion', 'Event', 'Beginner Friendly', 'Advanced', 'Indoor', 'Outdoor'];

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchTerm, sortBy, selectedFlags]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('Posts').select('*').order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterAndSortPosts() {
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFlags = selectedFlags.length === 0 || 
                          (post.flags && selectedFlags.some(flag => post.flags.includes(flag)));
      
      return matchesSearch && matchesFlags;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'created_at') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'upvotes') {
        return b.upvotes - a.upvotes;
      }
      return 0;
    });

    setFilteredPosts(filtered);
  }

  const toggleFlag = (flag) => {
    setSelectedFlags(prev => 
      prev.includes(flag) 
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading workout groups..." />;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Nature Workout Groups</h1>
      
      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search workout groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="sort-container">
          <label className="sort-label">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="created_at">Recent</option>
            <option value="upvotes">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="flag-filters">
        {availableFlags.map(flag => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            className={`flag-filter ${selectedFlags.includes(flag) ? 'active' : ''}`}
          >
            {flag}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="no-posts">
          {searchTerm || selectedFlags.length > 0 ? (
            <p>No workout groups found matching your filters</p>
          ) : (
            <>
              <p>No workout groups yet! Start the first nature fitness community.</p>
              <Link to="/create" className="btn" style={{marginTop: '1rem', textDecoration: 'none'}}>
                Create First Group
              </Link>
            </>
          )}
        </div>
      ) : (
        filteredPosts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
