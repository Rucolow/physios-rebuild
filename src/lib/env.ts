function need(name: string, ...older: string[]): string {
  for (const n of [name, ...older]) {
    const v = process.env[n]
    if (v) return v
  }
  throw new Error(`環境変数 ${name} がありません`)
}

// Supabase の画面の名前（Publishable key / Secret keys）に合わせる。古い名前（ANON / SERVICE_ROLE）でも読む
export const env = {
  supabaseUrl: () => need('SUPABASE_URL'),
  supabaseAnonKey: () => need('SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: () => need('SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY'),
  deepgramKey: () => need('DEEPGRAM_API_KEY'),
  anthropicKey: () => need('ANTHROPIC_API_KEY'),
  /** 音声メモの解釈とブリーフィングの文（設計書 6.2 の割り当て: Sonnet） */
  llmModel: () => process.env.PHYSIOS_LLM_MODEL || 'claude-sonnet-5-5',
}
