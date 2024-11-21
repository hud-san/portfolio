import { ArrowUpRight } from "lucide-react"

type Role = {
  title: string
  period: string
}

type TimelineEntry = {
  period: string
  company: string
  title: string
  description: string
  skills: string[]
  link?: string
  previousRoles?: Role[]
}

const timelineData: TimelineEntry[] = [
  {
    period: "2023 — PRESENT",
    company: "Monash University",
    title: "Cybersecurity Analyst",
    description: "Responsible for securing the wider security environment across the Monash University Group. Working within the security operations center (SOC), my objective is to analyse, report on and remediate cyber threats.",
    skills: ["Network Security", "Incident Response", "Threat Analysis", "SOC Operations"],
    link: "#",
    previousRoles: [
      {
        title: "Security Operations Analyst",
        period: "2023"
      }
    ]
  },
  {
    period: "JUNE 2023 — DECEMBER 2023",
    company: "Consulting Firm",
    title: "Risk Assessment Analyst",
    description: "Assisted in conducting risk assessments and control evaluations for clients across various industries. Included the identification of control weaknesses, unaccounted risks, and areas for process enhancement.",
    skills: ["Risk Assessment", "Control Evaluation", "Compliance", "Security Frameworks"],
    link: "#"
  }
]

export default function ExperienceTimeline() {
  return (
    <div className="w-full space-y-12 py-8">
      {timelineData.map((entry, index) => (
        <div key={index} className="group relative">
          <div className="flex flex-col space-y-4">
            {/* Period */}
            <span className="text-sm text-muted-foreground/60">
              {entry.period}
            </span>
            
            {/* Title and Company */}
            <div className="space-y-2">
              <a 
                href={entry.link} 
                className="inline-flex items-center group/link"
              >
                <h3 className="text-xl font-medium">
                  {entry.title} · {entry.company}
                </h3>
                <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 -translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all" />
              </a>
              
              {/* Previous Roles */}
              {entry.previousRoles && (
                <div className="space-y-1">
                  {entry.previousRoles.map((role, roleIndex) => (
                    <div key={roleIndex} className="text-muted-foreground">
                      {role.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Description */}
            <p className="text-muted-foreground max-w-2xl">
              {entry.description}
            </p>
            
            {/* Skills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {entry.skills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}