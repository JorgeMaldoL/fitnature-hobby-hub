import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [flags, setFlags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { userId } = useUser();

  const availableFlags = ['Question', 'Opinion', 'Event', 'Beginner Friendly', 'Advanced', 'Indoor', 'Outdoor'];

  const handleFlagToggle = (flag) => {
    setFlags(prev => 
      prev.includes(flag) 
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const postData = { 
        title: title.trim(), 
        content: content.trim(), 
        image: image.trim(),
        flags: flags,
        author_id: userId,
        upvotes: 0 
      };
      
      const { data, error } = await supabase.from('Posts').insert([postData]);
      
      if (!error) {
        navigate('/');
      } else {
        console.error('Supabase error:', error);
        alert(`Error creating post: ${error.message}`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Error creating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return (
      <div className="form-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Creating your workout group...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1 className="page-title">Create Workout Group</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Workout Title *</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g., Morning Trail Running Group, Beach Yoga Sessions..." 
            required 
            className="form-input"
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            placeholder="Describe your workout group: location, time, skill level, what to bring..." 
            className="form-textarea"
            maxLength={1000}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Photo URL (optional)</label>
          <input 
            value={image} 
            onChange={e => setImage(e.target.value)} 
            placeholder="https://example.com/workout-location.jpg" 
            className="form-input"
            type="url"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Flags</label>
          <div className="flag-selection">
            {availableFlags.map(flag => (
              <label key={flag} className="flag-option">
                <input
                  type="checkbox"
                  checked={flags.includes(flag)}
                  onChange={() => handleFlagToggle(flag)}
                />
                <span>{flag}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn" 
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? 'Creating Group...' : 'Create Workout Group'}
        </button>
      </form>
    </div>
  );
}
