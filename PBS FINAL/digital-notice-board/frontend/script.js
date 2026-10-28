const API_BASE_URL = 'http://localhost:5000/api';

let currentCategory = 'All';

document.addEventListener('DOMContentLoaded', () => {
    fetchNotices();

    // Event Listeners
    document.getElementById('notice-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('search-btn').addEventListener('click', () => fetchNotices());
    document.getElementById('search-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') fetchNotices();
    });
    document.getElementById('cancel-btn').addEventListener('click', resetForm);

    // Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-category');
            fetchNotices();
        });
    });
});

// Fetch all notices from API
async function fetchNotices() {
    const grid = document.getElementById('notices-grid');
    const spinner = document.getElementById('loading-spinner');
    const emptyState = document.getElementById('empty-state');
    const searchQuery = document.getElementById('search-input').value.trim();

    grid.innerHTML = '';
    spinner.classList.remove('hidden');
    emptyState.classList.add('hidden');

    try {
        let url = `${API_BASE_URL}/notices?category=${encodeURIComponent(currentCategory)}`;
        if (searchQuery) {
            url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        const res = await fetch(url);
        const result = await res.json();

        spinner.classList.add('hidden');

        if (result.success && result.data.length > 0) {
            renderNotices(result.data);
        } else {
            emptyState.classList.remove('hidden');
        }
    } catch (err) {
        spinner.classList.add('hidden');
        showToast('Failed to connect to backend server. Make sure it is running.', 'error');
        emptyState.classList.remove('hidden');
    }
}

// Render notices list to DOM
function renderNotices(notices) {
    const grid = document.getElementById('notices-grid');

    notices.forEach(notice => {
        const card = document.createElement('div');
        card.className = `notice-card ${notice.is_pinned ? 'pinned' : ''}`;

        const createdDate = new Date(notice.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });

        card.innerHTML = `
            <div>
                <div class="notice-header">
                    <span class="badge badge-${notice.category.toLowerCase()}">${notice.category}</span>
                    ${notice.is_pinned ? '<span class="pinned-badge">📌 Pinned</span>' : ''}
                </div>
                <h3 class="notice-title">${escapeHTML(notice.title)}</h3>
                <p class="notice-content">${escapeHTML(notice.content)}</p>
            </div>
            <div class="notice-footer">
                <div>
                    <strong>${escapeHTML(notice.author)}</strong> • ${createdDate}
                </div>
                <div class="card-actions">
                    <button class="btn-icon" onclick="editNotice('${notice.id}')" title="Edit">✏️</button>
                    <button class="btn-icon" onclick="deleteNotice('${notice.id}')" title="Delete">🗑️</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Form Submission (Create or Update)
async function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('notice-id').value;
    const title = document.getElementById('notice-title').value.trim();
    const category = document.getElementById('notice-category').value;
    const author = document.getElementById('notice-author').value.trim();
    const content = document.getElementById('notice-content').value.trim();
    const is_pinned = document.getElementById('notice-pinned').checked;

    if (!title || !category || !content || !author) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }

    const payload = { title, category, author, content, is_pinned };

    try {
        let res;
        if (id) {
            // Update
            res = await fetch(`${API_BASE_URL}/notices/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            res = await fetch(`${API_BASE_URL}/notices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        const result = await res.json();

        if (result.success) {
            showToast(id ? 'Notice updated successfully!' : 'Notice published successfully!', 'success');
            resetForm();
            fetchNotices();
        } else {
            showToast(`Error: ${result.message}`, 'error');
        }
    } catch (err) {
        showToast('Failed to save notice. Check backend connection.', 'error');
    }
}

// Load notice into form for editing
async function editNotice(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/notices/${id}`);
        const result = await res.json();

        if (result.success && result.data) {
            const notice = result.data;
            document.getElementById('notice-id').value = notice.id;
            document.getElementById('notice-title').value = notice.title;
            document.getElementById('notice-category').value = notice.category;
            document.getElementById('notice-author').value = notice.author;
            document.getElementById('notice-content').value = notice.content;
            document.getElementById('notice-pinned').checked = notice.is_pinned;

            document.getElementById('form-heading').innerText = 'Edit Notice';
            document.getElementById('submit-btn').innerText = 'Update Notice';
            document.getElementById('cancel-btn').classList.remove('hidden');

            document.getElementById('create-section').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (err) {
        showToast('Failed to fetch notice details for editing.', 'error');
    }
}

// Delete notice
async function deleteNotice(id) {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
        const res = await fetch(`${API_BASE_URL}/notices/${id}`, {
            method: 'DELETE'
        });
        const result = await res.json();

        if (result.success) {
            showToast('Notice deleted successfully!', 'success');
            fetchNotices();
        } else {
            showToast(`Error: ${result.message}`, 'error');
        }
    } catch (err) {
        showToast('Failed to delete notice. Check backend connection.', 'error');
    }
}

// Reset Form State
function resetForm() {
    document.getElementById('notice-form').reset();
    document.getElementById('notice-id').value = '';
    document.getElementById('form-heading').innerText = 'Post New Notice';
    document.getElementById('submit-btn').innerText = 'Publish Notice';
    document.getElementById('cancel-btn').classList.add('hidden');
}

// Show Toast Notification
function showToast(message, type) {
    const toast = document.getElementById('toast-banner');
    toast.innerText = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}

// Utility: Escape HTML
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
