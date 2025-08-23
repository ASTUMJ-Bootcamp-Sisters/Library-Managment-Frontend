export default function Footer() {
  return (
    <footer className="bg-white shadow-md text-center py-3 mt-auto">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} My App. All rights reserved.
      </p>
    </footer>
  );
}
