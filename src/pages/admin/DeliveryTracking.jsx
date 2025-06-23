import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { FaSearch } from "react-icons/fa";

// Dummy data
const defaultData = [
  {
    date: "07/12/2023",
    invoice: "62786457345",
    name: "Ramesh",
    location: "Coimbatore",
    contact: "99999 88888",
    products: 2,
    price: 100,
    trackingId: "",
  },
  {
    date: "07/12/2023",
    invoice: "62786457346",
    name: "Gokul",
    location: "Madurai",
    contact: "99999 88888",
    products: 2,
    price: 200,
    trackingId: "",
  },
  {
    date: "07/12/2023",
    invoice: "62786457351",
    name: "Akash",
    location: "Thirupur",
    contact: "99999 88888",
    products: 1,
    price: 100,
    trackingId: "BLR5150653421",
  },
  {
    date: "08/12/2023",
    invoice: "62786457362",
    name: "Kavin",
    location: "Thirupattur",
    contact: "99999 88888",
    products: 3,
    price: 300,
    trackingId: "",
  },
  {
    date: "07/12/2023",
    invoice: "62786457347",
    name: "Dhiva",
    location: "Thirupur",
    contact: "99999 88888",
    products: 1,
    price: 400,
    trackingId: "",
  },
  {
    date: "07/11/2023",
    invoice: "627864571436",
    name: "Vasanth",
    location: "Covai",
    contact: "99999 26472",
    products: 3,
    price: 100,
    trackingId: "",
  },
  {
    date: "07/12/2023",
    invoice: "62786457451",
    name: "Jeevan",
    location: "Thirupur",
    contact: "99999 88888",
    products: 1,
    price: 3000,
    trackingId: "",
  },
];

const DeliveryTracking = () => {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [inputTrackingId, setInputTrackingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("deliveryTrackingData");
    setData(saved ? JSON.parse(saved) : defaultData);
  }, []);

  const handleSaveTrackingId = () => {
    if (!inputTrackingId) return;
    const updated = data.map((item, i) =>
      i === selectedRow ? { ...item, trackingId: inputTrackingId } : item
    );
    setData(updated);
    localStorage.setItem("deliveryTrackingData", JSON.stringify(updated));
    setSelectedRow(null);
    setInputTrackingId("");
    alert("Tracking ID saved in LocalStorage successfully");
  };

  const filteredData = data.filter(
    (row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.invoice.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Delivery Tracking</h2>
          <div style={styles.controls}>
            <button style={styles.todayBtn}>Today</button>
            <div style={styles.searchBar}>
              <FaSearch color="#888" />
              <input
                type="text"
                placeholder="Search by name or invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              {[
                "Sl. no.",
                "Date",
                "Invoice number",
                "Name",
                "Location",
                "Contact Number",
                "Products",
                "Price",
                "Tracking ID",
              ].map((h) => (
                <th style={styles.th} key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}>{String(i + 1).padStart(2, "0")}</td>
                <td style={styles.td}>{row.date}</td>
                <td style={styles.td}>{row.invoice}</td>
                <td style={styles.td}>{row.name}</td>
                <td style={styles.td}>{row.location}</td>
                <td style={styles.td}>{row.contact}</td>
                <td style={styles.td}>{row.products}</td>
                <td style={styles.td}>Rs. {row.price}</td>
                <td style={styles.td}>
                  {row.trackingId ? (
                    <span>{row.trackingId}</span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedRow(i);
                        setInputTrackingId("");
                      }}
                      style={styles.trackLink}
                    >
                      Enter Track Id
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedRow !== null && (
          <div style={styles.overlay}>
            <div style={styles.card}>
              <h3 style={{ marginBottom: 10 }}>Enter Tracking ID</h3>
              <p><strong>Name:</strong> {data[selectedRow].name}</p>
              <p><strong>Invoice:</strong> {data[selectedRow].invoice}</p>
              <input
                type="text"
                placeholder="Tracking ID"
                value={inputTrackingId}
                onChange={(e) => setInputTrackingId(e.target.value)}
                style={styles.inputBox}
              />
              <div style={{ marginTop: 15, display: 'flex', gap: '10px' }}>
                <button style={styles.saveBtn} onClick={handleSaveTrackingId}>Save</button>
                <button style={styles.cancelBtn} onClick={() => setSelectedRow(null)}>Discard</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DeliveryTracking;

const styles = {
  container: {
    padding: "30px",
    fontFamily: "sans-serif",
    color: "#000",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  todayBtn: {
    padding: "8px 12px",
    backgroundColor: "#f6f6f6",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "6px 10px",
    backgroundColor: "#fff",
  },
  searchInput: {
    border: "none",
    outline: "none",
    marginLeft: "6px",
    fontSize: "14px",
    backgroundColor: "transparent",
    color:'black'
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
  },
  headerRow: {
    backgroundColor: "#f8f8f8",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    fontSize: "13px",
    fontWeight: "bold",
    borderBottom: "1px solid #ccc",
    color: "#000",
  },
  td: {
    padding: "10px 12px",
    fontSize: "13px",
    borderBottom: "1px solid #eee",
    color: "#000",
  },
  tr: {
    backgroundColor: "#fff",
  },
  trackLink: {
    background: "none",
    color: "#007bff",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px 30px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    minWidth: "300px",
  },
  inputBox: {
    marginTop: 10,
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "100%",
  },
  saveBtn: {
    backgroundColor: "green",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    color: "#000",
  },
};
