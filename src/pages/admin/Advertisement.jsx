import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { FaBullhorn, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Advertisement = () => {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    heading: '',
    content: '',
  });

  // Load ads from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ads'));
    if (stored && stored.length > 0) {
      setAds(stored);
    } else {
      // Set dummy data if none exist
      const dummy = [
        {
          id: Date.now(),
          title: 'Men',
          image: 'https://images.unsplash.com/photo-1618354691373-9b57991b9d6c',
          heading: 'Relaxed Fit Hoodie',
          content: 'Comfortable cotton hoodie in modern design.',
        },
        {
          id: Date.now() + 1,
          title: 'Women',
          image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
          heading: 'Stylish Top',
          content: 'Elegant top for casual and formal wear.',
        },
        {
          id: Date.now() + 2,
          title: 'Kids',
          image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f',
          heading: 'Colorful T-Shirt',
          content: 'Bright and fun t-shirts for kids.',
        }
      ];
      setAds(dummy);
      localStorage.setItem('ads', JSON.stringify(dummy));
    }
  }, []);

  // Update localStorage on changes
  useEffect(() => {
    localStorage.setItem('ads', JSON.stringify(ads));
  }, [ads]);

  const openForm = (ad = null) => {
    if (ad) {
      setSelectedAd(ad);
      setFormData(ad);
      setImagePreview(ad.image);
    } else {
      setSelectedAd(null);
      setFormData({ title: '', image: '', heading: '', content: '' });
      setImagePreview('');
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedAd(null);
    setFormData({ title: '', image: '', heading: '', content: '' });
    setImagePreview('');
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result;
          setImagePreview(base64Image);
          setFormData({ ...formData, image: base64Image });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleUpload = () => {
    if (selectedAd) {
      const updatedAds = ads.map(ad =>
        ad.id === selectedAd.id ? { ...formData, id: ad.id } : ad
      );
      setAds(updatedAds);
    } else {
      const newAd = { ...formData, id: Date.now() };
      setAds([...ads, newAd]);
    }
    closeForm();
  };

  const handleDelete = (id) => {
    const updated = ads.filter(ad => ad.id !== id);
    setAds(updated);
    if (selectedAd?.id === id) closeForm();
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}><FaBullhorn style={styles.icon} /> Advertisements</h2>
          <button style={styles.addButton} onClick={() => openForm()}><FaPlus /> Add New</button>
        </div>

        <div style={styles.scrollArea}>
          <div style={styles.grid}>
            {ads.map(ad => (
              <div key={ad.id} style={styles.card}>
                <p style={styles.text}><strong>Product No. :</strong> {ad.id.toString().slice(-4)}</p>
                <img src={ad.image} alt={ad.title} style={styles.image} />
                <p style={styles.text}><strong>Category:</strong> {ad.title}</p>
                <p style={styles.text}><strong>{ad.heading}</strong></p>
                <p style={styles.text}>{ad.content}</p>
                <div style={styles.cardButtons}>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(ad.id)}><FaTrash /> Delete</button>
                  <button style={styles.editBtn} onClick={() => openForm(ad)}><FaEdit /> Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.formCard}>
            <h3>{selectedAd ? 'Edit Advertisement' : 'Add Advertisement'}</h3>

            <label>Category</label>
            <select name="title" value={formData.title} onChange={handleChange} style={styles.input}>
              <option value="">Select Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>

            <label>Upload Image</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} style={styles.input} />
            {imagePreview && <img src={imagePreview} alt="Preview" style={styles.previewImg} />}

            <label>Heading</label>
            <input type="text" name="heading" value={formData.heading} onChange={handleChange} style={styles.input} />

            <label>Description</label>
            <textarea name="content" value={formData.content} onChange={handleChange} style={styles.textarea} />

            <div style={styles.actions}>
              <button style={styles.discardBtn} onClick={closeForm}>Discard</button>
              <button style={styles.uploadBtn} onClick={handleUpload}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

const styles = {
  container: { padding: '30px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '24px',
    color: '#007bff',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  icon: { color: '#007bff' },
  addButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  scrollArea: {
    maxHeight: 'calc(100vh - 180px)',
    overflowY: 'auto',
    paddingRight: '10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    color: '#000',
  },
  text: { color: '#000', fontSize: '14px', margin: '5px 0' },
  image: {
    height: '120px',
    width: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  cardButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  deleteBtn: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer',
  },
  editBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  formCard: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '500px',
    color: '#000',
    
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    height: '100px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    marginBottom: '15px',
  },
  previewImg: {
    width: '50%',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginBottom: '10px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  discardBtn: {
    backgroundColor: 'transparent',
    color: 'red',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  uploadBtn: {
    backgroundColor: 'darkgreen',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Advertisement;
