import { ChevronLeft } from "lucide-react";

export function TermsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center gap-3">
          <button onClick={onBack} className="text-blue-700 hover:underline flex items-center gap-1 text-sm font-medium">
            <ChevronLeft size={16} /> 戻る
          </button>
          <span className="text-gray-300">|</span>
          <h1 className="font-serif-jp text-base font-semibold text-gray-900 tracking-tight">利用規約</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10 pb-20">
        <div className="prose prose-sm max-w-none">
          <h1 className="font-serif-jp text-2xl font-bold text-gray-900 mb-2 tracking-tight">AIムービーマッチ 利用規約</h1>
          <p className="text-xs text-gray-500 mb-8">最終更新日: 2026年4月18日</p>

          <section className="mb-8">
            <p className="text-sm text-gray-700 leading-relaxed">
              本利用規約（以下「本規約」といいます）は、株式会社Ahare（以下「当社」といいます）が提供する動画制作マッチングプラットフォーム「AIムービーマッチ」（以下「本サービス」といいます）の利用条件を定めるものです。本サービスを利用するすべてのユーザーは、本規約に同意の上で利用するものとします。
            </p>
          </section>

          <Section title="第1条（定義）">
            <p>本規約において以下の用語は、それぞれ以下の意味で用います。</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>「本サービス」: 当社が運営する動画クリエイターと発注者のマッチングプラットフォーム。</li>
              <li>「ユーザー」: 本サービスに登録したすべての利用者。</li>
              <li>「発注者」: 動画制作を依頼する法人または個人のユーザー。</li>
              <li>「クリエイター」: 動画制作を受注するユーザー。</li>
              <li>「案件」: 発注者が投稿する動画制作の依頼。</li>
              <li>「コンテンツ」: ユーザーが本サービスに投稿・送信するテキスト・画像・動画等の一切の情報。</li>
            </ol>
          </Section>

          <Section title="第2条（本規約への同意）">
            <ol className="list-decimal pl-6 space-y-1">
              <li>ユーザーは本規約に同意した上で本サービスを利用するものとします。</li>
              <li>未成年者が本サービスを利用する場合は、親権者の同意を得たものとみなします。</li>
              <li>当社は本規約を随時変更することがあります。変更後の規約は本サービス上に掲載された時点で効力を生じます。</li>
            </ol>
          </Section>

          <Section title="第3条（アカウント登録）">
            <ol className="list-decimal pl-6 space-y-1">
              <li>本サービスの利用を希望する者は、当社が定める方法によりアカウント登録を行うものとします。</li>
              <li>ユーザーは登録情報を正確かつ最新の状態に保つものとします。</li>
              <li>アカウント情報の管理はユーザー自身の責任で行うものとします。第三者による不正利用の結果生じた損害について、当社は一切責任を負いません。</li>
              <li>以下のいずれかに該当する場合、当社は登録を拒否または取り消すことができます。
                <ul className="list-disc pl-6 mt-1">
                  <li>過去に本規約違反により登録抹消された者からの申請</li>
                  <li>虚偽の情報での申請</li>
                  <li>反社会的勢力と関係を有する者からの申請</li>
                  <li>その他、当社が不適切と判断した場合</li>
                </ul>
              </li>
            </ol>
          </Section>

          <Section title="第4条（サービス内容）">
            <ol className="list-decimal pl-6 space-y-1">
              <li>本サービスは、発注者とクリエイターのマッチング機会を提供するプラットフォームであり、動画制作の契約は発注者とクリエイターの当事者間で直接締結されます。</li>
              <li>本サービスはAI（Anthropic社のClaude API等）を活用して、ヒアリング支援・マッチング精度向上・スキル評価等の機能を提供します。</li>
              <li>当社は本サービスの品質維持のため、予告なく機能の追加・変更・削除を行うことがあります。</li>
            </ol>
          </Section>

          <Section title="第5条（料金および支払い）">
            <ol className="list-decimal pl-6 space-y-1">
              <li>本サービスへの登録および基本利用は無料です。</li>
              <li>クリエイターは成約した制作案件の対価に対し、当社が定める手数料（現在10%）を当社に支払うものとします。</li>
              <li>オプションサービス（プレミアム掲載、プロ選定サービス等）の料金は別途本サービス上に表示します。</li>
              <li>消費税・源泉徴収税等の公租公課は、各関係法令に従って適切に処理されるものとします。</li>
              <li>手数料率は当社の判断で変更することがあります。変更する場合は30日前までに通知します。</li>
            </ol>
          </Section>

          <Section title="第6条（ユーザーの義務）">
            <ol className="list-decimal pl-6 space-y-1">
              <li>ユーザーは本サービス利用にあたり、関係法令、本規約、および良識に従うものとします。</li>
              <li>クリエイターは受注した案件を誠実に遂行し、納期・品質を遵守するものとします。</li>
              <li>発注者は合意した対価を期日までに支払うものとします。</li>
              <li>ユーザーは、本サービスを経由したクリエイターとの直接取引（本サービスを経由しない発注）を3年間行わないものとします（いわゆる「引き抜き防止条項」）。</li>
            </ol>
          </Section>

          <Section title="第7条（禁止事項）">
            <p>ユーザーは以下の行為を行ってはなりません。</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>他のユーザー、第三者、または当社の知的財産権・プライバシー権・名誉その他の権利を侵害する行為</li>
              <li>虚偽の情報を登録・投稿する行為</li>
              <li>本サービスのマッチング機能を経由せずに、相手方ユーザーと直接取引を行う行為</li>
              <li>他のユーザーに無断で連絡先を収集する行為</li>
              <li>本サービスを利用した営業活動、宣伝、勧誘行為（当社が許可した場合を除く）</li>
              <li>本サービスのコンテンツを無断で複製、転載、改変、配布する行為</li>
              <li>本サービスの運営を妨害する行為（スクレイピング、過度な自動アクセス等）</li>
              <li>反社会的勢力に利益を供与する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ol>
          </Section>

          <Section title="第8条（コンテンツの著作権）">
            <ol className="list-decimal pl-6 space-y-1">
              <li>ユーザーが本サービスに投稿したコンテンツの著作権は、当該ユーザーに帰属します。</li>
              <li>ユーザーは当社に対し、本サービスの運営・改善・広告宣伝のために必要な範囲で、当該コンテンツを無償かつ非独占的に使用する権利を許諾するものとします。</li>
              <li>クリエイターが制作した動画作品の著作権帰属は、発注者との契約により別途定めるものとします。</li>
            </ol>
          </Section>

          <Section title="第9条（個人情報の取り扱い）">
            <p>個人情報の取り扱いについては、別途定める「プライバシーポリシー」によるものとします。</p>
          </Section>

          <Section title="第10条（免責事項）">
            <ol className="list-decimal pl-6 space-y-1">
              <li>本サービスはマッチングの場を提供するものであり、発注者とクリエイターの間で成立した契約内容、納品物の品質、対価の支払い等について、当社は一切責任を負いません。</li>
              <li>AIによる提案・スコアリング・評価等は参考情報であり、その正確性・完全性を当社は保証しません。最終判断はユーザー自身が行うものとします。</li>
              <li>本サービスは、当社の判断により予告なく一時停止・終了する場合があります。これによりユーザーに損害が生じても、当社は責任を負いません。</li>
              <li>通信環境の不具合、不正アクセス、データの消失・改ざん等による損害について、当社は責任を負いません。</li>
              <li>当社が責任を負う場合であっても、当社の損害賠償責任は、当該ユーザーが本サービスに支払った直近12か月分の手数料相当額を上限とします（当社に故意または重過失がある場合を除く）。</li>
            </ol>
          </Section>

          <Section title="第11条（利用制限・登録抹消）">
            <p>当社は、ユーザーが以下のいずれかに該当する場合、事前通知なく本サービスの利用を制限、またはアカウントを抹消することができます。</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>本規約に違反した場合</li>
              <li>登録情報に虚偽が判明した場合</li>
              <li>支払い義務を履行しない場合</li>
              <li>長期間本サービスを利用していない場合</li>
              <li>その他、当社が利用を適切でないと判断した場合</li>
            </ol>
          </Section>

          <Section title="第12条（サービスの変更・停止・終了）">
            <p>当社は、事業上・技術上の理由により、ユーザーに事前通知することなく本サービスの内容を変更し、または本サービスの提供を停止・終了することができます。</p>
          </Section>

          <Section title="第13条（通知・連絡）">
            <p>本サービスに関する当社からユーザーへの通知は、本サービス上への掲載、登録メールアドレス宛の送信、またはその他当社が適切と判断する方法により行います。</p>
          </Section>

          <Section title="第14条（準拠法・管轄）">
            <ol className="list-decimal pl-6 space-y-1">
              <li>本規約の解釈には日本法を適用します。</li>
              <li>本サービスに関して紛争が生じた場合、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
            </ol>
          </Section>

          <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>株式会社Ahare</p>
            <p>お問い合わせ: kokinakagoshi.info@gmail.com</p>
          </div>
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
