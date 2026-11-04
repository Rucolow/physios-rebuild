// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],

  theme: {
    // ── 置換（既定を消す）────────────────────────────────
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },

    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      white: '#FFFFFF',
      black: '#000000',

      // Navy — 面とテキストのニュートラル軸
      navy: {
        DEFAULT: '#1A2747',
        50:  '#F2F4F9',
        100: '#DEE4F1',
        200: '#BDC7DD',
        300: '#9DA8C3',
        400: '#7E89A6',
        500: '#626D8C',
        600: '#34406B',
        700: '#101A35',
        800: '#0D1530',
        900: '#080E1F',
      },

      // Gold — 一次アクション・現在地・ブランド
      gold: {
        DEFAULT: '#F2C14E',
        200: '#F9E3A3',
        300: '#F7D679',
        400: '#F4CC63',
        500: '#F2C14E',
        600: '#D9A93C',
      },

      // 白 α レイヤー（許可される 5 値のみ。これ以外は存在しない）
      layer: {
        3:  'rgb(255 255 255 / 0.03)',
        5:  'rgb(255 255 255 / 0.05)',
        6:  'rgb(255 255 255 / 0.06)',
        10: 'rgb(255 255 255 / 0.10)',
        20: 'rgb(255 255 255 / 0.20)',
      },

      // 暗幕
      scrim: {
        50: 'rgb(0 0 0 / 0.50)',
        70: 'rgb(0 0 0 / 0.70)',
      },

      // 状態色（Tailwind v3 既定値を転記。採用は 4 色相のみ）
      emerald: { 300: '#6EE7B7', 400: '#34D399', 500: '#10B981', 600: '#059669' },
      amber:   { 300: '#FCD34D', 400: '#FBBF24', 500: '#F59E0B', 600: '#D97706' },
      red:     { 300: '#FCA5A5', 400: '#F87171', 500: '#EF4444', 600: '#DC2626' },
      blue:    { 300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB' },
    },

    fontSize: {
      '2xs':    ['0.6875rem', { lineHeight: '1.45' }], // 11px
      sm:       ['0.8125rem', { lineHeight: '1.6'  }], // 13px 本文の既定
      base:     ['0.9375rem', { lineHeight: '1.55' }], // 15px 節見出し・読み物本文
      xl:       ['1.25rem',   { lineHeight: '1.45' }], // 20px 副指標
      '3xl':    ['1.875rem',  { lineHeight: '1.2'  }], // 30px ページ h1
      '4xl':    ['2.75rem',   { lineHeight: '1'    }], // 44px ヒーロー数値専用
      display:  ['3rem',      { lineHeight: '1', letterSpacing: '-0.02em' }], // 48px ブランド専用
    },

    fontWeight: {
      normal: '400',
      medium: '500',
      bold:   '700',
      black:  '900', // ブランド専用
    },

    lineHeight: {
      none:  '1',
      snug:  '1.4',
      loose: '1.9',
    },

    letterSpacing: {
      tight:  '-0.02em', // 欧文・ブランドのみ
      normal: '0em',
      wide:   '0.02em',
      wider:  '0.08em',  // オーバーライン・uppercase
    },

    borderRadius: {
      none:  '0px',
      badge: '8px',
      field: '12px',
      card:  '16px',
      sheet: '24px',
      pill:  '9999px',
    },

    boxShadow: {
      none: 'none',
      e1: '0 1px 2px rgb(0 0 0 / 0.30)',
      e2: '0 4px 12px rgb(0 0 0 / 0.35)',
      e3: '0 12px 32px rgb(0 0 0 / 0.45)',
      e4: '0 24px 64px rgb(0 0 0 / 0.55)',
      glass: 'inset 0 1px 0 rgb(255 255 255 / 0.06)',
      glow: '0 0 20px rgb(242 193 78 / 0.25)',
      'glow-strong': '0 0 32px rgb(242 193 78 / 0.45)',
      'glow-danger': '0 0 24px rgb(248 113 113 / 0.40)',
    },

    // ── 追加 ────────────────────────────────────────────
    extend: {
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'var(--font-noto-sans-jp)',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          '"Hiragino Sans"',
          '"Noto Sans CJK JP"',
          '"Yu Gothic UI"',
          'Meiryo',
          'sans-serif',
        ],
        mono: [
          'var(--font-jetbrains-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },

      spacing: {
        header: '3.5rem',
        'header-lg': '4rem',
        nav: '4rem',
        rail: '5.75rem',        // 92px ナビレール（§4-6）
        section: '3.25rem',     // 52px 節間（§3-1 縦の律動）
        'col-state': '5.25rem', // 84px 状態語の列幅（§4-7）
        pane: '25rem',          // 400px split の一覧ペイン固定幅（§3-12）
        'pane-sm': '19.5rem',   // 312px split のフィルタ用の狭い一覧ペイン（§3-12・J26-1）
      },

      backgroundImage: {
        // 記事カードのサムネ未設定時グラデーション（§4-18）。6 種のみ。
        // 2026-08-30 改訂（J19-12）: 一点物 hex を廃棄し、パレット既存値
        // （navy 各値 + gold α/10）のみで構成する
        'thumb-g1': 'linear-gradient(135deg, #1A2747, #0D1530 60%, #101A35)',
        'thumb-g2': 'linear-gradient(135deg, #34406B, #101A35 55%, #0D1530)',
        'thumb-g3': 'linear-gradient(150deg, #34406B, #1A2747 50%, #080E1F)',
        'thumb-g4': 'linear-gradient(135deg, rgb(242 193 78 / 0.10), transparent 55%), linear-gradient(135deg, #1A2747, #0D1530)',
        'thumb-g5': 'linear-gradient(160deg, #101A35, #0D1530 65%, #1A2747)',
        'thumb-g6': 'linear-gradient(160deg, rgb(242 193 78 / 0.10), transparent 60%), linear-gradient(135deg, #101A35, #080E1F)',
      },

      maxWidth: {
        form:   '26rem',
        read:   '45rem',
        detail: '72rem',
        list:   '80rem',
        shell:  '88rem',
      },

      maxHeight: {
        sheet: '85vh',
      },

      minHeight: {
        pane: 'calc(100vh - var(--header-h))', // 版面の高さ（§3-12・裁定 J175）
      },

      width: {
        modal: 'calc(100% - 2rem)',
        pane: '25rem', // 400px。split の一覧ペイン固定幅（§3-12）
      },

      gridTemplateColumns: {
        w2: 'minmax(0, 1.6fr) minmax(0, 1fr)', // cols w2 = 1.6:1（§3-12・裁定 J24）
      },

      zIndex: {
        nav: '40',
        header: '50',
        overlay: '60',
        modal: '70',
        toast: '80',
      },

      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
      },

      transitionTimingFunction: {
        out: 'cubic-bezier(0.4, 0, 0.2, 1)',
        emphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', translate: '0 8px' },
          to:   { opacity: '1', translate: '0 0' },
        },
        'slide-up': {
          from: { translate: '0 100%' },
          to:   { translate: '0 0' },
        },
        'scale-in': {
          from: { opacity: '0', scale: '0.96' },
          to:   { opacity: '1', scale: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 18px rgb(242 193 78 / 0.30)' },
          '50%':      { boxShadow: '0 0 32px rgb(242 193 78 / 0.55)' },
        },
        'glow-pulse-danger': {
          '0%, 100%': { boxShadow: '0 0 18px rgb(248 113 113 / 0.35)' },
          '50%':      { boxShadow: '0 0 32px rgb(248 113 113 / 0.60)' },
        },
        'bar-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.55' },
        },
        shimmer: {
          from: { translate: '-100% 0' },
          to:   { translate: '100% 0' },
        },
        spin: {
          to: { rotate: '360deg' },
        },
      },

      animation: {
        'fade-in':    'fade-in 250ms cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-in-up': 'fade-in-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up':   'slide-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in':   'scale-in 250ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'glow-pulse': 'glow-pulse 2.2s ease-in-out infinite',
        'glow-pulse-danger': 'glow-pulse-danger 1.4s ease-in-out infinite',
        'bar-pulse':  'bar-pulse 1.8s ease-in-out infinite',
        shimmer:      'shimmer 1.6s linear infinite',
        spin:         'spin 1s linear infinite',
      },
    },
  },

  plugins: [],
}

export default config
