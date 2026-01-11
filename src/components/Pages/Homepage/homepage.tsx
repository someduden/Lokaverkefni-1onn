import { useEffect, useState } from "react";
import { getCache, setCache, type Recipe } from "../../../utilities/utils";
import "./style.css";
import CardRecipe from "../../RecipeCard/cardRecipe";
import ErrorState from "../../ErrorState/errorState";

const randomCount = 6;

export default function Homepage() {
  const [recipes, setRecipes] = useState<Recipe[] | []>([]);
  const [joke, setJoke] = useState<string>("");
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [jokeLoading, setJokeLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const CACHE_KEY = "homepage_random_recipes";
  const CACHE_TTL = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const fetchPopular = async () => {
      setRecipesLoading(true);
      setError(null);

      const cached = getCache<Recipe[]>(CACHE_KEY, CACHE_TTL);
      if (cached) {
        setRecipes(cached);
        setRecipesLoading(false);
        return;
      }

      try {
        const meals: Recipe[] = [];

        for (let i = 0; i < randomCount; i++) {
          const res = await fetch("/api/mealdb/api/json/v1/1/random.php");
          const data = await res.json();
          meals.push(data.meals[0]);
        }

        const unique = Array.from(
          new Map(meals.map((m) => [m.idMeal, m])).values()
        );

        setRecipes(unique);
        setCache(CACHE_KEY, unique, CACHE_TTL);
      } catch {
        setError("Failed to load recipes");
      } finally {
        setRecipesLoading(false);
      }
    };

    fetchPopular();
  }, [retry]);

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        const response = await fetch("https://icanhazdadjoke.com/slack", {
          headers: {
            Accept: "application/json",
          },
        });
        const data = await response.json();

        setJoke(data.attachments[0].text);
      } catch {
        setError("Failed to load joke");
      } finally {
        setJokeLoading(false);
      }
    };

    fetchJoke();
  }, [retry]);

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          setError(null);
          setRecipesLoading(true);
          setJokeLoading(true);
          setRetry((r) => r + 1);
        }}
      />
    );
  }
  if (recipesLoading) return <p>Loading recipes...</p>;
  if (jokeLoading) return <p>Loading joke...</p>;

  return (
    <>
      <section className="popular-recipe-wrapper">
        <h2 className="home-descriptor">Popular Recipes</h2>

        <div className="recipe-grid">
          {recipes.map((r) => (
            <CardRecipe key={r.idMeal} recipe={r} />
          ))}
        </div>
      </section>

      <section className="hp-joke">
        <h3>Funny lil' joke for you</h3>

        <div className="joke">{joke}</div>
      </section>
    </>
  );
}
