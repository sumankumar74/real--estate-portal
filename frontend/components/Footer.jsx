
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="text-2xl font-bold">
            Estate<span className="text-amber-400">Hub</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-emerald-100/80">
            Find your next home with confidence. Explore properties for sale
            and rent in the places you love.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-amber-400">Explore</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-emerald-100/80">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/properties?type=For Sale" className="hover:text-white">Buy Property</Link>
            <Link to="/properties?type=For Rent" className="hover:text-white">Rent Property</Link>
            <Link to="/properties" className="hover:text-white">All Properties</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-amber-400">Account</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-emerald-100/80">
            <Link to="/login" className="hover:text-white">Log In</Link>
            <Link to="/register" className="hover:text-white">Create Account</Link>
            <Link to="/favourites" className="hover:text-white">Favourites</Link>
          </div>
        </div>

        <div id="contact">
          <h3 className="font-semibold text-amber-400">Contact Us</h3>
          <p className="mt-4 text-sm leading-6 text-emerald-100/80">
            Have questions about a property? Get in touch with our team.
          </p>
          <a
            href="mailto:support@estatehub.example"
            className="mt-3 inline-block text-sm text-white underline underline-offset-4 hover:text-amber-400"
          >
            Email our team
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-sm text-emerald-100/70 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} EstateHub. All rights reserved.</p>
          <p>Find your place. Build your future.</p>
        </div>
      </div>
    </footer>
  );
}
