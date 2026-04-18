import { ChevronLeft } from "lucide-react";

export function PrivacyPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center gap-3">
          <button onClick={onBack} className="text-blue-700 hover:underline flex items-center gap-1 text-sm font-medium">
            <ChevronLeft size={16} /> 戻る
          </button>
          <span className="text-gray-300">|</span>
          <h1 className="font-serif-jp text-base font-semibold text-gray-900 tracking-tight">プライバシーポリシー</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10 pb-20">
        <div className="prose prose-sm max-w-none">
          <h1 className="font-serif-jp text-2xl font-bold text-gray-900 mb-2 tracking-tight">AIムービーマッチ プライバシーポリシー</h1>
          <p className="text-xs text-gray-500 mb-8">最終更新日: 2026年4月18日</p>

          <section className="mb-8">
            <p className="text-sm text-gray-700 leading-relaxed">
              株式会社Ahare（以下「当社」といいます）は、AIムービーマッチ（以下「本サービス」といいます）の運営にあたり、ユーザーの個人情報を適切に取り扱うため、以下のプライバシーポリシー（以下「本ポリシー」といいます）を定めます。本ポリシーは、個人情報の保護に関する法律（個人情報保護法）その他関連法令を遵守するものです。
            </p>
          </section>

          <Section title="1. 事業者情報">
            <ul className="list-disc pl-6 space-y-1">
              <li>事業者名: 株式会社Ahare</li>
              <li>事業内容: 動画制作マッチングプラットフォームの運営</li>
              <li>個人情報保護管理者: 代表取締役</li>
              <li>連絡先: kokinakagoshi.info@gmail.com</li>
            </ul>
          </Section>

          <Section title="2. 取得する個人情報">
            <p>当社は、以下の情報をユーザーから取得します。</p>
            <h3 className="font-semibold text-gray-800 mt-3 mb-1">(1) ユーザーが直接提供する情報</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>氏名、会社名、ハンドルネーム</li>
              <li>メールアドレス、電話番号（任意）</li>
              <li>業種、専門分野、使用ツール、ポートフォリオ</li>
              <li>案件情報（会社概要、制作要件、予算、納期等）</li>
              <li>プロフィール画像、動画作品</li>
              <li>決済情報（Stripe等の決済事業者を通じて処理）</li>
            </ul>
            <h3 className="font-semibold text-gray-800 mt-3 mb-1">(2) 自動的に取得する情報</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>IPアドレス、ブラウザ種別、OS情報、リファラ</li>
              <li>アクセス日時、閲覧ページ、操作履歴</li>
              <li>Cookie、類似技術による識別情報</li>
              <li>サービス内でのマッチング履歴、メッセージ、評価</li>
            </ul>
          </Section>

          <Section title="3. 個人情報の利用目的">
            <p>取得した個人情報は以下の目的で利用します。</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>本サービスの提供・運営（ユーザー認証、マッチング、メッセージ送受信等）</li>
              <li>AIによる案件分析、クリエイター選定支援、スキル評価の提供</li>
              <li>料金の請求・決済処理</li>
              <li>本人確認、不正利用の防止</li>
              <li>ユーザーからのお問い合わせ対応</li>
              <li>本サービスの改善、新機能開発</li>
              <li>利用状況の分析、統計データの作成</li>
              <li>重要なお知らせ・利用規約変更等の通知</li>
              <li>本サービスに関するマーケティング（事前同意をいただいた場合）</li>
              <li>法令に基づく対応</li>
            </ol>
          </Section>

          <Section title="4. 第三者提供">
            <p>当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>ユーザーの同意がある場合</li>
              <li>マッチング成立に伴い、発注者とクリエイター間で必要な情報を共有する場合</li>
              <li>法令に基づき開示が必要な場合</li>
              <li>人の生命、身体または財産の保護のために必要な場合</li>
              <li>事業の承継に伴い提供される場合（承継先にも本ポリシーと同等以上の保護を義務付けます）</li>
            </ol>
          </Section>

          <Section title="5. 外部サービスへの委託">
            <p>当社は、本サービスの運営のため、以下の外部サービスを利用しており、これらのサービスのプライバシーポリシーが適用されます。</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3 space-y-2 text-sm">
              <ServiceRow
                name="Supabase Inc."
                purpose="データベース、認証、ストレージ、Edge Functions"
                region="シンガポール（データ保管）"
                link="https://supabase.com/privacy"
              />
              <ServiceRow
                name="Vercel Inc."
                purpose="Webアプリケーションのホスティング、CDN"
                region="米国"
                link="https://vercel.com/legal/privacy-policy"
              />
              <ServiceRow
                name="Anthropic, PBC"
                purpose="Claude API（AI解析、マッチング、スキル評価）"
                region="米国"
                link="https://www.anthropic.com/legal/privacy"
              />
              <ServiceRow
                name="GitHub, Inc."
                purpose="ソースコード管理、自動デプロイ"
                region="米国"
                link="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement"
              />
            </div>
            <p className="mt-3">AIによる処理に関して、当社は入力データをAIモデルの学習に使用させない設定で各サービスを利用しています。</p>
          </Section>

          <Section title="6. Cookie・類似技術">
            <p>本サービスは、利便性の向上、セッション管理、アクセス解析のためにCookieおよび類似技術を使用します。ユーザーはブラウザの設定によりCookieの受け入れを拒否することができますが、この場合、本サービスの一部機能が利用できなくなる可能性があります。</p>
          </Section>

          <Section title="7. 個人情報の保管期間">
            <ol className="list-decimal pl-6 space-y-1">
              <li>本サービスの提供に必要な期間、個人情報を保管します。</li>
              <li>アカウント削除後、原則として90日以内にデータを削除します。ただし、法令上の保管義務がある情報（取引記録等）はその期間保管します。</li>
              <li>統計処理された匿名化データは、保管期間の制限なく利用する場合があります。</li>
            </ol>
          </Section>

          <Section title="8. 安全管理措置">
            <p>当社は、個人情報の漏洩、滅失、毀損を防ぐため、以下の措置を講じています。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>通信の暗号化（HTTPS / TLS 1.3）</li>
              <li>パスワードのハッシュ化保存</li>
              <li>データベース行レベルセキュリティ（RLS）によるアクセス制御</li>
              <li>APIキー等の機密情報のサーバーサイド管理</li>
              <li>最小権限の原則に基づくアクセス管理</li>
              <li>定期的なセキュリティレビュー</li>
            </ul>
          </Section>

          <Section title="9. ユーザーの権利">
            <p>ユーザーは、自己の個人情報について以下を請求する権利を有します。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>開示請求</li>
              <li>訂正・追加・削除の請求</li>
              <li>利用停止・消去の請求</li>
              <li>第三者提供の停止請求</li>
            </ul>
            <p className="mt-2">ご請求は、上記「事業者情報」記載の連絡先までお願いします。本人確認の上、合理的な期間内に対応します。</p>
          </Section>

          <Section title="10. 未成年者の個人情報">
            <p>18歳未満のユーザーが本サービスを利用する場合は、親権者等の同意を得た上で利用するものとします。当社が未成年者であることを確認した場合、親権者の同意確認を行うことがあります。</p>
          </Section>

          <Section title="11. 越境データ移転について">
            <p>本サービスでは、前述の外部サービス（Supabase、Vercel、Anthropic、GitHub）を利用する関係で、ユーザーの個人情報がシンガポール、米国等の海外に移転される場合があります。これら移転先の個人情報保護制度については各サービスのプライバシーポリシーをご確認ください。</p>
          </Section>

          <Section title="12. 本ポリシーの変更">
            <p>本ポリシーは、法令の改正やサービス内容の変更等により、予告なく変更することがあります。重要な変更がある場合は、本サービス上で通知します。</p>
          </Section>

          <Section title="13. お問い合わせ">
            <p>本ポリシーに関するご質問、個人情報の取り扱いに関するご相談は、以下までご連絡ください。</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3 text-sm">
              <p>株式会社Ahare 個人情報保護管理者</p>
              <p>E-mail: kokinakagoshi.info@gmail.com</p>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-serif-jp text-base font-bold text-gray-900 mb-3 tracking-tight border-l-4 border-blue-700 pl-3">{title}</h2>
      <div className="text-sm text-gray-700 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

function ServiceRow({ name, purpose, region, link }: { name: string; purpose: string; region: string; link: string }) {
  return (
    <div className="pb-2 border-b border-gray-200 last:border-b-0 last:pb-0">
      <p className="font-semibold text-gray-800">{name}</p>
      <p className="text-xs text-gray-600 mt-0.5">用途: {purpose}</p>
      <p className="text-xs text-gray-600">データ保管地域: {region}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 hover:underline">
        プライバシーポリシー →
      </a>
    </div>
  );
}
