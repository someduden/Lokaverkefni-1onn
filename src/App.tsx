import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout/layout";
import HomeRecipes from "./components/Pages/Homepage/homepage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeRecipes />} />
      </Routes>
    </Layout>
  );
}

export default App;
