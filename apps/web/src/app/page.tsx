import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";

export default async function Home() {
  return (
    <>
      <main>
        <Hero />
        {/* <PrimaryFeatures /> */}
        {/* <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs /> */}
      </main>
      <Footer />
    </>
  );
}
