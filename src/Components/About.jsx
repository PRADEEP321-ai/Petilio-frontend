const FEATURES = [
  "Our services are customized to fit the specific needs",
  "We offer flexible scheduling for walks, grooming, daycare",
  "Stay connected with your pet even when you’re away!",
  "Our team can help find local veterinary services and support",
];

// Replace these text names with real logo <img> tags if you have them
const PARTNERS = ["igo", "Kansas", "Manila.", "London", "Vertigo", "Kan"];

const BLOGS = [
  { id: 1, tag: "Feeding tips", title: "Dealing with pet allergies: what you need to know", image: "/About/Feeding-tips.png", bg: "bg-stone-300" },
  { id: 2, tag: "Cats & kittens", title: "Your ultimate resource for pet food, treats, and tips", image: "/About/kittens.png", bg: "bg-orange-200" },
  { id: 3, tag: "Pet food", title: "Everything you need to know about pet food", image: "/About/pet-food.png", bg: "bg-amber-700" },
];

const FOOTER_LINKS = {
  Petilio: ["Shop", "About", "Blog", "Contact"],
  Info: ["Blog details", "Product details", "Changelog", "Style guide", "Licences"],
};

const SOCIALS = ["Instagram", "Facebook", "Twitter", "Youtube"];

// ---------- SMALL COMPONENTS ----------
function BlogCard({ blog }) {
  return (
    <article>
      <div className={`relative aspect-[3/2] overflow-hidden rounded-2xl ${blog.bg}`}>
        <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-[#ffe44d] px-4 py-1.5 text-sm">
          {blog.tag}
        </span>
      </div>
      <h3 className="mt-4 font-['Lora',serif] text-2xl leading-snug">{blog.title}</h3>
    </article>
  );
}

const About = () => {
  return (
    <div className="font-['DM_Sans',sans-serif] text-[#4a2a35]">
      {/* Navbar goes here (you already built it) */}


      {/* ===== ABOUT PETILIO SECTION ===== */}
      <section className="bg-[#f8dfca]">

        {/* Dark Background */}
        <div className="bg-[#4a2a35] text-white">
          <div className="mx-auto max-w-[1250px] px-6">

            {/* Heading */}
            <h1 className="py-12 text-center font-['Lora',serif] text-5xl font-semibold tracking-tight text-[#ffe44d] sm:text-6xl md:py-14 md:text-8xl">
              About Petilio
            </h1>

            {/* Three Column Layout */}
            <div className="grid items-center gap-10 md:grid-cols-[1fr_400px_1fr] md:gap-12">

              {/* Left Content */}
              <div className="pb-8 text-center md:pb-0 md:text-left">
                <p className="font-['Lora',serif] text-xl leading-relaxed sm:text-2xl lg:text-[27px] lg:leading-[1.4]">
                  We believe in nurturing growth at every stage, caring for your pets,
                  one groom at a time. No fillers or artificial flavors in our products.
                </p>

                <a
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#ffe44d] pb-2 text-sm font-semibold uppercase tracking-[3px] text-[#ffe44d] transition-all duration-300 hover:gap-4 hover:text-white"
                >
                  Contact Us <span>→</span>
                </a>
              </div>

              {/* Center Arch Image */}
              <div className="relative z-10 mx-auto h-[390px] w-[300px] overflow-hidden rounded-t-full rounded-b-3xl sm:h-[460px] sm:w-[360px] md:-mb-36 md:h-[500px] md:w-[400px]">
                <img
                  src="/About/front.png"
                  alt="Bowl of delicious pet treats"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Right Features */}
              <div className="pb-10 text-center md:pb-0 md:text-left">
                <h2 className="font-['Lora',serif] text-2xl font-semibold text-[#ffe44d] sm:text-3xl">
                  Petilio Features
                </h2>

                <ul className="mx-auto mt-6 max-w-[350px] space-y-5 text-left text-sm leading-relaxed text-white/90 sm:text-base md:mx-0">
                  {FEATURES.map((text) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-[#ffe44d]" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Cream space behind the overlapping image */}
        <div className="h-16 md:h-36" />

      </section>


      {/* ===== INTRO (peach) ===== */}
      <section className="bg-[#fae3cd] px-6 pb-16 pt-12 md:pt-44">
        <div className="mx-auto max-w-[850px] text-center">
          <h2 className="mx-auto max-w-[800px] font-['Lora',serif] text-5xl font-medium leading-tight">
            Modern and sleek webflow template for professionals
          </h2>
          <p className="mt-8 text-sm leading-loose text-[#4a2a35]/70">
            Whether you’re looking to relax or rejuvenate, our serums and oils know the way. Lorem ipsum
            dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt. ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipisicing elit,
            sed do eiusmod
          </p>
        </div>
      </section>

      {/* ===== CLIENT REVIEW (cream) ===== */}
      <section className="bg-[#faeee9] py-20">
        <div className="mx-auto grid max-w-[1100px] items-center gap-12 px-6 md:grid-cols-[376px_1fr]">

          {/* Pet Video */}
          <div className="h-[336px] overflow-hidden rounded-3xl bg-stone-300">
            <video
              src="/About/pet-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h2 className="font-['Lora',serif] text-5xl font-medium">
              Client review
            </h2>

            <p className="mt-8 font-['Lora',serif] text-[26px] italic leading-relaxed">
              “Whether you’re looking to relax or rejuvenate, our serums and oils know the way. Lorem
              ipsum dolor sit amet. Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud”
            </p>

            <div className="mt-8 flex items-center gap-4">
              <img
                src="/images/reviewer.jpg"
                alt="Mark Davis"
                className="h-[46px] w-[46px] rounded-full bg-orange-400 object-cover"
              />
              <div>
                <p className="text-base">Mark Davis</p>
                <p className="text-sm text-[#4a2a35]/70">- Dog trainer</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== QUESTIONS (peach) ===== */}
      <section className="bg-[#fae3cd] px-6 py-20 text-center">
        <h2 className="font-['Lora',serif] text-6xl font-medium md:text-8xl">Have a questions?</h2>
        <p className="mt-6 text-base text-[#4a2a35]/70">
          Have questions or just want to chat? free consultation with us.
        </p>
        <button className="mt-8 rounded-full border border-[#4a2a35] px-10 py-4 text-sm font-medium uppercase tracking-widest transition hover:bg-[#4a2a35] hover:text-white">
          Free consultation
        </button>
      </section>

      {/* ===== TRUSTED PARTNERS (dark strip) ===== */}
      <section className="overflow-hidden bg-[#4a2a35] py-8 text-white">
        <div className="mx-auto flex max-w-[1100px] items-center gap-12 px-6">
          <h3 className="shrink-0 font-['Lora',serif] text-2xl text-[#ffe44d]">Trusted partners</h3>
          <div className="flex flex-1 items-center justify-between gap-10 whitespace-nowrap text-2xl font-bold">
            {PARTNERS.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG (cream) ===== */}
      <section className="bg-[#faeee9] py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="mb-8 font-['Lora',serif] text-5xl font-medium">Our latest blog</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {BLOGS.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
export default About
