import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import Home from "./Pages/Home";
import Search from './Pages/Search';
import Shop from "./Pages/Shop";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import ProductViewPage from "./Pages/ProductViewPage";
import KitchenInterior from "./Pages/KitchenInterior";
import ContactUs from "./Pages/ContactUs";
import AboutUsPage from "./Pages/AboutUsPage";
import CategoryPage from "./Components/Categories/CategoryPage";
import ScrollToTop from "./Components/ScrollToTop";
import Seo from "./Components/Seo";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Seo />
        <ScrollToTop />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:category/:subCategory/:product_id" element={<ProductViewPage />} />
          <Route path="/product/:product_id" element={<ProductViewPage />} />
          <Route path="/kitchen-interior" element={<KitchenInterior />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/:category/:category_id" element={<CategoryPage />} />
          <Route path="/:category/:subCategory/:category_id" element={<CategoryPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
