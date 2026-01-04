import { useEffect, useState } from "react";
import type { Recipe } from "../../../utils";
import "./style.css";
import CardRecipe from "../../CardRecipe/cardRecipe";

const recipesPerPage = 15;

export default function AllRecipes() {
  const [recipes, setRecipes] = useState<Recipe[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const letters = "abcdefghijklmnopqrstuvwxyz".split("");

        const requests = letters.map((letter) =>
          fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
          ).then((res) => res.json())
        );

        const results = await Promise.all(requests);

        const allMeals = results.flatMap((result) => result.meals ?? []);

        setRecipes(allMeals);
      } catch (err) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllRecipes();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const categories = Array.from(
    new Set(recipes.map((r) => r.strCategory).filter(Boolean))
  );

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.strMeal
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(recipe.strCategory);

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const indexOfLast = currentPage * recipesPerPage;
  const indexOfFirst = indexOfLast - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirst, indexOfLast);

  if (isLoading) return <p>Loading recipes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="wrapper">
      {/* LEFT COLUMN */}
      <section className="content">
        <h2 className="descriptor">All Recipes</h2>

        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="recipe-grid">
          {currentRecipes.length > 0 ? (
            currentRecipes.map((r) => <CardRecipe key={r.idMeal} recipe={r} />)
          ) : (
            <p>No recipes found</p>
          )}
        </div>

        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </section>

      {/* RIGHT COLUMN */}
      <aside className="sidebar">
        <div className="category-filter">
          <label htmlFor="category-select">Filter by category</label>

          <select
            id="category-select"
            multiple
            value={selectedCategories}
            onChange={(e) => {
              const values = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              setSelectedCategories(values);
            }}
            className="category-select"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button onClick={() => setSelectedCategories([])}>
            Clear categories
          </button>
        </div>
      </aside>
    </section>
  );
}
