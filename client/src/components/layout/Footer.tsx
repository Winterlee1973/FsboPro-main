import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">HomeDirect</div>
            <p className="text-blue-200 mb-6">
              The smarter way to sell your home without agent commissions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/list-property">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">List Your Property</span>
                </Link>
              </li>
              <li>
                <Link href="/#premium-package">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">Premium Listings</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">Seller Resources</span>
                </Link>
              </li>
              <li>
                <Link href="/#premium-package">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">Pricing</span>
                </Link>
              </li>
              <li>
                <Link href="/#testimonials">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">Success Stories</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Buyers</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/search">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">Search Listings</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">Saved Searches</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">Make an Offer</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">Financing Options</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">Buyer Resources</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">How It Works</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">Contact Us</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">Careers</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="text-blue-200 hover:text-white transition cursor-pointer">Press</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} HomeDirect. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#">
              <span className="text-blue-200 hover:text-white text-sm transition cursor-pointer">Privacy Policy</span>
            </Link>
            <Link href="#">
              <span className="text-blue-200 hover:text-white text-sm transition cursor-pointer">Terms of Service</span>
            </Link>
            <Link href="#">
              <span className="text-blue-200 hover:text-white text-sm transition cursor-pointer">Cookie Policy</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
