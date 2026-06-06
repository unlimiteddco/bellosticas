import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { PatternDivider } from "@/components/sections/PatternDivider";
import { ShortTestimonials } from "@/components/sections/ShortTestimonials";
import { Services } from "@/components/sections/Services";
import { ProcessV2 } from "@/components/sections/ProcessV2";
import { ClientPortal } from "@/components/sections/ClientPortal";
import { Work } from "@/components/sections/Work";
import { Studio } from "@/components/sections/Studio";
import { Numbers } from "@/components/sections/Numbers";
import { FAQ } from "@/components/sections/FAQ";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { Footer } from "@/components/layout/Footer";
import { getProjects } from "@/lib/cms/projects";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await getProjects(locale);

  return (
    <>
      <Hero />
      <LogoMarquee />
      <ShortTestimonials />
      <Services />
      <PatternDivider height={48} size="xs" />
      <ProcessV2 />
      <ClientPortal />
      <Work projects={projects} />
      <Studio />
      <Numbers />
      <FAQ />
      <CTAFinal />
      <Footer />
    </>
  );
}
