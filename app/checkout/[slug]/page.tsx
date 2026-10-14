import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ALL_COURSES, findCourse } from '../../courses-data'
import { Moved } from './Moved'

export function generateStaticParams() {
  return ALL_COURSES.map((c) => ({
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
  if (!course) return { title: 'Tuition Checkout — Hanzo University' }
  const title = `Enroll in ${course.code}: ${course.title} — Hanzo University Checkout`
  return {
    title,
    description: `Enroll in ${course.code}: ${course.title} through Hanzo checkout.`,
    openGraph: {
      title,
      description: `Enroll in ${course.code}: ${course.title} through Hanzo checkout.`,
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
  return <Moved />
}
