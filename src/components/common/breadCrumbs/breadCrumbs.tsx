import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="p-4 text-sm text-gray-600">
      <nav className="flex gap-2 items-center">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        {pathnames.map((value, index) => {
          const to = "/" + pathnames.slice(0, index + 1).join("/");

          return (
            <span key={to} className="flex items-center gap-2">
              <span className="text-gray-400">/</span>
              <Link
                to={to}
                className="text-blue-600 capitalize hover:underline"
              >
                {decodeURIComponent(value.replace(/-/g, " "))}
              </Link>
            </span>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumbs;
