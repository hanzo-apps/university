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
  GraduationCap,
  Coins,
  Terminal,
  User,
  Key,
  Check,
  Tag,
  QrCode,
  Wallet,
  RefreshCw,
  Cpu,
} from 'lucide-react'
import {
  type UniversityCourse,
  validateCoupon,
  type CouponResult,
} from '../../courses-data'

type CheckoutStep = 'payment' | 'hanzo_id' | 'provisioning' | 'complete'
type PaymentMethod = 'card' | 'apple_pay' | 'crypto'

export function CheckoutFlow({ course }: { course: UniversityCourse }) {
  const router = useRouter()

  // Flow State
  const [step, setStep] = useState<CheckoutStep>('payment')

  // Coupon State
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [cardName, setCardName] = useState('Alex Rivers')
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242')
  const [cardExp, setCardExp] = useState('08/29')
  const [cardCvc, setCardCvc] = useState('882')
  const [cardCountry, setCardCountry] = useState('United States')
  const [cardPostal, setCardPostal] = useState('94107')
  const [cryptoAsset, setCryptoAsset] = useState<'USDC' | 'LUX' | 'ETH'>('USDC')
  const [cryptoNetwork] = useState('Lux Chain (Zero Gas)')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Transaction Receipt
  const [transactionId, setTransactionId] = useState('')
  const [paidAmount, setPaidAmount] = useState(course.price)

  // Hanzo ID State
  const [accountMode, setAccountMode] = useState<'create' | 'link'>('create')
  const [handle, setHandle] = useState('alex')
  const [legalName, setLegalName] = useState('Alex Rivers')
  const [studentEmail, setStudentEmail] = useState('alex@hanzo.ai')
  const [authMethod, setAuthMethod] = useState<'passkey' | 'password'>('passkey')
  const [password, setPassword] = useState('••••••••••••')
  const [agreeHonorCode, setAgreeHonorCode] = useState(true)

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

  // Phase 1: Complete Payment Handler (Pay for the class first)
  const handleCompletePayment = () => {
    setIsProcessingPayment(true)
    const randomTxn = `HZ-TXN-${new Date().getFullYear()}-${course.code.replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
    setTransactionId(randomTxn)
    setPaidAmount(finalPrice)

    setTimeout(() => {
      setIsProcessingPayment(false)
      // Advance to Phase 2: Hanzo ID account creation
      setStep('hanzo_id')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 900)
  }

  // Phase 2: Create / Link Hanzo ID and Provision Sandbox
  const handleStartProvisioning = () => {
    setStep('provisioning')
    setProvisionProgress(15)
    setProvisionLogs([
      `> [INIT] Hanzo Settlement verified: Txn #${transactionId} cleared ($${paidAmount} USD).`,
      `> [AUTH] Protocol dispatching seat license for course: ${course.code} (${course.credential})...`,
    ])

    setTimeout(() => {
      setProvisionProgress(40)
      setProvisionLogs((prev) => [
        ...prev,
        `> [HANZO ID] Generating student DID: did:hanzo:student:${handle}.hanzo.id`,
        `> [IDENTITY] Binding W3C-compliant academic claim for "${legalName}"...`,
      ])
    }, 600)

    setTimeout(() => {
      setProvisionProgress(70)
      setProvisionLogs((prev) => [
        ...prev,
        `> [COMPUTE] Depositing 25% compute fellowship ($${rebateCredits}.00 USD) into Hanzo Cloud wallet.`,
        `> [SANDBOX] Allocating isolated gVisor MicroVM container lease: pod-gvs-uswest2-${handle}...`,
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
      const targetUrl = `/portal?enrolled=${encodeURIComponent(course.slug)}&student=${encodeURIComponent(handle)}&welcome=1`
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
        $platform-web={{ zIndex: 50 }}
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
              TUITION CHECKOUT
            </Text>
          </XStack>

          {/* Stepper Pill */}
          <XStack items="center" gap="$2">
            <XStack
              items="center"
              gap="$2"
              px="$3"
              py="$1"
              rounded="var(--radius-md)"
              bg={step === 'payment' ? 'var(--white)' : 'var(--card)'}
              borderWidth={1}
              borderColor="var(--border)"
            >
              <Text
                fontSize="$1"
                fontWeight="700"
                fontFamily="$mono"
                color={step === 'payment' ? 'var(--pure-black)' : 'var(--muted-foreground)'}
              >
                1. TUITION PAYMENT
              </Text>
              {step !== 'payment' && <Check size={12} color="var(--emerald-400)" />}
            </XStack>

            <ChevronRight size={14} color="var(--muted-foreground)" />

            <XStack
              items="center"
              gap="$2"
              px="$3"
              py="$1"
              rounded="var(--radius-md)"
              bg={step === 'hanzo_id' || step === 'provisioning' ? 'var(--white)' : 'var(--card)'}
              borderWidth={1}
              borderColor="var(--border)"
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
                2. HANZO ID ACCOUNT
              </Text>
              {step === 'complete' && <Check size={12} color="var(--emerald-400)" />}
            </XStack>

            <ChevronRight size={14} color="var(--muted-foreground)" />

            <XStack
              items="center"
              gap="$2"
              px="$3"
              py="$1"
              rounded="var(--radius-md)"
              bg={step === 'complete' ? 'var(--emerald-400)' : 'var(--card)'}
              borderWidth={1}
              borderColor="var(--border)"
            >
              <Text
                fontSize="$1"
                fontWeight="700"
                fontFamily="$mono"
                color={step === 'complete' ? 'var(--pure-black)' : 'var(--muted-foreground)'}
              >
                3. STUDENT PORTAL
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
          <Grid columns={{ min: 360, max: 2 }} gap={32} items="flex-start">
            {/* Left Column: Order Breakdown, Perks, and Coupon */}

            <YStack gap="$5">
              <Card p={28} borderWidth={1} borderColor="var(--border)">
                <YStack gap="$4">
                  <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2">
                    <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                      ENROLLMENT SEAT LEASE
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
                      {course.credential}: {course.credentialFull} ({course.units}.0 Accredited Units)
                    </Text>
                  </YStack>

                  <Box height={1} bg="var(--border)" />

                  {/* Included Benefits */}
                  <YStack gap="$3">
                    <Text fontSize="$1" fontWeight="700" color="var(--white-70)" fontFamily="$mono">
                      EVERY ENROLLMENT INCLUDES:
                    </Text>

                    <XStack items="flex-start" gap="$3">
                      <Box p="$1" rounded="var(--radius-sm)" bg="var(--pure-black)" borderWidth={1} borderColor="var(--border)">
                        <Coins size={15} color="var(--emerald-400)" />
                      </Box>
                      <YStack gap={2}>
                        <Text fontSize="$2" fontWeight="600" color="var(--white)">
                          ${rebateCredits}.00 USD Compute Grant Deposit (25% Rebate)
                        </Text>
                        <Text fontSize="$1" color="var(--muted-foreground)">
                          Credited to your Hanzo Cloud wallet on Day 1 for model training & API calls.
                        </Text>
                      </YStack>
                    </XStack>

                    <XStack items="flex-start" gap="$3">
                      <Box p="$1" rounded="var(--radius-sm)" bg="var(--pure-black)" borderWidth={1} borderColor="var(--border)">
                        <Cpu size={15} color="var(--white)" />
                      </Box>
                      <YStack gap={2}>
                        <Text fontSize="$2" fontWeight="600" color="var(--white)">
                          Dedicated gVisor MicroVM Sandbox
                        </Text>
                        <Text fontSize="$1" color="var(--muted-foreground)">
                          Isolated execution runtime with pre-configured SWE-bench and Zen 6 ZAP RPC.
                        </Text>
                      </YStack>
                    </XStack>

                    <XStack items="flex-start" gap="$3">
                      <Box p="$1" rounded="var(--radius-sm)" bg="var(--pure-black)" borderWidth={1} borderColor="var(--border)">
                        <GraduationCap size={15} color="var(--white)" />
                      </Box>
                      <YStack gap={2}>
                        <Text fontSize="$2" fontWeight="600" color="var(--white)">
                          W3C Verifiable Credential on Lux Chain
                        </Text>
                        <Text fontSize="$1" color="var(--muted-foreground)">
                          Tamper-proof cryptographic degree badge instantly verifiable by tech employers.
                        </Text>
                      </YStack>
                    </XStack>
                  </YStack>

                  <Box height={1} bg="var(--border)" />

                  {/* Coupon Code Input Section */}
                  <YStack gap="$3">
                    <XStack items="center" justify="space-between">
                      <XStack items="center" gap="$2">
                        <Tag size={14} color="var(--emerald-400)" />
                        <Text fontSize="$2" fontWeight="600" color="var(--white)">
                          Tuition Coupon or Fellowship Grant
                        </Text>
                      </XStack>
                      {appliedCoupon?.valid && (
                        <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                          COUPON APPLIED
                        </Chip>
                      )}
                    </XStack>

                    {!appliedCoupon?.valid ? (
                      <XStack gap="$2" width="100%">
                        <input
                          type="text"
                          style={{
                            ...inputStyle,
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
                        borderColor="var(--emerald-800)"
                      >
                        <XStack items="center" gap="$2">
                          <CheckCircle2 size={16} color="var(--emerald-400)" />
                          <YStack>
                            <Text fontSize="$2" fontWeight="600" color="var(--emerald-300)" fontFamily="$mono">
                              {appliedCoupon.code} ({appliedCoupon.message})
                            </Text>
                            <Text fontSize="$1" color="var(--muted-foreground)">
                              Discount: -${appliedCoupon.discountAmount}.00 USD
                            </Text>
                          </YStack>
                        </XStack>
                        <Action
                          render="button"
                          onClick={handleRemoveCoupon}
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
                          px="$2"
                          py="$1"
                          rounded="var(--radius-sm)"
                          bg="var(--card)"
                          borderWidth={1}
                          borderColor="var(--border)"
                          $platform-web={{ cursor: 'pointer', border: 'none' }}
                        >
                          <Text fontSize="$1" fontFamily="$mono" color="var(--white-70)">
                            STUDENT50 (50% Off)
                          </Text>
                        </Box>
                        <Box
                          render="button"
                          onClick={() => handleApplyCoupon('DEVCOMMUNITY')}
                          px="$2"
                          py="$1"
                          rounded="var(--radius-sm)"
                          bg="var(--card)"
                          borderWidth={1}
                          borderColor="var(--border)"
                          $platform-web={{ cursor: 'pointer', border: 'none' }}
                        >
                          <Text fontSize="$1" fontFamily="$mono" color="var(--white-70)">
                            DEVCOMMUNITY (30% Off)
                          </Text>
                        </Box>
                      </XStack>
                    )}
                  </YStack>

                  <Box height={1} bg="var(--border)" />

                  {/* Itemized Price Breakdown */}
                  <YStack gap="$2">
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
                        <Text fontSize="$2" color="var(--emerald-400)">
                          Coupon Discount ({appliedCoupon?.code})
                        </Text>
                        <Text fontSize="$2" color="var(--emerald-400)" fontFamily="$mono">
                          -${discountAmount}.00 USD
                        </Text>
                      </XStack>
                    )}

                    <XStack justify="space-between" items="center">
                      <Text fontSize="$2" color="var(--muted-foreground)">
                        On-Chain Degree Issuance & CI Verification
                      </Text>
                      <Text fontSize="$2" color="var(--emerald-400)" fontFamily="$mono">
                        $0.00 (Waived)
                      </Text>
                    </XStack>

                    <Box height={1} bg="var(--border)" my="$1" />

                    <XStack justify="space-between" items="baseline">
                      <YStack>
                        <Text fontSize="$3" fontWeight="700" color="var(--white)">
                          Total Due Today
                        </Text>
                        <Text fontSize="$1" color="var(--muted-foreground)">
                          One-time tuition fee. Never a recurring SaaS subscription.
                        </Text>
                      </YStack>
                      <Text fontSize="$6" fontWeight="700" color="var(--white)" fontFamily="$mono">
                        ${finalPrice}.00 USD
                      </Text>
                    </XStack>
                  </YStack>
                </YStack>
              </Card>
            </YStack>

            {/* Right Column: Payment Form */}
            <YStack gap="$5">
              <Card p={28} borderWidth={1} borderColor="var(--border)">
                <YStack gap="$5">
                  <YStack gap="$1">
                    <Text fontSize="$4" fontWeight="700" color="var(--white)">
                      Payment Method
                    </Text>
                    <Text fontSize="$2" color="var(--muted-foreground)">
                      Secure one-time payment settled via Hanzo Treasury Layer.
                    </Text>
                  </YStack>

                  {/* Method Tabs */}
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
                      onClick={() => setPaymentMethod('apple_pay')}
                      py="$2"
                      px="$3"
                      rounded="var(--radius-md)"
                      bg={paymentMethod === 'apple_pay' ? 'var(--white)' : 'var(--pure-black)'}
                      borderWidth={1}
                      borderColor={paymentMethod === 'apple_pay' ? 'var(--white)' : 'var(--border)'}
                      $platform-web={{ cursor: 'pointer', outline: 'none' }}
                    >
                      <XStack items="center" justify="center" gap="$2">
                        <Wallet
                          size={15}
                          color={paymentMethod === 'apple_pay' ? 'var(--pure-black)' : 'var(--white)'}
                        />
                        <Text
                          fontSize="$1"
                          fontWeight="700"
                          fontFamily="$mono"
                          color={paymentMethod === 'apple_pay' ? 'var(--pure-black)' : 'var(--white)'}
                        >
                          APPLE / GOOGLE PAY
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

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <YStack gap="$3">
                      <YStack gap="$1">
                        <Text fontSize="$1" color="var(--muted-foreground)">
                          Name on Card
                        </Text>
                        <input
                          type="text"
                          style={inputStyle}
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </YStack>

                      <YStack gap="$1">
                        <Text fontSize="$1" color="var(--muted-foreground)">
                          Card Number
                        </Text>
                        <input
                          type="text"
                          style={{ ...inputStyle, fontFamily: 'monospace' }}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </YStack>

                      <Grid columns={2} gap={12}>
                        <YStack gap="$1">
                          <Text fontSize="$1" color="var(--muted-foreground)">
                            Expires (MM/YY)
                          </Text>
                          <input
                            type="text"
                            style={{ ...inputStyle, fontFamily: 'monospace' }}
                            value={cardExp}
                            onChange={(e) => setCardExp(e.target.value)}
                          />
                        </YStack>

                        <YStack gap="$1">
                          <Text fontSize="$1" color="var(--muted-foreground)">
                            Security Code (CVC)
                          </Text>
                          <input
                            type="text"
                            style={{ ...inputStyle, fontFamily: 'monospace' }}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                          />
                        </YStack>
                      </Grid>

                      <Grid columns={2} gap={12}>
                        <YStack gap="$1">
                          <Text fontSize="$1" color="var(--muted-foreground)">
                            Country
                          </Text>
                          <input
                            type="text"
                            style={inputStyle}
                            value={cardCountry}
                            onChange={(e) => setCardCountry(e.target.value)}
                          />
                        </YStack>

                        <YStack gap="$1">
                          <Text fontSize="$1" color="var(--muted-foreground)">
                            Postal Code
                          </Text>
                          <input
                            type="text"
                            style={inputStyle}
                            value={cardPostal}
                            onChange={(e) => setCardPostal(e.target.value)}
                          />
                        </YStack>
                      </Grid>
                    </YStack>
                  )}

                  {/* Apple / Google Pay Form */}
                  {paymentMethod === 'apple_pay' && (
                    <YStack
                      gap="$4"
                      p="$6"
                      rounded="var(--radius-md)"
                      bg="var(--pure-black)"
                      borderWidth={1}
                      borderColor="var(--border)"
                      items="center"
                    >
                      <Wallet size={36} color="var(--white)" />
                      <YStack items="center" gap="$1">
                        <Text fontSize="$3" fontWeight="600" color="var(--white)">
                          Instant Digital Wallet Checkout
                        </Text>
                        <Text fontSize="$1" color="var(--muted-foreground)" $platform-web={{ textAlign: 'center' }}>
                          Pay ${finalPrice}.00 USD with Touch ID / Face ID using your Apple Pay or Google Wallet.
                        </Text>


                      </YStack>
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

                  {/* Guarantees Box */}
                  <Box
                    p="$3"
                    rounded="var(--radius-md)"
                    bg="var(--pure-black)"
                    borderWidth={1}
                    borderColor="var(--border)"
                  >
                    <XStack items="center" gap="$3">
                      <ShieldCheck size={18} color="var(--emerald-400)" />
                      <Text fontSize="$1" color="var(--muted-foreground)">
                        256-bit TLS encrypted. Backed by 14-day full money-back academic guarantee.
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
                    }}
                  >
                    {isProcessingPayment ? (
                      <XStack items="center" gap="$2">
                        <RefreshCw size={16} className="animate-spin" />
                        <Text fontSize="$2" fontWeight="600" color="inherit">
                          Processing Settlement...
                        </Text>
                      </XStack>
                    ) : (
                      <XStack items="center" gap="$2">
                        <Text fontSize="$2" fontWeight="600" color="inherit">
                          Pay ${finalPrice}.00 USD & Proceed to Hanzo ID →
                        </Text>
                      </XStack>
                    )}
                  </Action>

                  <Text fontSize="$1" color="var(--muted-foreground)" $platform-web={{ textAlign: 'center' }}>
                    Step 1 of 2: Tuition payment is completed first, followed immediately by Hanzo ID creation.
                  </Text>


                </YStack>
              </Card>
            </YStack>
          </Grid>
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
              borderColor="var(--emerald-850)"
            >
              <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3">
                <XStack items="center" gap="$3">
                  <Box p="$2" rounded="var(--radius-md)" bg="var(--emerald-950)">
                    <CheckCircle2 size={24} color="var(--emerald-400)" />
                  </Box>
                  <YStack>
                    <Text fontSize="$3" fontWeight="700" color="var(--white)">
                      Tuition Cleared: ${paidAmount}.00 USD
                    </Text>
                    <Text fontSize="$1" color="var(--emerald-400)" fontFamily="$mono">
                      Receipt ID: {transactionId}
                    </Text>
                  </YStack>
                </XStack>

                <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                  SEAT RESERVED · STEP 2 OF 2
                </Chip>
              </XStack>
            </Box>

            {/* Account Creation Card */}
            <Card p={32} borderWidth={1} borderColor="var(--border)">
              <YStack gap="$5">
                <YStack gap="$2">
                  <Text fontSize="$5" fontWeight="700" color="var(--white)">
                    Create or Link your Hanzo ID
                  </Text>
                  <Text fontSize="$2" color="var(--muted-foreground)">
                    Your class payment is locked in. Now configure your decentralized Hanzo ID to claim your
                    Student DID (`did:hanzo:student:...`), unlock your ${rebateCredits}.00 USD compute grant, and initialize your gVisor sandbox.
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

                {/* Form: Create New Hanzo ID */}
                {accountMode === 'create' && (
                  <YStack gap="$4">
                    <Grid columns={{ min: 260, max: 2 }} gap={16}>
                      <YStack gap="$1">
                        <Text fontSize="$1" color="var(--muted-foreground)">
                          Full Legal Name (For W3C Credential)
                        </Text>
                        <input
                          type="text"
                          style={inputStyle}
                          value={legalName}
                          onChange={(e) => setLegalName(e.target.value)}
                        />
                      </YStack>

                      <YStack gap="$1">
                        <Text fontSize="$1" color="var(--muted-foreground)">
                          Student Email Address
                        </Text>
                        <input
                          type="email"
                          style={inputStyle}
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                        />
                      </YStack>
                    </Grid>

                    <YStack gap="$1">
                      <XStack justify="space-between" items="center">
                        <Text fontSize="$1" color="var(--muted-foreground)">
                          Hanzo ID Handle
                        </Text>
                        <Text fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                          did:hanzo:student:{handle || 'you'}
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
                          type="text"
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
                          borderColor={authMethod === 'passkey' ? 'var(--emerald-400)' : 'var(--border)'}
                          $platform-web={{ cursor: 'pointer', outline: 'none' }}
                        >
                          <XStack items="center" gap="$2">
                            <Sparkles
                              size={14}
                              color={authMethod === 'passkey' ? 'var(--emerald-400)' : 'var(--muted-foreground)'}
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
                          borderColor={authMethod === 'password' ? 'var(--emerald-400)' : 'var(--border)'}
                          $platform-web={{ cursor: 'pointer', outline: 'none' }}
                        >
                          <XStack items="center" gap="$2">
                            <Lock
                              size={14}
                              color={authMethod === 'password' ? 'var(--emerald-400)' : 'var(--muted-foreground)'}
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

                    {/* Honor Code */}
                    <XStack items="center" gap="$2" pt="$2">
                      <input
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
                        type="text"
                        style={inputStyle}
                        placeholder="alex@hanzo.ai or @alex"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                      />
                    </YStack>

                    <YStack gap="$1">
                      <Text fontSize="$1" color="var(--muted-foreground)">
                        Password or Passkey
                      </Text>
                      <input
                        type="password"
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
                          setHandle('github-alex')
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
                          setHandle('google-alex')
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
            </Card>
          </YStack>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: PROVISIONING / COMPLETION (Terminal initialization & forward)       */}
        {/* ========================================================================= */}
        {(step === 'provisioning' || step === 'complete') && (
          <YStack gap="$5" maxW={820} mx="auto">
            <Card p={32} borderWidth={1} borderColor="var(--border)">
              <YStack gap="$4">
                <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3">
                  <XStack items="center" gap="$2">
                    <Terminal size={18} color="var(--emerald-400)" />
                    <Text fontSize="$3" fontWeight="700" color="var(--white)" fontFamily="$mono">
                      HANZO IDENTITY & SANDBOX PROVISIONER
                    </Text>
                  </XStack>
                  <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                    {provisionProgress}% COMPLETE
                  </Chip>
                </XStack>

                {/* Progress Bar */}
                <Box height={4} width="100%" bg="var(--border)" rounded={999} overflow="hidden">
                  <Box
                    height="100%"
                    width={`${provisionProgress}%`}
                    bg="var(--emerald-400)"
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
                            ? 'var(--emerald-400)'
                            : log.includes('[INIT]')
                            ? 'var(--white)'
                            : 'var(--white-70)'
                        }
                      >
                        {log}
                      </Text>
                    ))}
                    {provisionProgress < 100 && (
                      <XStack items="center" gap="$2" pt="$2">
                        <RefreshCw size={13} color="var(--emerald-400)" className="animate-spin" />
                        <Text fontSize="$1" color="var(--emerald-400)" fontFamily="$mono">
                          Provisioning microVM container lease...
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                </Box>

                {/* Done Callout */}
                {step === 'complete' && (
                  <YStack gap="$3" items="center" pt="$2">
                    <Text fontSize="$2" color="var(--emerald-300)" fontWeight="600">
                      ✅ Enrollment Complete! Forwarding to your student learning portal...
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
