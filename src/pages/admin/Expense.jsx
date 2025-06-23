import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { FaSearch } from "react-icons/fa";

const ExpensePage = () => {
  // Static dummy data
  const dummyExpenses = [
    {
      date: "2025-06-20",
      category: "Office Supplies",
      subCategory: "Stationery",
      amount: "1500",
      description: "Purchase of pens and notebooks",
      status: "Paid",
    },
    {
      date: "2025-06-18",
      category: "Travel",
      subCategory: "Taxi",
      amount: "800",
      description: "Client meeting travel expense",
      status: "Paid",
    },
    {
      date: "2025-06-17",
      category: "Maintenance",
      subCategory: "Printer",
      amount: "1200",
      description: "Printer repair charges",
      status: "Unpaid",
    },
  ];

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : dummyExpenses;
  });

  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    subCategory: "",
    amount: "",
    description: "",
    status: "Paid",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  useEffect(() => {
    handleFilter();
  }, [expenses, searchTerm, dateRange]);

  const handleFilter = () => {
    let data = [...expenses];

    if (searchTerm.trim()) {
      data = data.filter(
        (exp) =>
          exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      data = data.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= fromDate && expDate <= toDate;
      });
    }

    setFilteredExpenses(data);
  };

  const handleAddExpense = () => {
    const updated = [...expenses, formData];
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
    setFormData({
      date: "",
      category: "",
      subCategory: "",
      amount: "",
      description: "",
      status: "Paid",
    });
    setShowForm(false);
  };

  const handleSaveToLocal = () => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    alert("Expenses saved to localStorage.");
  };

  const handlePrint = () => {
    window.print();
  };

  const getTotal = () => {
    const paid = expenses
      .filter((e) => e.status === "Paid")
      .reduce((acc, e) => acc + Number(e.amount), 0);
    const unpaid = expenses
      .filter((e) => e.status === "Unpaid")
      .reduce((acc, e) => acc + Number(e.amount), 0);
    return { paid, unpaid, total: paid + unpaid };
  };

  const totals = getTotal();

  return (
    <AdminLayout>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>Expense</h3>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              style={styles.datePicker}
            />
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              style={styles.datePicker}
            />
            <div style={styles.searchBar}>
              <FaSearch color="#888" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <button style={styles.addButton} onClick={() => setShowForm(true)}>
              + Add Expense
            </button>
          </div>
        </div>

        {/* Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.headerCell}>Sl. No.</th>
              <th style={styles.headerCell}>Date</th>
              <th style={styles.headerCell}>Category</th>
              <th style={styles.headerCell}>Sub Category</th>
              <th style={styles.headerCell}>Description</th>
              <th style={styles.headerCell}>Amount</th>
              <th style={styles.headerCell}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                  No matching records found.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp, i) => (
                <tr key={i} style={i % 2 === 0 ? styles.zebraRow : {}}>
                  <td style={styles.cell}>{String(i + 1).padStart(2, "0")}</td>
                  <td style={styles.cell}>{exp.date}</td>
                  <td style={styles.cell}>{exp.category}</td>
                  <td style={styles.cell}>{exp.subCategory}</td>
                  <td style={styles.cell}>{exp.description}</td>
                  <td style={styles.cell}>₹ {exp.amount}</td>
                  <td style={{ ...styles.cell, color: exp.status === "Paid" ? "green" : "red" }}>
                    {exp.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div style={styles.totalSummary}>
          <span style={{ color: "#ff8c00" }}>Paid Amount: ₹{totals.paid}</span>
          <span style={{ color: "red", marginLeft: 20 }}>Unpaid Amount: ₹{totals.unpaid}</span>
          <span style={{ color: "green", marginLeft: 20 }}>Total Amount: ₹{totals.total}</span>
        </div>

        {/* Save & Print */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <button style={styles.printBtn} onClick={handlePrint}>
            Print
          </button>
          <button style={styles.saveLocalBtn} onClick={handleSaveToLocal}>
            Save
          </button>
        </div>

        {/* Add Expense Modal */}
        {showForm && (
          <div style={styles.overlay}>
            <div style={styles.modalCard}>
              <h3 style={{ marginBottom: 20 }}>Add Expense</h3>

              <div style={styles.grid}>
                <div style={styles.inputGroup}>
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label>Sub Category</label>
                  <input
                    type="text"
                    placeholder="Sub Category"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label>Amount</label>
                  <input
                    type="number"
                    placeholder="₹ Amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label>Description</label>
                <textarea
                  placeholder="Enter details"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={styles.textarea}
                />
              </div>

              <div style={{ marginTop: 10, marginBottom: 10 }}>
                <label style={{ fontWeight: 600 }}>Status</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="status"
                      value="Paid"
                      checked={formData.status === "Paid"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                    <span style={{ color: "green", marginLeft: 5 }}>● Paid</span>
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="status"
                      value="Unpaid"
                      checked={formData.status === "Unpaid"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                    <span style={{ color: "red", marginLeft: 5 }}>● Unpaid</span>
                  </label>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>
                  Discard
                </button>
                <button style={styles.saveBtn} onClick={handleAddExpense}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ExpensePage;



// Styles
const styles = {
  container: {
    padding: "30px",
    fontFamily: "sans-serif",
    color: "#000",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: "10px",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  datePicker: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
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
  },
  addButton: {
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  printBtn: {
    backgroundColor: "#ddd",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    
  },
  saveLocalBtn: {
    backgroundColor: "darkgreen",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  headerCell: {
    padding: "12px 16px",
    backgroundColor: "#f9f9f9",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: "14px",
  },
  cell: {
    padding: "12px 16px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
    textAlign: "left",
  },
  zebraRow: {
    backgroundColor: "#fafafa",
  },
  totalSummary: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
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
  modalCard: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.3)",
    minWidth: "600px",
    maxWidth: "700px",
    width: "90%",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "12px",
  },
  input: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "100%",
  },
  textarea: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    resize: "none",
    fontFamily: "inherit",
    width: "100%",
  },
  radioGroup: {
    display: "flex",
    gap: "20px",
    marginTop: "8px",
    alignItems: "center",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: 500,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  saveBtn: {
    backgroundColor: "green",
    color: "#fff",
    padding: "10px 24px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "#f1f1f1",
    padding: "10px 24px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold",
    color: "#000",
    cursor: "pointer",
  },
};


