import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { UNIVERSITY_COURSES, findCourse, getSchoolById } from '../courses-data'
import { CourseView } from './CourseView'

export function generateStaticParams() {
  return UNIVERSITY_COURSES.map((c) => ({
    slug: c.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = findCourse(slug)
  if (!course) return { title: 'Course Not Found — Hanzo University' }
  const school = getSchoolById(course.school)
  const title = `${course.code}: ${course.title} — ${school.shortName}`
  return {
    title,
    description: `${course.summary} Launch interactive labs on hanzo.app/learn and earn cryptographic W3C completion proof for your deployed capstone.`,
    openGraph: {
      title: `${title} | Hanzo University`,
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
