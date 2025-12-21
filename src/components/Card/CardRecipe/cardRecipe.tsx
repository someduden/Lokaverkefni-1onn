import { Link } from "react-router-dom";
import "./style.css";
import type { Recipe } from "../../../utils";

export default function CardRecipe({ recipe }: { recipe: Recipe }) {
  return (
    <Link to={`/recipes/${recipe.idMeal}`} className="card">
      <div className="card-image-wrapper">
        <img
          src={`${recipe.strMealThumb}/preview`}
          alt={recipe.strMeal}
          className="card-image"
        />
      </div>

      <div>
        <h3 className="card-title">{recipe.strMeal}</h3>
        <p className="card-categ">Category: {recipe.strCategory}</p>
        <p className="card-cntry">Country: {recipe.strArea}</p>
      </div>
    </Link>
  );
}
