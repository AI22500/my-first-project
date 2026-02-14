# Flow - モバイルTODOアプリ

`docs/spec.md` の仕様に沿って実装した React + Vite ベースの TODO アプリです。

## セットアップ

```bash
npm install
```

## 開発サーバー

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

## 主な実装内容

- タスク CRUD（追加 / 編集 / 削除 / 完了切替）
- 優先度・カテゴリ・期限・サブタスク対応
- ステータス/カテゴリフィルターとリアルタイム検索
- 統計カード表示
- ダークモード / 日本語・英語切替
- `window.storage` API（なければ `localStorage` フォールバック）による永続化
- モバイルファースト UI（Sticky Header、FAB、Bottom Sheet、モーダル）
