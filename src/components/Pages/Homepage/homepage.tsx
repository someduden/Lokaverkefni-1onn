import { useEffect, useState } from "react";
import type { Category } from "../../../utils";
import CardCtgry from "../../Card/CardCtgry/cardCategory";

export default function HomeRecipes() {
  const [category, setCategory] = useState<Category[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCtgry = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/categories.php`
        );
        const data = await response.json();
        setCategory(data.categories ?? []);
      } catch {
        setError("Whoops, something went wrong!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCtgry();
  }, []);

  return (
    <>
      <h1>Popular Recipes</h1>

      {isLoading && <p>Hleð uppskriftum...</p>}

      {!isLoading && (
        <>
          <div className="recipes-grid">
            {category.map((c) => (
              <CardCtgry key={c.idCategory} category={c} />
            ))}
          </div>
        </>
      )}

      {error && <div>{error}</div>}
    </>
  );
}
