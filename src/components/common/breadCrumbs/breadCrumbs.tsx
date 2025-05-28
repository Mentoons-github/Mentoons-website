import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Regular expression to detect common ID formats (UUID or MongoDB ObjectID)
  const isId = (segment: string) => {
    // UUID: 8-4-4-4-12 characters (hex)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    // MongoDB ObjectID: 24 hexadecimal characters
    const objectIdRegex = /^[0-9a-f]{24}$/i;
    return uuidRegex.test(segment) || objectIdRegex.test(segment);
  };

  return (
    <div className="p-4 text-sm text-gray-600">
      <nav className="flex gap-2 items-center">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        {pathnames.map((value, index) => {

          const to = "/" + pathnames.slice(0, index + 1).join("/");

          if (isId(value)) {
            return null;
          }

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
