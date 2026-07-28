import { createFileRoute } from "@tanstack/react-router";
import { Droplets, MapPin, Bell, ShieldCheck, Users, Zap, Smartphone, ArrowRight, CheckCircle2, Menu } from "lucide-react";
import heroImage from "@/assets/hero-water.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

const APK_DOWNLOAD_URL = "/Majiscope-User.apk";
const REPORT_WEB_APP_URL = "https://majiscope-0196.onrender.com";
const BRAND_IMAGE_URL = "/logo.png";

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <About />
        <HowItWorks />
        <WhyItMatters />
        <ReportEntry />
        <DownloadApp />
      </main>
      <Footer />
    </div>
  );
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={BRAND_IMAGE_URL}
        alt=""
        aria-hidden="true"
        className="h-12 w-12 rounded-xl bg-white object-contain p-1 shadow-[var(--shadow-card)]"
      />
      <span className="font-display text-xl font-extrabold tracking-tight">
        Maji<span className="text-brand">Scope</span>
      </span>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#about" className="transition-colors hover:text-foreground">About</a>
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#why" className="transition-colors hover:text-foreground">Why it matters</a>
          <a href="#app" className="transition-colors hover:text-foreground">Mobile app</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#report"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-[var(--shadow-card)] transition-all hover:opacity-90"
          >
            Report Now <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <button className="grid h-9 w-9 place-items-center rounded-lg border border-border md:hidden" aria-label="Menu">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
      <div
        className="absolute inset-0 opacity-25 mix-blend-overlay"
        style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />

      <div className="relative mx-auto max-w-6xl px-5 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-soft" />
            Trusted community water reporting
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Report water issues quickly.
            <span className="block text-brand-soft">Help fix them faster.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            MajiScope makes it easy for every citizen to report leaks, shortages, and water quality problems â€” and connects your report to the people who can act on it.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#report"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-brand-deep shadow-[var(--shadow-elegant)] transition-transform hover:-translate-y-0.5"
            >
              Report a Problem <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={APK_DOWNLOAD_URL}
              download
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <Smartphone className="h-4 w-4" /> Download App
            </a>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-6 text-white">
            <Stat value="24/7" label="Reporting" />
            <Stat value="Free" label="For all citizens" />
            <Stat value="Fast" label="Response tracking" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-extrabold sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs text-white/70 sm:text-sm">{label}</div>
    </div>
  );
}

function TrustBar() {
  const items = [
    { icon: ShieldCheck, text: "Official civic platform" },
    { icon: MapPin, text: "Location-aware reporting" },
    { icon: Bell, text: "Real-time status updates" },
    { icon: Users, text: "Community-driven" },
  ];
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
            <Icon className="h-5 w-5 shrink-0 text-brand" strokeWidth={2} />
            <span className="font-medium">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-deep">
      {children}
    </span>
  );
}

function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionLabel>What is MajiScope</SectionLabel>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
            A trusted way for communities to report water issues.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            MajiScope is a public reporting platform that connects citizens with the water service providers responsible for their area. Report a burst pipe, low pressure, contamination, or a shortage â€” and see it reach the right team.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Submit reports from anywhere, in seconds",
              "Track the status of your submission",
              "Help improve service delivery in your area",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span className="text-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-[image:var(--gradient-soft)]" />
          <div className="relative rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-brand-foreground">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">New Report</div>
                <div className="font-semibold">Water leak Â· Riverside Rd</div>
              </div>
              <span className="ml-auto rounded-full bg-brand-tint px-2.5 py-1 text-xs font-semibold text-brand-deep">In review</span>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              {[
                { label: "Reported", value: "Today, 08:42" },
                { label: "Location", value: "Ward 4 â€” Riverside" },
                { label: "Assigned to", value: "City Water Services" },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between border-b border-border/70 pb-2 last:border-0">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-medium">{r.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
              {["Received", "Reviewed", "Resolved"].map((s, i) => (
                <div key={s} className={`rounded-lg py-2 font-medium ${i === 0 ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", icon: MapPin, title: "You report the issue", text: "Open MajiScope, describe the problem, add a photo, and share your location." },
    { n: "02", icon: Bell, title: "It reaches the right team", text: "Your report is routed to the water service responsible for your area and reviewed." },
    { n: "03", icon: CheckCircle2, title: "Action is taken", text: "You get updates as the issue moves from reviewed to resolved." },
  ];
  return (
    <section id="how" className="border-y border-border bg-[image:var(--gradient-soft)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
            Three simple steps from report to resolution.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map(({ n, icon: Icon, title, text }) => (
            <div key={n} className="group relative rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-tint text-brand-deep">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <span className="font-display text-3xl font-extrabold text-brand/20">{n}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyItMatters() {
  const items = [
    { icon: Zap, title: "Faster reporting", text: "Cut out phone calls and paperwork â€” report in under a minute." },
    { icon: MapPin, title: "Better visibility", text: "Pinpoint issues on a map so services know exactly where to go." },
    { icon: Users, title: "Stronger community", text: "See what's happening around you and add your voice." },
    { icon: ShieldCheck, title: "Improved service", text: "Data helps utilities respond quicker and plan better." },
  ];
  return (
    <section id="why" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <SectionLabel>Why it matters</SectionLabel>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
            Small reports. Big impact on service delivery.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every report helps utilities prioritize repairs, track recurring issues, and improve water access for everyone.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/40">
              <Icon className="h-8 w-8 text-brand" strokeWidth={1.75} />
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReportEntry() {
  return (
    <section id="report" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-elegant)]">
          <div className="grid gap-10 p-8 md:grid-cols-2 md:p-14">
            <div className="text-white">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
                Start reporting
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-4xl">
                Two easy ways to report a water issue.
              </h2>
              <p className="mt-4 text-white/85">
                Choose the option that works best for you. Whether you're at home or out in the community, MajiScope is ready.
              </p>
            </div>

            <div className="grid gap-4">
              <a
                href={REPORT_WEB_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl bg-white p-6 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-tint text-brand-deep">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-brand-deep">Report on the web</div>
                    <div className="text-sm text-muted-foreground">Open the reporting page in your browser</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-brand-deep transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={APK_DOWNLOAD_URL}
                download
                className="group flex items-center justify-between rounded-2xl border border-white/25 bg-white/10 p-6 text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/15">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold">Use the mobile app</div>
                    <div className="text-sm text-white/75">Report on the go from anywhere</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DownloadApp() {
  return (
    <section id="app" className="pb-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 rounded-3xl border border-border bg-card p-8 md:grid-cols-[1.2fr_1fr] md:items-center md:p-14">
          <div>
            <SectionLabel>Mobile app</SectionLabel>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-4xl">
              Take MajiScope with you.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Report issues, attach photos, and track responses right from your phone. Free to download, simple to use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <StoreBtn top="Download the" bottom="Android APK" />
              <StoreBtn top="Install on" bottom="Your phone" />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xs">
            <div className="absolute inset-0 rotate-3 rounded-[2.5rem] bg-[image:var(--gradient-hero)] opacity-90" />
            <div className="relative rounded-[2.5rem] border-8 border-brand-deep bg-card p-4 shadow-[var(--shadow-elegant)]">
              <div className="rounded-2xl bg-[image:var(--gradient-soft)] p-5">
                <div className="flex items-center gap-2">
                  <img src={BRAND_IMAGE_URL} alt="" aria-hidden="true" className="h-7 w-7 rounded-lg bg-white object-contain p-0.5" />
                  <span className="font-display font-bold">MajiScope</span>
                </div>
                <div className="mt-6 space-y-3">
                  {["Leak reported", "Assigned to team", "Being resolved"].map((t, i) => (
                    <div key={t} className="flex items-center gap-3 rounded-xl bg-card p-3 text-sm shadow-sm">
                      <div className={`h-2 w-2 rounded-full ${i < 2 ? "bg-brand" : "bg-muted-foreground/30"}`} />
                      <span className="font-medium">{t}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-brand-foreground">
                  New Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoreBtn({ top, bottom }: { top: string; bottom: string }) {
  return (
    <a
      href={APK_DOWNLOAD_URL}
      download
      className="flex items-center gap-3 rounded-xl bg-brand-deep px-5 py-3 text-white transition-transform hover:-translate-y-0.5"
    >
      <Smartphone className="h-6 w-6" />
      <div className="text-left leading-tight">
        <div className="text-[10px] uppercase tracking-wider opacity-80">{top}</div>
        <div className="text-sm font-bold">{bottom}</div>
      </div>
    </a>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A trusted community platform for reporting water issues and improving service delivery.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold">Platform</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#about" className="hover:text-foreground">About</a></li>
            <li><a href="#how" className="hover:text-foreground">How it works</a></li>
            <li><a href="#report" className="hover:text-foreground">Report now</a></li>
            <li><a href="#app" className="hover:text-foreground">Download app</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold">Help</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Contact support</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
            <li><a href="#" className="hover:text-foreground">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>Â© {new Date().getFullYear()} MajiScope. A community water reporting service.</p>
          <p>Made for stronger communities.</p>
        </div>
      </div>
    </footer>
  );
}




