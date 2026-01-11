import type { ReactNode } from "react";
import "./style.css";
import { Link } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <header>
        <img src="/src/assets/logo.png" className="logo" />
        <nav>
          <Link to="/">Homepage</Link>
          <Link to="/recipes">All Recipes</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; RecipeHub 2026</p>
      </footer>
    </div>
  );
}
