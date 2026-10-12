import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { ShortTestimonials } from "@/components/sections/ShortTestimonials";
import { Services } from "@/components/sections/Services";
import { ProcessBlock } from "@/components/sections/ProcessBlock";
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
      {/* Servicios y, enseguida, la prueba: los casos. El cómo se trabaja
          (proceso y portal, en un solo bloque) va después de haber visto qué
          se ha hecho. */}
      <Services />
      <Work projects={projects} />
      <ProcessBlock />
      <Studio />
      <Numbers />
      <FAQ />
      <CTAFinal />
      <Footer />
    </>
  );
}
