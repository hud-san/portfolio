// app/routes/api/experiences.ts

import { json } from "@remix-run/node";
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
      startDate: new Date(exp.startDate),
      endDate: exp.endDate ? new Date(exp.endDate) : null
    })),
    educations: educations.map(edu => ({
      ...edu,
      startDate: new Date(edu.startDate),
      endDate: edu.endDate ? new Date(edu.endDate) : null
    }))
  });
}