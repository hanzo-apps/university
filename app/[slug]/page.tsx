import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { UNIVERSITY_COURSES } from '../courses-data'
import { CourseView } from './CourseView'

export function generateStaticParams() {
  return UNIVERSITY_COURSES.map((c) => ({
    slug: c.slug,
  }))
}

function findCourse(slug: string) {
  return UNIVERSITY_COURSES.find((c) => c.slug === slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = findCourse(slug)
  if (!course) return { title: 'Course Not Found — Hanzo University' }
  const title = `${course.code}: ${course.title} (${course.credential}) — Hanzo University`
  return {
    title,
    description: `${course.summary} Earn your ${course.credential} credential with 25% compute credit rebate and isolated gVisor sandboxes.`,
    openGraph: {
      title,
      description: course.summary,
      type: 'article',
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = findCourse(slug)
  if (!course) notFound()
  return <CourseView course={course} />
}
