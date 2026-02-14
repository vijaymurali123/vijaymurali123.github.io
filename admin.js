// ========================================
// FIREBASE CONFIGURATION
// ========================================
// Replace with your Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Hardcoded admin credentials (temporary - replace with Firebase later)
const ADMIN_CREDENTIALS = {
    username: 'vijay',
    password: '10042026'
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

// Initialize Firebase only if configured
let db, storage, auth;
if (isFirebaseConfigured) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    storage = firebase.storage();
    auth = firebase.auth();
}

// ========================================
// ADMIN PORTAL FUNCTIONS
// ========================================

let currentVisitor = null;

function setAdminAccessVisibility() {
    const adminAccess = document.getElementById('adminAccess');
    if (!adminAccess) return;
    const url = new URL(window.location.href);
    const allowAdminToggle = localStorage.getItem('adminLoggedIn') === 'true' || url.searchParams.get('admin') === '1';
    adminAccess.style.display = allowAdminToggle ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    setAdminAccessVisibility();
});

// Open Admin Portal
function openAdminPortal() {
    document.getElementById('adminPortal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Admin Portal
function closeAdminPortal() {
    document.getElementById('adminPortal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Admin Login
document.getElementById('adminLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    try {
        // Check hardcoded credentials first
        if (email === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Login successful
            localStorage.setItem('adminLoggedIn', 'true');
            document.getElementById('adminLogin').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            setAdminAccessVisibility();
            loadVisitorsLocal();
            loadAnalyticsLocal();
            return;
        }
        
        // Try Firebase authentication if configured
        if (isFirebaseConfigured) {
            await auth.signInWithEmailAndPassword(email, password);
            localStorage.setItem('adminLoggedIn', 'true');
            document.getElementById('adminLogin').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            setAdminAccessVisibility();
            loadGalleryManager();
            loadVisitors();
            loadAnalytics();
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        alert('Login failed: Invalid username or password');
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        submitBtn.disabled = false;
    }
});

// Switch Admin Tabs
function switchTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').style.display = 'block';
    
    if (tab === 'gallery') {
        if (isFirebaseConfigured) {
            loadGalleryManager();
        } else {
            document.getElementById('galleryManager').innerHTML = '<p class="empty-state">Gallery management requires Firebase setup. See FIREBASE_SETUP.md</p>';
        }
    }
    if (tab === 'visitors') {
        if (isFirebaseConfigured) {
            loadVisitors();
        } else {
            loadVisitorsLocal();
        }
    }
    if (tab === 'analytics') {
        if (isFirebaseConfigured) {
            loadAnalytics();
        } else {
            loadAnalyticsLocal();
        }
    }
}

// ========================================
// GALLERY MANAGER
// ========================================

// Upload Images
document.getElementById('imageUpload')?.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    const uploadButton = document.querySelector('.upload-button');
    uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    
    for (const file of files) {
        try {
            const storageRef = storage.ref(`gallery/${Date.now()}_${file.name}`);
            await storageRef.put(file);
            const url = await storageRef.getDownloadURL();
            
            await db.collection('gallery').add({
                url: url,
                filename: file.name,
                uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
                category: 'couple'
            });
        } catch (error) {
            console.error('Upload error:', error);
        }
    }
    
    uploadButton.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload Images';
    loadGalleryManager();
    updateFrontendGallery();
});

// Load Gallery Manager
async function loadGalleryManager() {
    const container = document.getElementById('galleryManager');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    
    try {
        const snapshot = await db.collection('gallery').orderBy('uploadedAt', 'desc').get();
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="empty-state">No images uploaded yet</p>';
            return;
        }
        
        let html = '<div class="admin-gallery-grid">';
        snapshot.forEach(doc => {
            const data = doc.data();
            html += `
                <div class="admin-gallery-item">
                    <img src="${data.url}" alt="${data.filename}">
                    <div class="admin-gallery-actions">
                        <button onclick="deleteImage('${doc.id}', '${data.url}')" class="delete-btn">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = '<p class="error">Error loading gallery</p>';
    }
}

// Delete Image
async function deleteImage(docId, url) {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
        await db.collection('gallery').doc(docId).delete();
        const storageRef = storage.refFromURL(url);
        await storageRef.delete();
        loadGalleryManager();
        updateFrontendGallery();
    } catch (error) {
        alert('Error deleting image: ' + error.message);
    }
}

// Update Frontend Gallery
async function updateFrontendGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
// ========================================
// LOCAL STORAGE FALLBACK (when Firebase not configured)
// ========================================

// Load Visitors from localStorage
function loadVisitorsLocal() {
    const container = document.getElementById('visitorsList');
    const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    
    // Update stats
    document.getElementById('totalVisitors').textContent = visitors.length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = visitors.filter(v => {
        const visitDate = new Date(v.timestamp);
        return visitDate >= today;
    }).length;
    document.getElementById('todayVisitors').textContent = todayCount;
    
    if (visitors.length === 0) {
        container.innerHTML = '<p class="empty-state">No visitors yet</p>';
        return;
    }
    
    let html = '<table class="visitors-table"><thead><tr><th>Name</th><th>Visit Time</th><th>Pages Viewed</th></tr></thead><tbody>';
    
// Track Visitor
async function trackVisitor(name) {
    // Always track locally
    trackVisitorLocal(name);
    
    // Also track in Firebase if configured
    if (!isFirebaseConfigured) return;
    
    try {
        const visitorRef = await db.collection('visitors').add({
            name: name,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent,
            pageViews: [],
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        currentVisitor = {
            id: visitorRef.id,
            name: name
        };
        
        // Track page sections
        trackPageView('Home');
        
        return visitorRef.id;
    } catch (error) {
        console.error('Error tracking visitor in Firebase:', error);
    }
}

// Track Page View
async function trackPageView(section) {
    // Always track locally
    trackPageViewLocal(section);
    
    // Also track in Firebase if configured and visitor exists
    if (!currentVisitor || !isFirebaseConfigured) return;
    
    try {
        await db.collection('visitors').doc(currentVisitor.id).update({
            pageViews: firebase.firestore.FieldValue.arrayUnion({
                section: section,
                timestamp: new Date().toISOString()
            }),
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error tracking page view in Firebase:', error);
    }
}           ${details}
            <button onclick="this.parentElement.parentElement.remove()" class="modal-close-btn">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Load Analytics from localStorage
function loadAnalyticsLocal() {
    const container = document.getElementById('analyticsData');
    const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    
    const sectionCounts = {};
    visitors.forEach(visitor => {
        visitor.pageViews?.forEach(view => {
            sectionCounts[view.section] = (sectionCounts[view.section] || 0) + 1;
        });
    });
    
    if (Object.keys(sectionCounts).length === 0) {
        container.innerHTML = '<p class="empty-state">No analytics data yet</p>';
        return;
    }
    
    let html = '<div class="analytics-grid">';
    
    Object.entries(sectionCounts).sort((a, b) => b[1] - a[1]).forEach(([section, count]) => {
        html += `
            <div class="analytics-card">
                <h4>${section}</h4>
                <p class="analytics-number">${count}</p>
                <p class="analytics-label">views</p>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Track Visitor in localStorage
function trackVisitorLocal(name) {
    const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    const visitor = {
        name: name,
        timestamp: new Date().toISOString(),
        pageViews: [{ section: 'Home', timestamp: new Date().toISOString() }]
    };
    visitors.push(visitor);
    localStorage.setItem('visitors', JSON.stringify(visitors));
    localStorage.setItem('currentVisitorIndex', visitors.length - 1);
}

// Track Page View in localStorage
function trackPageViewLocal(section) {
    const visitorIndex = localStorage.getItem('currentVisitorIndex');
    if (visitorIndex === null) return;
    
    const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    if (visitors[visitorIndex]) {
        const pageView = { section: section, timestamp: new Date().toISOString() };
        // Check if this section was already tracked recently (within 30 seconds)
        const recentView = visitors[visitorIndex].pageViews?.find(v => 
            v.section === section && 
            (new Date() - new Date(v.timestamp)) < 30000
        );
        if (!recentView) {
            visitors[visitorIndex].pageViews = visitors[visitorIndex].pageViews || [];
            visitors[visitorIndex].pageViews.push(pageView);
            localStorage.setItem('visitors', JSON.stringify(visitors));
        }
    }
}

// ========================================
// VISITOR TRACKING (Works with or without Firebase)
// ========================================

// Track Visitor.forEach(doc => {
            const data = doc.data();
            html += `
                <div class="gallery-item" data-category="${data.category || 'couple'}">
                    <img src="${data.url}" alt="${data.filename}">
                    <div class="gallery-overlay">
                        <i class="fas fa-search-plus"></i>
                    </div>
                </div>
            `;
        });
        
        galleryGrid.innerHTML = html;
        initGalleryItems();
    } catch (error) {
        console.error('Error updating gallery:', error);
    }
}

// ========================================
// VISITORS TRACKING
// ========================================

// Track Visitor
async function trackVisitor(name) {
    try {
        const visitorRef = await db.collection('visitors').add({
            name: name,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent,
            pageViews: [],
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        currentVisitor = {
            id: visitorRef.id,
            name: name
        };
        
        // Track page sections
        trackPageView('Home');
        
        return visitorRef.id;
    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
}

// Track Page View
async function trackPageView(section) {
    if (!currentVisitor) return;
    
    try {
        await db.collection('visitors').doc(currentVisitor.id).update({
            pageViews: firebase.firestore.FieldValue.arrayUnion({
                section: section,
                timestamp: new Date().toISOString()
            }),
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error tracking page view:', error);
    }
}

// Load Visitors
async function loadVisitors() {
    const container = document.getElementById('visitorsList');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    
    try {
        const snapshot = await db.collection('visitors').orderBy('timestamp', 'desc').get();
        
        // Update stats
        document.getElementById('totalVisitors').textContent = snapshot.size;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = snapshot.docs.filter(doc => {
            const timestamp = doc.data().timestamp?.toDate();
            return timestamp && timestamp >= today;
        }).length;
        document.getElementById('todayVisitors').textContent = todayCount;
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="empty-state">No visitors yet</p>';
            return;
        }
        
        let html = '<table class="visitors-table"><thead><tr><th>Name</th><th>Visit Time</th><th>Pages Viewed</th></tr></thead><tbody>';
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate();
            const pageViews = data.pageViews?.length || 0;
            
            html += `
                <tr onclick="showVisitorDetails('${doc.id}')">
                    <td><i class="fas fa-user-circle"></i> ${data.name}</td>
                    <td>${timestamp ? timestamp.toLocaleString() : 'N/A'}</td>
                    <td><span class="badge">${pageViews} sections</span></td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = '<p class="error">Error loading visitors</p>';
    }
}

// Show Visitor Details
async function showVisitorDetails(visitorId) {
    try {
        const doc = await db.collection('visitors').doc(visitorId).get();
        const data = doc.data();
        
        let details = `
            <div class="visitor-details-modal">
                <h4>${data.name}</h4>
                <p><strong>Visit Time:</strong> ${data.timestamp?.toDate().toLocaleString()}</p>
                <p><strong>Sections Visited:</strong></p>
                <ul>
        `;
        
        data.pageViews?.forEach(view => {
            details += `<li>${view.section} - ${new Date(view.timestamp).toLocaleTimeString()}</li>`;
        });
        
        details += `</ul></div>`;
        
        const modal = document.createElement('div');
        modal.className = 'visitor-modal-overlay';
        modal.innerHTML = `
            <div class="visitor-modal">
                ${details}
                <button onclick="this.parentElement.parentElement.remove()" class="modal-close-btn">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    } catch (error) {
        alert('Error loading visitor details');
    }
}

// ========================================
// ANALYTICS
// ========================================

async function loadAnalytics() {
    const container = document.getElementById('analyticsData');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    
    try {
        const snapshot = await db.collection('visitors').get();
        
        const sectionCounts = {};
        snapshot.forEach(doc => {
            const pageViews = doc.data().pageViews || [];
            pageViews.forEach(view => {
                sectionCounts[view.section] = (sectionCounts[view.section] || 0) + 1;
            });
        });
        
        let html = '<div class="analytics-grid">';
        
        Object.entries(sectionCounts).sort((a, b) => b[1] - a[1]).forEach(([section, count]) => {
            html += `
                <div class="analytics-card">
                    <h4>${section}</h4>
                    <p class="analytics-number">${count}</p>
                    <p class="analytics-label">views</p>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = '<p class="error">Error loading analytics</p>';
    }
}

// ========================================
// SECTION TRACKING WITH INTERSECTION OBSERVER
// ========================================

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sectionName = entry.target.id || entry.target.className;
            trackPageView(sectionName);
        }
    });
}, { threshold: 0.5 });

// Observe all main sections
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });
});

// ========================================
// SHOW ADMIN ACCESS (Triple Click Logo)
// ========================================

let clickCount = 0;
let clickTimer = null;

document.querySelector('.nav-logo')?.addEventListener('click', () => {
    clickCount++;
    
    if (clickTimer) clearTimeout(clickTimer);
    
    if (clickCount === 3) {
        document.getElementById('adminAccess').style.display = 'block';
        clickCount = 0;
    }
    
    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 1000);
});

// Load gallery on page load
window.addEventListener('load', () => {
    updateFrontendGallery();
});
