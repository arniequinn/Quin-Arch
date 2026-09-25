import React from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { ContactSection, Section } from "../components/PageSections";
import { Button } from "../components/Button";
import { GallerySection } from "../components/gallery/GallerySection";
import { surfaceOf } from "../components/gallery/JustifiedGrid";
import { FURNITURE_BY_CATEGORY, GalleryProject, SERVICE_LINKS, thumbOf } from "../data/galleryProjects";
import { projectHref, ROUTES } from "../data/routes";

const SERVICE_ROUTES = {
  visualization: ROUTES.visualization,
  bim: ROUTES.bimCad,
  consultancy: ROUTES.consultancy,
} as const;

// One gallery project (v3.0 §7): the cover, the text and facts, every item in the justified grid,
// the furniture on its own where the room has it, then the related service and one closing action.
export const GalleryProjectPage: React.FC<{ project: GalleryProject }> = ({ project }) => {
  const { cover } = project;
  const thumb = thumbOf(cover);
  const isFurniture = project.slug === "furniture";

  return (
    <main className="flex-1">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Project Library", href: ROUTES.projects },
          { label: project.title },
        ]}
        eyebrow={project.kind}
        title={project.title}
        intro={project.summary}
      />

      {/* The cover, as wide as the page allows — never wider than its own pixels, and never taller
          than most of the screen, so the text below it is in reach. */}
      <Container>
        <figure
          className="mx-auto"
          style={{ maxWidth: `min(${cover.width}px, calc(78svh * ${(cover.width / cover.height).toFixed(4)}))` }}
        >
          <div className={`overflow-hidden rounded-sm ${surfaceOf(cover)}`} style={{ aspectRatio: `${cover.width} / ${cover.height}` }}>
            <img
              src={cover.src}
              srcSet={thumb.width < cover.width ? `${thumb.src} ${thumb.width}w, ${cover.src} ${cover.width}w` : undefined}
              sizes={`min(100vw, 1216px, ${cover.width}px)`}
              width={cover.width}
              height={cover.height}
              alt={`${cover.title} — ${cover.caption}`}
              fetchPriority="high"
              className="h-full w-full object-contain"
            />
          </div>
          <figcaption className="mt-3 text-small text-neutral-400">
            <span className="font-semibold text-neutral-200">{cover.title}</span> — {cover.caption}
          </figcaption>
        </figure>
      </Container>

      <Section className="mt-16 sm:mt-24">
        <Container width="text">
          <p className="eyebrow text-amber-400">About the project</p>
          <div className="mt-5 space-y-5 text-body text-neutral-300">
            {project.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {project.facts && (
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-neutral-800 pt-6 sm:grid-cols-3">
              {project.facts.map((f) => (
                <div key={f.label}>
                  <dt className="eyebrow text-neutral-500">{f.label}</dt>
                  <dd className="mt-1 text-body text-neutral-100">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Container>
      </Section>

      <Section raised>
        <Container>
          <SectionHeader
            eyebrow={isFurniture ? "The collection" : "The project"}
            title={isFurniture ? `${project.items.length} pieces, in nine categories` : `Every view, ${project.items.length} in all`}
            intro="Select any image to see it whole."
          />
          {isFurniture ? (
            FURNITURE_BY_CATEGORY.map((category) => (
              <div key={category.label} className="mt-14">
                <h3 className="eyebrow mb-8 border-t border-neutral-800 pt-8 text-neutral-400">
                  {category.label} <span className="font-mono normal-case tracking-normal text-neutral-600">· {category.items.length}</span>
                </h3>
                <GallerySection items={category.items} currentProject={project.slug} />
              </div>
            ))
          ) : (
            <GallerySection className="mt-14" items={project.items} currentProject={project.slug} />
          )}
        </Container>
      </Section>

      {project.pieces && (
        <Section>
          <Container>
            <SectionHeader
              eyebrow="Virtual staging"
              title="Pieces in this room"
              intro="The furniture in these views, each on its own — from a large library of industry-standard, manufacturer-specified pieces, placed into the design with a designer's eye."
            >
              <Button href={projectHref("furniture")} variant="link">
                See the whole furniture collection
              </Button>
            </SectionHeader>
            <GallerySection className="mt-14" items={project.pieces} currentProject="furniture" />
          </Container>
        </Section>
      )}

      <Section raised={!project.pieces}>
        <Container>
          <SectionHeader eyebrow="Related service" title={project.services.length > 1 ? "The services behind it" : "The service behind it"} />
          <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2">
            {project.services.map((service) => (
              <li key={service} className="border-t border-neutral-700 pt-6">
                <a href={SERVICE_ROUTES[service]} className="group block">
                  <h3 className="heading-3 text-neutral-100 transition-colors group-hover:text-amber-300">{SERVICE_LINKS[service].label}</h3>
                  <p className="mt-2 text-small text-neutral-400">{SERVICE_LINKS[service].description}</p>
                  <p className="mt-4 inline-flex items-center gap-2 text-small font-semibold text-amber-400">
                    See the service
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                  </p>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex justify-center">
            <Button href={ROUTES.projects} variant="link">
              All projects
            </Button>
          </div>
        </Container>
      </Section>
      <ContactSection service={project.services[0]} title="Have a project like this in mind?" />
    </main>
  );
};
