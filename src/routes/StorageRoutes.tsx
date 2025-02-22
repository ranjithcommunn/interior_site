import { Routes, Route } from "react-router-dom";
import TVUnits from "@/Components/Categories/Storage/TVUnits";
import BookShelves from "@/Components/Categories/Storage/BookShelves";
import ShoeRack from "@/Components/Categories/Storage/ShoeRack";
import DressingTable from "@/Components/Categories/Storage/DressingTable";
import Wardrobes from "@/Components/Categories/Storage/Wardrobes";

const StorageRoutes = () => {
  return (
    <Routes>
      <Route path="tv-units" element={<TVUnits />} />
      <Route path="book-shelves" element={<BookShelves />} />
      <Route path="shoe-rack" element={<ShoeRack />} />
      <Route path="dressing-table" element={<DressingTable />} />
      <Route path="wardrobes" element={<Wardrobes />} />
    </Routes>
  );
};

export default StorageRoutes;
