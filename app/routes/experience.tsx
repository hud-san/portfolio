import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ExperienceSectionComponent } from '~/components/app-components-experience-section';
import PageLayout from '~/components/page-layout';
import { db } from "~/lib/prisma";

export async function loader() {
  const experiences = await db.experience.findMany({
    orderBy: { startDate: 'desc' }
  });

  const educations = await db.education.findMany({
    orderBy: { startDate: 'desc' }
  });

  return json({
    experiences: experiences.map(exp => ({
      ...exp,
      startDate: exp.startDate?.toISOString() ?? null,
      endDate: exp.endDate?.toISOString() ?? null,
    })),
    educations: educations.map(edu => ({
      ...edu,
      startDate: edu.startDate?.toISOString() ?? null,
      endDate: edu.endDate?.toISOString() ?? null,
    }))
  });
}

export default function Experience() {
  const { experiences, educations } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <div className="w-full bg-background">
        <ExperienceSectionComponent experiences={experiences} educations={educations} />
      </div>
    </PageLayout>
  );
}