import { Link } from "react-router-dom";
import "./style.css";
import type { Category } from "../../../utils";

export default function CardCtgry({ category }: { category: Category }) {
  return (
    <Link to={`/homepage/${category.idCategory}`} className="card">
      <div className="card-image-wrapper">
        <img
          src={`${category.strCategoryThumb}`}
          alt={category.strCategory}
          className="card-image"
        />
      </div>

      <div>
        <h3 className="card-title">{category.strCategory}</h3>
        <p className="card-categ">{category.strCategoryDescription}</p>
      </div>
    </Link>
  );
}
