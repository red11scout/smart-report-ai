import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-xl text-slate-600 mb-8">Page Not Found</p>
      <Link href="/">
        <a className="px-6 py-3 bg-[#001278] text-white rounded-lg font-medium hover:bg-[#001278]/90 transition-colors">
          Back to Home
        </a>
      </Link>
    </div>
  );
}
