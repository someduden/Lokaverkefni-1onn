import { useEffect, useState } from "react";
import type { Recipe } from "../../../utils";
import "./style.css";
import CardRecipe from "../../CardRecipe/cardRecipe";

const randomCount = 6;

export default function HomeRecipes() {
  const [recipes, setRecipes] = useState<Recipe[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const requests = Array.from({ length: randomCount }, () =>
          fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        );

        const responses = await Promise.all(requests);
        const data = await Promise.all(responses.map((r) => r.json()));
        const meals = data.map((d) => d.meals[0]);
        const unique = Array.from(
          new Map(meals.map((m) => [m.idMeal, m])).values()
        );

        setRecipes(unique);
      } catch (err) {
        setError("Whoops, something went wrong!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopular();
  }, []);

  if (isLoading) return <p>Loading recipes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <h2 className="home-descriptor">Popular Recipes</h2>

      <div className="recipe-grid">
        {recipes.map((r) => (
          <CardRecipe key={r.idMeal} recipe={r} />
        ))}
      </div>
    </>
  );
}
