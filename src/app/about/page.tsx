import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Target, Users, Zap, Award } from "lucide-react";
import Image from "next/image";

export default function About() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading 
            title="About The Game Changer" 
            subtitle="We are a collective of strategists, creatives, and technologists united by a single mission: to redefine what's possible in advertising."
            centered
          />

          <div className="flex flex-col lg:flex-row gap-16 mt-20 items-center">
            <div className="lg:w-1/2">
              <h3 className="text-[var(--color-primary-red)] font-bold tracking-widest uppercase mb-4">Our Story</h3>
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide mb-6">Born from the need to break rules.</h2>
              <div className="space-y-6 text-[var(--color-muted)] leading-relaxed text-lg">
                <p>
                  Founded on the belief that safe advertising is invisible advertising, The Game Changer was created to help bold brands make a lasting impact.
                </p>
                <p>
                  We don't believe in one-size-fits-all solutions. Every campaign we touch is meticulously crafted to resonate with your specific audience, disrupt the market, and drive undeniable results.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 w-full h-[400px] relative rounded-sm overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop" 
                alt="Our Team" 
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-32">
            <SectionHeading title="Our Core Values" centered />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {[
                { title: 'Fearless Innovation', desc: 'We constantly push the boundaries of what is possible.', icon: Zap },
                { title: 'Data-Driven Creativity', desc: 'Our creative decisions are backed by hard data and insights.', icon: Target },
                { title: 'True Partnership', desc: 'We treat your business as if it were our own.', icon: Users },
                { title: 'Excellence Always', desc: 'We deliver nothing short of the highest quality work.', icon: Award },
              ].map((value, idx) => (
                <div key={idx} className="bg-[var(--color-off-white)] p-8 rounded-sm text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[var(--color-primary-red)] shadow-md mb-6">
                    <value.icon size={32} />
                  </div>
                  <h4 className="text-xl font-bold uppercase tracking-wide mb-4">{value.title}</h4>
                  <p className="text-[var(--color-muted)]">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
