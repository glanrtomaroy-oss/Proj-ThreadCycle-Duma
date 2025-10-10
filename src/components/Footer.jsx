

const Footer = () => {
  // Minimal footer with a back-to-top anchor and a single-line disclaimer.
  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <footer className="bg-[#2C6E49] text-white py-6">
      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between gap-3">
        <button onClick={handleBackToTop} className="text-xs px-3 py-1.5 border border-white/30 rounded hover:bg-white/10 transition-colors">
          Back to top
        </button>
        <p className="text-center text-sm text-white/90 flex-1">&copy; 2025 ThreadCycle Duma. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
