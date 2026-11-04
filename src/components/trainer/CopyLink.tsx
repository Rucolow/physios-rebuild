'use client'
import { useState } from 'react'
import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={url} target="_blank" rel="noreferrer" className="text-2xs font-bold text-gold-400 hover:text-gold-300">選手の画面を開く</a>
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          await navigator.clipboard.writeText(url)
          setCopied(true)
        }}
      >
        <Copy size={14} aria-hidden="true" />
        {copied ? 'コピーしました' : 'リンクをコピー'}
      </Button>
    </div>
  )
}
