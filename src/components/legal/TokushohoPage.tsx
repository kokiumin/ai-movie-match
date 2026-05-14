import { LegalLayout, Section } from "./LegalLayout";

export function TokushohoPage({ onBack }: { onBack: () => void }) {
  return (
    <LegalLayout
      title="特定商取引法に基づく表記"
      subtitle="最終更新日: 2026年4月18日"
      onBack={onBack}
      footerNote="※ 本表記は AI による初稿のため、最終的な法的効力は弁護士レビューを経て確定します。"
    >
      <Row label="サービス名" value="AI Movie Match（AIムービーマッチ）" />
      <Row label="販売事業者" value="株式会社Ahare（カブシキガイシャ アハレ）" />
      <Row label="運営責任者" value="中越こうき（代表取締役）" />
      <Row label="所在地" value="〒[郵便番号] 三重県[住所]" note="請求があった場合、遅滞なく開示します。" />
      <Row
        label="連絡先"
        value={
          <>
            メール: support@ai-movie-match.com<br />
            電話番号: [電話番号]（受付時間: 平日10:00〜18:00、土日祝休）<br />
            お問い合わせフォーム: https://www.ai-movie-match.com/contact
          </>
        }
        note="電話番号は請求があった場合、遅滞なく開示します。"
      />
      <Row label="URL" value="https://www.ai-movie-match.com/" />

      <Section title="販売価格">
        <p>各案件ごとに、発注者とクリエイターが個別に合意した金額となります。本サービス上で案件投稿時または見積もり提示時に明示されます。</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>発注者のお支払額: 合意した金額の全額（追加手数料なし）</li>
          <li>消費税: 10%（内税）</li>
          <li>支払方法に応じた手数料が別途発生する場合があります（クレジットカード決済手数料等）</li>
        </ul>
      </Section>

      <Section title="商品代金以外の必要料金">
        <ul className="list-disc pl-6 space-y-1">
          <li>クレジットカード決済手数料: 当社負担（発注者負担なし）</li>
          <li>銀行振込手数料: 発注者負担</li>
          <li>法人請求書払い: 月末締め翌月末払い。与信審査あり</li>
        </ul>
      </Section>

      <Section title="支払方法">
        <ol className="list-decimal pl-6 space-y-1">
          <li>クレジットカード（Visa、Mastercard、JCB、American Express、Diners Club）</li>
          <li>銀行振込</li>
          <li>法人請求書払い（当社所定の与信審査を経た法人のみ）</li>
        </ol>
      </Section>

      <Section title="支払時期">
        <ul className="list-disc pl-6 space-y-1">
          <li>クレジットカード・銀行振込: 案件契約成立時に仮払い</li>
          <li>法人請求書払い: 月末締め翌月末払い</li>
        </ul>
      </Section>

      <Section title="商品引渡時期">
        <p>各案件ごとに、発注者とクリエイターが個別に合意した納期となります。本サービス上で案件投稿時または見積もり提示時に明示されます。</p>
      </Section>

      <Section title="返品・キャンセル">
        <p className="font-bold mt-2">1. 契約成立前のキャンセル</p>
        <p>発注者は、契約成立前であれば、いつでもキャンセル可能です。仮払いも発生していないため、料金は発生しません。</p>

        <p className="font-bold mt-3">2. 契約成立後・制作着手前のキャンセル</p>
        <p>発注者・クリエイター双方の合意がある場合、キャンセル可能です。仮払い金は全額発注者に返金されます。</p>

        <p className="font-bold mt-3">3. 制作着手後のキャンセル</p>
        <p>発注者・クリエイター双方の合意がある場合、キャンセル可能です。進捗状況に応じた金額がクリエイターに支払われ、残額が発注者に返金されます。配分は両者の協議により決定し、合意に至らない場合は当社が仲裁します。</p>

        <p className="font-bold mt-3">4. 検収後のキャンセル</p>
        <p>検収完了後のキャンセルは原則受け付けません。ただし、成果物に重大な瑕疵があり、クリエイターが対応しない場合等、合理的な理由がある場合は当社にお問い合わせください。</p>

        <p className="font-bold mt-3">5. クリエイター側の規約違反による契約解除</p>
        <p>クリエイターの規約違反が判明した場合、当社の判断で契約を解除し、仮払い金は原則として全額発注者に返金されます。</p>

        <p className="font-bold mt-3">返金方法</p>
        <p>返金は、原則として元の支払方法と同じ経路で行われます（クレジットカードの場合はカード会社経由、銀行振込の場合は指定口座への振込）。返金にかかる手数料は当社が負担します。</p>
      </Section>

      <Section title="動作環境">
        <p className="font-semibold">推奨ブラウザ:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Google Chrome（最新版）</li>
          <li>Mozilla Firefox（最新版）</li>
          <li>Safari（最新版）</li>
          <li>Microsoft Edge（最新版）</li>
        </ul>
        <p className="font-semibold mt-2">モバイルブラウザ:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>iOS Safari（iOS 15以上）</li>
          <li>Android Chrome（Android 10以上）</li>
        </ul>
      </Section>

      <Section title="その他">
        <p>本サービスは、AI動画制作のマッチングプラットフォームです。当社は、発注者とクリエイター間の動画制作契約の当事者ではなく、両者間のマッチング機会を提供するに留まります。詳細は「利用規約」「プライバシーポリシー」「AI生成物ポリシー」をご確認ください。</p>
      </Section>
    </LegalLayout>
  );
}

function Row({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <div className="mb-5 pb-4 border-b border-gray-100">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm text-gray-800">{value}</div>
      {note && <div className="text-xs text-gray-400 mt-1">※ {note}</div>}
    </div>
  );
}
