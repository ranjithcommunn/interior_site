import { Routes, Route } from "react-router-dom";
import BeanBags from "@/Components/Categories/Living/BeanBags";
import Chairs from "@/Components/Categories/Living/Chairs";
import Pouffes from "@/Components/Categories/Living/Pouffes";
import Recliners from "@/Components/Categories/Living/Recliners";
import Sofa from "@/Components/Categories/Living/Sofa";
import SofaCumBed from "@/Components/Categories/Living/SofaCumBed";
import Tables from "@/Components/Categories/Living/Tables";

const LivingRoutes = () => {
  return (
    <Routes>
      <Route path="sofa" element={<Sofa />} />
      <Route path="sofa-cum-bed" element={<SofaCumBed />} />
      <Route path="recliners" element={<Recliners />} />
      <Route path="chairs" element={<Chairs />} />
      <Route path="tables" element={<Tables />} />
      <Route path="bean-bags" element={<BeanBags />} />
      <Route path="pouffes" element={<Pouffes />} />
    </Routes>
  );
};

export default LivingRoutes;
