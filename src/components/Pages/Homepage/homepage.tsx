import { useEffect, useState } from "react";
import type { Recipe } from "../../../utils";
import "./style.css";
import CardRecipe from "../../CardRecipe/cardRecipe";
import ErrorState from "../../ErrorState/errorState";

const randomCount = 6;

export default function Homepage() {
  const [recipes, setRecipes] = useState<Recipe[] | []>([]);
  const [joke, setJoke] = useState<string>("");
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [jokeLoading, setJokeLoading] = useState(true);
  const [retry, setRetry] = useState(0);
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
        const response = await fetch("https://icanhazdadjoke.com/slack");
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

  if (recipesLoading) return <p>Loading recipes...</p>;
  if (jokeLoading) return <p>Loading joke...</p>;
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
