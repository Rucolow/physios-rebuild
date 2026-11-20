import { requireTrainer } from '@/lib/auth'
import { TrainerNav } from '@/components/trainer/TrainerNav'
import { TrainerHeader } from '@/components/trainer/TrainerHeader'
import { RecorderProvider } from '@/components/trainer/RecorderProvider'

export const dynamic = 'force-dynamic'

/** アバターの字。日本語の名前は姓の一文字、ラテン文字は頭文字二つ */
function initialsOf(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (/[぀-ヿ㐀-䶿一-鿿가-힯]/.test(name)) return parts[0].charAt(0)
  return parts.map((p) => p.charAt(0)).join('').slice(0, 2).toUpperCase()
}

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
  const trainer = await requireTrainer()
  return (
    <RecorderProvider>
      <div className="min-h-screen shell-bg text-navy-100">
        <TrainerHeader trainerName={trainer.name} initials={initialsOf(trainer.name)} />
        <div className="pb-nav">{children}</div>
        <TrainerNav />
      </div>
    </RecorderProvider>
  )
}
