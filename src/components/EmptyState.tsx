export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {/* Illustration */}
      <div className="mb-10 relative">
        <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center relative">
          {/* Phone illustration */}
          <div className="w-16 h-24 bg-gray-800 rounded-lg relative">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-600 rounded-full"></div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-600 rounded-full"></div>
          </div>
          {/* Hand illustration */}
          <div className="absolute -right-2 -bottom-2">
            <div className="w-12 h-12 bg-orange-300 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-400 rounded-full relative">
                <div className="absolute top-1 left-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text content */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {`Let's get you started`}
      </h2>
      <p className="text-gray-500 max-w-md leading-relaxed">
        {`Use the "Add new link" button to get started. Once you have more than
        one link, you can reorder and edit them. We're here to help you share
        your profiles with everyone!`}
      </p>
    </div>
  );
}
