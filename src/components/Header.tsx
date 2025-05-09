import Link from 'next/link'

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="text-yellow-300">✨</span>
          <span className="text-xl font-semibold">Book2life</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/about" 
            className="text-white hover:text-gray-200 transition-colors"
          >
            About
          </Link>
          <Link 
            href="/gallery" 
            className="text-white hover:text-gray-200 transition-colors"
          >
            Gallery
          </Link>
          <Link 
            href="/create" 
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Now
          </Link>
        </div>
      </nav>
    </header>
  )
} 