import React from 'react';
import { COURSES } from '@/lib/constants';
import MissionRunnerClient from '@/components/missions/MissionRunnerClient';
import { notFound } from 'next/navigation';

interface MissionPageProps {
  params: Promise<{ courseId: string }>;
}

export async function generateStaticParams() {
  return COURSES.map((course) => ({
    courseId: course.key,
  }));
}

export default async function MissionPage({ params }: MissionPageProps) {
  const resolvedParams = await params;
  const course = COURSES.find((c) => c.key === resolvedParams.courseId);

  if (!course) {
    notFound();
  }

  return <MissionRunnerClient course={course} />;
}
