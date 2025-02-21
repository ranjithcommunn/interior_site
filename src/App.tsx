import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Search from './Pages/Search'
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import ProductViewPage from "./Pages/ProductViewPage";
import KitchenInterior from "./Pages/KitchenInterior";
import ContactUs from "./Pages/ContactUs";
import Sofa from "./Components/Categories/Sofa";


const App = () => (
  <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/product" element={<ProductViewPage />} />
      <Route path="/kitchen-interior" element={<KitchenInterior />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/sofa" element={<Sofa />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);

export default App;
