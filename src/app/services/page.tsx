import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { SERVICES } from "@/lib/constants/content";

export default function Services() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading 
            title="Our Services" 
            subtitle="Comprehensive, high-impact marketing solutions tailored for brands that want to lead their industry."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {SERVICES.map((service, index) => (
              <ServiceCard 
                key={index}
                title={service.title} 
                description={service.description} 
                icon={service.icon} 
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
