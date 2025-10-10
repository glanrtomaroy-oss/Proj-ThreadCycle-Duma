

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2C6E49] text-white pt-10 pb-6">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-xl font-bold">ThreadCycle Duma</h3>
          <button onClick={handleBackToTop} className="text-sm px-3 py-1.5 border border-white/30 rounded hover:bg-white/10 transition-colors">
            Back to top
          </button>
        </div>
        <p className="text-gray-200 mt-3 text-sm max-w-3xl">
          A digital platform for slow fashion and sustainable living in Dumaguete City.
        </p>
        <div className="text-center pt-5 border-t border-white/20 text-white/80 text-sm mt-5">
          <p className="mb-1">&copy; 2025 ThreadCycle Duma. All rights reserved.</p>
          <p className="text-xs opacity-80">Disclaimer: Information is provided as-is and may change without notice.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
