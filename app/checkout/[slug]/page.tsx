import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { UNIVERSITY_COURSES } from '../../courses-data'
import { CheckoutFlow } from './CheckoutFlow'

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
  if (!course) return { title: 'Tuition Checkout — Hanzo University' }
  const title = `Enroll in ${course.code}: ${course.title} — Hanzo University Checkout`
  return {
    title,
    description: `Complete enrollment for ${course.code}. Pay one-time class tuition, then create or link your Hanzo ID to receive your student credentials, gVisor sandbox, and 25% compute credit deposit.`,
    openGraph: {
      title,
      description: `Enroll in ${course.code}: ${course.title}. One-time class tuition, W3C verifiable credential, and 25% compute credit rebate.`,
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
  return <CheckoutFlow course={course} />
}
