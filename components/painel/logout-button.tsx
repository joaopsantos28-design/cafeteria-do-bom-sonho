'use client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
export function LogoutButton() { const router = useRouter(); return <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => router.push('/')}><LogOut data-icon="inline-start" /> Sair do painel</Button> }
