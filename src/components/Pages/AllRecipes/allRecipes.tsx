import { useEffect, useState } from "react";
import type { Recipe } from "../../../utils";

export default function AllRecipes() {
  const [recipes, setRecipes] = useState<Recipe[] | []>([]);
  const [page, setPage] = useState(1);
  const pageSize = 18;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLetterA = async () => {
      try {
        const responseA = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?f=a`
        );
        const dataA = await responseA.json();
        setRecipes(dataA.meals ?? []);
      } finally {
        <div>hi</div>;
      }
    };
  });
}
