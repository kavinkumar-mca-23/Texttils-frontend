// src/context/ProductFormContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ProductFormContext = createContext();

export const ProductFormProvider = ({ children }) => {
  const [showForm, setShowForm] = useState(false);

  const showFormNow = () => setShowForm(true);
  const hideForm = () => setShowForm(false);

  return (
    <ProductFormContext.Provider value={{ showForm, showFormNow, hideForm }}>
      {children}
    </ProductFormContext.Provider>
  );
};

export const useProductForm = () => useContext(ProductFormContext);
