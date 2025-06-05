import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              🎉 Purchase Order Management System
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">⚡ Vite</h3>
                <p className="text-blue-600 text-sm">Lightning fast development</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">⚛️ React 18</h3>
                <p className="text-green-600 text-sm">Modern React with TypeScript</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">🎨 Tailwind</h3>
                <p className="text-purple-600 text-sm">Beautiful, responsive UI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
