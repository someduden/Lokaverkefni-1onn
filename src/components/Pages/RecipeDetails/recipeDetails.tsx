import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Recipe } from "../../../utils";
import "./style.css";

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

  if (isLoading) return <p>Hleð uppskrift...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Uppskrift fannst ekki</p>;

  return (
    <section className="recipe-details">
      <h2>{recipe.strMeal}</h2>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />

      <div className="recipe-meta">
        <p>
          <strong>Flokkur:</strong> {recipe.strCategory}
        </p>
        <p>
          <strong>Uppruni:</strong> {recipe.strArea}
        </p>
      </div>

      <h3>Leiðbeiningar</h3>
      <p className="recipe-instructions">{recipe.strInstructions}</p>

      <button className="back-button" onClick={() => window.history.back()}>
        Til baka
      </button>
    </section>
  );
}
