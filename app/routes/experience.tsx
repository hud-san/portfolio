import { MetaFunction, useLoaderData } from "@remix-run/react";
import { ExperienceSectionComponent } from '~/components/app-components-experience-section';
import PageLayout from '~/components/page-layout';
import { db } from "~/lib/prisma";
import type { Experience, Education } from "~/types/types";

export const meta: MetaFunction = () => {
  return [
    { title: "EXPERIENCE" },
    { name: "description", content: "HUDSON A. A PUBLIC ARCHIVE TO DOCUMENT MY INTERESTS, WORK AND PASSIONS." },
  ];
};

export async function loader() {
  const experiences = await db.experience.findMany({
    orderBy: { startDate: 'desc' }
  });

  const educations = await db.education.findMany({
    orderBy: { startDate: 'desc' }
  });

  return Response.json({
    experiences,
    educations
  });
}

export default function ExperiencePage() {
  const { experiences, educations } = useLoaderData<{ experiences: Experience[], educations: Education[] }>();

  return (
    <PageLayout>
      <div className="w-full bg-background">
        <ExperienceSectionComponent experiences={experiences} educations={educations} />
      </div>
    </PageLayout>
  );
}