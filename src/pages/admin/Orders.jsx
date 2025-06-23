import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const Orders = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [showInvoiceId, setShowInvoiceId] = useState(null);

  const handlePrint = () => window.print();

  const filteredData = dummyData.filter((row) => {
    const matchCategory = selectedCategory === 'All' || row.category === selectedCategory;
    const matchDate = !selectedDate || row.date === selectedDate;
    const matchProduct = selectedProduct === 'All' || row.products.some(p => p.product === selectedProduct);
    const matchSearch =
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchDate && matchProduct && matchSearch;
  });

  const handleStatusClick = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
    setShowInvoiceId(null);
  };

  const handleGenerateInvoice = (id) => {
    setShowInvoiceId(id);
    setExpandedRowId(null);
  };

  const closeInvoice = () => setShowInvoiceId(null);

  return (
    <AdminLayout>
      <div style={{ ...styles.container, filter: showInvoiceId || expandedRowId ? 'blur(2px)' : 'none' }}>
        <div style={styles.topBarContainer}>
          <h2 style={styles.title}>Orders</h2>
          <div style={styles.filterBoxSmall}>
            <select style={styles.select} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
            <select style={styles.select} onChange={(e) => setSelectedProduct(e.target.value)}>
              <option value="All">Product</option>
              {[...new Set(dummyData.flatMap(d => d.products.map(p => p.product)))].map(prod => (
                <option key={prod} value={prod}>{prod}</option>
              ))}
            </select>
            <input type="date" style={styles.datePicker} onChange={(e) => setSelectedDate(e.target.value)} />
            <input type="text" placeholder="Search..." style={styles.searchInputSmall} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Sl.</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>SubCat</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <React.Fragment key={row.id}>
                <tr style={styles.tr}>
                  <td style={styles.td}>{idx + 1}</td>
                  <td style={styles.td}>{row.date}</td>
                  <td style={styles.td}>{row.name}</td>
                  <td style={styles.td}>{row.location}</td>
                  <td style={styles.td}>{row.category}</td>
                  <td style={styles.td}>{row.subCategory}</td>
                  <td style={styles.td}>{row.products?.[0]?.product || '-'}</td>
                  <td style={styles.td}>Rs. {row.products?.[0]?.price || '-'}</td>
                  <td style={styles.td}>{row.products?.[0]?.qty || '-'}</td>
                  <td style={{ ...styles.td, color: getStatusColor(row.status), cursor: 'pointer' }} onClick={() => handleStatusClick(row.id)}>
                    {row.status}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {(expandedRowId || showInvoiceId) && (
        <div style={styles.popupCard}>
          <button style={styles.closeBtn} onClick={() => { setExpandedRowId(null); setShowInvoiceId(null); }}>×</button>
          <div style={styles.detailCardSmall}>
            {expandedRowId && (
              <>
                <h4>Customer Info</h4>
                {renderCustomerDetails(expandedRowId)}
                <h4 style={{ marginTop: 10 }}>Products</h4>
                {renderProductDetails(expandedRowId)}
                <div style={{ fontSize: '13px', marginTop: '10px', color: '#000',marginLeft:'200px' }}>
                  <p><strong>Subtotal:</strong> Rs. {getSubtotal(dummyData.find(d => d.id === expandedRowId).products)}</p>
                  <p><strong>GST (10%):</strong> Rs. {(getSubtotal(dummyData.find(d => d.id === expandedRowId).products) * 0.1).toFixed(0)}</p>
                  <p><strong>Total:</strong> Rs. {(getSubtotal(dummyData.find(d => d.id === expandedRowId).products) * 1.1).toFixed(0)}</p>
                </div>
                <button style={styles.greenBtnSmall} onClick={() => handleGenerateInvoice(expandedRowId)}>
                  Generate Invoice
                </button>
              </>
            )}

            {showInvoiceId && (
              <>
                <h3 style={{ marginBottom: '10px', color: '#000' }}>Invoice</h3>
                {renderCustomerDetails(showInvoiceId)}
                <h4 style={{ marginTop: '15px', color: '#000' }}>Products</h4>
                {renderProductDetails(showInvoiceId)}
                <div style={{ fontSize: '13px', marginTop: '10px', color: '#000',marginLeft:'200px' }}>
                  <p><strong>Subtotal:</strong> Rs. {getSubtotal(dummyData.find(d => d.id === showInvoiceId).products)}</p>
                  <p><strong>GST (10%):</strong> Rs. {(getSubtotal(dummyData.find(d => d.id === showInvoiceId).products) * 0.10).toFixed(0)}</p>
                  <p><strong>Total:</strong> Rs. {(getSubtotal(dummyData.find(d => d.id === showInvoiceId).products) * 1.10).toFixed(0)}</p>
                </div>
                <button style={{ ...styles.greenBtnSmall, marginTop: '15px',marginLeft:'200px'  }} onClick={handlePrint}>
                  Print Invoice
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

const renderCustomerDetails = (id) => {
  const row = dummyData.find(d => d.id === id);
  if (!row) return null;
  return (
    <ul style={{ fontSize: '13px', color: '#000' }}>
      <li><strong>Name:</strong> {row.name}</li>
      <li><strong>Contact:</strong> {row.contact}</li>
      <li><strong>Email:</strong> {row.email}</li>
      <li><strong>Address:</strong> {row.address}</li>
    </ul>
  );
};

const renderProductDetails = (id) => {
  const row = dummyData.find(d => d.id === id);
  if (!row || !row.products) return null;
  return (
    <table style={{ width: '100%', fontSize: '12px', marginTop: '10px', color: '#000' }}>
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
            
          <th>Price</th>
          <th>Color</th>
        
        </tr>
      </thead>
      <tbody>
        {row.products.map((p, i) => (
          <tr key={i}>
            <td>{p.product}</td>
            <td>{p.qty}</td>
            <td>Rs.{p.price}</td>
            <td>
              <div style={{ width: '15px', height: '15px', borderRadius: '3px', backgroundColor: p.color, border: '1px solid #ccc' }}></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const getSubtotal = (products) => products.reduce((sum, p) => sum + p.qty * p.price, 0);

const getStatusColor = (status) => {
  if (status === 'Dispatched') return 'green';
  if (status === 'Cancelled') return 'red';
  return '#444';
};

const styles = {
  container: { padding: '20px', fontFamily: 'sans-serif', color: '#000' },
  title: { marginRight: 'auto', fontSize: '20px', color: '#000' },
  topBarContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  filterBoxSmall: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  select: { padding: '6px', fontSize: '13px', borderRadius: '5px' },
  datePicker: { padding: '6px', fontSize: '13px', borderRadius: '5px' },
  searchInputSmall: { padding: '6px', fontSize: '13px', borderRadius: '5px', width: '160px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', backgroundColor: '#fff', color: '#000' },
  tableHeader: { backgroundColor: '#f2f2f2' },
  th: { padding: '8px', borderBottom: '1px solid #ccc' },
  td: { padding: '8px', borderBottom: '1px solid #eee' },
  tr: { backgroundColor: '#fff' },
  popupCard: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '450px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    zIndex: 1000,
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    color: '#000'
  },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#000'
  },
  detailCardSmall: { fontSize: '13px', color: '#000' },
  greenBtnSmall: { backgroundColor: 'green', color: '#fff', padding: '6px 10px', borderRadius: '5px', fontSize: '13px', marginTop: '10px',marginLeft:'200px' }
};





const dummyData = [
  {
    id: 1,
    date: '2023-12-07',
    name: 'Kavin',
    location: 'Coimbatore',
    contact: '99999 88888',
    email: 'kavin@example.com',
    address: '12, Gandhi Street, Coimbatore, Tamil Nadu, 641001',
   
    category: 'Men',
    subCategory: 'T-Shirt',
    status: 'Dispatched',
    products: [
      { code: '001', product: 'Printed', qty: 1, price: 100, size: 'M', color: '#b71c1c' },
      { code: '002', product: 'Formals', qty: 1, price: 100, size: 'L', color: '#1565c0' }
    ],
  },
   {
    id: 2,
    date: '2023-12-07',
    name: 'dhiva',
    location: 'Chennai',
    contact: '99999 635262',
    email: 'dhiva@example.com',
    address: '12, Gandhi Street, Chennai, Tamil Nadu, 641001',
   
    category: 'Men',
    subCategory: 'T-Shirt',
    status: 'Dispatched',
    products: [
      { code: '001', product: 'Printed', qty: 2, price: 100, size: 'xl', color: '#ffffff' },
      { code: '002', product: 'Formals', qty: 1, price: 500, size: 'L', color: '#1565c0' }
    ],
  },
  {
    id: 3,
    date: '2023-12-07',
    name: 'vasanth',
    location: 'Coimbatore',
    contact: '99999 12345',
    email: 'vasanth@example.com',
    address: '12, Ram Nagar, Coimbatore, Tamil Nadu, 641001',
    category: 'Men',
    subCategory: 'Shirts',
    status: 'Dispatched',
    products: [
      { code: 'M001', product: 'Checked Shirt', qty: 2, price: 450, size: 'L', color: '#4caf50' },
      { code: 'M002', product: 'Plain White Shirt', qty: 1, price: 550, size: 'M', color: '#ffffff' }
    ]
  },
  {
    id: 4,
    date: '2023-12-07',
    name: 'DhuvinRaj',
    location: 'Chennai',
    contact: '99999 635262',
    email: 'dhuvin@example.com',
    address: '14, Gandhi Street, Chennai, Tamil Nadu, 600001',
    category: 'Men',
    subCategory: 'T-Shirt',
    status: 'Dispatched',
    products: [
      { code: 'T001', product: 'Printed Tee', qty: 2, price: 300, size: 'XL', color: '#4caf50' },
      { code: 'T002', product: 'Graphic Tee', qty: 1, price: 350, size: 'L', color: '#1565c0' }
    ]
  },
  {
    id: 5,
    date: '2023-12-07',
    name: 'Aishwarya M',
    location: 'Madurai',
    contact: '98765 43210',
    email: 'aishu@example.com',
    address: '7, Flower Market, Madurai, Tamil Nadu, 625001',
    category: 'Women',
    subCategory: 'Kurthi',
    status: 'Pending',
    products: [
      { code: 'W001', product: 'Rayon Kurthi', qty: 1, price: 700, size: 'M', color: '#f06292' },
      { code: 'W002', product: 'Cotton Kurthi', qty: 2, price: 650, size: 'L', color: '#ffb300' }
    ]
  },
  {
    id: 6,
    date: '2023-12-07',
    name: 'Naveen K',
    location: 'Salem',
    contact: '99555 88112',
    email: 'naveen@example.com',
    address: '22, Steel City Road, Salem, Tamil Nadu, 636007',
    category: 'Men',
    subCategory: 'Trousers',
    status: 'Cancelled',
    products: [
      { code: 'TR001', product: 'Formal Trousers', qty: 1, price: 800, size: '34', color: '#212121' },
      { code: 'TR002', product: 'Chinos', qty: 2, price: 900, size: '32', color: '#a1887f' }
    ]
  },
  {
    id: 7,
    date: '2023-12-07',
    name: 'Sherin A',
    location: 'Tirunelveli',
    contact: '94444 22113',
    email: 'sherin@example.com',
    address: '5, River Side, Tirunelveli, Tamil Nadu, 627002',
    category: 'Women',
    subCategory: 'Saree',
    status: 'Dispatched',
    products: [
      { code: 'S001', product: 'Cotton Saree', qty: 1, price: 1000, size: 'Free', color: '#d84315' },
      { code: 'S002', product: 'Silk Saree', qty: 1, price: 2500, size: 'Free', color: '#6a1b9a' }
    ]
  }
];

export default Orders;