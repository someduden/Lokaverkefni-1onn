import { useNavigate } from "react-router-dom";
import "./style.css";

export default function NotFound() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <section className="not-found">
      <img src="/src/assets/404.png" alt="404" />
      <p>Sorry. It seems like we have lost the site you were looking for</p>
      <button className="not-found-btn" onClick={goHome}>
        Return Home
      </button>
    </section>
  );
}
