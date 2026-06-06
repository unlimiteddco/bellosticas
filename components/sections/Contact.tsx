import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="max-w-[640px]">
        <ContactForm />
      </div>
    </section>
  );
}
