import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import UploadProducts from './pages/admin/UploadProducts';
import Orders from './pages/admin/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import DeliveryTracking from './pages/admin/DeliveryTracking'
import Expense  from './pages/admin/Expense'
import Reviews from'./pages/admin/Reviews';
import Advertisement from './pages/admin/Advertisement'
import Stocks from './pages/admin/Stocks';
// ✅ Import the Provider

function App() {
  return (
    <Router>
      {/* Wrap all protected routes inside ProductFormProvider */}
    
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/upload-products"
            element={
              <ProtectedRoute>
                <UploadProducts />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route
            path="/admin/DeliveryTracking"
            element={
              <ProtectedRoute>
                <DeliveryTracking />
              </ProtectedRoute>
            }
          />
          <Route
          path='/admin/Expense'
          element={<ProtectedRoute>
            <Expense/>
          </ProtectedRoute>
          }
          />
          <Route
          path='/admin/Reviews'
          element={<ProtectedRoute>
            <Reviews/>
          </ProtectedRoute>}
          />
          <Route
          path='/admin/Advertisement'
          element={<ProtectedRoute>
            <Advertisement/>
          </ProtectedRoute>}
          />
          <Route
          path='/admin/Stocks'
          element={<ProtectedRoute>
            <Stocks/>
          </ProtectedRoute>}
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
     
    </Router>
  );
}

export default App;
