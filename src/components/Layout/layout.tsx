import type { ReactNode } from "react";
import "./style.css";
import { Link } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <header>
        <nav>
          <Link to="/">Heimasíða</Link>
          <Link to="/homepage">Allar uppskriftir</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>Uppskriftir fyrir mig</p>
      </footer>
    </div>
  );
}
