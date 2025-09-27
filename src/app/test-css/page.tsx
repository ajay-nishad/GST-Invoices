export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">CSS Test Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">
              Card 1
            </h2>
            <p className="text-gray-600">
              This is a test card to verify Tailwind CSS is working properly.
            </p>
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Test Button
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              Card 2
            </h2>
            <p className="text-gray-600">
              If you can see styled elements, Tailwind CSS is working correctly.
            </p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Another Button
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Card 3</h2>
            <p className="text-gray-600">
              Check the browser developer tools to see if CSS is loading.
            </p>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
              Red Button
            </button>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            CSS Status Check
          </h3>
          <ul className="text-blue-800 space-y-1">
            <li>
              ✓ If you see colors, backgrounds, and spacing - CSS is working
            </li>
            <li>✓ If buttons have hover effects - CSS is working</li>
            <li>✓ If the layout is responsive - CSS is working</li>
            <li>✓ If text has proper typography - CSS is working</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
