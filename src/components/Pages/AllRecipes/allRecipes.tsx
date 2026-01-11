import { useEffect, useState } from "react";
import type { Recipe } from "../../../utilities/utils";
import "./style.css";
import CardRecipe from "../../RecipeCard/cardRecipe";
import ErrorState from "../../ErrorState/errorState";

const recipesPerPage = 15;

export default function AllRecipes() {
  const [recipes, setRecipes] = useState<Recipe[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string[]>([]);

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
      } catch {
        setError("Failed to load recipes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllRecipes();
  }, [retry]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, selectedCountry]);

  // FILTERING
  const categories = Array.from(
    new Set(recipes.map((r) => r.strCategory).filter(Boolean))
  );

  const countries = Array.from(
    new Set(recipes.map((r) => r.strArea).filter(Boolean))
  );

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.strMeal
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(recipe.strCategory);

    const matchesCountry =
      selectedCountry.length === 0 || selectedCountry.includes(recipe.strArea);

    return matchesSearch && matchesCategory && matchesCountry;
  });

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const indexOfLast = currentPage * recipesPerPage;
  const indexOfFirst = indexOfLast - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirst, indexOfLast);

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          setError(null);
          setIsLoading(true);
          setRetry((r) => r + 1);
        }}
      />
    );
  }
  if (isLoading) return <p>Loading recipes...</p>;

  return (
    <section className="wrapper">
      {/* LEFT COLUMN */}
      <section className="content">
        <h2 className="descriptor">All Recipes</h2>

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
        <div className="search-bar">
          <label htmlFor="search-bar">Search for recipes</label>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

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

        <div className="country-filter">
          <label htmlFor="country-select">Filter by country</label>

          <select
            id="country-select"
            multiple
            value={selectedCountry}
            onChange={(e) => {
              const values = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              setSelectedCountry(values);
            }}
            className="country-select"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <button onClick={() => setSelectedCountry([])}>Clear country</button>
        </div>
      </aside>
    </section>
  );
}
