import { Route,Routes } from "react-router-dom";
import CreateNote from "../pages/CreateNote";
import ViewNote from "../pages/ViewNote";

const AppRoutes = () => {
  return (
    <Routes>
        <Route path= "/" element={<CreateNote/>}/>
        <Route path ="/view/:noteId" element={<ViewNote/>}/>
    </Routes>
        )
}

export default AppRoutes;