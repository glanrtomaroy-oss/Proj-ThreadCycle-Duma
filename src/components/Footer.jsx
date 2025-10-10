

const Footer = () => {
  // Minimal footer with a text-based back-to-top anchor and a single-line disclaimer.
  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <footer className="bg-[#2C6E49] text-white py-6">
      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between gap-3">
        <a
          onClick={handleBackToTop}
          aria-label="Back to top"
          title="Back to top"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 shadow-sm text-lg leading-none cursor-pointer hover:text-white/90 select-none"
        >
          ↑
        </a>
        <p className="text-center text-sm text-white/90 flex-1 m-0">&copy; 2025 ThreadCycle Duma. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
