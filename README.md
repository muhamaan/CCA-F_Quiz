# CCA-F Quiz

Claude Certified Architect – Foundations (CCA-F) 対策用の穴あき4択練習問題アプリ。
`ExamGuide.pdf` の各ドメインの "Knowledge of" / "Skills in" 記述（ベストプラクティス・アンチパターン）から生成した約170問を収録した Vite + React + PWA アプリです。スマホにインストールしてオフラインで学習できます。

## 機能

- 全問ランダム出題 / ドメイン別出題（D1〜D5） / 間違えた問題の復習モード
- 回答直後に正誤 + 英文解説を表示（正解の根拠と誤答選択肢の理由）
- ドメイン別の進捗・正答率統計（localStorage に保存）
- PWA: 一度読み込めば完全オフラインで動作

## 開発

```bash
cd app
npm install
npm run dev        # 開発サーバー
npm run validate   # 問題バンクの整合性チェック
npm run build      # 型チェック + 本番ビルド
npm run preview    # ビルド結果の確認
```

問題データは `app/src/data/d1.json`〜`d5.json`（穴あき問題）と `samples.json`（公式サンプル問題12問）。
生成ソースの Exam Guide（PDF・抽出テキスト）は Anthropic の著作物のため、リポジトリには含めていません（ローカル管理）。

## デプロイ（GitHub Pages）

1. GitHub にリポジトリを作成して push
2. リポジトリの Settings → Pages → Source を「GitHub Actions」に設定
3. `master`/`main` への push で `.github/workflows/deploy.yml` が自動ビルド・デプロイ
   （`BASE_PATH` はリポジトリ名から自動設定）
4. 公開URLをスマホで開き「ホーム画面に追加」でインストール
