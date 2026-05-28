import Image from "next/image";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Button } from "@/components/marketing/Button";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { PortfolioCard } from "@/components/marketing/PortfolioCard";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { SERVICES, PROJECTS, TESTIMONIALS } from "@/lib/constants/content";
import { ArrowRight, Trophy, Users, Target, Activity } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[var(--color-primary-black)]">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/hero-image.png" 
              alt="The Game Changer Hero" 
              fill
              className="object-cover opacity-60 md:opacity-100 md:object-right object-center mix-blend-lighten"
              priority
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-black)] via-[var(--color-primary-black)]/80 to-transparent md:w-2/3"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-3xl animate-slide-up">
              <h2 className="text-[var(--color-primary-red)] font-bold tracking-widest uppercase mb-4 text-xl">
                Advertising Agency
              </h2>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight text-white mb-2 leading-none">
                THE <br />
                <span className="text-white relative inline-block">
                  GAME
                </span> <br />
                <span className="text-[var(--color-primary-red)]">CHANGER</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-xl font-light mt-6">
                We break through the noise. We don't just follow trends, we set them. Ready to change the game?
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/contact" variant="primary" size="lg" className="animate-pulse-red">
                  Start Your Campaign
                </Button>
                <Button href="/portfolio" variant="outline" size="lg" className="!border-white !text-white hover:!bg-white hover:!text-black">
                  View Our Work
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <SectionHeading 
                title="What We Do" 
                subtitle="End-to-end advertising solutions designed to dominate your market and drive measurable ROI."
              />
              <Button href="/services" variant="ghost" className="hidden md:inline-flex mb-12 border-b border-[var(--color-primary-red)] rounded-none px-0 py-1 text-[var(--color-primary-red)]">
                View All Services <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.slice(0, 4).map((service, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <ServiceCard 
                    title={service.title} 
                    description={service.description} 
                    icon={service.icon} 
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center md:hidden">
              <Button href="/services" variant="outline">
                View All Services
              </Button>
            </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="py-24 bg-[var(--color-off-white)]">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2 relative">
                <div className="aspect-square relative rounded-sm overflow-hidden shadow-2xl z-10">
                  <Image 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop" 
                    alt="Our Team" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-2/3 aspect-video rounded-sm overflow-hidden shadow-xl z-20 border-8 border-[var(--color-off-white)] hidden md:block">
                  <Image 
                    src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=800&auto=format&fit=crop" 
                    alt="Strategy Session" 
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Red accent block */}
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-[var(--color-primary-red)] rounded-sm z-0"></div>
              </div>
              
              <div className="lg:w-1/2">
                <h3 className="text-[var(--color-primary-red)] font-bold tracking-widest uppercase mb-4">The Amazing Agency</h3>
                <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wide mb-6 text-[var(--color-primary-black)]">
                  We don't do ordinary.
                </h2>
                <div className="accent-line mb-8"></div>
                <div className="space-y-6 text-lg text-[var(--color-muted)] leading-relaxed">
                  <p>
                    The Game Changer is an award-winning advertising agency that thrives on pushing boundaries. We combine data-driven insights with fearless creativity to build campaigns that don't just get noticed—they get results.
                  </p>
                  <p>
                    Since our inception, we've helped startups become unicorns and legacy brands find their modern voice. Our team of strategists, creatives, and technologists work in unison to deliver experiences that convert.
                  </p>
                </div>
                <div className="mt-10">
                  <Button href="/about" variant="dark">
                    Discover Our Story
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-[var(--color-primary-red)] text-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              <div className="flex flex-col items-center">
                <Users size={48} className="mb-4 opacity-80" />
                <h4 className="text-5xl md:text-6xl font-bold font-heading mb-2">150+</h4>
                <p className="uppercase tracking-widest text-sm font-bold opacity-90">Happy Clients</p>
              </div>
              <div className="flex flex-col items-center">
                <Target size={48} className="mb-4 opacity-80" />
                <h4 className="text-5xl md:text-6xl font-bold font-heading mb-2">500+</h4>
                <p className="uppercase tracking-widest text-sm font-bold opacity-90">Campaigns</p>
              </div>
              <div className="flex flex-col items-center">
                <Trophy size={48} className="mb-4 opacity-80" />
                <h4 className="text-5xl md:text-6xl font-bold font-heading mb-2">25</h4>
                <p className="uppercase tracking-widest text-sm font-bold opacity-90">Industry Awards</p>
              </div>
              <div className="flex flex-col items-center">
                <Activity size={48} className="mb-4 opacity-80" />
                <h4 className="text-5xl md:text-6xl font-bold font-heading mb-2">$50M</h4>
                <p className="uppercase tracking-widest text-sm font-bold opacity-90">Client Revenue Gen</p>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Preview */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16 flex flex-col items-center">
              <SectionHeading 
                title="Featured Work" 
                subtitle="Explore some of our most impactful campaigns and brand transformations."
                centered
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROJECTS.slice(0, 3).map((project) => (
                <PortfolioCard 
                  key={project.id}
                  title={project.title}
                  client={project.client}
                  category={project.category}
                  image={project.image}
                />
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Button href="/portfolio" variant="outline" size="lg">
                View Full Portfolio
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-[var(--color-primary-black)]">
          <div className="container mx-auto px-4 md:px-8">
            <SectionHeading 
              title="Client Success" 
              subtitle="Don't just take our word for it. Here's what our partners say."
              dark
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {TESTIMONIALS.map((testimonial) => (
                <TestimonialCard 
                  key={testimonial.id}
                  name={testimonial.name}
                  company={testimonial.company}
                  quote={testimonial.quote}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden bg-[var(--color-primary-red)]">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-wide text-white mb-8">
              Ready to dominate your market?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12">
              Let's build something extraordinary together. Our team is ready to analyze your brand and chart a course for explosive growth.
            </p>
            <Button href="/contact" variant="dark" size="lg" className="px-12 py-5 text-xl">
              Let's Talk
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
