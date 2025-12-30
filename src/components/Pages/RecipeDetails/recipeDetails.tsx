import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Recipe } from "../../../utils";
import "./style.css";

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
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();
        setRecipe(data.meals?.[0] ?? null);
      } catch {
        setError("Shiiiiiit");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (isLoading) return <p>Loading recipes...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Recipe was not found!</p>;

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

      <button className="back-button" onClick={() => window.history.back()}>
        Back
      </button>
    </section>
  );
}
