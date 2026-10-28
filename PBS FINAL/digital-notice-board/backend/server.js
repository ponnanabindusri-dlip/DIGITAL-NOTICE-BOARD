const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./supabase');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Digital Notice Board API Server is running' });
});

// GET all notices (with optional search & filter)
app.get('/api/notices', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = supabase.from('notices').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,author.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching notices:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single notice by ID
app.get('/api/notices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('notices').select('*').eq('id', id).single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Notice not found' });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new notice
app.post('/api/notices', async (req, res) => {
  try {
    const { title, category, content, author, is_pinned } = req.body;

    // Validation
    if (!title || !category || !content) {
      return res.status(400).json({ success: false, message: 'Title, category, and content are required fields.' });
    }

    const newNotice = {
      title,
      category,
      content,
      author: author || 'Admin',
      is_pinned: !!is_pinned,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('notices').insert([newNotice]).select();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Notice created successfully', data: data[0] });
  } catch (error) {
    console.error('Error creating notice:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update notice by ID
app.put('/api/notices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, content, author, is_pinned } = req.body;

    const updatedNotice = {
      title,
      category,
      content,
      author,
      is_pinned,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('notices').update(updatedNotice).eq('id', id).select();

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Notice updated successfully', data: data[0] });
  } catch (error) {
    console.error('Error updating notice:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE notice by ID
app.delete('/api/notices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('notices').delete().eq('id', id);

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Digital Notice Board Server listening on http://localhost:${PORT}`);
});
