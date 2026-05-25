import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { PortfolioCard } from "@/components/marketing/PortfolioCard";
import { PROJECTS } from "@/lib/constants/content";

export default function Portfolio() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-20 bg-[var(--color-primary-black)]">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading 
            title="Our Work" 
            subtitle="A showcase of our most transformative campaigns and brand identities."
            centered
            dark
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {PROJECTS.map((project) => (
              <PortfolioCard 
                key={project.id}
                title={project.title}
                client={project.client}
                category={project.category}
                image={project.image}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
