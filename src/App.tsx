import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MedusaProvider } from "medusa-react";
import Home from "./Pages/Home";
import Search from './Pages/Search';
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import ProductViewPage from "./Pages/ProductViewPage";
import KitchenInterior from "./Pages/KitchenInterior";
import ContactUs from "./Pages/ContactUs";
import { QueryClient } from "@tanstack/react-query";
import CategoryPage from "./Components/Categories/CategoryPage";

const queryClient = new QueryClient();
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const App = () => (
  <MedusaProvider baseUrl={BASE_URL} queryClientProviderProps={{ client: queryClient }} publishableApiKey={import.meta.env.VITE_APP_MEDUSA_API_KEY}>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:category/:subCategory/:product_id" element={<ProductViewPage />} />
        <Route path="/kitchen-interior" element={<KitchenInterior />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/:category/:category_id" element={<CategoryPage />} />
        <Route path="/:category/:subCategory/:category_id" element={<CategoryPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </MedusaProvider>
);

export default App;
