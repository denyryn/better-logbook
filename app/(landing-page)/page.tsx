"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Brain,
  BarChart2,
  Shield,
  Zap,
  Clock,
  CheckCircle2,
  Menu,
  X,
  ArrowRight,
  FileText,
  TrendingUp,
  Users,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Let AI analyze your logbook entries and surface key achievements, patterns, and growth areas automatically.",
    },
    {
      icon: BarChart2,
      title: "Productivity Visualization",
      description:
        "See your work output over time with clean, minimal charts that make your progress undeniable.",
    },
    {
      icon: FileText,
      title: "CV Key Points",
      description:
        "Automatically generate compelling bullet points from your work log — ready to paste into your resume.",
    },
    {
      icon: Shield,
      title: "Private by Default",
      description:
        "Your data stays yours. No sharing, no selling, no third-party access. Ever.",
    },
  ];

  const benefits = [
    { icon: CheckCircle2, text: "Log work in seconds, not minutes" },
    { icon: CheckCircle2, text: "Never forget what you accomplished" },
    { icon: CheckCircle2, text: "AI-generated CV bullets on demand" },
    { icon: CheckCircle2, text: "Visualize output trends weekly" },
    { icon: CheckCircle2, text: "Export logs in any format" },
    { icon: CheckCircle2, text: "Works offline, syncs when ready" },
    { icon: CheckCircle2, text: "Zero tracking or analytics collection" },
    { icon: CheckCircle2, text: "Lightweight — no bloat" },
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      aiLimit: "50 AI requests / month",
      description: "For individuals getting started",
      features: [
        "Unlimited logbook entries",
        "50 AI requests per month",
        "Basic productivity charts",
        "CV export (text)",
        "7-day history",
      ],
      cta: "Get Started Free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      aiLimit: "500 AI requests / month",
      description: "For professionals who log daily",
      features: [
        "Unlimited logbook entries",
        "500 AI requests per month",
        "Advanced productivity charts",
        "CV export (PDF, DOCX)",
        "Unlimited history",
        "Priority support",
      ],
      cta: "Start Pro Trial",
      highlighted: true,
    },
    {
      name: "Team",
      price: "$29",
      period: "per month",
      aiLimit: "2,000 AI requests / month",
      description: "For teams tracking collective output",
      features: [
        "Everything in Pro",
        "2,000 AI requests per month",
        "Team dashboard",
        "Shared project logs",
        "Admin controls",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled ? "border-b bg-background/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-tight">Better Logbook</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#preview" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </a>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="ghost" size="sm">Login</Button>
            <Button size="sm">Get Started</Button>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background px-6 py-4 flex flex-col gap-3">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#preview" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1" onClick={() => setMobileMenuOpen(false)}>Docs</a>
            <Separator />
            <Button variant="outline" size="sm" className="w-full">Login</Button>
            <Button size="sm" className="w-full">Get Started</Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-28 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 text-xs tracking-wide uppercase">
            Now with AI insights
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
            Your work, clearly documented.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Better Logbook captures everything you do, surfaces your best work, and turns daily logs into career-ready highlights — privately, and automatically.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="w-full sm:w-auto">
              Start for free
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              See how it works
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            No credit card required. 50 free AI requests per month.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-xs tracking-wide uppercase">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need to track your work
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
              Built for professionals who want a clear record of their output without the overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover-elevate">
                  <CardHeader>
                    <div className="w-9 h-9 rounded-lg border flex items-center justify-center mb-3 bg-muted">
                      <Icon className="w-4 h-4 text-foreground" />
                    </div>
                    <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section id="preview" className="py-24 px-6 border-t bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-xs tracking-wide uppercase">Product</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
                Visualize what you've built, over time.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Each entry you make is timestamped, tagged, and fed into a productivity timeline. Watch patterns emerge, spot your peak hours, and never undersell yourself in a review again.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: TrendingUp, label: "Weekly and monthly output graphs" },
                  { icon: Zap, label: "Real-time AI analysis of entries" },
                  { icon: Clock, label: "Automatic time-tracking integration" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-7 h-7 rounded-md border flex items-center justify-center shrink-0 bg-background">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-8" size="lg">
                Try it yourself
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="relative">
              <div className="rounded-2xl border bg-background overflow-hidden shadow-lg">
                <div className="border-b px-4 py-3 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">better-logbook.app</span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">This week</span>
                    <Badge variant="outline" className="text-xs">14 entries</Badge>
                  </div>
                  {[
                    { day: "Mon", pct: 72, entries: 3 },
                    { day: "Tue", pct: 90, entries: 5 },
                    { day: "Wed", pct: 55, entries: 2 },
                    { day: "Thu", pct: 85, entries: 4 },
                    { day: "Fri", pct: 40, entries: 0 },
                  ].map(({ day, pct, entries }) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-7 shrink-0">{day}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-foreground transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-16 text-right shrink-0">
                        {entries > 0 ? `${entries} entries` : "—"}
                      </span>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <Brain className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs font-medium mb-0.5">AI Summary</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Your most productive days are Mon & Thu. You ship 60% more on days with morning log entries.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-xs tracking-wide uppercase">Why Better Logbook</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Simple tools, serious results
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
              Designed for developers, designers, and knowledge workers who want to track output without friction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {benefits.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-start gap-3 p-4 rounded-xl border bg-card hover-elevate"
              >
                <Icon className="w-4 h-4 mt-0.5 shrink-0 text-foreground" />
                <span className="text-sm leading-snug">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl border bg-muted/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center bg-background shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Your data is never shared</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  No analytics, no third-party access, no selling. Your logbook is yours alone.
                </p>
              </div>
            </div>
            <Badge variant="outline" className="shrink-0 text-xs">Privacy first</Badge>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-xs tracking-wide uppercase">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Start free, scale when you're ready
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
              Straightforward pricing with no surprises. Every plan includes unlimited log entries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.highlighted ? "border-foreground shadow-lg ring-1 ring-foreground" : ""}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="text-xs px-3">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-base font-semibold">{plan.name}</CardTitle>
                    <Badge variant="outline" className="text-xs shrink-0">{plan.aiLimit}</Badge>
                  </div>
                  <CardDescription className="text-xs mb-3">{plan.description}</CardDescription>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Separator className="mb-5" />
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-foreground" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            All plans include a 14-day money-back guarantee. No questions asked.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 text-xs tracking-wide uppercase">Get started</Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Start logging what matters.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Join professionals who use Better Logbook to stay sharp, track progress, and never undersell their work in a review.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="w-full sm:w-auto">
              Create your free account
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View live demo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-5">
            Free forever plan available. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="font-semibold text-sm">Better Logbook</span>
            </div>

            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {["Features", "Pricing", "Docs", "Privacy", "Terms", "Blog"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? "Light mode" : "Dark mode"}
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Better Logbook. All rights reserved.
            </p>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Built for professionals who ship</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
