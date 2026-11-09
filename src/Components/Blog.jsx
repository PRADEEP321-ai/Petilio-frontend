import React from "react";

// ---------- BLOG DATA ----------
const BLOGS = [
  {
    id: 1,
    tag: "Feeding tips",
    title: "Dealing with pet allergies: what you need to know",
    image: "/About/Feeding-tips.png",
  },
  {
    id: 2,
    tag: "Cats & kittens",
    title: "Your ultimate resource for pet food, treats, and tips",
    image: "/About/kittens.png",
  },
  {
    id: 3,
    tag: "Pet food",
    title: "Everything you need to know about pet food",
    image: "/About/pet-food.png",
  },
  {
    id: 4,
    tag: "Pet nutrition",
    title: "Unleashing the secrets of pet food choices",
    image: "/About/pet-nutrition.png",
  },
  {
    id: 5,
    tag: "Pets meal",
    title: "You need to know about choosing the right pet food",
    image: "/About/pets-meal.png",
  },
  {
    id: 6,
    tag: "Pet care tips",
    title: "Enhancing your dog or cat's diet with nutrient-rich options",
    image: "/About/pet-care.png",
  },
];

// ---------- BLOG CARD ----------
function BlogCard({ blog }) {
  return (
    <article className="group">
      {/* Blog Image */}
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-[#ead6c8]">
        <img
          src={blog.image}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        {/* Category */}
        <span className="absolute left-4 top-4 rounded-full bg-[#ffe44d] px-4 py-2 text-xs font-semibold text-[#4a2a35]">
          {blog.tag}
        </span>
      </div>

      {/* Blog Title */}
      <h3 className="mt-4 font-['Lora',serif] text-xl font-medium leading-snug transition-colors group-hover:text-[#a36b37] sm:text-2xl">
        {blog.title}
      </h3>
    </article>
  );
}

// ---------- BLOG PAGE ----------
function Blog() {
  return (
    <div className="font-['DM_Sans',sans-serif] text-[#4a2a35]">

      {/* ===== TITLE ===== */}
      <section className="bg-[#4a2a35] px-6 py-20 text-center md:py-24">
        <h1 className="font-['Lora',serif] text-6xl font-medium text-[#ffe44d] sm:text-7xl md:text-8xl">
          Blogs
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
          Discover helpful tips, expert advice, and everything you need
          to keep your furry friends happy and healthy.
        </p>
      </section>

      {/* ===== BLOG GRID ===== */}
      <section className="bg-[#faeee9] px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-[1100px] gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {BLOGS.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>

      {/* ===== QUESTIONS ===== */}
      <section className="bg-[#fae3cd] px-6 py-20 text-center">
        <h2 className="font-['Lora',serif] text-4xl font-medium sm:text-5xl md:text-7xl">
          Have a question?
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[#4a2a35]/70 sm:text-base">
          Have questions or just want to chat? Get a free consultation with us.
        </p>

        <a
          href="/contact"
          className="mt-8 inline-block rounded-full border border-[#4a2a35] px-10 py-4 text-sm font-semibold uppercase tracking-widest transition hover:bg-[#4a2a35] hover:text-white"
        >
          Free Consultation
        </a>
      </section>

    </div>
  );
}

export default Blog;