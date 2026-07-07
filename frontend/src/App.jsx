import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Landing from './pages/Landing'
import SellerDashboard from './pages/SellerDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import ProductDetail from './pages/ProductDetail'
import ShoppingCart from './pages/ShoppingCart'
import Wishlist from './pages/Wishlist'
import BuyNow from './pages/BuyNow'
import OrderHistory from './pages/OrderHistory'

// Protected Route Component with Role Validation
function ProtectedRoute({ children, requiredRole }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF7F5] dark:bg-[#1B0B0E]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8D5A2B]"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to={user.role === 'seller' ? '/dashboard/seller' : '/dashboard/customer'} replace />
    }

    return children
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />

                    {/* Protected Seller Dashboard */}
                    <Route
                        path="/dashboard/seller"
                        element={
                            <ProtectedRoute requiredRole="seller">
                                <SellerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Customer Dashboard */}
                    <Route
                        path="/dashboard/customer"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <CustomerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Product Detail */}
                    <Route
                        path="/product/:id"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <ProductDetail />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Shopping Cart */}
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <ShoppingCart />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Wishlist */}
                    <Route
                        path="/wishlist"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <Wishlist />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Buy Now */}
                    <Route
                        path="/buy-now/:id"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <BuyNow />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Order History */}
                    <Route
                        path="/order-history"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <OrderHistory />
                            </ProtectedRoute>
                        }
                    />

                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App

