import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { FaWarehouse, FaPlus } from 'react-icons/fa';

const Stocks = () => {
  const [stockData, setStockData] = useState([]);
  const [newCards, setNewCards] = useState([]);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [search, setSearch] = useState('');

  const dummyData = [
    { id: 1, productCode: '254', product: 'Printed Formal Shirt', category: 'Mens', subCategory: 'Shirt', quantity: 10, updatedOn: '23/06/2025' },
    { id: 2, productCode: '333', product: 'Casual Jeans', category: 'Mens', subCategory: 'Bottomwear', quantity: 25, updatedOn: '20/06/2025' },
    { id: 3, productCode: '448', product: 'Kids Frock', category: 'Kids', subCategory: 'Dress', quantity: 15, updatedOn: '21/06/2025' },
    { id: 4, productCode: '254', product: 'Printed Formal Shirt', category: 'Mens', subCategory: 'Shirt', quantity: 10, updatedOn: '23/06/2025' },
    { id: 5, productCode: '333', product: 'Casual Jeans', category: 'Mens', subCategory: 'Bottomwear', quantity: 25, updatedOn: '20/06/2025' },
    { id: 6, productCode: '448', product: 'Kids Frock', category: 'Kids', subCategory: 'Dress', quantity: 15, updatedOn: '21/06/2025' }
  ];

  useEffect(() => {
    const savedStock = localStorage.getItem('stockData');
    const parsed = savedStock ? JSON.parse(savedStock) : [];
    const existingCodes = parsed.map(item => item.productCode);
    const merged = [
      ...dummyData.filter(d => !existingCodes.includes(d.productCode)),
      ...parsed,
    ];
    setStockData(merged);
  }, []);

  useEffect(() => {
    localStorage.setItem('stockData', JSON.stringify(stockData));
  }, [stockData]);

  const addNewCard = () => {
    setNewCards([...newCards, {
      id: Date.now(),
      productCode: '', category: '', productName: '', subCategory: '', price: '',
      productType: '', gst: '', image: null,
      variants: [{ color: '#800000', size: 'S', quantity: 10 }]
    }]);
  };

  const handleImageUpload = (e, index, source = 'new') => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const cards = source === 'new' ? [...newCards] : [...uploadQueue];
      cards[index].image = reader.result;
      source === 'new' ? setNewCards(cards) : setUploadQueue(cards);
    };
    reader.readAsDataURL(file);
  };

  const updateCard = (index, key, value, source = 'new') => {
    const cards = source === 'new' ? [...newCards] : [...uploadQueue];
    cards[index][key] = value;
    source === 'new' ? setNewCards(cards) : setUploadQueue(cards);
  };

  const updateVariant = (cardIndex, variantIndex, key, value, source = 'new') => {
    const cards = source === 'new' ? [...newCards] : [...uploadQueue];
    cards[cardIndex].variants[variantIndex][key] = value;
    source === 'new' ? setNewCards(cards) : setUploadQueue(cards);
  };

  const addVariant = (index, source = 'new') => {
    const cards = source === 'new' ? [...newCards] : [...uploadQueue];
    cards[index].variants.push({ color: '#000000', size: 'S', quantity: 1 });
    source === 'new' ? setNewCards(cards) : setUploadQueue(cards);
  };

  const discardCard = (id, source = 'new') => {
    source === 'new'
      ? setNewCards(newCards.filter(card => card.id !== id))
      : setUploadQueue(uploadQueue.filter(card => card.id !== id));
  };

  const moveToUploadCard = (index) => {
    const card = newCards[index];
    setUploadQueue([...uploadQueue, card]);
    discardCard(card.id, 'new');
  };

  const uploadCardToTable = (index) => {
    const card = uploadQueue[index];
    const totalQty = card.variants.reduce((acc, v) => acc + v.quantity, 0);
    const today = new Date().toLocaleDateString();
    const newEntry = {
      id: Date.now(),
      productCode: card.productCode,
      product: card.productName,
      category: card.category,
      subCategory: card.subCategory,
      quantity: totalQty,
      updatedOn: today
    };
    const updatedStock = [...stockData, newEntry];
    setStockData(updatedStock);
    discardCard(card.id, 'upload');
  };

  const incrementQuantity = (id) => {
    const updated = stockData.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setStockData(updated);
  };

  const filteredStock = stockData.filter(
    item => item.product.toLowerCase().includes(search.toLowerCase()) || item.productCode.includes(search)
  );

  const isPopupOpen = newCards.length || uploadQueue.length;

  return (
    <AdminLayout>
      <div style={{ padding: '30px', filter: isPopupOpen ? 'blur(2px)' : 'none' }}>
        <h2 style={{ fontSize: '24px', color: '#000', marginBottom: '20px' }}>
          <FaWarehouse style={{ marginRight: '10px' }} /> Stock Management
        </h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <input
            style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Code or Product..."
          />
          <button onClick={addNewCard} style={{ backgroundColor: '#28a745', color: '#fff', padding: '10px 15px', borderRadius: '5px', border: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FaPlus /> New Product
          </button>
        </div>

        <table style={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <thead>
            <tr>
              {['Sl. No.', 'Code', 'Product', 'Category', 'Subcategory', 'Qty', 'Updated', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px', backgroundColor: '#f0f0f0', color: '#000', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStock.map((item, i) => (
              <tr key={item.id}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>{item.productCode}</td>
                <td style={tdStyle}>{item.product}</td>
                <td style={tdStyle}>{item.category}</td>
                <td style={tdStyle}>{item.subCategory}</td>
                <td style={tdStyle}>{item.quantity}</td>
                <td style={tdStyle}>{item.updatedOn}</td>
                <td style={tdStyle}>
                  <span onClick={() => incrementQuantity(item.id)} style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                    Add More
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {[...newCards, ...uploadQueue].map((card, i) => {
        const source = uploadQueue.includes(card) ? 'upload' : 'new';
        const index = source === 'new' ? newCards.findIndex(c => c.id === card.id) : uploadQueue.findIndex(c => c.id === card.id);
        return (
          <div key={card.id} style={popupCard}>
            <h3 style={{ marginBottom: '10px', color: '#000' }}>{source === 'new' ? 'New Product' : 'Upload Product'}</h3>

            <div style={formRow}>
              <input placeholder="Product Code" value={card.productCode} onChange={e => updateCard(index, 'productCode', e.target.value, source)} style={inputStyle} />
              <select value={card.category} onChange={e => updateCard(index, 'category', e.target.value, source)} style={inputStyle}>
                <option>Mens</option><option>Womens</option><option>Kids</option>
              </select>
            </div>

            <div style={formRow}>
              <input placeholder="Sub Category" value={card.subCategory} onChange={e => updateCard(index, 'subCategory', e.target.value, source)} style={inputStyle} />
              <input placeholder="Product Name" value={card.productName} onChange={e => updateCard(index, 'productName', e.target.value, source)} style={inputStyle} />
            </div>

            <div style={formRow}>
              <select value={card.productType} onChange={e => updateCard(index, 'productType', e.target.value, source)} style={inputStyle}>
                <option>Western</option><option>Traditional</option>
              </select>
              <input placeholder="Price" value={card.price} onChange={e => updateCard(index, 'price', e.target.value, source)} style={inputStyle} />
            </div>

            <input placeholder="GST %" value={card.gst} onChange={e => updateCard(index, 'gst', e.target.value, source)} style={{ ...inputStyle, width: '50%' }} />

            {card.variants.map((v, vi) => (
              <div key={vi} style={formRow}>
                <input type="color" value={v.color} onChange={e => updateVariant(index, vi, 'color', e.target.value, source)} style={{ width: '40px' }} />
                <select value={v.size} onChange={e => updateVariant(index, vi, 'size', e.target.value, source)} style={inputStyle}>
                  <option>S</option><option>M</option><option>L</option>
                </select>
                <input placeholder="Quantity" value={v.quantity} type="number" onChange={e => updateVariant(index, vi, 'quantity', parseInt(e.target.value), source)} style={inputStyle} />
              </div>
            ))}

            <div style={formRow}>
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, index, source)} />
              <button style={subBtn} onClick={() => addVariant(index, source)}>Add More</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button style={discardBtn} onClick={() => discardCard(card.id, source)}>Discard</button>
              {source === 'upload' ? (
                <button style={saveBtn} onClick={() => uploadCardToTable(index)}>Upload</button>
              ) : (
                <button style={saveBtn} onClick={() => moveToUploadCard(index)}>Save</button>
              )}
            </div>
          </div>
        );
      })}
    </AdminLayout>
  );
};

const tdStyle = { padding: '10px', color: '#000' };
const inputStyle = { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 };
const formRow = { display: 'flex', gap: '10px', marginBottom: '10px' };
const popupCard = { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', position: 'fixed', top: '10%', left: '20%', right: '20%', zIndex: 10, boxShadow: '0 5px 15px rgba(0,0,0,0.2)', maxHeight: '80vh', overflowY: 'auto' };
const saveBtn = { backgroundColor: '#004d1a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' };
const discardBtn = { background: 'none', color: '#b30000', border: 'none', fontWeight: 'bold' };
const subBtn = { backgroundColor: '#f5c518', color: '#000', padding: '6px 10px', borderRadius: '4px', border: 'none' };

export default Stocks;
