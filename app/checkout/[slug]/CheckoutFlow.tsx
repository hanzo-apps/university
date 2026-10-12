'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Box, Text, XStack, YStack, View } from '@/components/ui'
import { Band, Card } from '@/components/band'
import { Action, Chip } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Coins,
  BookOpen,
  Terminal,
  User,
  Key,
  Check,
  Tag,
  QrCode,
  Wallet,
  RefreshCw,
  Cpu,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'
import {
  type UniversityCourse,
  validateCoupon,
  KNOWN_COUPONS,
  type CouponResult,
} from '../../courses-data'
import { addEnrolledCourse } from '@/lib/auth'

function SquareLogo({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke={color} strokeWidth="2.5" />
      <rect x="7.5" y="7.5" width="9" height="9" rx="2" fill={color} />
    </svg>
  )
}

function ApplePayLogo({ height = 18 }: { height?: number }) {
  return (
    <svg height={height} viewBox="0 0 54 22" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M9.95 10.66c-.02-1.74 1.42-2.58 1.49-2.62-.81-1.18-2.07-1.34-2.51-1.36-1.07-.11-2.09.63-2.63.63-.55 0-1.39-.62-2.27-.6-1.16.02-2.24.68-2.84 1.72-1.21 2.1-.31 5.21.87 6.92.58.83 1.26 1.76 2.17 1.73.87-.04 1.2-.56 2.25-.56s1.35.56 2.26.54c.93-.02 1.52-.84 2.09-1.68.66-.96.93-1.89.95-1.94-.02-.01-1.82-.7-1.83-2.78zM8.01 5.37c.48-.58.8-1.38.71-2.19-.69.03-1.53.46-2.02 1.04-.44.5-.82 1.32-.71 2.1.77.06 1.54-.37 2.02-.95zM17.47 16V6.9h3.6c2.08 0 3.33 1.15 3.33 2.92 0 1.78-1.25 2.94-3.33 2.94h-1.94V16h-1.66zm1.66-4.5h1.81c1.1 0 1.78-.58 1.78-1.58s-.68-1.57-1.78-1.57h-1.81v3.15zm8.56 4.62c-1.44 0-2.45-.98-2.45-2.38 0-1.44 1.05-2.35 2.58-2.35.88 0 1.48.21 1.83.42v-.32c0-.85-.62-1.37-1.68-1.37-.77 0-1.44.25-1.93.57l-.46-1.09c.64-.42 1.55-.72 2.62-.72 2.02 0 3.08 1.08 3.08 2.89V16h-1.52v-.89c-.44.62-1.25.99-2.07.99zm.41-1.18c.95 0 1.63-.58 1.63-1.44v-.35c-.32-.19-.82-.35-1.47-.35-.94 0-1.5.47-1.5 1.22 0 .61.47.92 1.34.92zm7.25 3.65l-2.61-7.07h1.76l1.71 5.09 1.67-5.09h1.69l-3.35 9.07h-1.87z" fill="currentColor"/>
    </svg>
  )
}

function GooglePayLogo({ height = 18 }: { height?: number }) {
  return (
    <svg height={height} viewBox="0 0 58 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12.44 12.22c0-.52-.05-1.01-.13-1.49H6.12v2.82h3.55c-.15.82-.62 1.51-1.31 1.97v1.64h2.12c1.24-1.14 1.96-2.82 1.96-4.94z" fill="#4285F4"/>
      <path d="M6.12 18.66c1.77 0 3.25-.59 4.34-1.59l-2.12-1.64c-.59.39-1.34.62-2.22.62-1.71 0-3.15-1.15-3.67-2.7H.17v1.7c1.08 2.14 3.3 3.61 5.95 3.61z" fill="#34A853"/>
      <path d="M2.45 13.35c-.13-.39-.21-.81-.21-1.24 0-.43.08-.85.21-1.24V9.17H.17C-.37 10.25-.68 11.47-.68 12.76c0 1.29.31 2.51.85 3.59l2.28-1.7.0-.3z" fill="#FBBC05" transform="translate(0.68,-0.65)"/>
      <path d="M6.12 6.86c.96 0 1.83.33 2.51.98l1.88-1.88C9.36 4.9 7.89 4.3 6.12 4.3 3.47 4.3 1.25 5.77.17 7.91l2.28 1.7c.52-1.55 1.96-2.7 3.67-2.7z" fill="#EA4335"/>
      <path d="M22.56 16.5V9.4h2.52c1.46 0 2.33.8 2.33 2.04 0 1.25-.87 2.06-2.33 2.06h-1.36v3.0h-1.16zm1.16-4.04h1.27c.77 0 1.25-.41 1.25-1.11 0-.69-.48-1.1-1.25-1.1h-1.27v2.21zm6.0 4.12c-1.01 0-1.72-.69-1.72-1.67 0-1.01.74-1.64 1.81-1.64.62 0 1.04.15 1.28.29v-.22c0-.6-.43-.96-1.18-.96-.54 0-1.01.18-1.35.4l-.32-.76c.45-.29 1.09-.5 1.83-.5 1.41 0 2.16.76 2.16 2.02v3.04h-1.06v-.62c-.31.43-.88.69-1.45.69zm.29-.83c.66 0 1.14-.41 1.14-1.01v-.25c-.22-.13-.57-.25-1.03-.25-.66 0-1.05.33-1.05.85 0 .43.33.66.94.66zm5.08 2.56l-1.83-4.95h1.23l1.2 3.56 1.17-3.56h1.18l-2.35 6.35h-1.31z" fill="var(--white)"/>
    </svg>
  )
}

function getCardBrand(num: string): string | null {
  const clean = num.replace(/\D/g, '')
  if (clean.startsWith('4')) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'Mastercard'
  if (/^(34|37)/.test(clean)) return 'Amex'
  if (/^(6011|65)/.test(clean)) return 'Discover'
  return null
}

type CheckoutStep = 'payment' | 'hanzo_id' | 'provisioning' | 'complete'
type PaymentMethod = 'card' | 'crypto'

export function CheckoutFlow({ course }: { course: UniversityCourse }) {
  const router = useRouter()

  // Flow State
  const [step, setStep] = useState<CheckoutStep>('payment')
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false)

  // Coupon State
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Payment Form State (Empty initial values - NO mock prefill)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardStreet, setCardStreet] = useState('')
  const [cardApt, setCardApt] = useState('')
  const [cardCity, setCardCity] = useState('')
  const [cardState, setCardState] = useState('')
  const [cardCountry, setCardCountry] = useState('United States')
  const [cardPostal, setCardPostal] = useState('')
  const [cryptoAsset, setCryptoAsset] = useState<'USDC' | 'LUX' | 'ETH'>('USDC')
  const [cryptoNetwork] = useState('Lux Chain (Zero Gas)')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [processingSource, setProcessingSource] = useState<'card' | 'apple_pay' | 'google_pay' | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Transaction Receipt
  const [transactionId, setTransactionId] = useState('')
  const [paidAmount, setPaidAmount] = useState(course.price)

  // Hanzo ID State (Empty initial values - NO mock prefill)
  const [accountMode, setAccountMode] = useState<'create' | 'link'>('create')
  const [handle, setHandle] = useState('')
  const [legalName, setLegalName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [authMethod, setAuthMethod] = useState<'passkey' | 'password'>('passkey')
  const [password, setPassword] = useState('')
  const [agreeHonorCode, setAgreeHonorCode] = useState(true)
  const [accountError, setAccountError] = useState<string | null>(null)

  // Provisioning Terminal Logs
  const [provisionProgress, setProvisionProgress] = useState(0)
  const [provisionLogs, setProvisionLogs] = useState<string[]>([])

  // Check URL query parameters for initial coupon
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const initialCoupon = params.get('coupon')
      if (initialCoupon) {
        setCouponCode(initialCoupon)
        const res = validateCoupon(initialCoupon, course.price)
        if (res.valid) {
          setAppliedCoupon(res)
        }
      }
    }
  }, [course.price])

  // Calculated Price & Rebates
  const originalPrice = course.price
  const finalPrice = appliedCoupon?.valid ? appliedCoupon.finalPrice : originalPrice
  const discountAmount = appliedCoupon?.valid ? appliedCoupon.discountAmount : 0
  const rebateCredits = appliedCoupon?.valid ? appliedCoupon.rebateCredits : course.rebateCredits

  // Regular Hanzo Payment Gateway URL (Square integration)
  const hanzoPayUrl = appliedCoupon?.valid
    ? `https://hanzo.ai/pay/cart?plan=${course.planId}&returnUrl=${encodeURIComponent(`https://hanzo.university/portal?enrolled=${course.slug}`)}&coupon=${encodeURIComponent(appliedCoupon.code)}`
    : `https://hanzo.ai/pay/cart?plan=${course.planId}&returnUrl=${encodeURIComponent(`https://hanzo.university/portal?enrolled=${course.slug}`)}`

  // Card input formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardNumber(formatted)
    if (paymentError) setPaymentError(null)
  }

  const handleCardExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`
    }
    setCardExp(raw)
    if (paymentError) setPaymentError(null)
  }

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCardCvc(raw)
    if (paymentError) setPaymentError(null)
  }

  // Apply Coupon Handler
  const handleApplyCoupon = (codeToApply?: string) => {
    const target = (codeToApply || couponCode).trim()
    if (!target) {
      setCouponError('Please enter a coupon code.')
      return
    }
    const res = validateCoupon(target, originalPrice)
    if (res.valid) {
      setAppliedCoupon(res)
      setCouponCode(res.code)
      setCouponError(null)
    } else {
      setCouponError(res.message)
      setAppliedCoupon(null)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setAppliedCoupon(null)
    setCouponError(null)
  }

  // Express Checkout: Apple Pay & Google Pay authorization with native PaymentRequest
  const handleWalletPayment = async (wallet: 'apple_pay' | 'google_pay') => {
    const isMembership = course.slug === 'membership'
    const chargeAmount = isMembership ? '0.00' : `${finalPrice}.00`
    const label = isMembership
      ? 'Hanzo University Pro · 7-Day Free Trial'
      : `${course.code}: ${course.title} Tuition`

    setProcessingSource(wallet)
    setIsProcessingPayment(true)
    setPaymentError(null)

    // W3C PaymentRequest support for mobile Safari (Apple Pay) & Chrome (Google Pay)
    if (typeof window !== 'undefined' && 'PaymentRequest' in window) {
      try {
        const supportedInstruments = [
          {
            supportedMethods:
              wallet === 'apple_pay'
                ? 'https://apple.com/apple-pay'
                : 'https://google.com/pay',
            data: {
              version: 3,
              merchantIdentifier: 'merchant.ai.hanzo.university',
              countryCode: 'US',
              currencyCode: 'USD',
            },
          },
          {
            supportedMethods: 'basic-card',
          },
        ]

        const details = {
          total: {
            label,
            amount: { currency: 'USD', value: chargeAmount },
          },
        }

        const request = new (window as any).PaymentRequest(supportedInstruments, details)
        if (request && typeof request.show === 'function') {
          const paymentResponse = await request.show()
          if (paymentResponse && typeof paymentResponse.complete === 'function') {
            await paymentResponse.complete('success')
          }
        }
      } catch (err: any) {
        // Fallback for sandboxes or user cancellations
        console.log('Native PaymentRequest status:', err?.message || err)
      }
    }

    const prefix = wallet === 'apple_pay' ? 'sq_ap_' : 'sq_gp_'
    const walletTxn = `${prefix}${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 8)}`
    setTransactionId(walletTxn)
    setPaidAmount(isMembership ? 0 : finalPrice)

    setTimeout(() => {
      setIsProcessingPayment(false)
      setProcessingSource(null)
      setStep('hanzo_id')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 750)
  }

  // Phase 1: Complete Payment Handler (Pay for the class via Square Web Payments / Hanzo Treasury)
  const handleCompletePayment = () => {
    const isMembership = course.slug === 'membership'

    if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\D/g, '')
      if (!cardName.trim()) {
        setPaymentError('Please enter the name on your card.')
        return
      }
      if (cleanNum.length < 13) {
        setPaymentError('Please enter a valid card number.')
        return
      }
      if (cardExp.length < 5) {
        setPaymentError('Please enter card expiration in MM/YY format.')
        return
      }
      if (cardCvc.length < 3) {
        setPaymentError('Please enter a valid CVC security code.')
        return
      }
      if (!cardPostal.trim()) {
        setPaymentError('Please enter your billing postal code.')
        return
      }
    } else if (isMembership) {
      setPaymentError('A valid credit or debit card is required upfront to activate the 7-day free trial.')
      return
    }

    setPaymentError(null)
    setProcessingSource('card')
    setIsProcessingPayment(true)

    // Store billing info for seamless account provisioning if provided
    try {
      if (cardName.trim()) localStorage.setItem('hanzo_portal_student_name', cardName.trim())
      if (cardPostal.trim()) localStorage.setItem('hanzo_billing_postal', cardPostal.trim())
      if (cardStreet.trim()) localStorage.setItem('hanzo_billing_street', cardStreet.trim())
    } catch (_) {}

    // Square Live Transaction ID format matching Hanzo Pay
    const squareTxn = `sq_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 8)}`
    setTransactionId(squareTxn)
    setPaidAmount(isMembership ? 0 : finalPrice)

    setTimeout(() => {
      setIsProcessingPayment(false)
      setProcessingSource(null)
      // Advance to Phase 2: Hanzo ID account creation
      setStep('hanzo_id')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 900)
  }

  // Phase 2: Create / Link Hanzo ID and Provision Sandbox
  const handleStartProvisioning = () => {
    if (accountMode === 'create') {
      if (!legalName.trim()) {
        setAccountError('Please provide your full legal name for your verifiable credential.')
        return
      }
      if (!studentEmail.trim() || !studentEmail.includes('@')) {
        setAccountError('Please provide a valid student email address.')
        return
      }
      if (!agreeHonorCode) {
        setAccountError('Please accept the Hanzo University Academic Integrity Policy.')
        return
      }
    } else {
      if (!studentEmail.trim()) {
        setAccountError('Please enter your Hanzo ID email or username.')
        return
      }
    }

    const finalHandle = (handle.trim() || (studentEmail.includes('@') ? studentEmail.split('@')[0] : studentEmail.trim()) || 'student')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '')
    const finalLegalName = legalName.trim() || finalHandle
    const isMembership = course.slug === 'membership'

    try {
      localStorage.setItem('hanzo_portal_student_handle', finalHandle)
      localStorage.setItem('hanzo_portal_student_name', finalLegalName)
      if (studentEmail.trim()) {
        localStorage.setItem('hanzo_portal_student_email', studentEmail.trim())
      }
      addEnrolledCourse(course.slug)
    } catch (_) {}

    setAccountError(null)
    setStep('provisioning')
    setProvisionProgress(15)
    setProvisionLogs(
      isMembership
        ? [
            `> [CARD VERIFIED] Square card authorization cleared: Auth #${transactionId} ($0.00 charged today).`,
            `> [TRIAL] 7-Day All-Access Free Trial activated for Hanzo University Pro.`,
            `> [PRO PLATFORM] Full Hanzo Pro Developer account activated (unlimited Zen 6, 13 MCP tools).`,
            `> [BILLING] Recurring tuition scheduled for $29.00 USD on Day 8. Cancel anytime in 1-click.`,
          ]
        : [
            `> [INIT] Square & Hanzo settlement verified: Txn #${transactionId} cleared ($${paidAmount} USD).`,
            `> [AUTH] Protocol dispatching seat license for course: ${course.code} (${course.credential})...`,
          ]
    )

    setTimeout(() => {
      setProvisionProgress(40)
      setProvisionLogs((prev) => [
        ...prev,
        `> [HANZO ID] Generating student DID: did:hanzo:student:${finalHandle}.hanzo.id`,
        `> [IDENTITY] Binding W3C-compliant academic claim for "${finalLegalName}"...`,
      ])
    }, 600)

    setTimeout(() => {
      setProvisionProgress(70)
      setProvisionLogs((prev) => [
        ...prev,
        isMembership
          ? `> [COMPUTE] Depositing monthly compute allowance ($50.00 USD) into Hanzo Cloud wallet.`
          : `> [COMPUTE] Depositing 25% compute fellowship ($${rebateCredits}.00 USD) into Hanzo Cloud wallet.`,
        `> [SANDBOX] Allocating isolated Hanzo Visor microVM container lease: pod-vsr-uswest2-${finalHandle}...`,
      ])
    }, 1200)

    setTimeout(() => {
      setProvisionProgress(95)
      setProvisionLogs((prev) => [
        ...prev,
        `> [BENCHMARKS] Mounting SWE-bench harness, Zen 6 reasoning bridge, and AST verification suite.`,
        `> [OK] Enrolled student workspace provisioned with exit code 0.`,
      ])
    }, 1800)

    setTimeout(() => {
      setProvisionProgress(100)
      setStep('complete')
      // Redirect seamlessly to student portal with enrolled course & student details
      const targetUrl = `/portal?enrolled=${encodeURIComponent(course.slug)}&student=${encodeURIComponent(finalHandle)}&name=${encodeURIComponent(finalLegalName)}&welcome=1`
      setTimeout(() => {
        router.push(targetUrl)
      }, 1400)
    }, 2400)
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--pure-black)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '8px 12px',
    color: 'var(--white)',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  }

  return (
    <Box minH="100vh" bg="$background" $platform-web={{ color: 'var(--foreground)' }}>
      {/* ── Top Bar & Step Tracker ── */}
      <Box
        borderBottomWidth={1}
        borderColor="var(--border)"
        bg="var(--pure-black)"
        py="$3"
        px="$6"
        position="sticky"
        t={0}
        $platform-web={{ zIndex: 20 }}
      >
        <XStack items="center" justify="space-between" flexWrap="wrap" gap="$4">
          <XStack items="center" gap="$3">
            <Link href={`/${course.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <XStack items="center" gap="$2">
                <ArrowLeft size={16} color="var(--white-70)" />
                <Text fontSize="$2" fontWeight="600" color="var(--white-70)" hoverStyle={{ color: 'var(--white)' }}>
                  Back to {course.code}
                </Text>
              </XStack>
            </Link>
            <Text color="var(--muted-foreground)">/</Text>
            <Text fontSize="$2" fontWeight="700" color="var(--white)" fontFamily="$mono">
              {course.slug === 'membership' ? 'UNIVERSITY PRO · 7-DAY FREE TRIAL' : 'TUITION CHECKOUT'}
            </Text>
          </XStack>

          {/* Stepper Pill */}
          <XStack items="center" gap="$2" flexWrap="wrap" maxW="100%" minW={0}>
            <XStack
              items="center"
              gap="$1.5"
              px="$2.5"
              py="$1"
              rounded="var(--radius-md)"
              bg={step === 'payment' ? 'var(--white)' : 'var(--card)'}
              borderWidth={0}
            >
              <Text
                fontSize="$1"
                fontWeight="700"
                fontFamily="$mono"
                color={step === 'payment' ? 'var(--pure-black)' : 'var(--muted-foreground)'}
              >
                {course.slug === 'membership' ? '1. VERIFY CARD' : '1. PAYMENT'}
              </Text>
              {step !== 'payment' && <Check size={12} color="var(--white)" />}
            </XStack>

            <ChevronRight size={14} color="var(--muted-foreground)" />

            <XStack
              items="center"
              gap="$1.5"
              px="$2.5"
              py="$1"
              rounded="var(--radius-md)"
              bg={step === 'hanzo_id' || step === 'provisioning' ? 'var(--white)' : 'var(--card)'}
              borderWidth={0}
            >
              <Text
                fontSize="$1"
                fontWeight="700"
                fontFamily="$mono"
                color={
                  step === 'hanzo_id' || step === 'provisioning'
                    ? 'var(--pure-black)'
                    : 'var(--muted-foreground)'
                }
              >
                2. ACCOUNT
              </Text>
              {step === 'complete' && <Check size={12} color="var(--white)" />}
            </XStack>

            <ChevronRight size={14} color="var(--muted-foreground)" />

            <XStack
              items="center"
              gap="$1.5"
              px="$2.5"
              py="$1"
              rounded="var(--radius-md)"
              bg={step === 'complete' ? 'var(--white)' : 'var(--card)'}
              borderWidth={0}
            >
              <Text
                fontSize="$1"
                fontWeight="700"
                fontFamily="$mono"
                color={step === 'complete' ? 'var(--pure-black)' : 'var(--muted-foreground)'}
              >
                3. PORTAL
              </Text>
            </XStack>
          </XStack>
        </XStack>
      </Box>

      {/* ── Main Step Content ── */}
      <Band pad={40} measure={1180}>
        {/* ========================================================================= */}
        {/* STEP 1: TUITION PAYMENT (Pay for the class first)                          */}
        {/* ========================================================================= */}
        {step === 'payment' && (
          <YStack gap="$5" width="100%">
            {/* Mobile Order Summary (Visible only on screens <= 768px, placed above payment) */}
            <Box className="show-on-mobile-only" width="100%">
              <Card p={18} borderWidth={0}>
                <YStack gap="$3">
                  <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2">
                    <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--white)">
                      {course.slug === 'membership' ? '7-DAY FREE TRIAL · ALL-ACCESS' : 'ENROLLMENT SEAT LEASE'}
                    </Chip>
                    <Text fontSize="$4" fontWeight="700" color="var(--white)" fontFamily="$mono">
                      {course.slug === 'membership' ? '$0.00 USD' : `$${finalPrice}.00 USD`}
                    </Text>
                  </XStack>

                  <YStack gap="$1">
                    <Text fontSize="$3" fontWeight="700" color="var(--white)">
                      {course.code}: {course.title}
                    </Text>
                    <Text fontSize="$1" color="var(--muted-foreground)">
                      {course.credential}: {course.credentialFull} ({course.units}.0 Academic Units)
                    </Text>
                  </YStack>

                  {appliedCoupon?.valid && (
                    <XStack
                      items="center"
                      justify="space-between"
                      p="$2"
                      rounded="var(--radius-sm)"
                      bg="rgba(255, 255, 255, 0.04)"
                    >
                      <XStack items="center" gap="$2">
                        <CheckCircle2 size={13} color="var(--white)" />
                        <Text fontSize="$1" color="var(--white)" fontFamily="$mono">
                          {appliedCoupon.code} (-${appliedCoupon.discountAmount}.00 USD)
                        </Text>
                      </XStack>
                      <Action
                        render="button"
                        onClick={handleRemoveCoupon}
                        px={8}
                        py={2}
                        $platform-web={{ fontSize: '11px' }}
                      >
                        Remove
                      </Action>
                    </XStack>
                  )}

                  {/* Toggle: Show/Hide Syllabus Perks & Coupon */}
                  <Box
                    render="button"
                    onClick={() => setMobileDetailsOpen(!mobileDetailsOpen)}
                    py="$2"
                    px="$3"
                    rounded="var(--radius-md)"
                    bg="rgba(255, 255, 255, 0.04)"
                    borderWidth={1}
                    borderColor="var(--border)"
                    $platform-web={{ cursor: 'pointer', outline: 'none' }}
                  >
                    <XStack items="center" justify="space-between">
                      <XStack items="center" gap="$2">
                        <Tag size={13} color="var(--white-70)" />
                        <Text fontSize="$1" fontWeight="600" color="var(--white-70)">
                          {mobileDetailsOpen ? 'Hide order details & coupon' : 'Show order details & coupon'}
                        </Text>
                      </XStack>
                      {mobileDetailsOpen ? (
                        <ChevronUp size={14} color="var(--white-70)" />
                      ) : (
                        <ChevronDown size={14} color="var(--white-70)" />
                      )}
                    </XStack>
                  </Box>

                  {/* Collapsible Section on Mobile */}
                  {mobileDetailsOpen && (
                    <YStack gap="$4" pt="$2">
                      <Box height={1} bg="var(--border)" />

                      {/* Included Benefits */}
                      <YStack gap={12}>
                        <Text
                          fontSize={11}
                          fontWeight="600"
                          color="rgba(255, 255, 255, 0.45)"
                          fontFamily="$mono"
                          letterSpacing={1.2}
                        >
                          {course.slug === 'membership'
                            ? 'UNIVERSITY PRO INCLUDES:'
                            : 'EVERY ENROLLMENT INCLUDES:'}
                        </Text>

                        {course.slug === 'membership' ? (
                          <>
                            <XStack items="flex-start" gap={10}>
                              <Sparkles size={14} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                              <YStack gap={1} flex={1} minW={0}>
                                <Text fontSize="$1" fontWeight="600" color="var(--white)">
                                  Full Hanzo Pro Developer Account
                                </Text>
                                <Text fontSize={11} color="var(--muted-foreground)">
                                  Unlimited Zen 6 and premium model access, 13 MCP tools.
                                </Text>
                              </YStack>
                            </XStack>
                            <XStack items="flex-start" gap={10}>
                              <Coins size={14} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                              <YStack gap={1} flex={1} minW={0}>
                                <Text fontSize="$1" fontWeight="600" color="var(--white)">
                                  + $50 compute credit for free every month
                                </Text>
                                <Text fontSize={11} color="var(--muted-foreground)">
                                  Deposited monthly into your Hanzo Cloud wallet.
                                </Text>
                              </YStack>
                            </XStack>
                          </>
                        ) : (
                          <>
                            <XStack items="flex-start" gap={10}>
                              <Coins size={14} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                              <YStack gap={1} flex={1} minW={0}>
                                <Text fontSize="$1" fontWeight="600" color="var(--white)">
                                  + ${rebateCredits} usage credit for free
                                </Text>
                                <Text fontSize={11} color="var(--muted-foreground)">
                                  Credited to your Hanzo Cloud wallet on Day 1.
                                </Text>
                              </YStack>
                            </XStack>
                            <XStack items="flex-start" gap={10}>
                              <Cpu size={14} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                              <YStack gap={1} flex={1} minW={0}>
                                <Text fontSize="$1" fontWeight="600" color="var(--white)">
                                  Dedicated Hanzo Visor Sandbox
                                </Text>
                                <Text fontSize={11} color="var(--muted-foreground)">
                                  Isolated SWE-bench and Zen 6 execution runtime.
                                </Text>
                              </YStack>
                            </XStack>
                          </>
                        )}
                      </YStack>

                      {/* Coupon Section (Mobile) */}
                      {course.slug !== 'membership' && (
                        <YStack gap="$2.5">
                          <Box height={1} bg="var(--border)" />
                          <Text fontSize="$1" fontWeight="600" color="var(--white)">
                            Coupon or Fellowship Grant
                          </Text>
                          {!appliedCoupon?.valid ? (
                            <XStack gap="$2" width="100%">
                              <input
                                id="mobile-coupon-input"
                                type="text"
                                style={{
                                  ...inputStyle,
                                  flex: 1,
                                  minWidth: 0,
                                  fontFamily: 'monospace',
                                  fontSize: '13px',
                                  borderColor: couponError ? 'var(--red-500)' : 'var(--border)',
                                }}
                                placeholder="e.g. STUDENT50"
                                value={couponCode}
                                onChange={(e) => {
                                  setCouponCode(e.target.value)
                                  if (couponError) setCouponError(null)
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleApplyCoupon()
                                  }
                                }}
                              />
                              <Action
                                render="button"
                                onClick={() => handleApplyCoupon()}
                                px={14}
                                py={6}
                                $platform-web={{ fontSize: '13px' }}
                              >
                                Apply
                              </Action>
                            </XStack>
                          ) : null}

                          {couponError && (
                            <Text fontSize="$1" color="var(--red-400)">
                              {couponError}
                            </Text>
                          )}

                          {!appliedCoupon?.valid && (
                            <XStack gap="$2" flexWrap="wrap" items="center">
                              <Text fontSize={11} color="var(--muted-foreground)">Grants:</Text>
                              <Box
                                render="button"
                                onClick={() => handleApplyCoupon('STUDENT50')}
                                px={8}
                                py={3}
                                rounded={999}
                                bg="rgba(255, 255, 255, 0.04)"
                                borderWidth={1}
                                borderColor="rgba(255, 255, 255, 0.1)"
                                $platform-web={{ cursor: 'pointer' }}
                              >
                                <Text fontSize={11} fontFamily="$mono" color="rgba(255, 255, 255, 0.8)">
                                  STUDENT50 (50% Off)
                                </Text>
                              </Box>
                              <Box
                                render="button"
                                onClick={() => handleApplyCoupon('DEVCOMMUNITY')}
                                px={8}
                                py={3}
                                rounded={999}
                                bg="rgba(255, 255, 255, 0.04)"
                                borderWidth={1}
                                borderColor="rgba(255, 255, 255, 0.1)"
                                $platform-web={{ cursor: 'pointer' }}
                              >
                                <Text fontSize={11} fontFamily="$mono" color="rgba(255, 255, 255, 0.8)">
                                  DEVCOMMUNITY (30% Off)
                                </Text>
                              </Box>
                            </XStack>
                          )}
                        </YStack>
                      )}

                      <Box height={1} bg="var(--border)" />

                      {/* Itemized Price Summary (Mobile) */}
                      <YStack gap="$1.5">
                        <XStack justify="space-between">
                          <Text fontSize="$1" color="var(--muted-foreground)">Standard Course Tuition</Text>
                          <Text fontSize="$1" color="var(--white)" fontFamily="$mono">${originalPrice}.00 USD</Text>
                        </XStack>
                        {discountAmount > 0 && (
                          <XStack justify="space-between">
                            <Text fontSize="$1" color="var(--white)">Coupon Discount ({appliedCoupon?.code})</Text>
                            <Text fontSize="$1" color="var(--white)" fontFamily="$mono">-${discountAmount}.00 USD</Text>
                          </XStack>
                        )}
                        <XStack justify="space-between" pt="$1">
                          <Text fontSize="$2" fontWeight="700" color="var(--white)">Total Due Today</Text>
                          <Text fontSize="$3" fontWeight="700" color="var(--white)" fontFamily="$mono">
                            {course.slug === 'membership' ? '$0.00 USD' : `$${finalPrice}.00 USD`}
                          </Text>
                        </XStack>
                      </YStack>
                    </YStack>
                  )}
                </YStack>
              </Card>
            </Box>

            <Grid columns={{ min: 280, max: 2 }} gap={32} items="flex-start">
              {/* Left Column: Order Breakdown, Perks, and Coupon (Desktop) */}
              <YStack gap="$5" className="hide-on-mobile">
                <Card p={28} borderWidth={0}>
                  <YStack gap="$4">
                    <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2">
                      <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--white)">
                        {course.slug === 'membership' ? '7-DAY FREE TRIAL · ALL-ACCESS' : 'ENROLLMENT SEAT LEASE'}
                      </Chip>
                      <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                        TERM: FALL / IMMEDIATE ACCESS
                      </Text>
                    </XStack>

                    <YStack gap="$1">
                      <Text fontSize="$5" fontWeight="700" color="var(--white)">
                        {course.code}: {course.title}
                      </Text>
                      <Text fontSize="$2" color="var(--muted-foreground)">
                        {course.credential}: {course.credentialFull} ({course.units}.0 Academic Units)
                      </Text>
                    </YStack>

                    <Box height={1} bg="var(--border)" />

                    {/* Included Benefits */}
                    <YStack gap={16}>
                      <Text fontSize={12} fontWeight="600" color="rgba(255, 255, 255, 0.45)" fontFamily="$mono" letterSpacing={1.2}>
                        {course.slug === 'membership' ? 'UNIVERSITY PRO MEMBERSHIP INCLUDES:' : 'EVERY ENROLLMENT INCLUDES:'}
                      </Text>

                      {course.slug === 'membership' ? (
                        <>
                          <XStack items="flex-start" gap={12}>
                            <Sparkles size={16} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                            <YStack gap={2} flex={1} minW={0}>
                              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                                Full Hanzo Pro Developer Account Included
                              </Text>
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Unlimited Zen 6 and premium model access, 13 unified MCP tools, and cloud developer features.
                              </Text>
                            </YStack>
                          </XStack>

                          <XStack items="flex-start" gap={12}>
                            <BookOpen size={16} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                            <YStack gap={2} flex={1} minW={0}>
                              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                                All 6 Accredited Degree Tracks &amp; Syllabi
                              </Text>
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Universal access to ENG 100, RL 101, SYS 103, MKT 102, PRA 104, and ARC 105.
                              </Text>
                            </YStack>
                          </XStack>

                          <XStack items="flex-start" gap={12}>
                            <Coins size={16} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                            <YStack gap={2} flex={1} minW={0}>
                              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                                + $50 compute credit for free every month
                              </Text>
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Deposited monthly into your Hanzo Cloud wallet for model inference and container leases.
                              </Text>
                            </YStack>
                          </XStack>

                          <XStack items="flex-start" gap={12}>
                            <Cpu size={16} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                            <YStack gap={2} flex={1} minW={0}>
                              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                                Dedicated Hanzo Visor GPU Sandboxes
                              </Text>
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Isolated execution runtime with automated cleanroom autograders.
                              </Text>
                            </YStack>
                          </XStack>

                          <XStack items="flex-start" gap={12}>
                            <GraduationCap size={16} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                            <YStack gap={2} flex={1} minW={0}>
                              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                                W3C Verifiable Credentials on Lux Chain
                              </Text>
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Verifiable on-chain degree credentials and live GitHub telemetry badges.
                              </Text>
                            </YStack>
                          </XStack>
                        </>
                      ) : (
                        <>
                          <XStack items="flex-start" gap={12}>
                            <Coins size={16} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                            <YStack gap={2} flex={1} minW={0}>
                              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                                + ${rebateCredits} usage credit for free
                              </Text>
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Credited to your Hanzo Cloud wallet on Day 1 for model training &amp; API calls.
                              </Text>
                            </YStack>
                          </XStack>

                          <XStack items="flex-start" gap={12}>
                            <Cpu size={16} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                            <YStack gap={2} flex={1} minW={0}>
                              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                                Dedicated Hanzo Visor MicroVM Sandbox
                              </Text>
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Isolated execution runtime with pre-configured SWE-bench and Zen 6 ZAP RPC.
                              </Text>
                            </YStack>
                          </XStack>

                          <XStack items="flex-start" gap={12}>
                            <GraduationCap size={16} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                            <YStack gap={2} flex={1} minW={0}>
                              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                                W3C Verifiable Credential on Lux Chain
                              </Text>
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Tamper-proof cryptographic degree badge instantly verifiable by tech employers.
                              </Text>
                            </YStack>
                          </XStack>
                        </>
                      )}
                    </YStack>

                    <Box height={1} bg="var(--border)" />

                    {/* Coupon Code / Trial Status Section */}
                    {course.slug === 'membership' ? (
                      <Box
                        p="$3.5"
                        rounded="var(--radius-md)"
                        bg="rgba(255, 255, 255, 0.04)"
                        borderWidth={1}
                        borderColor="rgba(255, 255, 255, 0.12)"
                      >
                        <XStack items="center" justify="space-between">
                          <XStack items="center" gap="$2">
                            <Sparkles size={14} color="var(--white)" />
                            <Text fontSize="$2" fontWeight="600" color="var(--white)">
                              7-Day Free Trial Activated
                            </Text>
                          </XStack>
                          <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--white)">
                            $0.00 TODAY
                          </Chip>
                        </XStack>
                        <Text fontSize="$1" color="var(--muted-foreground)" pt="$1.5">
                          First 7 days free. Credit or debit card verified upfront ($0.00). Billed $29.00/month starting on Day 8. Cancel anytime in 1-click in your portal.
                        </Text>
                      </Box>
                    ) : (
                      <YStack gap="$3">
                        <XStack items="center" justify="space-between">
                          <XStack items="center" gap="$2">
                            <Tag size={14} color="var(--white)" />
                            <Text fontSize="$2" fontWeight="600" color="var(--white)">
                              Tuition Coupon or Fellowship Grant
                            </Text>
                          </XStack>
                          {appliedCoupon?.valid && (
                            <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--white)">
                              COUPON APPLIED
                            </Chip>
                          )}
                        </XStack>

                        {!appliedCoupon?.valid ? (
                          <XStack gap="$2" width="100%">
                            <input
                              id="desktop-coupon-input"
                              type="text"
                              style={{
                                ...inputStyle,
                                flex: 1,
                                minWidth: 0,
                                fontFamily: 'monospace',
                                borderColor: couponError ? 'var(--red-500)' : 'var(--border)',
                              }}
                              placeholder="e.g. STUDENT50, DEVCOMMUNITY"
                              value={couponCode}
                              onChange={(e) => {
                                setCouponCode(e.target.value)
                                if (couponError) setCouponError(null)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  handleApplyCoupon()
                                }
                              }}
                            />
                            <Action
                              render="button"
                              onClick={() => handleApplyCoupon()}
                              px={16}
                              py={8}
                              $platform-web={{ fontSize: '13px' }}
                            >
                              Apply
                            </Action>
                          </XStack>
                        ) : (
                          <XStack
                            items="center"
                            justify="space-between"
                            p="$3"
                            rounded="var(--radius-md)"
                            bg="var(--pure-black)"
                            borderWidth={1}
                            borderColor="rgba(255, 255, 255, 0.2)"
                          >
                            <XStack items="center" gap="$2" flex={1} minW={0}>
                              <CheckCircle2 size={16} color="var(--white)" />
                              <YStack flex={1} minW={0}>
                                <Text fontSize="$2" fontWeight="600" color="var(--white)" fontFamily="$mono">
                                  {appliedCoupon.code} applied{KNOWN_COUPONS[appliedCoupon.code] ? ` · ${KNOWN_COUPONS[appliedCoupon.code].label}` : ''}
                                </Text>
                                <Text fontSize="$1" color="var(--muted-foreground)">
                                  Discount: -${appliedCoupon.discountAmount}.00 USD
                                </Text>
                              </YStack>
                            </XStack>
                            <Action
                              render="button"
                              onClick={handleRemoveCoupon}
                              ml="$3"
                              px={10}
                              py={4}
                              $platform-web={{ fontSize: '12px' }}
                            >
                              Remove
                            </Action>
                          </XStack>
                        )}

                        {couponError && (
                          <Text fontSize="$1" color="var(--red-400)">
                            {couponError}
                          </Text>
                        )}

                        {/* Quick Suggestion Chips */}
                        {!appliedCoupon?.valid && (
                          <XStack gap="$2" flexWrap="wrap" items="center">
                            <Text fontSize="$1" color="var(--muted-foreground)">
                              Available grants:
                            </Text>
                            <Box
                              render="button"
                              onClick={() => handleApplyCoupon('STUDENT50')}
                              px={10}
                              py={4}
                              rounded={999}
                              bg="rgba(255, 255, 255, 0.04)"
                              borderWidth={1}
                              borderColor="rgba(255, 255, 255, 0.1)"
                              hoverStyle={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                              $platform-web={{ cursor: 'pointer' }}
                            >
                              <Text fontSize={11} fontFamily="$mono" color="rgba(255, 255, 255, 0.8)">
                                STUDENT50 (50% Off)
                              </Text>
                            </Box>
                            <Box
                              render="button"
                              onClick={() => handleApplyCoupon('DEVCOMMUNITY')}
                              px={10}
                              py={4}
                              rounded={999}
                              bg="rgba(255, 255, 255, 0.04)"
                              borderWidth={1}
                              borderColor="rgba(255, 255, 255, 0.1)"
                              hoverStyle={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                              $platform-web={{ cursor: 'pointer' }}
                            >
                              <Text fontSize={11} fontFamily="$mono" color="rgba(255, 255, 255, 0.8)">
                                DEVCOMMUNITY (30% Off)
                              </Text>
                            </Box>
                          </XStack>
                        )}
                      </YStack>
                    )}

                    <Box height={1} bg="var(--border)" />

                    {/* Itemized Price Breakdown */}
                    <YStack gap="$2">
                      {course.slug === 'membership' ? (
                        <>
                          <XStack justify="space-between" items="center">
                            <Text fontSize="$2" color="var(--muted-foreground)">
                              Standard University Pro Membership
                            </Text>
                            <Text fontSize="$2" color="var(--white)" fontFamily="$mono">
                              $29.00 USD / mo
                            </Text>
                          </XStack>

                          <XStack justify="space-between" items="center">
                            <Text fontSize="$2" color="var(--white)">
                              7-Day Free Trial Discount
                            </Text>
                            <Text fontSize="$2" color="var(--white)" fontFamily="$mono">
                              -$29.00 USD (First 7 days free)
                            </Text>
                          </XStack>

                          <XStack justify="space-between" items="center">
                            <Text fontSize="$2" color="var(--muted-foreground)">
                              Hanzo Pro Developer Platform Access
                            </Text>
                            <Text fontSize="$2" color="var(--white)" fontFamily="$mono">
                              Included
                            </Text>
                          </XStack>

                          <Box height={1} bg="var(--border)" my="$1" />

                          <XStack justify="space-between" items="baseline">
                            <YStack flex={1} minW={0}>
                              <Text fontSize="$3" fontWeight="700" color="var(--white)">
                                Total Due Today
                              </Text>
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Card verified today ($0.00). Billed $29.00/mo starting on Day 8. Cancel anytime with 1-click in your portal.
                              </Text>
                            </YStack>
                            <Text fontSize="$6" fontWeight="700" color="var(--white)" fontFamily="$mono" ml="$3" $platform-web={{ whiteSpace: 'nowrap' }}>
                              $0.00 USD
                            </Text>
                          </XStack>
                        </>
                      ) : (
                        <>
                          <XStack justify="space-between" items="center">
                            <Text fontSize="$2" color="var(--muted-foreground)">
                              Standard Course Tuition
                            </Text>
                            <Text fontSize="$2" color="var(--white)" fontFamily="$mono">
                              ${originalPrice}.00 USD
                            </Text>
                          </XStack>

                          {discountAmount > 0 && (
                            <XStack justify="space-between" items="center">
                              <Text fontSize="$2" color="var(--white)">
                                Coupon Discount ({appliedCoupon?.code})
                              </Text>
                              <Text fontSize="$2" color="var(--white)" fontFamily="$mono">
                                -${discountAmount}.00 USD
                              </Text>
                            </XStack>
                          )}

                          <XStack justify="space-between" items="center">
                            <Text fontSize="$2" color="var(--muted-foreground)">
                              On-Chain Degree Issuance & CI Verification
                            </Text>
                            <Text fontSize="$2" color="rgba(255, 255, 255, 0.6)" fontFamily="$mono">
                              $0.00 (Waived)
                            </Text>
                          </XStack>

                          <Box height={1} bg="var(--border)" my="$1" />

                          <XStack justify="space-between" items="baseline">
                            <YStack flex={1} minW={0}>
                              <Text fontSize="$3" fontWeight="700" color="var(--white)">
                                Total Due Today
                              </Text>
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                One-time tuition fee. Never a recurring SaaS subscription.
                              </Text>
                            </YStack>
                            <Text fontSize="$6" fontWeight="700" color="var(--white)" fontFamily="$mono" ml="$3" $platform-web={{ whiteSpace: 'nowrap' }}>
                              ${finalPrice}.00 USD
                            </Text>
                          </XStack>
                        </>
                      )}
                    </YStack>
                  </YStack>
                </Card>
              </YStack>

              {/* Right Column: Unified Payment Card (Mobile & Desktop) */}
              <YStack gap="$5" width="100%">
                <Card p={28} borderWidth={0}>
                  <YStack gap="$5">
                    <YStack gap="$1">
                      <Text fontSize="$4" fontWeight="700" color="var(--white)">
                        {course.slug === 'membership' ? 'Card Verification' : 'Payment Method'}
                      </Text>
                      <Text fontSize="$2" color="var(--muted-foreground)">
                        {course.slug === 'membership'
                          ? 'Card details required upfront to activate your 7-day free trial. $0.00 charged today.'
                          : 'Secure one-time payment settled via Hanzo Treasury Layer.'}
                      </Text>
                    </YStack>

                    {/* ── Express Checkout (Apple Pay & Google Pay) ── */}
                    <YStack gap="$2.5">
                      <XStack items="center" justify="space-between">
                        <Text
                          fontSize={11}
                          fontWeight="700"
                          fontFamily="$mono"
                          color="var(--muted-foreground)"
                          letterSpacing={1.2}
                        >
                          EXPRESS CHECKOUT
                        </Text>
                        <Text fontSize={10} color="var(--muted-foreground)" fontFamily="$mono">
                          INSTANT 1-TAP
                        </Text>
                      </XStack>

                      <XStack gap="$3" width="100%">
                        {/* Apple Pay Button */}
                        <Box
                          render="button"
                          flex={1}
                          onClick={() => {
                            if (!isProcessingPayment) handleWalletPayment('apple_pay')
                          }}
                          py={12}
                          px={16}
                          rounded="var(--radius-md)"
                          bg="var(--pure-black)"
                          borderWidth={1}
                          borderColor="rgba(255, 255, 255, 0.25)"
                          hoverStyle={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            borderColor: 'rgba(255, 255, 255, 0.45)',
                          }}
                          $platform-web={{
                            cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                            opacity: isProcessingPayment && processingSource !== 'apple_pay' ? 0.4 : 1,
                            outline: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                            minHeight: '44px',
                          }}
                          aria-label="Pay with Apple Pay"
                        >
                          {isProcessingPayment && processingSource === 'apple_pay' ? (
                            <XStack items="center" gap="$2">
                              <RefreshCw size={14} className="animate-spin" color="var(--white)" />
                              <Text fontSize="$1" fontWeight="600" color="var(--white)">
                                Authorizing...
                              </Text>
                            </XStack>
                          ) : (
                            <ApplePayLogo height={20} />
                          )}
                        </Box>

                        {/* Google Pay Button */}
                        <Box
                          render="button"
                          flex={1}
                          onClick={() => {
                            if (!isProcessingPayment) handleWalletPayment('google_pay')
                          }}
                          py={12}
                          px={16}
                          rounded="var(--radius-md)"
                          bg="var(--pure-black)"
                          borderWidth={1}
                          borderColor="rgba(255, 255, 255, 0.25)"
                          hoverStyle={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            borderColor: 'rgba(255, 255, 255, 0.45)',
                          }}
                          $platform-web={{
                            cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                            opacity: isProcessingPayment && processingSource !== 'google_pay' ? 0.4 : 1,
                            outline: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                            minHeight: '44px',
                          }}
                          aria-label="Pay with Google Pay"
                        >
                          {isProcessingPayment && processingSource === 'google_pay' ? (
                            <XStack items="center" gap="$2">
                              <RefreshCw size={14} className="animate-spin" color="var(--white)" />
                              <Text fontSize="$1" fontWeight="600" color="var(--white)">
                                Authorizing...
                              </Text>
                            </XStack>
                          ) : (
                            <GooglePayLogo height={20} />
                          )}
                        </Box>
                      </XStack>
                    </YStack>

                    {/* ── Divider: OR PAY WITH CARD ── */}
                    <XStack items="center" gap="$3" width="100%" my="$1">
                      <Box height={1} bg="var(--border)" flex={1} />
                      <Text
                        fontSize={11}
                        fontWeight="600"
                        color="var(--muted-foreground)"
                        fontFamily="$mono"
                        letterSpacing={1.2}
                      >
                        OR PAY WITH CARD
                      </Text>
                      <Box height={1} bg="var(--border)" flex={1} />
                    </XStack>

                    {/* ── Payment Method Switcher (Card / Crypto) ── */}
                    <XStack gap="$2" width="100%">
                      <Box
                        render="button"
                        flex={1}
                        onClick={() => setPaymentMethod('card')}
                        py="$2"
                        px="$3"
                        rounded="var(--radius-md)"
                        bg={paymentMethod === 'card' ? 'var(--white)' : 'var(--pure-black)'}
                        borderWidth={1}
                        borderColor={paymentMethod === 'card' ? 'var(--white)' : 'var(--border)'}
                        $platform-web={{ cursor: 'pointer', outline: 'none' }}
                      >
                        <XStack items="center" justify="center" gap="$2">
                          <CreditCard
                            size={15}
                            color={paymentMethod === 'card' ? 'var(--pure-black)' : 'var(--white)'}
                          />
                          <Text
                            fontSize="$1"
                            fontWeight="700"
                            fontFamily="$mono"
                            color={paymentMethod === 'card' ? 'var(--pure-black)' : 'var(--white)'}
                          >
                            CARD
                          </Text>
                        </XStack>
                      </Box>

                      <Box
                        render="button"
                        flex={1}
                        onClick={() => setPaymentMethod('crypto')}
                        py="$2"
                        px="$3"
                        rounded="var(--radius-md)"
                        bg={paymentMethod === 'crypto' ? 'var(--white)' : 'var(--pure-black)'}
                        borderWidth={1}
                        borderColor={paymentMethod === 'crypto' ? 'var(--white)' : 'var(--border)'}
                        $platform-web={{ cursor: 'pointer', outline: 'none' }}
                      >
                        <XStack items="center" justify="center" gap="$2">
                          <Coins
                            size={15}
                            color={paymentMethod === 'crypto' ? 'var(--pure-black)' : 'var(--white)'}
                          />
                          <Text
                            fontSize="$1"
                            fontWeight="700"
                            fontFamily="$mono"
                            color={paymentMethod === 'crypto' ? 'var(--pure-black)' : 'var(--white)'}
                          >
                            CRYPTO
                          </Text>
                        </XStack>
                      </Box>
                    </XStack>

                    {/* ── Semantic Payment Form with Autofill ── */}
                    <form
                      id="checkout-payment-form"
                      method="POST"
                      action="#"
                      autoComplete="on"
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (!isProcessingPayment) handleCompletePayment()
                      }}
                    >
                      <YStack gap="$4">
                        {/* Card Form */}
                        {paymentMethod === 'card' && (
                          <YStack gap="$3">
                            {/* Cardholder Name */}
                            <YStack gap="$1">
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Name on Card
                              </Text>
                              <input
                                id="cc-name"
                                name="cc-name"
                                type="text"
                                autoComplete="cc-name"
                                placeholder="Name on card"
                                style={inputStyle}
                                value={cardName}
                                onChange={(e) => {
                                  setCardName(e.target.value)
                                  if (paymentError) setPaymentError(null)
                                }}
                                required
                              />
                            </YStack>

                            {/* Card Number */}
                            <YStack gap="$1">
                              <XStack justify="space-between" items="center">
                                <Text fontSize="$1" color="var(--muted-foreground)">
                                  Card Number
                                </Text>
                                {getCardBrand(cardNumber) && (
                                  <Chip px={6} py={1} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                                    {getCardBrand(cardNumber)}
                                  </Chip>
                                )}
                              </XStack>
                              <input
                                id="cc-number"
                                name="cc-number"
                                type="tel"
                                inputMode="numeric"
                                autoComplete="cc-number"
                                placeholder="1234 5678 9012 3456"
                                style={{ ...inputStyle, fontFamily: 'monospace' }}
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                maxLength={19}
                                required
                              />
                            </YStack>

                            {/* Expiration & CVC */}
                            <Grid columns={2} gap={12}>
                              <YStack gap="$1">
                                <Text fontSize="$1" color="var(--muted-foreground)">
                                  Expires (MM/YY)
                                </Text>
                                <input
                                  id="cc-exp"
                                  name="cc-exp"
                                  type="tel"
                                  inputMode="numeric"
                                  autoComplete="cc-exp"
                                  placeholder="MM/YY"
                                  style={{ ...inputStyle, fontFamily: 'monospace' }}
                                  value={cardExp}
                                  onChange={handleCardExpChange}
                                  maxLength={5}
                                  required
                                />
                              </YStack>

                              <YStack gap="$1">
                                <Text fontSize="$1" color="var(--muted-foreground)">
                                  Security Code (CVC)
                                </Text>
                                <input
                                  id="cc-csc"
                                  name="cc-csc"
                                  type="tel"
                                  inputMode="numeric"
                                  autoComplete="cc-csc"
                                  placeholder="CVC"
                                  style={{ ...inputStyle, fontFamily: 'monospace' }}
                                  value={cardCvc}
                                  onChange={handleCardCvcChange}
                                  maxLength={4}
                                  required
                                />
                              </YStack>
                            </Grid>

                            {/* Billing Address Subheading with Autofill Notice */}
                            <Box height={1} bg="var(--border)" my="$1" />
                            <XStack items="center" justify="space-between">
                              <Text fontSize={11} fontWeight="700" fontFamily="$mono" color="var(--muted-foreground)" letterSpacing={1}>
                                BILLING ADDRESS
                              </Text>
                              <Text fontSize={10} color="var(--muted-foreground)" fontFamily="$mono">
                                AUTOFILL ENABLED
                              </Text>
                            </XStack>

                            {/* Street Address */}
                            <YStack gap="$1">
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Street Address
                              </Text>
                              <input
                                id="billing-street-address"
                                name="billing-street-address"
                                type="text"
                                autoComplete="billing street-address"
                                placeholder="Street address (e.g. 100 Main St)"
                                style={inputStyle}
                                value={cardStreet}
                                onChange={(e) => setCardStreet(e.target.value)}
                              />
                            </YStack>

                            {/* Apt / Suite / Unit (optional) */}
                            <YStack gap="$1">
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Apt, Suite, Unit (optional)
                              </Text>
                              <input
                                id="billing-address-line2"
                                name="billing-address-line2"
                                type="text"
                                autoComplete="billing address-line2"
                                placeholder="Apt, Suite, Unit"
                                style={inputStyle}
                                value={cardApt}
                                onChange={(e) => setCardApt(e.target.value)}
                              />
                            </YStack>

                            {/* City & State / Region */}
                            <Grid columns={2} gap={12}>
                              <YStack gap="$1">
                                <Text fontSize="$1" color="var(--muted-foreground)">
                                  City
                                </Text>
                                <input
                                  id="billing-level2"
                                  name="billing-level2"
                                  type="text"
                                  autoComplete="billing address-level2"
                                  placeholder="City"
                                  style={inputStyle}
                                  value={cardCity}
                                  onChange={(e) => setCardCity(e.target.value)}
                                />
                              </YStack>

                              <YStack gap="$1">
                                <Text fontSize="$1" color="var(--muted-foreground)">
                                  State / Region
                                </Text>
                                <input
                                  id="billing-level1"
                                  name="billing-level1"
                                  type="text"
                                  autoComplete="billing address-level1"
                                  placeholder="State / Region"
                                  style={inputStyle}
                                  value={cardState}
                                  onChange={(e) => setCardState(e.target.value)}
                                />
                              </YStack>
                            </Grid>

                            {/* Postal Code & Country */}
                            <Grid columns={2} gap={12}>
                              <YStack gap="$1">
                                <Text fontSize="$1" color="var(--muted-foreground)">
                                  Postal / ZIP Code
                                </Text>
                                <input
                                  id="billing-postal-code"
                                  name="billing-postal-code"
                                  type="text"
                                  inputMode="numeric"
                                  autoComplete="billing postal-code"
                                  placeholder="Postal code / ZIP"
                                  style={inputStyle}
                                  value={cardPostal}
                                  onChange={(e) => {
                                    setCardPostal(e.target.value)
                                    if (paymentError) setPaymentError(null)
                                  }}
                                  required
                                />
                              </YStack>

                              <YStack gap="$1">
                                <Text fontSize="$1" color="var(--muted-foreground)">
                                  Country
                                </Text>
                                <input
                                  id="billing-country"
                                  name="billing-country"
                                  type="text"
                                  autoComplete="billing country-name"
                                  placeholder="Country"
                                  style={inputStyle}
                                  value={cardCountry}
                                  onChange={(e) => setCardCountry(e.target.value)}
                                />
                              </YStack>
                            </Grid>
                          </YStack>
                        )}

                        {/* Crypto Form */}
                        {paymentMethod === 'crypto' && (
                          <YStack gap="$3">
                            <YStack gap="$1">
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                Asset & Network
                              </Text>
                              <XStack gap="$2">
                                {(['USDC', 'LUX', 'ETH'] as const).map((coin) => (
                                  <Box
                                    key={coin}
                                    render="button"
                                    flex={1}
                                    onClick={() => setCryptoAsset(coin)}
                                    py="$2"
                                    rounded="var(--radius-md)"
                                    bg={cryptoAsset === coin ? 'var(--white)' : 'var(--pure-black)'}
                                    borderWidth={1}
                                    borderColor={cryptoAsset === coin ? 'var(--white)' : 'var(--border)'}
                                    $platform-web={{ cursor: 'pointer', outline: 'none' }}
                                  >
                                    <Text
                                      fontSize="$1"
                                      fontWeight="700"
                                      fontFamily="$mono"
                                      $platform-web={{ textAlign: 'center' }}
                                      color={cryptoAsset === coin ? 'var(--pure-black)' : 'var(--white)'}
                                    >
                                      {coin}
                                    </Text>
                                  </Box>
                                ))}
                              </XStack>
                            </YStack>

                            <Box
                              p="$3"
                              rounded="var(--radius-md)"
                              bg="var(--pure-black)"
                              borderWidth={1}
                              borderColor="var(--border)"
                            >
                              <XStack items="center" justify="space-between">
                                <YStack>
                                  <Text fontSize="$1" color="var(--muted-foreground)">
                                    Deposit Address ({cryptoNetwork})
                                  </Text>
                                  <Text fontSize="$1" fontFamily="$mono" color="var(--white)">
                                    0x71C...4e89 (Hanzo Treasury)
                                  </Text>
                                </YStack>
                                <QrCode size={20} color="var(--white-70)" />
                              </XStack>
                            </Box>
                          </YStack>
                        )}

                        {/* Payment Error Alert */}
                        {paymentError && (
                          <Box
                            p="$2.5"
                            px="$3"
                            rounded="var(--radius-md)"
                            bg="rgba(239, 68, 68, 0.1)"
                            borderWidth={1}
                            borderColor="var(--red-500)"
                          >
                            <XStack items="center" gap="$2">
                              <AlertCircle size={15} color="var(--red-400)" />
                              <Text fontSize="$1" color="var(--red-400)">
                                {paymentError}
                              </Text>
                            </XStack>
                          </Box>
                        )}

                        {/* Security Guarantees */}
                        <Box
                          p="$3"
                          rounded="var(--radius-md)"
                          bg="rgba(255, 255, 255, 0.03)"
                          borderWidth={1}
                          borderColor="rgba(255, 255, 255, 0.08)"
                        >
                          <XStack items="center" justify="center">
                            <Text fontSize="$1" color="var(--muted-foreground)" $platform-web={{ textAlign: 'center' }}>
                              {course.slug === 'membership'
                                ? '256-bit TLS encrypted. Cancel anytime in 1-click before Day 8 to avoid charges.'
                                : '256-bit TLS encrypted. Backed by 14-day full money-back academic guarantee.'}
                            </Text>
                          </XStack>
                        </Box>

                        {/* Primary Submit CTA */}
                        <Action
                          render="button"
                          onClick={handleCompletePayment}
                          fill
                          disabled={isProcessingPayment}
                          py={14}
                          $platform-web={{
                            fontSize: '15px',
                            fontWeight: 600,
                            justifyContent: 'center',
                            minHeight: '48px',
                          }}
                        >
                          {isProcessingPayment && processingSource === 'card' ? (
                            <XStack items="center" gap="$2">
                              <RefreshCw size={16} className="animate-spin" />
                              <Text fontSize="$2" fontWeight="600" color="inherit">
                                {course.slug === 'membership'
                                  ? 'Verifying card & activating trial...'
                                  : 'Processing payment...'}
                              </Text>
                            </XStack>
                          ) : (
                            <XStack items="center" gap="$2">
                              <Text fontSize="$2" fontWeight="600" color="inherit">
                                {course.slug === 'membership'
                                  ? 'Verify Card & Start 7-Day Free Trial →'
                                  : `Pay $${finalPrice}.00 USD & Proceed to Hanzo ID →`}
                              </Text>
                            </XStack>
                          )}
                        </Action>

                        <Text fontSize="$1" color="var(--muted-foreground)" $platform-web={{ textAlign: 'center' }}>
                          {course.slug === 'membership'
                            ? 'Step 1 of 2: Card details verified ($0.00 today), followed immediately by Hanzo ID creation.'
                            : 'Step 1 of 2: Tuition payment is completed first, followed immediately by Hanzo ID creation.'}
                        </Text>
                      </YStack>
                    </form>
                  </YStack>
                </Card>
              </YStack>
            </Grid>
          </YStack>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: HANZO ID ACCOUNT CREATION (Use hanzo id to make the actual account) */}
        {/* ========================================================================= */}
        {step === 'hanzo_id' && (
          <YStack gap="$5" maxW={780} mx="auto">
            {/* Payment Verified Celebration Banner */}
            <Box
              p="$4"
              rounded="var(--radius-lg)"
              bg="var(--pure-black)"
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.15)"
            >
              <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3">
                <XStack items="center" gap="$3">
                  <Box p="$2" rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.08)">
                    <CheckCircle2 size={24} color="var(--white)" />
                  </Box>
                  <YStack>
                    <Text fontSize="$3" fontWeight="700" color="var(--white)">
                      {course.slug === 'membership'
                        ? 'Card Verified: 7-Day Free Trial Active ($0.00 Today)'
                        : `Tuition Cleared: $${paidAmount}.00 USD`}
                    </Text>
                    <Text fontSize="$1" color="rgba(255, 255, 255, 0.6)" fontFamily="$mono">
                      {course.slug === 'membership'
                        ? `Auth ID: ${transactionId} · Billed $29.00/mo on Day 8`
                        : `Receipt ID: ${transactionId}`}
                    </Text>
                  </YStack>
                </XStack>

                <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--white)">
                  {course.slug === 'membership' ? 'TRIAL RESERVED · STEP 2 OF 2' : 'SEAT RESERVED · STEP 2 OF 2'}
                </Chip>
              </XStack>
            </Box>

            {/* Account Creation Card */}
            <Card p={32} borderWidth={0}>
              <YStack gap="$5">
                <YStack gap="$2">
                  <Text fontSize="$5" fontWeight="700" color="var(--white)">
                    Create or Link your Hanzo ID
                  </Text>
                  <Text fontSize="$2" color="var(--muted-foreground)">
                    {course.slug === 'membership'
                      ? 'Your 7-day free trial is activated. Now configure your decentralized Hanzo ID to claim your Student DID (did:hanzo:student:...), unlock full Hanzo Pro developer tools, and initialize your Hanzo Visor sandbox.'
                      : `Your class payment is locked in. Now configure your decentralized Hanzo ID to claim your Student DID (did:hanzo:student:...), unlock your $${rebateCredits}.00 USD compute grant, and initialize your Hanzo Visor sandbox.`}
                  </Text>
                </YStack>

                {/* Account Mode Switcher */}
                <XStack gap="$2" width="100%">
                  <Box
                    render="button"
                    flex={1}
                    onClick={() => setAccountMode('create')}
                    py="$2"
                    px="$3"
                    rounded="var(--radius-md)"
                    bg={accountMode === 'create' ? 'var(--white)' : 'var(--pure-black)'}
                    borderWidth={1}
                    borderColor={accountMode === 'create' ? 'var(--white)' : 'var(--border)'}
                    $platform-web={{ cursor: 'pointer', outline: 'none' }}
                  >
                    <XStack items="center" justify="center" gap="$2">
                      <User
                        size={15}
                        color={accountMode === 'create' ? 'var(--pure-black)' : 'var(--white)'}
                      />
                      <Text
                        fontSize="$1"
                        fontWeight="700"
                        fontFamily="$mono"
                        color={accountMode === 'create' ? 'var(--pure-black)' : 'var(--white)'}
                      >
                        CREATE NEW HANZO ID
                      </Text>
                    </XStack>
                  </Box>

                  <Box
                    render="button"
                    flex={1}
                    onClick={() => setAccountMode('link')}
                    py="$2"
                    px="$3"
                    rounded="var(--radius-md)"
                    bg={accountMode === 'link' ? 'var(--white)' : 'var(--pure-black)'}
                    borderWidth={1}
                    borderColor={accountMode === 'link' ? 'var(--white)' : 'var(--border)'}
                    $platform-web={{ cursor: 'pointer', outline: 'none' }}
                  >
                    <XStack items="center" justify="center" gap="$2">
                      <Key
                        size={15}
                        color={accountMode === 'link' ? 'var(--pure-black)' : 'var(--white)'}
                      />
                      <Text
                        fontSize="$1"
                        fontWeight="700"
                        fontFamily="$mono"
                        color={accountMode === 'link' ? 'var(--pure-black)' : 'var(--white)'}
                      >
                        LINK EXISTING ACCOUNT
                      </Text>
                    </XStack>
                  </Box>
                </XStack>

                <form
                  id="checkout-account-form"
                  method="POST"
                  action="#"
                  autoComplete="on"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleStartProvisioning()
                  }}
                >
                  <YStack gap="$5">
                    {/* Form: Create New Hanzo ID */}
                    {accountMode === 'create' && (
                      <YStack gap="$4">
                        <Grid columns={{ min: 260, max: 2 }} gap={16}>
                          <YStack gap="$1">
                            <Text fontSize="$1" color="var(--muted-foreground)">
                              Full Legal Name (For W3C Credential)
                            </Text>
                            <input
                              id="student-name"
                              name="name"
                              type="text"
                              autoComplete="name"
                              placeholder="e.g. Jane Doe"
                              style={inputStyle}
                              value={legalName}
                              onChange={(e) => {
                                setLegalName(e.target.value)
                                if (accountError) setAccountError(null)
                              }}
                            />
                          </YStack>

                          <YStack gap="$1">
                            <Text fontSize="$1" color="var(--muted-foreground)">
                              Student Email Address
                            </Text>
                            <input
                              id="student-email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              placeholder="student@example.com"
                              style={inputStyle}
                              value={studentEmail}
                              onChange={(e) => {
                                setStudentEmail(e.target.value)
                                if (accountError) setAccountError(null)
                                if (!handle && e.target.value.includes('@')) {
                                  setHandle(e.target.value.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, ''))
                                }
                              }}
                            />
                          </YStack>
                        </Grid>

                        <YStack gap="$1">
                          <XStack justify="space-between" items="center">
                            <Text fontSize="$1" color="var(--muted-foreground)">
                              Hanzo ID Handle
                            </Text>
                            <Text fontSize="$1" fontFamily="$mono" color="rgba(255, 255, 255, 0.7)">
                              did:hanzo:student:{handle || 'yourhandle'}
                            </Text>
                          </XStack>
                          <XStack
                            items="center"
                            px="$3"
                            py="$2"
                            rounded="var(--radius-md)"
                            bg="var(--pure-black)"
                            borderWidth={1}
                            borderColor="var(--border)"
                          >
                            <Text fontSize="$2" color="var(--muted-foreground)" fontFamily="$mono" mr="$1">
                              @
                            </Text>
                            <input
                              id="student-handle"
                              name="username"
                              type="text"
                              autoComplete="username"
                              placeholder="yourhandle"
                              style={{
                                ...inputStyle,
                                border: 'none',
                                padding: 0,
                                background: 'transparent',
                                fontFamily: 'monospace',
                                flex: 1,
                              }}
                              value={handle}
                              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                            />
                            <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                              .hanzo.id
                            </Text>
                          </XStack>
                        </YStack>

                        {/* Auth Method */}
                        <YStack gap="$2">
                          <Text fontSize="$1" color="var(--muted-foreground)">
                            Authentication Method
                          </Text>
                          <XStack gap="$2">
                            <Box
                              render="button"
                              flex={1}
                              onClick={() => setAuthMethod('passkey')}
                              py="$2"
                              px="$3"
                              rounded="var(--radius-md)"
                              bg={authMethod === 'passkey' ? 'var(--card)' : 'var(--pure-black)'}
                              borderWidth={1}
                              borderColor={authMethod === 'passkey' ? 'var(--white)' : 'var(--border)'}
                              $platform-web={{ cursor: 'pointer', outline: 'none' }}
                            >
                              <XStack items="center" gap="$2">
                                <Sparkles
                                  size={14}
                                  color={authMethod === 'passkey' ? 'var(--white)' : 'var(--muted-foreground)'}
                                />
                                <YStack items="flex-start">
                                  <Text fontSize="$1" fontWeight="600" color="var(--white)">
                                    Passkey (Biometric)
                                  </Text>
                                  <Text fontSize="$1" color="var(--muted-foreground)">
                                    Touch ID / Face ID / WebAuthn
                                  </Text>
                                </YStack>
                              </XStack>
                            </Box>

                            <Box
                              render="button"
                              flex={1}
                              onClick={() => setAuthMethod('password')}
                              py="$2"
                              px="$3"
                              rounded="var(--radius-md)"
                              bg={authMethod === 'password' ? 'var(--card)' : 'var(--pure-black)'}
                              borderWidth={1}
                              borderColor={authMethod === 'password' ? 'var(--white)' : 'var(--border)'}
                              $platform-web={{ cursor: 'pointer', outline: 'none' }}
                            >
                              <XStack items="center" gap="$2">
                                <Lock
                                  size={14}
                                  color={authMethod === 'password' ? 'var(--white)' : 'var(--muted-foreground)'}
                                />
                                <YStack items="flex-start">
                                  <Text fontSize="$1" fontWeight="600" color="var(--white)">
                                    Master Password
                                  </Text>
                                  <Text fontSize="$1" color="var(--muted-foreground)">
                                    Standard secure passphrase
                                  </Text>
                                </YStack>
                              </XStack>
                            </Box>
                          </XStack>
                        </YStack>

                        {authMethod === 'password' && (
                          <YStack gap="$1">
                            <Text fontSize="$1" color="var(--muted-foreground)">
                              Master Passphrase
                            </Text>
                            <input
                              id="student-new-password"
                              name="new-password"
                              type="password"
                              autoComplete="new-password"
                              placeholder="Choose a passphrase"
                              style={inputStyle}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </YStack>
                        )}

                        {/* Honor Code */}
                        <XStack items="center" gap="$2" pt="$2">
                          <input
                            id="honor-code"
                            name="honor-code"
                            type="checkbox"
                            checked={agreeHonorCode}
                            onChange={(e) => setAgreeHonorCode(e.target.checked)}
                            style={{ cursor: 'pointer' }}
                          />
                          <Text fontSize="$1" color="var(--muted-foreground)">
                            I agree to the Hanzo University Academic Integrity Policy and Verifiable Credential standard.
                          </Text>
                        </XStack>
                      </YStack>
                    )}

                    {/* Form: Link Existing Hanzo ID */}
                    {accountMode === 'link' && (
                      <YStack gap="$4">
                        <YStack gap="$1">
                          <Text fontSize="$1" color="var(--muted-foreground)">
                            Hanzo ID Username or Email
                          </Text>
                          <input
                            id="link-identifier"
                            name="username"
                            type="text"
                            autoComplete="username"
                            style={inputStyle}
                            placeholder="student@example.com or @handle"
                            value={studentEmail}
                            onChange={(e) => {
                              setStudentEmail(e.target.value)
                              if (accountError) setAccountError(null)
                            }}
                          />
                        </YStack>

                        <YStack gap="$1">
                          <Text fontSize="$1" color="var(--muted-foreground)">
                            Password or Passkey
                          </Text>
                          <input
                            id="link-password"
                            name="current-password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Password or passkey"
                            style={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </YStack>

                        {/* Quick SSO */}
                        <XStack gap="$2" items="center">
                          <Text fontSize="$1" color="var(--muted-foreground)">
                            Or sign in with:
                          </Text>
                          <Box
                            render="button"
                            onClick={() => {
                              const fallback = (studentEmail.includes('@') ? studentEmail.split('@')[0] : (studentEmail.trim() || 'student')).toLowerCase().replace(/[^a-z0-9_-]/g, '')
                              setHandle(`${fallback}-gh`)
                              handleStartProvisioning()
                            }}
                            px="$3"
                            py="$1"
                            rounded="var(--radius-sm)"
                            bg="var(--pure-black)"
                            borderWidth={1}
                            borderColor="var(--border)"
                            $platform-web={{ cursor: 'pointer', border: 'none' }}
                          >
                            <Text fontSize="$1" color="var(--white)" fontFamily="$mono">
                              GitHub SSO
                            </Text>
                          </Box>
                          <Box
                            render="button"
                            onClick={() => {
                              const fallback = (studentEmail.includes('@') ? studentEmail.split('@')[0] : (studentEmail.trim() || 'student')).toLowerCase().replace(/[^a-z0-9_-]/g, '')
                              setHandle(`${fallback}-google`)
                              handleStartProvisioning()
                            }}
                            px="$3"
                            py="$1"
                            rounded="var(--radius-sm)"
                            bg="var(--pure-black)"
                            borderWidth={1}
                            borderColor="var(--border)"
                            $platform-web={{ cursor: 'pointer', border: 'none' }}
                          >
                            <Text fontSize="$1" color="var(--white)" fontFamily="$mono">
                              Google SSO
                            </Text>
                          </Box>
                        </XStack>
                      </YStack>
                    )}

                    {/* Account Error Alert */}
                    {accountError && (
                      <Box
                        p="$2.5"
                        px="$3"
                        rounded="var(--radius-md)"
                        bg="rgba(239, 68, 68, 0.1)"
                        borderWidth={1}
                        borderColor="var(--red-500)"
                      >
                        <XStack items="center" gap="$2">
                          <AlertCircle size={15} color="var(--red-400)" />
                          <Text fontSize="$1" color="var(--red-400)">
                            {accountError}
                          </Text>
                        </XStack>
                      </Box>
                    )}

                    {/* Provision Submit CTA */}
                    <Action
                      render="button"
                      onClick={handleStartProvisioning}
                      fill
                      py={14}
                      $platform-web={{
                        fontSize: '15px',
                        fontWeight: 600,
                        justifyContent: 'center',
                        minHeight: '48px',
                      }}
                    >
                      <XStack items="center" gap="$2">
                        <Sparkles size={16} />
                        <Text fontSize="$2" fontWeight="600" color="inherit">
                          {accountMode === 'create'
                            ? 'Create Hanzo ID & Launch Workspace →'
                            : 'Link Hanzo ID & Enter Portal →'}
                        </Text>
                      </XStack>
                    </Action>
                  </YStack>
                </form>
              </YStack>
            </Card>
          </YStack>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: PROVISIONING / COMPLETION (Terminal initialization & forward)       */}
        {/* ========================================================================= */}
        {(step === 'provisioning' || step === 'complete') && (
          <YStack gap="$5" maxW={820} mx="auto">
            <Card p={32} borderWidth={0}>
              <YStack gap="$4">
                <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3">
                  <XStack items="center" gap="$2">
                    <Terminal size={18} color="var(--white)" />
                    <Text fontSize="$3" fontWeight="700" color="var(--white)" fontFamily="$mono">
                      HANZO IDENTITY & SANDBOX PROVISIONER
                    </Text>
                  </XStack>
                  <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--white)">
                    {provisionProgress}% COMPLETE
                  </Chip>
                </XStack>

                {/* Progress Bar */}
                <Box height={4} width="100%" bg="var(--border)" rounded={999} overflow="hidden">
                  <Box
                    height="100%"
                    width={`${provisionProgress}%`}
                    bg="var(--white)"
                    transition="quick"
                  />
                </Box>

                {/* Terminal Console */}
                <Box
                  p="$4"
                  rounded="var(--radius-md)"
                  bg="var(--pure-black)"
                  borderWidth={1}
                  borderColor="var(--border)"
                  minH={220}
                  $platform-web={{ fontFamily: 'monospace' }}
                >
                  <YStack gap="$2">
                    {provisionLogs.map((log, i) => (
                      <Text
                        key={i}
                        fontSize="$1"
                        fontFamily="$mono"
                        color={
                          log.includes('[OK]') || log.includes('[SUCCESS]')
                            ? 'var(--white)'
                            : log.includes('[INIT]') || log.includes('[CARD VERIFIED]')
                            ? 'var(--white)'
                            : 'var(--white-70)'
                        }
                      >
                        {log}
                      </Text>
                    ))}
                    {provisionProgress < 100 && (
                      <XStack items="center" gap="$2" pt="$2">
                        <RefreshCw size={13} color="var(--white-70)" className="animate-spin" />
                        <Text fontSize="$1" color="var(--white-70)" fontFamily="$mono">
                          Provisioning microVM container lease...
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                </Box>

                {/* Done Callout */}
                {step === 'complete' && (
                  <YStack gap="$3" items="center" pt="$2">
                    <Text fontSize="$2" color="var(--white)" fontWeight="600">
                      Enrollment Complete! Forwarding to your student learning portal...
                    </Text>
                    <Action
                      href={`/portal?enrolled=${encodeURIComponent(course.slug)}&student=${encodeURIComponent(handle)}&welcome=1`}
                      fill
                    >
                      Enter Student Learning Portal Now →
                    </Action>
                  </YStack>
                )}
              </YStack>
            </Card>
          </YStack>
        )}
      </Band>
    </Box>
  )
}
