import Link from "next/link";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <nav className="p-16 flex items-center justify-between">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Better Logbook
        </h1>
        <Link
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full outline outline-foreground bg-foreground hover:bg-background px-5 text-background hover:text-foreground transition-colors md:w-39.5"
          href="/auth/sign-in"
        >
          Sign In
        </Link>
      </nav>
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start"></main>
    </div>
  );
}
