import './App.css';
import React, { useEffect, useState } from 'react';
import { listPosts, createPost, deletePost } from './api/posts';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      const data = await listPosts();
      setPosts(data);
    } catch (e) {
      setError('Failed to load posts');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const created = await createPost({ author, content, imageUrl });
      setAuthor('');
      setContent('');
      setImageUrl('');
      setPosts([created, ...posts]);
    } catch (e) {
      setError('Failed to create post');
    }
  };

  const onDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (e) {
      setError('Failed to delete post');
    }
  };

  return (
    <div id="root">
      <div className="header card">
        <div className="title">facebook</div>
      </div>

      <div className="card">
        <form onSubmit={onCreate}>
          <div>
            <input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
          </div>
          <div>
            <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
          </div>
          <div>
            <input placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          </div>
          <button type="submit">Create Post</button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>

      <ul className="post-list">
        {posts.map(p => (
          <li key={p.id} className="card">
            <div className="post-meta">
              <div className="avatar">{(p.author || 'U').charAt(0).toUpperCase()}</div>
              <div className="info">
                <div className="author">{p.author}</div>
                <div className="time"><small>{p.createdAt}</small></div>
              </div>
            </div>
            <div className="post-content">{p.content}</div>
            {p.imageUrl && <img className="post-image" src={p.imageUrl} alt="" />}
            <div className="post-actions" style={{ marginTop: 8 }}>
              <button onClick={() => onDelete(p.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}