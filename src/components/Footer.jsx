

const Footer = () => {
  return (
    <footer className="bg-[var(--dark)] text-white pt-[50px] pb-[20px] px-0">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="mb-5 text-xl font-bold">ThreadCycle Duma</h3>
            <p className="text-gray-300 mb-4">A digital platform for slow fashion and sustainable living in Dumaguete City.</p>
          </div>
        </div>
        <div className="text-center pt-5 border-t border-gray-700 text-gray-400 text-sm">
          <p>&copy; 2025 ThreadCycle Duma. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
