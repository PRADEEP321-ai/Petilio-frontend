import { useState } from "react";
import { ChevronDown } from "lucide-react";

/*
  SETUP: same as the other pages (Tailwind + Lora and DM Sans fonts).
  Needs lucide-react (already installed if you built the products page).

  IMAGE: put contact-dog.jpg in /public/images/
*/

// ---------- DATA ----------
const CONTACT_SOCIALS = ["Facebook", "Twitter", "Linkedin", "Instagram"];

const FAQS = [
  {
    title: "Object",
    text: "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
  },
  {
    title: "Advertising",
    text: "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
  },
  {
    title: "E-Commerce",
    text: "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
  },
  {
    title: "Return",
    text: "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
  },
];

const FOOTER_LINKS = {
  Petilio: ["Shop", "About", "Blog", "Contact"],
  Info: ["Blog details", "Product details", "Changelog", "Style guide", "Licences"],
};

const SOCIALS = ["Instagram", "Facebook", "Twitter", "Youtube"];

// Shared style for the form fields
const fieldStyle =
  "w-full border-2 border-white bg-transparent px-6 text-white placeholder:text-white/70 focus:border-[#ffe44d] focus:outline-none";

// ---------- SMALL COMPONENTS ----------
function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-[#4a2a35]">
      <button onClick={onToggle} className="flex w-full items-center justify-between py-6 text-left text-xl">
        {item.title}
        <ChevronDown size={18} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <p className="pb-6 text-base leading-relaxed text-[#4a2a35]/70">{item.text}</p>}
    </div>
  );
}

// ---------- PAGE ----------
function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [openFaq, setOpenFaq] = useState(0); // first item open like the design

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", form); // send this to your backend here
  };

  return (
    <div className="font-['DM_Sans',sans-serif] text-[#4a2a35]">
      {/* Navbar goes here (you already built it) */}

      {/* ===== CONTACT (dark) ===== */}
      <section className="bg-[#4a2a35] pb-28 pt-10 text-white">
        <h1 className="text-center font-['Lora',serif] text-8xl font-medium text-[#ffe44d]">Contact us</h1>

        <div className="mx-auto mt-14 grid max-w-[1100px] gap-12 px-6 md:grid-cols-[1fr_1.45fr]">
          {/* Left: address info */}
          <div>
            <p className="text-base">Contact Us</p>
            <h2 className="mt-10 font-['Lora',serif] text-3xl leading-snug md:text-4xl">
              123 Demo 1st left Street New York, 10000
            </h2>
            <p className="mt-6 text-xl">(555) 555-555</p>
            <p className="mt-2 text-xl">email@example.com</p>
            <p className="mt-8 flex flex-wrap gap-x-4 text-base">
              {CONTACT_SOCIALS.map((name) => (
                <a key={name} href="#" className="hover:text-[#ffe44d]">
                  {name}
                </a>
              ))}
            </p>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className={`${fieldStyle} h-[56px] rounded-full`} />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className={`${fieldStyle} h-[56px] rounded-full`} />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className={`${fieldStyle} h-[56px] rounded-full`} />
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subjet" className={`${fieldStyle} h-[56px] rounded-full`} />
            </div>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Message"
              className={`${fieldStyle} h-[100px] rounded-3xl pt-4 text-sm`}
            />

            <button
              type="submit"
              className="mt-3 h-[56px] rounded-full border-2 border-[#ffe44d] px-12 text-sm font-medium uppercase tracking-widest text-[#ffe44d] transition hover:bg-[#ffe44d] hover:text-[#4a2a35]"
            >
              Ask a question
            </button>
          </form>
        </div>
      </section>

      {/* ===== FAQ (cream) ===== */}
      <section className="bg-[#faeee9] py-28 md:py-32">
        <div className="mx-auto grid max-w-[1250px] items-center gap-14 px-6 md:grid-cols-[5fr_7fr] md:gap-16">

          {/* Dog Image */}

          <div className="mx-auto h-[500px] w-full max-w-[550px] overflow-hidden rounded-3xl bg-amber-400 md:h-[600px] md:max-w-none">
            <img
              src="/contact/dog.png"
              alt="Dog chewing a bone"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* FAQ Content */}
          <div>
            <h2 className="font-['Lora',serif] text-4xl font-medium leading-[1.25] sm:text-5xl lg:text-[52px]">
              I capture found and formed objects for both creative and commercial purposes.
            </h2>

            <div className="mt-12">
              {FAQS.map((item, index) => (
                <FaqItem
                  key={item.title}
                  item={item}
                  isOpen={openFaq === index}
                  onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                />
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Contact;