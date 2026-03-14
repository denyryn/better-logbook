import Link from "next/link";
import HeroSection from "./_components/hero.section";
import FeatureSection from "./_components/feature.section";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <nav className="flex items-center justify-between p-16">
        <h1 className="max-w-xs text-2xl md:text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
          Better Logbook
        </h1>
        <Link
          href="/auth/sign-in"
          className="outline-foreground bg-foreground hover:bg-background text-background hover:text-foreground flex h-10 md:h-12 items-center justify-center gap-2 rounded-full px-5 outline transition-colors w-16 md:w-39.5"
        >
          Sign In
        </Link>
      </nav>
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-between px-16 py-32 sm:items-start">
        <HeroSection />
        <FeatureSection
          features={[
            {
              title: "Task Management",
              description: "Keep track of your tasks and stay organized.",
              icon: "📝",
            },
            {
              title: "Collaboration",
              description: "Work together with your team seamlessly.",
              icon: "🤝",
            },
            {
              title: "Analytics",
              description: "Gain insights into your project's progress.",
              icon: "📊",
            },
          ]}
        />
      </main>
    </div>
  );
}
