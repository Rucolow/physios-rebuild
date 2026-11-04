import { requireTrainer } from '@/lib/auth'
import { TrainerNav } from '@/components/trainer/TrainerNav'
import { Recorder } from '@/components/trainer/Recorder'

export const dynamic = 'force-dynamic'

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
  await requireTrainer()
  return (
    <div className="min-h-screen shell-bg text-navy-100">
      <div className="pb-nav">{children}</div>
      <Recorder />
      <TrainerNav />
    </div>
  )
}
