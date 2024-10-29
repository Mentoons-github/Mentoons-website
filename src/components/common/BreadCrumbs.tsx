import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter(Boolean); // Remove empty strings

  return (
    <nav>
      <ul className="flex space-x-2 items-center justify-center text-xl font-bold">
        {pathnames.length > 0 && (
          <li>
            <button onClick={() => navigate(-1)} className="flex items-center">
              <FaArrowLeft className="text-xl mr-3" />
            </button>
          </li>
        )}
        <li>
          <Link to="/">
            <figure className="w-6 h-6">
              <img
                src="/assets/home/Home icon .png"
                alt="home icon"
                className="h-full w-full object-contain"
              />
            </figure>
          </Link>
        </li>
        {pathnames.map((value, index) => {
          // Decode the pathname to handle spaces correctly
          const decodedPathname = decodeURIComponent(value);
          const to = `/${pathnames.slice(0, index + 1).join("/")}`; // Template literal

          return (
            <li key={to}>
              <span> / </span>
              <Link to={to}>
                {decodedPathname.charAt(0).toUpperCase() +
                  decodedPathname.slice(1)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
