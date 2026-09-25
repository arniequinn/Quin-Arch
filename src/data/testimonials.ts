// Genuine client reviews, transcribed as text (documentation/v3.0-gallery-expansion.md §9, D5).
// The wording is the client's own; punctuation is tidied and references to the marketplace the job
// came through are dropped, marked "…". Never shown with stars, ratings or platform names.

export interface Testimonial {
  id: string;
  quote: string;
  /** First name and initial, or "Private client" where only a username exists. */
  attribution: string;
  /** The project, where known. */
  project?: string;
}

export const TESTIMONIALS: Record<"q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8", Testimonial> = {
  q1: {
    id: "q1",
    quote:
      "I would recommend these services to anyone seeking very high-quality architectural work and absolute professionalism.",
    attribution: "Edward B.",
    project: "California summer home",
  },
  q2: {
    id: "q2",
    quote:
      "Arslan represents outstanding value, a willingness to listen and adapt, and impressive skillsets. … He does quality work. He worked with me on every step of this project, was responsive to the changes I wanted and the restrictions we had, and together we delivered! He gets the highest recommendation: A+",
    attribution: "James B.",
    project: "Foxhole House, Wealden",
  },
  q3: {
    id: "q3",
    quote: "Great concept and design considerations. We loved the final product and will use again.",
    attribution: "Michael V.",
    project: "Foster home, Australia",
  },
  q4: {
    id: "q4",
    quote:
      "Arslan was attentive and considerate of my needs … a designer who is interactive and offers many solutions for clients until they are 100% satisfied, with very fair costs. I highly recommend!",
    attribution: "Private client",
  },
  q5: {
    id: "q5",
    quote: "Very pleased with the whole process & such great experience, looking forward to working with him again!",
    attribution: "Private client",
  },
  q6: {
    id: "q6",
    quote:
      "Thank you Arslan — great work and brilliant architectural mind; helps me to get the job done in a fast and efficient way.",
    attribution: "Private client",
  },
  q7: {
    id: "q7",
    quote: "Works beyond and above. … I recommend him 100%.",
    attribution: "Private client",
  },
  q8: {
    id: "q8",
    quote: "Great, prompt, kind and very helpful.",
    attribution: "Private client",
  },
};

/** The quotes that rotate in the footer's contact band. */
export const FOOTER_TESTIMONIALS: Testimonial[] = [
  TESTIMONIALS.q4,
  TESTIMONIALS.q5,
  TESTIMONIALS.q6,
  TESTIMONIALS.q7,
  TESTIMONIALS.q8,
];

export const testimonialCredit = (t: Testimonial) => (t.project ? `${t.attribution} — ${t.project}` : t.attribution);
