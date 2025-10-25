import AdminSidebar from "./components/AdminSidebar"

export default function AdminBlankPage({ title }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </main>
    </div>
  )
}
