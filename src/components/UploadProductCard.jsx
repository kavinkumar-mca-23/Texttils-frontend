import React from 'react';
import { useProductForm } from '../context/ProductFormContext';

const UploadProductCard = () => {
  const { hideFormNow } = useProductForm();

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Add New Product</h3>
      <input type="text" placeholder="Product Name" style={styles.input} />
      <input type="text" placeholder="Category" style={styles.input} />
      <input type="text" placeholder="Price" style={styles.input} />
      <div style={styles.buttons}>
        <button style={styles.saveBtn}>Save</button>
        <button style={styles.cancelBtn} onClick={hideFormNow}>Cancel</button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '15px',
    fontSize: '18px',
    color: '#009688',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
  },
  saveBtn: {
    backgroundColor: '#009688',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: '#ccc',
    color: '#333',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default UploadProductCard;
