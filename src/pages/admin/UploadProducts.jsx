import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { FaPlus, FaPencilAlt, FaEye, FaTrash } from 'react-icons/fa';

const initialForm = {
  productCode: '',
  category: 'Men',
  subCategory: '',
  productName: '',
  productType: 'Western Wear',
  price: '',
  gst: '10%',
  status: 'Active',
  image: '',
  colors: [],
  sizes: [],
  quantity: '',
};

const UploadProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [editIndex, setEditIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [variants, setVariants] = useState([{ color: '#800000', size: 'S', quantity: 1 }]);
  const [previewCard, setPreviewCard] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const productsPerPage = 5;
  
useEffect(() => {
  const uploadedProducts = JSON.parse(localStorage.getItem('uploadedProducts')) || [];
  const deletedDummyCodes = JSON.parse(localStorage.getItem('deletedDummyCodes')) || [];

  // Exclude deleted dummy products
  const remainingDummy = dummyProductData.filter(
    (item) => !deletedDummyCodes.includes(item.productCode)
  );

  const combinedProducts = [...remainingDummy, ...uploadedProducts];

  setProducts(combinedProducts);
  setFiltered(combinedProducts);
}, []);




  useEffect(() => {
    let temp = [...products];
    if (categoryFilter !== 'All') {
      temp = temp.filter(p => p.category === categoryFilter);
    }
    if (statusFilter !== 'All') {
      temp = temp.filter(p => p.status === statusFilter);
    }
    if (search.trim()) {
      temp = temp.filter(p =>
        p.productCode.toLowerCase().includes(search.toLowerCase()) ||
        p.productName.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(temp);
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, products]);

  const paginatedData = filtered.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, options) => {
    const selected = Array.from(options).filter(option => option.selected).map(option => option.value);
    setFormData(prev => ({ ...prev, [field]: selected }));
  };

  const handleSubmit = () => {
  if (!formData.productCode || !formData.productName || !formData.price) {
    alert('Product Code, Name, and Price are required.');
    return;
  }
  setPreviewCard(true); // Show preview card
  setShowForm(false);   // Hide form
};
const handleFinalUpload = () => {
  const imageToUse = selectedImage || formData.image || '';

  const newData = {
    ...formData,
    image: imageToUse,
    postedOn: new Date().toLocaleDateString('en-GB'),
    variants,
  };

  const updatedList = [...products];

  if (editIndex !== null) {
    updatedList[editIndex] = newData;
  } else {
    updatedList.push(newData);
  }

  // Save only uploaded products (exclude dummy)
  const onlyUploaded = updatedList.filter(
    (p) => !dummyProductData.some((d) => d.productCode === p.productCode)
  );

  localStorage.setItem('uploadedProducts', JSON.stringify(onlyUploaded));

  setProducts(updatedList);

  // 👉 THIS IS VERY IMPORTANT (re-apply filter so table updates)
  let temp = [...updatedList];
  if (categoryFilter !== 'All') {
    temp = temp.filter(p => p.category === categoryFilter);
  }
  if (statusFilter !== 'All') {
    temp = temp.filter(p => p.status === statusFilter);
  }
  if (search.trim()) {
    temp = temp.filter(p =>
      p.productCode.toLowerCase().includes(search.toLowerCase()) ||
      p.productName.toLowerCase().includes(search.toLowerCase())
    );
  }
  setFiltered(temp);

  // Reset form
  setEditIndex(null);
  setFormData(initialForm);
  setVariants([{ color: '#800000', size: 'S', quantity: 1 }]);
  setPreviewCard(false);
  setSelectedImage(null);
};





const handleBackFromPreview = () => {
  setShowForm(true);
  setPreviewCard(false);
};

//IMG logic
const handleImageSelect = (file) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => {
    setSelectedImage(reader.result);
  };
  reader.readAsDataURL(file);
};






const handleEdit = (index) => {
    const actualIndex = products.findIndex(
      (item) => item.productCode === paginatedData[index].productCode
    );
    const selectedProduct = products[actualIndex];

    setEditIndex(actualIndex);
    setFormData({
      ...selectedProduct,
      image: selectedProduct.image || '',
      status: selectedProduct.status || 'Active',
    });
    setVariants(selectedProduct.variants || [{ color: '#800000', size: 'S', quantity: 1 }]);
    setShowForm(true);
  };

  const handleView = (index) => {
    const itemIndex = (currentPage - 1) * productsPerPage + index;
    setViewData(filtered[itemIndex]);
  };

const handleDelete = (index) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this product?');
  if (!confirmDelete) return;

  const itemIndex = (currentPage - 1) * productsPerPage + index;
  const itemToDelete = filtered[itemIndex];

  const updatedList = products.filter(p => p.productCode !== itemToDelete.productCode);

  // Save only uploaded products (exclude dummy)
  const onlyUploaded = updatedList.filter(
    (p) => !dummyProductData.some((d) => d.productCode === p.productCode)
  );

  localStorage.setItem('uploadedProducts', JSON.stringify(onlyUploaded));

  // 👉 Track deleted dummy products
  if (dummyProductData.some((d) => d.productCode === itemToDelete.productCode)) {
    const deletedDummyCodes = JSON.parse(localStorage.getItem('deletedDummyCodes')) || [];
    const updatedDeletedCodes = [...deletedDummyCodes, itemToDelete.productCode];
    localStorage.setItem('deletedDummyCodes', JSON.stringify(updatedDeletedCodes));
  }

  setProducts(updatedList);
};

  const handleVariantChange = (index, key, value) => {
    const updated = [...variants];
    updated[index][key] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { color: '#800000', size: 'S', quantity: 1 }]);
  };

  const iconBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '18px',
};

  const cell = {
    padding: '12px',
    borderBottom: '1px solid #eee',
    color: '#000',
  };
  const inputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    color: '#000',
    width: '100%',
  };
  return (
    <AdminLayout>
      <div style={{ padding: '30px', backgroundColor: '#f9f9f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ color: '#2c3e50' }}>Product Details</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
  type="text"
  placeholder="Search by Code or Name"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    padding: '6px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#000',
    backgroundColor: '#fff',
    width: '180px',
    height:"45px",
    outline: 'none',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
    marginRight:'50px',
    marginTop:'5px'
  }}
/>

            <button
              onClick={() => {
                setFormData(initialForm);
                setEditIndex(null);
                setShowForm(true);
              }}
              style={{ backgroundColor: '#007b5e', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '6px',height:"40px", marginRight:'50px',marginTop:'10px' }}
            >
              <FaPlus style={{ marginRight: '10px' }} /> New Product
            </button>
          </div>
        </div>

        {/* BLUR OVERLAY */}
        {(showForm || viewData) && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(5px)', zIndex: 9
          }}></div>
        )}

        {/* FORM */}
     {showForm && (
    <div style={{
      position: 'absolute', top: '5%', left: '30%', right: '10%',
      background: '#fff', padding: '30px', borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)', zIndex: 10,
      width:'500px'
    }}>
      <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600', color: '#000' }}>{editIndex !== null ? 'Edit Product' : 'New Product'}</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <input placeholder="Product Code" value={formData.productCode} onChange={(e) => handleChange('productCode', e.target.value)} style={inputStyle} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} style={inputStyle}>
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
            <option>Accessories</option>
          </select>
          <a href="#" onClick={() => handleChange('category', prompt('Enter new category'))} style={{ fontSize: '12px', color: '#007b5e' }}>Add New Category</a>
        </div>

        <input placeholder="Sub Category" value={formData.subCategory} onChange={(e) => handleChange('subCategory', e.target.value)} style={inputStyle}  />
        <input placeholder="Product Name" value={formData.productName} onChange={(e) => handleChange('productName', e.target.value)} style={inputStyle} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select value={formData.productType} onChange={(e) => handleChange('productType', e.target.value)} style={inputStyle}>
            <option>Western Wear</option>
            <option>Traditional Wear</option>
            <option>Sportswear</option>
            <option>Casual Wear</option>
            <option>Formal Wear</option>
          </select>
          <a href="#" onClick={() => handleChange('productType', prompt('Enter new product type'))} style={{ fontSize: '12px', color: '#fff' }}>Add New Product Type</a>
        </div>

        <input placeholder="Price" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} style={inputStyle} />
        <input placeholder="GST" value={formData.gst} onChange={(e) => handleChange('gst', e.target.value)} style={inputStyle} />
      </div>

      <p style={{ marginTop: '20px', marginBottom: '10px', fontWeight: '500', color: '#000' }}>Available Colours, Sizes & Quantity.</p>

      {variants.map((variant, index) => (
        <div key={index} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <label style={{ fontWeight: '500', color: '#000' }}>Colour</label>
            <input type="color" value={variant.color} onChange={(e) => handleVariantChange(index, 'color', e.target.value)} style={{ width: '100%', height: '38px', padding: '2px' }} />
          </div>

          <div>
            <label style={{ fontWeight: '500', color: '#000' }}>Size</label>
            <select value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} style={inputStyle}>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
              <option>XXL</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: '500', color: '#000' }}>Quantity</label>
            <input type="number" value={variant.quantity} onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)} style={inputStyle} />
          </div>
        </div>
      ))}

      <div style={{ marginTop: '10px', textAlign: 'right' }}>
        <a href="#" onClick={addVariant} style={{ fontSize: '12px', color: '#007b5e' }}>Add More</a>
     </div>

      {/* ✅ Image Preview (Small with Photo: label and delete option) */}
{/* Image Upload and Preview Row */}
<div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    flexWrap: 'wrap',
    gap: '20px',
  }}
>
  {/* Upload Image Button */}
  <button
    onClick={() => setShowImageUpload(true)}
    style={{
      backgroundColor: '#fff',
      border: '1px solid #28a745',
      color: '#28a745',
      height: '50px',
      fontWeight: '500',
      width: '150px',
    }}
  >
    Upload Image
  </button>

  {/* Uploaded Image Preview */}
  {formData.image && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <p style={{ color: '#000', margin: 0 }}><strong>Photo:</strong></p>
      <img
        src={formData.image}
        alt="Uploaded Thumbnail"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '6px',
          objectFit: 'cover',
          border: '1px solid #aaa',
        }}
      />
    </div>
  )}
</div>

   <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button
  onClick={() => setShowForm(false)}
  style={{
    padding: '10px 20px',
    borderRadius: '6px',
    backgroundColor: '#fff',
    border: '1px solid white',
    color: 'red'
  }}
>
  Discard
</button>

        <button onClick={handleSubmit} style={{ padding: '10px 20px', borderRadius: '6px', backgroundColor: '#007b5e', color: '#fff', border: 'none' }}>Continue</button>
      </div>
    </div>
  )

  
}
     {/*previewCard*/}
{previewCard && (
  <div style={{
    position: 'absolute',
    top: '10%',
    left: '20%',
    right: '20%',
    maxWidth: '800px',
    margin: '0 auto',
    background: '#fff',
    padding: '20px 30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    zIndex: 10,
    overflowY: 'auto',
  }}>
    <h3 style={{ color: '#000', marginBottom: '20px' }}>Preview Product</h3>


    {/* ✅ Product Details */}
    <p style={{ color: '#000' }}><strong>Product Code:</strong> {formData.productCode}</p>
    <p style={{ color: '#000' }}><strong>Product Name:</strong> {formData.productName}</p>
    <p style={{ color: '#000' }}><strong>Category:</strong> {formData.category}</p>
    <p style={{ color: '#000' }}><strong>Subcategory:</strong> {formData.subCategory}</p>
    <p style={{ color: '#000' }}><strong>Product Type:</strong> {formData.productType}</p>
    <p style={{ color: '#000' }}><strong>Price:</strong> ₹{formData.price}</p>
    <p style={{ color: '#000' }}><strong>GST:</strong> {formData.gst}</p>

    
    {/* ✅ Image Preview */}
 {/* ✅ GST and Image Thumbnail Side-by-Side */}
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>


 {formData.image && (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <p style={{ color: '#000', margin: 0 }}><strong>Photo:</strong></p>
    <img
      src={formData.image}
      alt="Uploaded Thumbnail"
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '6px',
        objectFit: 'cover',
        border: '1px solid #aaa'
      }}
    />
  </div>
)}
</div>


    {/* ✅ Status Radio Options */}
    <div style={{ marginTop: '10px' }}>
      <strong style={{ color: '#000' }}>Status:</strong>
      <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
        {[
          { label: 'Active', color: 'green' },
          { label: 'Inactive', color: 'orange' },
          { label: 'Out of Stock', color: 'red' },
        ].map(({ label, color }) => (
          <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#000' }}>
            <input
              type="radio"
              name="status"
              value={label}
              checked={formData.status === label}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            />
            <span style={{
              color,
              fontWeight: formData.status === label ? '600' : '400'
            }}>{label}</span>
          </label>
        ))}
      </div>
    </div>

    {/* ✅ Variant Details */}
    <p style={{ color: '#000', marginTop: '20px' }}><strong>Variants:</strong></p>
    <ul style={{ marginLeft: '20px' }}>
      {variants.map((v, idx) => (
        <li key={idx} style={{ color: '#000', fontSize: '14px', marginBottom: '5px' }}>
          Color: <span style={{
            display: 'inline-block', width: '15px', height: '15px',
            backgroundColor: v.color, borderRadius: '50%', marginRight: '5px', verticalAlign: 'middle'
          }}></span>
          | Size: {v.size} | Quantity: {v.quantity}
        </li>
      ))}
    </ul>

    {/* ✅ Action Buttons */}
    <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
      <button onClick={handleBackFromPreview} style={{ padding: '10px 20px', borderRadius: '6px', backgroundColor: '#ccc', border: 'none' }}>Back</button>
      <button onClick={handleFinalUpload} style={{ padding: '10px 20px', borderRadius: '6px', backgroundColor: '#007b5e', color: '#fff', border: 'none' }}>Upload</button>
    </div>
  </div>
)}



{/*IMGAES UPLOAD CARD */}

{showImageUpload && (
  <div style={{
    position: 'absolute', top: '5%', left: '10%', right: '10%',
    background: '#fff', padding: '30px', borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', zIndex: 10
  }}>
    <h3 style={{ color: '#000' }}>Upload Product Image</h3>

    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleImageSelect(file);
      }}
      style={{
        border: '2px dashed #ccc',
        borderRadius: '10px',
        padding: '30px',
        textAlign: 'center',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9',
      }}
    >
      {selectedImage ? (
        <img
          src={selectedImage}
          alt="Preview"
          style={{ maxWidth: '100%', maxHeight: '200px' }}
        />
      ) : (
        <p style={{ color: '#555' }}>Drag and drop image here or click below to browse</p>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageSelect(e.target.files[0])}
        style={{ marginTop: '10px' }}
      />
    </div>

    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
      <button
        onClick={() => setShowImageUpload(false)}
        style={{ padding: '10px 20px', borderRadius: '6px', backgroundColor: '#ccc', border: 'none' }}
      >
        Back
      </button>
      <button
        onClick={() => {
          handleChange('image', selectedImage);
          setShowImageUpload(false);
        }}
        disabled={!selectedImage}
        style={{
          padding: '10px 20px',
          borderRadius: '6px',
          backgroundColor: selectedImage ? '#007b5e' : '#aaa',
          color: '#fff',
          border: 'none',
          cursor: selectedImage ? 'pointer' : 'not-allowed'
        }}
      >
        Continue
      </button>
    </div>
  </div>
)}
{/*privew card img show*/}



   


        {/* VIEW MODAL */}
{/* VIEW MODAL */}
{viewData && (
  <div
    style={{
      position: 'absolute',
      top: '10%',
      left: '25%',
      right: '25%',
      background: '#fff',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      zIndex: 10,
    }}
  >
    <h3 style={{ color: '#000' }}>{viewData.productName}</h3>

    {/* ✅ Show small photo preview with label */}
{viewData && (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px'
  }}>
   
  </div>
)}

    <p style={{ color: '#000' }}>Code: {viewData.productCode}</p>
    <p style={{ color: '#000' }}>Category: {viewData.category}</p>
    <p style={{ color: '#000' }}>Subcategory: {viewData.subCategory}</p>
    <p style={{ color: '#000' }}>Price: ₹{viewData.price}</p>
    <p style={{ color: '#000' }}>GST: {viewData.gst}</p>
     {viewData.image && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <p style={{ color: '#000', margin: 0 }}><strong>Photo:</strong></p>
        <img
          src={viewData.image}
          alt="Uploaded Thumbnail"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            objectFit: 'cover',
            border: '1px solid #aaa'
          }}
        />
      </div>
    )}
    <p style={{ color: '#000' }}>Status: {viewData.status}</p>

    <p style={{ color: '#000', marginTop: '20px' }}><strong>Variants:</strong></p>
    <ul style={{ marginLeft: '20px' }}>
      {(viewData.variants || []).map((v, idx) => (
        <li key={idx} style={{ color: '#000', marginBottom: '6px', fontSize: '14px' }}>
          Color:
          <span
            style={{
              display: 'inline-block',
              backgroundColor: v.color,
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              margin: '0 10px 0 5px',
              verticalAlign: 'middle',
            }}
          />
          | Size: {v.size} | Quantity: {v.quantity}
        </li>
      ))}
    </ul>

    <button
      onClick={() => setViewData(null)}
      style={{
        marginTop: '20px',
        backgroundColor: '#ccc',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
      }}
    >
      Close
    </button>
  </div>
)}

        {/* PRODUCT TABLE */}
        {!showForm && !viewData && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                {['Active', 'Inactive', 'Out of Stock'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    style={{
                      padding: '10px 16px',
                      border: 'none',
                      borderBottom: statusFilter === tab ? '3px solid #007b5e' : 'none',
                      backgroundColor: 'transparent',
                      color: statusFilter === tab ? '#007b5e' : '#555',
                      fontWeight: statusFilter === tab ? 'bold' : 'normal',
                      cursor: 'pointer'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #ccc',marginRight:'50px' }}>
                <option value="All">Category: All</option>
                <option>Men</option><option>Women</option><option>Kids</option><option>Accessories</option>
              </select>
            </div>

            <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f2f2f2', color: '#333' }}>
                  <tr>
                    <th style={cell}>Sl. no</th>
                    <th style={cell}>Posted</th>
                    <th style={cell}>Product Code</th>
                    <th style={cell}>Category</th>
                    <th style={cell}>Subcategory</th>
                    <th style={cell}>Product</th>
                    <th style={cell}>Price</th>
                    <th style={cell}>GST</th>
                    <th style={cell}>Status</th>
                   <div style={{marginLeft:'70px', marginTop:'10px'}}> <th style={cell}>Action</th></div>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length ? paginatedData.map((prod, i) => {
                    const index = (currentPage - 1) * productsPerPage + i;
                    return (
                      <tr key={i} style={{ textAlign: 'center', color: '#000' }}>
                        <td style={cell}>{index + 1}</td>
                        <td style={cell}>{prod.postedOn}</td>
                        <td style={cell}>{prod.productCode}</td>
                        <td style={cell}>{prod.category}</td>
                        <td style={cell}>{prod.subCategory}</td>
                        <td style={cell}>{prod.productName}</td>
                        <td style={cell}>{`₹${prod.price}`}</td>
                        <td style={cell}>{prod.gst}</td>
                        <td style={{ ...cell, color: prod.status === 'Active' ? 'green' : prod.status === 'Inactive' ? 'orange' : 'red' }}>{prod.status}</td>
                        <td style={cell}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                            <button onClick={() => handleView(i)} style={{ ...iconBtn, color: '#000' }} title="View"><FaEye /></button>
                            <button onClick={() => handleEdit(i)} style={{ ...iconBtn, color: '#007bff' }} title="Edit"><FaPencilAlt /></button>
                            <button onClick={() => handleDelete(i)} style={{ ...iconBtn, color: 'red' , marginRight:'30px'}} title="Delete"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      backgroundColor: currentPage === i + 1 ? '#007b5e' : '#fff',
                      color: currentPage === i + 1 ? '#fff' : '#000',
                      cursor: 'pointer'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};



const dummyProductData = [
  {
    postedOn: '2025-06-20',
    productCode: '01',
    category: 'Men',
    subCategory: 'T-Shirts',
    productName: 'Basic Cotton T-Shirt',
    price: 499,
    gst: '12%',
    status: 'Active',
    
    variants: [
      { color: '#000000', size: 'M', quantity: 10 },
    ]
  },
  {
    postedOn: '2025-06-18',
    productCode: '02',
    category: 'Women',
    subCategory: 'Dresses',
    productName: 'Floral Summer Dress',
    price: 1299,
    gst: '18%',
    status: 'Inactive',
   
    variants: [
      { color: '#FF69B4', size: 'S', quantity: 4 },
      { color: '#FF69B4', size: 'M', quantity: 6 },
      { color: '#FF69B4', size: 'L', quantity: 3 },
    ],
  },
  {
    postedOn: '2025-06-15',
    productCode: '03',
    category: 'Kids',
    subCategory: 'Footwear',
    productName: 'Kids Sports Shoes',
    price: 899,
    gst: '5%',
    status: 'Out of Stock',
    
    variants: [
      { color: '#FF0000', size: '2', quantity: 0 },
      { color: '#0000FF', size: '3', quantity: 0 },
    ],
  },
  {
    postedOn: '2025-06-10',
    productCode: '04',
    category: 'Accessories',
    subCategory: 'Watches',
    productName: 'Stylish Wrist Watch',
    price: 1999,
    gst: '12%',
    status: 'Active',
   
    variants: [
      { color: '#C0C0C0', size: 'Standard', quantity: 15 },
    ],
  },
  {
    postedOn: '2025-06-08',
    productCode: '05',
    category: 'Men',
    subCategory: 'Shirts',
    productName: 'Formal Blue Shirt',
    price: 799,
    gst: '12%',
    status: 'Inactive',
   
    variants: [
      { color: '#0000FF', size: 'M', quantity: 7 },
      { color: '#0000FF', size: 'L', quantity: 5 },
      { color: '#0000FF', size: 'XL', quantity: 2 },
    ],
  },
  {
    postedOn: '2025-06-05',
    productCode: '06',
    category: 'Women',
    subCategory: 'Handbags',
    productName: 'Leather Shoulder Bag',
    price: 1599,
    gst: '18%',
    status: 'Out of Stock',
   
    variants: [
      { color: '#8B4513', size: 'Standard', quantity: 0 },
    ],
  },
  {
    postedOn: '2025-06-01',
    productCode: '07',
    category: 'Kids',
    subCategory: 'Toys',
    productName: 'Remote Control Car',
    price: 499,
    gst: '5%',
    status: 'Active',
    
    variants: [
      { color: '#FF0000', size: 'Standard', quantity: 12 },
    ],
  },
];




export default UploadProducts;