import { BiChevronRight } from "react-icons/bi"
import { Link, useLocation } from "react-router-dom"

export default function Breadcrumb({ categoryName }) {
  const location = useLocation()

  return (
    <nav className="bg-gray-50 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
        <Link to="/" className="text-amber-600 hover:text-amber-700 font-medium">
          Home
        </Link>
        <BiChevronRight size={14} className="text-gray-400" />
        <span className="text-gray-600">Products</span>
        {categoryName && (
          <>
            <BiChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-900 font-medium">{categoryName}</span>
          </>
        )}
      </div>
    </nav>
  )
}
