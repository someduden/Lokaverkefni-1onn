import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/layout";
import HomeRecipes from "./components/Pages/Homepage/homepage";
import AllRecipes from "./components/Pages/AllRecipes/allRecipes";
import RecipeDetails from "./components/Pages/RecipeDetails/recipeDetails";
import NotFound from "./components/Pages/NotFound/notFound";
import ScrollToTop from "./components/ScrollToTop/scrollToTop";

function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeRecipes />} />
        <Route path="/recipes" element={<AllRecipes />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
