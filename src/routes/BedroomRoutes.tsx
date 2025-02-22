import { Routes, Route } from "react-router-dom";
import BedCots from "@/Components/Categories/Bedroom/BedCots";
import HeadBoards from "@/Components/Categories/Bedroom/HeadBoards";
import BedRoomTables from "@/Components/Categories/Bedroom/BedRoomTables";
import BunkerBeds from "@/Components/Categories/Bedroom/BunkerBeds";

const BedroomRouter = () => {
  return (
    <Routes>
      <Route path="bed-cots" element={<BedCots/>} />
      <Route path="head-boards" element={<HeadBoards />} />
      <Route path="bed-room-tables" element={<BedRoomTables />} />
      <Route path="bunker-beds" element={<BunkerBeds/>} />
    </Routes>
  );
};

export default BedroomRouter;
