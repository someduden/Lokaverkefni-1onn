import { Link } from "react-router-dom";
import "./style.css";
import type { Recipe } from "../../utilities/utils";

export default function CardRecipe({ recipe }: { recipe: Recipe }) {
  const shortDescription =
    recipe.strInstructions?.split(". ").slice(0, 2).join(". ") + ".";

  const isVegan = recipe.strCategory === "Vegetarian";

  const isSpicy = /spicy|chili|chilli|curry|pepper|hot/i.test(
    recipe.strMeal + " " + recipe.strInstructions
  );

  const ingredientCount = Object.keys(recipe).filter(
    (key) => key.startsWith("strIngredient") && recipe[key as keyof Recipe]
  ).length;

  const isQuick = ingredientCount <= 6;

  return (
    <Link to={`/recipes/${recipe.idMeal}`} className="card">
      <div className="card-image-wrapper">
        <img
          src={`${recipe.strMealThumb}/preview`}
          alt={recipe.strMeal}
          className="card-image"
        />
      </div>

      <div className="card-content">
        <div className="card-badges">
          {isQuick && (
            <span
              className="badge quick"
              title="Quick recipe"
              aria-label="Quick recipe"
            >
              ⏱️
            </span>
          )}
          {isVegan && (
            <span
              className="badge vegan"
              title="Vegetarian"
              aria-label="Vegetarian recipe"
            >
              🌱
            </span>
          )}
          {isSpicy && (
            <span
              className="badge spicy"
              title="Spicy"
              aria-label="Spicy recipe"
            >
              🌶️
            </span>
          )}
        </div>

        <h3 className="card-title">{recipe.strMeal}</h3>

        <p className="card-description" title={recipe.strInstructions}>
          {shortDescription}
        </p>

        <p className="card-categ">Category: {recipe.strCategory}</p>
        <p className="card-cntry">Country: {recipe.strArea}</p>
      </div>
    </Link>
  );
}
