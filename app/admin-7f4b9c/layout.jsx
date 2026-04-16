export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#e9f7f1]">
      <main className="px-10 py-6">{children}</main>
    </div>
  );
}
