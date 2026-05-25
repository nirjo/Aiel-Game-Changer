import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ContactForm } from "@/components/marketing/ContactForm";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-20 bg-[var(--color-off-white)]">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading 
            title="Contact Us" 
            subtitle="Ready to disrupt the market? Get in touch with our team of experts today."
            centered
          />

          <div className="flex flex-col lg:flex-row gap-12 mt-16 max-w-6xl mx-auto">
            <div className="lg:w-5/12 space-y-12">
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-wide mb-6">Our Headquarters</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-[var(--color-primary-red)]">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-wide">Address</h4>
                      <p className="text-[var(--color-muted)]">123 Innovation Drive<br />Tech District, NY 10001<br />United States</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-[var(--color-primary-red)]">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-wide">Phone</h4>
                      <p className="text-[var(--color-muted)]">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-[var(--color-primary-red)]">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-wide">Email</h4>
                      <p className="text-[var(--color-muted)]">hello@thegamechanger.agency</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="h-64 bg-gray-300 rounded-sm overflow-hidden relative shadow-inner">
                {/* Placeholder for map */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500 font-bold uppercase tracking-widest">Interactive Map Placeholder</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-7/12">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
