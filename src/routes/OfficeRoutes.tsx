import { Routes, Route } from "react-router-dom";
import CabinTables from "@/Components/Categories/Office/CabinTables";
import WorkStationTables from "@/Components/Categories/Office/WorkStationTables";
import OfficeBossChairs from "@/Components/Categories/Office/OfficeBossChairs";
import OfficeVisitorschair from "@/Components/Categories/Office/OfficeVisitorschair";
import OfficeWaitingchairs from "@/Components/Categories/Office/OfficeWaitingchairs";


const OfficeRouter = () => {
  return (
    <Routes>
      <Route path="cabin-tables" element={<CabinTables/>} />
      <Route path="work-station-tables" element={<WorkStationTables />} />
      <Route path="office-boss-chairs" element={<OfficeBossChairs />} />
      <Route path="office-visitors-chair" element={<OfficeVisitorschair />} />
      <Route path="office-waiting-chairs" element={<OfficeWaitingchairs />} />
    </Routes>
  );
};

export default OfficeRouter;
