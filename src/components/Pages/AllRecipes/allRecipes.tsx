import { useEffect, useState } from "react";
import type { Recipe } from "../../../utils";
import "./style.css";
import CardRecipe from "../../Card/CardRecipe/cardRecipe";

export default function AllRecipes() {
  const [recipes, setRecipes] = useState<Recipe[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError("Whoopsy daisy!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllRecipes();
  }, []);

  return (
    <>
      <h2 className="descriptor">Allar Uppskriftir</h2>

      {isLoading && <p>Hleð uppskriftum...</p>}

      {!isLoading && (
        <>
          <div className="recipe-grid">
            {recipes.map((r) => (
              <CardRecipe key={r.idMeal} recipe={r} />
            ))}
          </div>
        </>
      )}

      {error && <div>{error}</div>}
    </>
  );
}
