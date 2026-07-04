import NavLinks from "@/components/NavLinks";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2">
          <span className="mr-1 shrink-0 text-lg font-bold">
            Review<span className="text-indigo-600">Ops</span>
          </span>
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            <NavLinks />
          </nav>
          <form action="/api/logout" method="POST" className="shrink-0">
            <button
              type="submit"
              className="rounded-lg px-2.5 py-1.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-5">{children}</main>
    </div>
  );
}
