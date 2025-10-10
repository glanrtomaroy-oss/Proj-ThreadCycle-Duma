

const Footer = () => {
  // Minimal footer with a text-based back-to-top anchor and a single-line disclaimer.
  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <footer className="bg-[#2C6E49] text-white py-6">
      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between gap-3">
        <a onClick={handleBackToTop} className="text-xs underline underline-offset-2 cursor-pointer hover:text-white/80">
          Back to top
        </a>
        <p className="text-center text-sm text-white/90 flex-1 m-0">&copy; 2025 ThreadCycle Duma. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
