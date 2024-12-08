// app/routes/experience.tsx
import { MetaFunction, useLoaderData, useNavigation } from "@remix-run/react";
import { ExperienceSectionComponent } from '~/components/app-components-experience-section';
import PageLayout from '~/components/page-layout';
import { db } from "~/lib/prisma";
import type { Experience, Education } from "~/types/types";
import { formatDate } from "~/lib/date";
import { useState, useEffect } from "react";

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
    experiences: experiences.map(exp => ({
      ...exp,
      startDate: formatDate(exp.startDate),
      endDate: formatDate(exp.endDate),
      roles: Array.isArray(exp.roles) ? exp.roles : [],
      technologies: Array.isArray(exp.technologies) ? exp.technologies : [],
    })),
    educations: educations.map(edu => ({
      ...edu,
      startDate: formatDate(edu.startDate),
      endDate: formatDate(edu.endDate),
    }))
  });
}

export default function ExperiencePage() {
  const { experiences, educations } = useLoaderData<{ 
    experiences: Experience[], 
    educations: Education[] 
  }>();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (navigation.state === "loading") {
      timer = setTimeout(() => {
        setIsLoading(true);
      }, 100);
    } else if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [navigation.state, isLoading]);

  return (
    <PageLayout>
      <div className={`w-full bg-background transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <ExperienceSectionComponent 
          experiences={experiences} 
          educations={educations} 
        />
      </div>
    </PageLayout>
  );
}