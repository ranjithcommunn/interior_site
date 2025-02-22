import { Routes, Route } from "react-router-dom";
import StudyTables from "@/Components/Categories/Study/StudyTables";
import Chairs from "@/Components/Categories/Study/Chairs";


const StudyRouter = () => {
  return (
    <Routes>
      <Route path="study-tables" element={<StudyTables/>} />
      <Route path="study-chairs" element={<Chairs />} />
    </Routes>
  );
};

export default StudyRouter;
