const API_PREFIX = '/api/posts';

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    try {
      return Promise.reject(JSON.parse(text));
    } catch {
      return Promise.reject({ error: text });
    }
  }
  return res.json();
}

export async function listPosts() {
  const res = await fetch(API_PREFIX);
  return handleResponse(res);
}

export async function createPost(payload) {
  const res = await fetch(API_PREFIX, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deletePost(id) {
  const res = await fetch(`${API_PREFIX}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete failed');
  return true;
}