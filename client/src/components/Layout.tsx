import type React from "react"
import { Link, useLocation } from "react-router-dom"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Sistema de Clientes
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/customers"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/customers" || location.pathname === "/"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Lista de Clientes
              </Link>
              <Link
                to="/customers/new"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/customers/new"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Novo Cliente
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}

export default Layout
