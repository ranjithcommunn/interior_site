import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MedusaProvider } from "medusa-react";
import Home from "./Pages/Home";
import Search from './Pages/Search';
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import ProductViewPage from "./Pages/ProductViewPage";
import KitchenInterior from "./Pages/KitchenInterior";
import ContactUs from "./Pages/ContactUs";
// import LivingRoutes from "./routes/LivingRoutes";
// import StorageRoutes from "./routes/StorageRoutes";
// import DiningRoutes from "./routes/DiningRoutes";
// import BedroomRouter from "./routes/BedroomRoutes";
// import MatressRouter from "./routes/MatressRoutes";
// import OfficeRouter from "./routes/OfficeRoutes";
// import OutdoorRouter from "./routes/OutdoorRoute";
// import StudyRouter from "./routes/StudyRoutes";
import { QueryClient } from "@tanstack/react-query";
import CategoryPage from "./Components/Categories/CategoryPage";

const queryClient = new QueryClient();
const BASE_URL = "http://localhost:9000"; // Medusa backend URL

const App = () => (
  <MedusaProvider baseUrl={BASE_URL} queryClientProviderProps={{ client: queryClient }} publishableApiKey={import.meta.env.VITE_APP_MEDUSA_API_KEY}>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product" element={<ProductViewPage />} />
        <Route path="/kitchen-interior" element={<KitchenInterior />} />
        <Route path="/contact-us" element={<ContactUs />} />
        {/* <Route path="/living/*" element={<LivingRoutes />} />
        <Route path="/storage/*" element={<StorageRoutes />} />
        <Route path="/dining/*" element={<DiningRoutes />} />
        <Route path="/bedroom/*" element={<BedroomRouter />} />
        <Route path="/matress/*" element={<MatressRouter />} />
        <Route path="/office/*" element={<OfficeRouter />} />
        <Route path="/outdoor/*" element={<OutdoorRouter />} />
        <Route path="/study/*" element={<StudyRouter />} /> */}
        <Route path="/:category" element={<CategoryPage />} />
        <Route path="/:category/:subCategory/:category_id" element={<CategoryPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </MedusaProvider>
);

export default App;
