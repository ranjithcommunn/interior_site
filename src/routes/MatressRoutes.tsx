import { Routes, Route } from "react-router-dom";
import KingSize from "@/Components/Categories/Matress/KingSize";
import QueenSize from "@/Components/Categories/Matress/QueenSize";
import SingleBed from "@/Components/Categories/Matress/SingleBed";
import DoubleBed from "@/Components/Categories/Matress/DoubleBed";

const MatressRouter = () => {
  return (
    <Routes>
      <Route path="king-size" element={<KingSize/>} />
      <Route path="queen-size" element={<QueenSize />} />
      <Route path="single-bed" element={<SingleBed />} />
      <Route path="double-bed" element={<DoubleBed/>} />
    </Routes>
  );
};

export default MatressRouter;
