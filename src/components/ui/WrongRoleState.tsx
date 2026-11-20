import Link from 'next/link'
import { UserRound } from 'lucide-react'
import { button } from './Button'
import { EmptyState } from './Feedback'

export type ScreenRole = 'trainer' | 'player' | 'coach'

/**
 * この空状態が必要とする**文の形**（裁定 J85）。
 *
 * **プリミティブは形を持ち、語を持たない。** 語は呼び出し側が辞書 `shared.*` から渡す
 * （`src/lib/i18n/messages/*`）。3アプリ共通のこのファイルに日本語を置くと、
 * 独語の指導者が別ロールの URL を開いたときそこだけ日本語になる——
 * §4-12 が防ごうとした「何が起きたかを言わない画面」が別の形で再現する。
 */
export interface WrongRoleMessages {
  /** 役割語（読者の言語での「トレーナー／選手／指導者」） */
  role: Record<ScreenRole, string>
  screenFor: (screenRole: string) => string
  yourScreenIs: (role: string) => string
  goHome: string
  signOut: string
  noAccount: string
  askInvite: string
}

/**
 * ロール不一致の空状態（DESIGN_SYSTEM §4-12・裁定 J53）。3 レイアウト共通の**唯一の文の出所**。
 *
 * **リダイレクトしない。** 黙って飛ばすと、URL を打った人に何が起きたかを言わない上、
 * ロール null（招待前・別テナント）には行き先が無い。「どこにいて、どこへ行けるか」を言い切る。
 * 判定（`getSignedInRole()`）はレイアウトが 1 箇所で行い、ここは描くだけ。
 *
 * - 別ロール: 「この画面は〈画面のロール〉用です」＋「自分の画面へ」（`HOME_PATH[role]`）＋「サインアウト」
 * - ロール null: 「アカウントがまだ登録されていません」＋「サインアウト」
 */
export function WrongRoleState({ screen, role, homePath, messages }: {
  /** この画面が想定するロール */
  screen: ScreenRole
  /** サインイン中のユーザーのロール。null = どのロール行にも当たらない */
  role: ScreenRole | null
  /** `role` の着地先（`HOME_PATH[role]`）。role null では null */
  homePath: string | null
  /** 読者の言語の語（`messagesFor(locale).shared.wrongRole` ＋ `.shared.role`） */
  messages: WrongRoleMessages
}) {
  const icon = <UserRound width={24} height={24} strokeWidth={1.75} aria-hidden="true" />
  // /auth/signout は POST のみ受ける。リンクにすると押しても何も起きない
  const signOut = <form action="/auth/signout" method="post">
    <button type="submit" className={button({ variant: 'ghost' })}>{messages.signOut}</button>
  </form>

  if (role === null) {
    return <EmptyState
      icon={icon}
      title={messages.noAccount}
      description={messages.askInvite}
      action={signOut}
    />
  }
  return <EmptyState
    icon={icon}
    title={messages.screenFor(messages.role[screen])}
    description={messages.yourScreenIs(messages.role[role])}
    action={<div className="flex flex-wrap items-center justify-center gap-2">
      {homePath && <Link href={homePath} className={button({ variant: 'secondary' })}>{messages.goHome}</Link>}
      {signOut}
    </div>}
  />
}
