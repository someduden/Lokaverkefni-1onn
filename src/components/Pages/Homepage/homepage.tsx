import { useEffect, useState } from "react";
import type { Recipe } from "../../../utils";
import Card from "../../Card/card";

export default function HomeRecipes() {
  const [recipes, setRecipes] = useState<Recipe[] | []>([]);
  const [page, setPage] = useState(1);
  const pageSize = 18;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?f=p`
        );
        const data = await response.json();
        setRecipes(data.meals ?? []);
      } catch {
        setError("Whoops, something went wrong!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [page]);

  const paginatedRecipes = recipes.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(recipes.length / pageSize);

  return (
    <>
      <h1>Popular Recipes</h1>

      {isLoading && <p>Hleð uppskriftum...</p>}

      {!isLoading && (
        <>
          <div className="recipes-grid">
            {paginatedRecipes.map((r) => (
              <Card key={r.idMeal} recipe={r} />
            ))}
          </div>

          <div className="recipes-buttons">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {error && <div>{error}</div>}
    </>
  );
}
