import { BrandSide } from '@/components/brand-side'
import { LoginForm } from '@/components/login-form'
export default function HomePage() { return <main className="grid min-h-svh lg:grid-cols-[1fr_1fr]"><BrandSide /><section className="bg-background"><LoginForm /></section></main> }
