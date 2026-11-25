import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { findCheckoutItem, getAllCheckoutItems } from '../../courses-data'
import { Moved } from './Moved'

export function generateStaticParams() {
  return getAllCheckoutItems().map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = findCheckoutItem(slug)
  if (!item) return { title: 'Enrollment Checkout — Hanzo University' }
  const title = `Enroll in ${item.code}: ${item.title} — Hanzo University`
  return {
    title,
    description: `Self-service enrollment for ${item.code}: ${item.title} through Hanzo checkout.`,
    openGraph: {
      title,
      description: `Self-service enrollment for ${item.code}: ${item.title} through Hanzo checkout.`,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = findCheckoutItem(slug)
  if (!item) notFound()
  return <Moved item={item} />
}
