import { Routes, Route } from "react-router-dom";
import DiningTables from "@/Components/Categories/Dining/DiningTables";
import DiningChairs from "@/Components/Categories/Dining/DiningChairs";
import CrockeryUnits from "@/Components/Categories/Dining/CrockeryUnits";

const DiningRoutes = () => {
  return (
    <Routes>
      <Route path="dining-tables" element={<DiningTables />} />
      <Route path="dining-chairs" element={<DiningChairs />} />
      <Route path="crockery-units" element={<CrockeryUnits />} />
    </Routes>
  );
};

export default DiningRoutes;
