import React, { useEffect, useRef } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { FaShirt, FaChild, FaPersonDress } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import gsap from "gsap";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const containerRef = useRef(null);

//   useEffect(() => {
//   const el = containerRef.current;

//   // 💡 Reset opacity and transform before animation
//   gsap.set(el, { opacity: 1, y: 0 });

//   // ✅ Then run entrance animation
//   gsap.from(el, {
//     opacity: 0,
//     y: 40,
//     duration: 1,
//     ease: "power2.out",
//   });
// }, []);


  const graphData = [
    { name: "Mon", sales: 200 },
    { name: "Tue", sales: 300 },
    { name: "Wed", sales: 250 },
    { name: "Thu", sales: 180 },
    { name: "Fri", sales: 270 },
    { name: "Sat", sales: 230 },
  ];

  const revenueData = [
    { name: "Mens", value: 30000, color: "#006400" },
    { name: "Womens", value: 20000, color: "#228B22" },
    { name: "Kids", value: 10000, color: "#20B2AA" },
    { name: "Accessories", value: 10000, color: "#90EE90" },
  ];

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #28a745",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    color: "#000",
  };

  const thtd = {
    borderBottom: "1px solid #ccc",
    padding: "10px",
    fontSize: "14px",
    textAlign: "left",
    color: "#000",
  };

  const boxWrapper = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginTop: "20px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  };

  return (
    <AdminLayout>
      <div
        ref={containerRef}
        style={{ padding: "20px", marginTop: "-25px", backgroundColor: "rgb(241, 255, 252)" }}

      >
        {/* Top Cards */}
        <div style={{ display: "flex", gap: "20px" }}>
          {[
            { label: "Mens", value: 500, icon: <FaShirt size={28} /> },
            { label: "Womens", value: 660, icon: <FaPersonDress size={28} /> },
            { label: "Kids", value: 400, icon: <FaChild size={28} /> },
            { label: "Accessories", value: 250, icon: <FaShoppingBag size={28} /> },
          ].map((item, idx) => (
            <div
              key={idx}
              className="shadow-sm p-3 rounded"
              style={{ ...cardStyle, cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div>
                <b>{item.value}</b>
                <br />
                {item.label}
              </div>
              {item.icon}
            </div>
          ))}
        </div>

        {/* Sales Graph + Revenue */}
        <div style={boxWrapper}>
          {/* Sales Graph */}
          <div style={{ ...cardStyle, flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <b>Sale's Graph</b>
              <select className="form-select form-select-sm" style={{ width: "80px" }}>
                <option>Week</option>
              </select>
            </div>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={graphData}>
                  <XAxis dataKey="name" stroke="#000" />
                  <YAxis stroke="#000" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#228B22"
                    strokeWidth={3}
                    dot={{ fill: "#228B22" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue */}
          <div style={{ ...cardStyle, flexDirection: "column" }}>
            <div
              style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 10 }}
            >
              <b>Revenue</b>
              <select className="form-select form-select-sm" style={{ width: "90px" }}>
                <option>Today</option>
              </select>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <PieChart width={160} height={160}>
                <Pie
                  data={revenueData}
                  cx={80}
                  cy={80}
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {revenueData.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "4px",
                        backgroundColor: item.color,
                        marginRight: "8px",
                      }}
                    ></div>
                    <span style={{ fontWeight: 500, fontSize: "14px", color: "#000" }}>{item.name}</span>
                    <span style={{ marginLeft: "auto", color: "#000", fontSize: "14px" }}>
                      Rs.{item.value.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Orders + Low Stock */}
        <div style={boxWrapper}>
          {/* Orders */}
          <div style={{ ...cardStyle, flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <b>Orders</b>
              <button className="btn btn-outline-success btn-sm">View All</button>
            </div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thtd}>Sl. no.</th>
                  <th style={thtd}>Name</th>
                  <th style={thtd}>Location</th>
                  <th style={thtd}>Mobile Number</th>
                  <th style={thtd}>Products</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["01", "Praveen", "Coimbatore", "67567 65291", "Shirt"],
                  ["02", "Gokul", "Nagercoil", "98354 67328", "Pant"],
                  ["03", "Priya", "Tirunelveli", "76342 56789", "Tops"],
                  ["04", "Angel", "Chennai", "43336 72829", "Saree"],
                  ["05", "Abishta", "Madurai", "93657 83241", "Kurthi"],
                ].map((row, idx) => (
                  <tr key={idx}>{row.map((cell, i) => <td key={i} style={thtd}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Low Stock */}
          <div style={{ ...cardStyle, flexDirection: "column" }}>
            <b>Low Stock</b>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thtd}>Code</th>
                  <th style={thtd}>Product</th>
                  <th style={thtd}>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["26767", "Saree", "09"],
                  ["26767", "Leggings", "10"],
                  ["26767", "T-shirt", "12"],
                  ["26767", "Hand kerchief", "13"],
                  ["26767", "Nighty", "18"],
                ].map(([code, product, qty], i) => (
                  <tr key={i}>
                    <td style={thtd}>{code}</td>
                    <td style={thtd}>{product}</td>
                    <td style={{ ...thtd, color: "red" }}>{qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Table */}
        <div style={{ ...cardStyle, flexDirection: "column", marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <b>Expense</b>
            <button className="btn btn-outline-success btn-sm">View All</button>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thtd}>Sl. no.</th>
                <th style={thtd}>Date</th>
                <th style={thtd}>Category</th>
                <th style={thtd}>Sub Category</th>
                <th style={thtd}>Amount</th>
                <th style={thtd}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["01", "10/11/2023", "Plumbing", "Taps, Pipes", "Rs.1,000", "Paid"],
                ["02", "12/11/2023", "Painting", "Paint Brush", "Rs.450", "Unpaid"],
                ["03", "12/11/2023", "Carpentry", "Wood", "Rs.6,000", "Paid"],
                ["04", "11/11/2023", "Transport", "Diesel", "Rs.600", "Unpaid"],
                ["05", "11/11/2023", "Electrical", "Wires", "Rs.1,300", "Paid"],
              ].map(([a, b, c, d, e, f], i) => (
                <tr key={i}>
                  <td style={thtd}>{a}</td>
                  <td style={thtd}>{b}</td>
                  <td style={thtd}>{c}</td>
                  <td style={thtd}>{d}</td>
                  <td style={thtd}>{e}</td>
                  <td style={{ ...thtd, color: f === "Paid" ? "green" : "red" }}>{f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
