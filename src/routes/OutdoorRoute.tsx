import { Routes, Route } from "react-router-dom";
import OutdoorDining from "@/Components/Categories/Outdoor/OutdoorDining";
import OutdoorSeatingAndChairs from "@/Components/Categories/Outdoor/OutdoorSeatingAndChairs";
import OutdoorSofas from "@/Components/Categories/Outdoor/OutdoorSofas";
import SunLoungers from "@/Components/Categories/Outdoor/SunLoungers";

const OutdoorRouter = () => {
  return (
    <Routes>
      <Route path="outdoor-dining" element={<OutdoorDining/>} />
      <Route path="outdoor-seating-and-chairs" element={<OutdoorSeatingAndChairs />} />
      <Route path="outdoor-sofas" element={<OutdoorSofas />} />
      <Route path="sun-loungers" element={<SunLoungers/>} />
    </Routes>
  );
};

export default OutdoorRouter;
