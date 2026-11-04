function need(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`環境変数 ${name} がありません`)
  return v
}

export const env = {
  supabaseUrl: () => need('SUPABASE_URL'),
  supabaseAnonKey: () => need('SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: () => need('SUPABASE_SERVICE_ROLE_KEY'),
  deepgramKey: () => need('DEEPGRAM_API_KEY'),
  anthropicKey: () => need('ANTHROPIC_API_KEY'),
  /** 音声メモの解釈とブリーフィングの文（設計書 6.2 の割り当て: Sonnet） */
  llmModel: () => process.env.PHYSIOS_LLM_MODEL || 'claude-sonnet-5-5',
}
