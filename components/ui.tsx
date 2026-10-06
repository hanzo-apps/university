'use client'

import React from 'react'
import {
  Box as GuiBox,
  Text as GuiText,
  XStack as GuiXStack,
  YStack as GuiYStack,
  View as GuiView,
} from '@hanzo/ui'

export const Box = GuiBox
export const Text = GuiText
export const XStack = GuiXStack
export const YStack = GuiYStack
export const View = GuiView

export function Band({
  children,
  id,
  measure = 1280,
  pad = 48,
  rule = true,
  ...props
}: {
  children: React.ReactNode
  id?: string
  measure?: number
  pad?: number | string
  rule?: boolean
  [key: string]: any
}) {
  return (
    <GuiBox
      id={id}
      width="100%"
      py={pad as any}
      px={20}
      borderTopWidth={rule ? 1 : 0}
      borderColor="var(--border)"
      {...props}
    >
      <GuiBox maxW={measure} mx="auto" width="100%">
        {children}
      </GuiBox>
    </GuiBox>
  )
}

export function Card({
  children,
  p = 24,
  ...props
}: {
  children: React.ReactNode
  p?: number | string
  [key: string]: any
}) {
  return (
    <GuiBox
      p={p as any}
      rounded="var(--radius-lg)"
      bg="var(--card)"
      borderWidth={1}
      borderColor="var(--border)"
      {...props}
    >
      {children}
    </GuiBox>
  )
}
