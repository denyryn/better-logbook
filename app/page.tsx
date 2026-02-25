import Link from "next/link";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <nav className="flex items-center justify-between p-16">
        <h1 className="max-w-xs text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
          Better Logbook
        </h1>
        <Link
          className="outline-foreground bg-foreground hover:bg-background text-background hover:text-foreground flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 outline transition-colors md:w-39.5"
          href="/auth/sign-in"
        >
          Sign In
        </Link>
      </nav>
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between px-16 py-32 sm:items-start"></main>
    </div>
  );
}
