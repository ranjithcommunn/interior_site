import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./store/authStore";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { CategoriesPage } from "./pages/categories/CategoriesPage";
import { ProductsListPage } from "./pages/products/ProductsListPage";
import { ProductFormPage } from "./pages/products/ProductFormPage";
import { EnquiriesPage } from "./pages/enquiries/EnquiriesPage";
import { BannersPage } from "./pages/banners/BannersPage";
import { InteriorSlidesPage } from "./pages/interiorSlides/InteriorSlidesPage";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/banners" element={<BannersPage />} />
          <Route path="/interior-slides" element={<InteriorSlidesPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/enquiries" element={<EnquiriesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
