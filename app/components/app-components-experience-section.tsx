import { ArrowUpRight } from 'lucide-react'
import { Badge } from "~/components/ui/badge"
import { Link } from "@remix-run/react"

interface ExperienceItem {
  id: string;
  startDate: string;
  endDate: string | null;
  title: string;
  company: string;
  companyUrl: string;
  description: string;
  roles?: string[];
  technologies: string[];
}

interface EducationItem {
  id: string;
  startDate: string;
  endDate: string | null;
  degree: string;
  institution: string;
  institutionUrl: string;
  description: string | null;
}

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  educations: EducationItem[];
}

function formatDateRange(startDate: string, endDate: string | null): string {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
  };

  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'PRESENT';

  return `${start} — ${end}`;
}

export function ExperienceSectionComponent({ experiences, educations }: ExperienceSectionProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-3xl lg:px-8 mt-20">
      <h2 className="text-3xl font-bold tracking-tight text-primary mb-12">Experience</h2>
      <div className="space-y-16 md:space-y-24">
        {experiences.map((experience) => (
          <div key={experience.id} className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-[150px_1fr] sm:gap-8">
            <div className="text-xs text-muted-foreground">
              {formatDateRange(experience.startDate, experience.endDate)}
            </div>
            <div className="grid gap-4">
              <div>
                <h3 className="text-lg font-medium leading-tight text-primary mb-2">
                  <a
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-primary/80 transition-colors"
                  >
                    {experience.title} · {experience.company}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </h3>
                {experience.roles && experience.roles.length > 0 && (
                  <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground">
                    {experience.roles.map((role, idx) => (
                      <span key={idx} className="pl-4 relative before:content-['-'] before:absolute before:left-0 before:top-0 before:text-muted-foreground">
                        {role}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-secondary-foreground text-sm">{experience.description}</p>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors px-2 py-1 rounded-none"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-primary mb-12 mt-24">Education</h2>
      <div className="space-y-16 md:space-y-24">
        {educations.map((edu) => (
          <div key={edu.id} className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-[150px_1fr] sm:gap-8">
            <div className="text-xs text-muted-foreground">
              {formatDateRange(edu.startDate, edu.endDate)}
            </div>
            <div className="grid gap-4">
              <div>
                <h3 className="text-lg font-medium leading-tight text-primary mb-2">
                  <a
                    href={edu.institutionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-primary/80 transition-colors"
                  >
                    {edu.degree}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </h3>
                <div className="mt-1 text-sm text-muted-foreground">
                  {edu.institution}
                </div>
              </div>
              {edu.description && (
                <p className="text-secondary-foreground text-sm">{edu.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors px-2 py-1 rounded-none"
                >
                  {edu.degree}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}