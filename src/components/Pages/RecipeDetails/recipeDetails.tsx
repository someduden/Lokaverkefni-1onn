import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Recipe } from "../../../utilities/utils";
import "./style.css";
import ErrorState from "../../ErrorState/errorState";

function getIngredients(recipe: Recipe) {
  const ingredients: { ingredient: string; measure: string }[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe] as string;
    const measure = recipe[`strMeasure${i}` as keyof Recipe] as string;

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() ?? "",
      });
    }
  }

  return ingredients;
}

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  const [similarRecipe, setSimilarRecipe] = useState<Recipe[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/404", { replace: true });
      return;
    }

    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();

        if (!data.meals) {
          navigate("/404", { replace: true });
          return;
        }

        setRecipe(data.meals?.[0] ?? null);
      } catch {
        setError("Failed to load recipe");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, retry, navigate]);

  useEffect(() => {
    if (!recipe) return;

    const fetchSimilar = async () => {
      setSimilarLoading(true);

      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
            recipe.strCategory
          )}`
        );

        const data = await res.json();

        const similar =
          data.meals
            ?.filter((m: Recipe) => m.idMeal !== recipe.idMeal)
            .slice(0, 6) ?? [];

        setSimilarRecipe(similar);
      } catch {
        console.error("Failed to load similar recipes");
      } finally {
        setSimilarLoading(false);
      }
    };

    fetchSimilar();
  }, [recipe]);

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          setError(null);
          setRecipe(null);
          setIsLoading(true);
          setRetry((r) => r + 1);
        }}
      />
    );
  }
  if (isLoading) return <p>Loading recipes...</p>;
  if (!recipe) return null;

  const ingredients = getIngredients(recipe);

  return (
    <section className="recipe-details">
      <h2>{recipe.strMeal}</h2>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />

      <div className="recipe-meta">
        <p>
          <strong>Category:</strong> {recipe.strCategory}
        </p>
        <p>
          <strong>Country:</strong> {recipe.strArea}
        </p>
      </div>

      <h3>Ingredients</h3>
      <ul className="ingred-list">
        {ingredients.map((item, index) => (
          <li key={index}>
            {item.measure} {item.ingredient}
          </li>
        ))}
      </ul>

      <h3>Instructions</h3>
      <p className="recipe-instructions">{recipe.strInstructions}</p>

      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>

      <h3>Similar Recipes</h3>
      <div className="recipe-grid">
        {similarRecipe.map((r) => (
          <div
            key={r.idMeal}
            className="similar-card"
            onClick={() => navigate(`/recipes/${r.idMeal}`)}
          >
            <img src={r.strMealThumb} alt={r.strMeal} />
            <p>{r.strMeal}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
