# Flow - モバイルTODOアプリケーション 技術仕様書

**バージョン**: 1.0  
**作成日**: 2026年2月14日  
**対象**: AIエージェント（Claude Code, Codex, Cursor等）向けの完全実装仕様

-----

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
1. [技術スタック](#2-技術スタック)
1. [機能要件](#3-機能要件)
1. [データ構造](#4-データ構造)
1. [UIデザイン仕様](#5-uiデザイン仕様)
1. [カラーパレット](#6-カラーパレット)
1. [レイアウト構成](#7-レイアウト構成)
1. [アニメーション仕様](#8-アニメーション仕様)
1. [多言語対応](#9-多言語対応)
1. [ストレージ仕様](#10-ストレージ仕様)
1. [コンポーネント詳細](#11-コンポーネント詳細)
1. [実装チェックリスト](#12-実装チェックリスト)

-----

## 1. プロジェクト概要

### 1.1 アプリケーション名

**Flow**

### 1.2 概要

モバイルファーストの高機能TODOアプリケーション。洗練されたUI/UXと、タスク管理に必要な全ての機能を備えたReactベースのウェブアプリケーション。

### 1.3 主要な特徴

- モバイルブラウザに最適化されたレスポンシブデザイン
- タスク管理の全機能（優先度、期限、カテゴリ、サブタスク）
- ダークモード対応
- 多言語対応（英語・日本語）
- ローカルストレージによるデータ永続化
- スムーズなアニメーションとトランジション

-----

## 2. 技術スタック

### 2.1 フロントエンドフレームワーク

- **React** (関数コンポーネント + Hooks)
- **JSX** (単一ファイルコンポーネント)

### 2.2 使用ライブラリ

- **lucide-react**: アイコンライブラリ
  - 使用アイコン: `Plus`, `Check`, `Trash2`, `Edit2`, `Calendar`, `Flag`, `Tag`, `Filter`, `Search`, `Moon`, `Sun`, `ChevronRight`, `ChevronDown`, `MoreVertical`, `Settings`, `X`

### 2.3 フォント

- **Space Mono** (Google Fonts)
  - ウェイト: 400 (Regular), 700 (Bold)
  - monospaceフォントで洗練された印象を演出

### 2.4 ストレージAPI

- **window.storage API** (ブラウザ永続化ストレージ)
  - メソッド: `get()`, `set()`, `delete()`, `list()`

-----

## 3. 機能要件

### 3.1 基本機能

#### 3.1.1 タスク管理

- ✅ タスクの追加
- ✅ タスクの編集
- ✅ タスクの削除
- ✅ タスクの完了/未完了切り替え

#### 3.1.2 タスク属性

- ✅ タイトル（必須）
- ✅ カテゴリ（Work, Personal, Health, Learning）
- ✅ 優先度（High, Medium, Low）
- ✅ 期限日時
- ✅ 作成日時（自動記録）
- ✅ サブタスク（複数可）

### 3.2 高度な機能

#### 3.2.1 フィルタリング

- ステータスフィルター（All, Active, Completed）
- カテゴリフィルター（All, Work, Personal, Health, Learning）

#### 3.2.2 検索

- タスクタイトルの全文検索
- リアルタイム検索結果表示

#### 3.2.3 サブタスク

- タスクごとに複数のサブタスクを追加可能
- サブタスクの完了/未完了切り替え
- サブタスクの展開/折りたたみ表示
- 進捗状況の表示（完了数/総数）

#### 3.2.4 統計表示

- 総タスク数
- アクティブタスク数
- 完了タスク数
- 高優先度タスク数

#### 3.2.5 ユーザー設定

- ダークモード/ライトモード切り替え
- 言語切り替え（英語/日本語）
- 設定の永続化

### 3.3 期限管理

- 期限切れタスクの視覚的な警告表示（赤色バッジ）
- 期限日の表示（カレンダーアイコン付き）

-----

## 4. データ構造

### 4.1 タスクオブジェクト

```javascript
{
  id: number,              // タイムスタンプベースのユニークID
  text: string,            // タスクのタイトル
  completed: boolean,      // 完了状態
  category: string,        // カテゴリ（'Work' | 'Personal' | 'Health' | 'Learning'）
  priority: string,        // 優先度（'high' | 'medium' | 'low'）
  dueDate: string,         // 期限（ISO 8601形式）
  createdAt: string,       // 作成日時（ISO 8601形式）
  subtasks: Array<{
    id: number,
    text: string,
    completed: boolean
  }>,
  recurring: null          // 将来の拡張用（繰り返しタスク）
}
```

### 4.2 アプリケーション状態

```javascript
// React State変数一覧
const [tasks, setTasks] = useState([]);                    // タスク配列
const [categories, setCategories] = useState([]);          // カテゴリ配列
const [newTask, setNewTask] = useState('');                // 新規タスク入力値
const [editingId, setEditingId] = useState(null);          // 編集中タスクID
const [editingText, setEditingText] = useState('');        // 編集中テキスト
const [selectedCategory, setSelectedCategory] = useState(''); // 選択中カテゴリ
const [selectedPriority, setSelectedPriority] = useState('medium'); // 選択中優先度
const [selectedDate, setSelectedDate] = useState('');      // 選択中期限
const [showAddTask, setShowAddTask] = useState(false);     // タスク追加パネル表示
const [filterStatus, setFilterStatus] = useState('all');   // ステータスフィルター
const [filterCategory, setFilterCategory] = useState('all'); // カテゴリフィルター
const [searchTerm, setSearchTerm] = useState('');          // 検索キーワード
const [darkMode, setDarkMode] = useState(false);           // ダークモード
const [expandedTask, setExpandedTask] = useState(null);    // 展開中サブタスクID
const [showMenu, setShowMenu] = useState(null);            // 表示中メニューID
const [showSettings, setShowSettings] = useState(false);   // 設定パネル表示
const [language, setLanguage] = useState('en');            // 言語設定
const [loading, setLoading] = useState(true);              // ローディング状態
```

-----

## 5. UIデザイン仕様

### 5.1 デザインコンセプト

- **モノスペースフォント**: Space Monoを使用した独特なタイポグラフィ
- **グラデーション**: 紫系のグラデーションをアクセントカラーに使用
- **モダンなカード**: 大きめのボーダーラディウスと影によるエレベーション
- **カラフルなバッジ**: カテゴリと優先度を視覚的に区別

### 5.2 レスポンシブデザイン

- モバイルファースト（320px〜）
- タッチフレンドリーなボタンサイズ（最小44px × 44px）
- スムーズなスクロール体験

### 5.3 インタラクション

- タップ時のスケールアニメーション
- ホバー時の背景色変更
- スライド/フェードインアニメーション

-----

## 6. カラーパレット

### 6.1 ライトモード

```javascript
{
  bg: '#fafafa',           // 背景色
  cardBg: '#ffffff',       // カード背景色
  text: '#1a1a1a',         // テキスト色
  textSecondary: '#666',   // セカンダリテキスト色
  border: '#e0e0e0',       // ボーダー色
  accent: '#6d28d9',       // アクセントカラー（紫）
  accentLight: '#8b5cf6'   // アクセント明るめ
}
```

### 6.2 ダークモード

```javascript
{
  bg: '#0a0a0a',           // 背景色（濃い黒）
  cardBg: '#1a1a1a',       // カード背景色
  text: '#e0e0e0',         // テキスト色
  textSecondary: '#999',   // セカンダリテキスト色
  border: '#2a2a2a',       // ボーダー色
  accent: '#7c3aed',       // アクセントカラー（明るめ紫）
  accentLight: '#a78bfa'   // アクセント明るめ
}
```

### 6.3 優先度カラー

```javascript
// ライトモード
high: '#e63946'     // 赤
medium: '#f4a261'   // オレンジ
low: '#2a9d8f'      // ティール

// ダークモード
high: '#ff6b6b'     // 明るい赤
medium: '#ffd93d'   // 黄色
low: '#6bcf7f'      // 明るい緑
```

### 6.4 カテゴリカラー

```javascript
Work: '#5e60ce'      // 紫
Personal: '#48cae4'  // シアン
Health: '#06d6a0'    // エメラルド
Learning: '#ff006e'  // マゼンタ
```

-----

## 7. レイアウト構成

### 7.1 ヘッダー（Sticky）

- **背景**: グラデーション（accent → accentLight）
- **パディング**: 24px 20px
- **位置**: sticky, top: 0, z-index: 100
- **内容**:
  - アプリ名「Flow」（左上）
  - 設定アイコン（右上）
  - ダークモード切り替えアイコン（右上）
  - 統計カード 4つ（Total, Active, Done, Priority）

#### 統計カード仕様

- **レイアウト**: Grid 4列
- **背景**: rgba(255,255,255,0.15) + backdrop-filter: blur(10px)
- **ボーダーラディウス**: 12px
- **パディング**: 12px 8px
- **アニメーション**: slideUp（0.1s毎に遅延）

### 7.2 検索・フィルターバー（Sticky）

- **位置**: sticky, top: 148px, z-index: 99
- **背景**: cardBg
- **パディング**: 20px
- **内容**:
  - 検索入力（Searchアイコン付き）
  - フィルターボタン群（横スクロール可能）

### 7.3 タスクリスト

- **パディング**: 20px
- **各タスクカード**:
  - マージンボトム: 12px
  - ボーダーラディウス: 16px
  - パディング: 16px
  - ボーダー: 2px solid（優先度カラー）
  - アニメーション: slideIn（0.05s毎に遅延）

### 7.4 タスク追加ボタン（FAB）

- **位置**: fixed, bottom: 24px, right: 20px
- **サイズ**: 64px × 64px
- **ボーダーラディウス**: 20px
- **背景**: グラデーション
- **影**: 0 8px 32px rgba(0,0,0,0.3)
- **アイコン**: Plus（回転アニメーション）

### 7.5 タスク追加パネル（Bottom Sheet）

- **位置**: fixed, bottom: 0
- **背景**: cardBg
- **ボーダーラディウス**: 24px（上のみ）
- **パディング**: 24px 20px
- **影**: 0 -4px 32px rgba(0,0,0,0.2)
- **アニメーション**: slideUpPanel

### 7.6 設定パネル（Modal）

- **背景オーバーレイ**: rgba(0,0,0,0.5)
- **パネル**: Bottom Sheet形式
- **内容**:
  - 言語設定（英語/日本語）
  - テーマ設定（ライト/ダーク）

-----

## 8. アニメーション仕様

### 8.1 キーフレームアニメーション

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideUpPanel {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

### 8.2 トランジション

- **全般**: `transition: all 0.2s ease` または `transition: all 0.3s ease`
- **背景/テーマ切り替え**: `transition: background 0.3s ease, color 0.3s ease`
- **Plusアイコン回転**: `transition: transform 0.3s ease`

### 8.3 インタラクション

- **ボタンアクティブ**: `transform: scale(0.98)` または `scale(0.95)`
- **ホバー**: `background: theme.border` または色変更

-----

## 9. 多言語対応

### 9.1 翻訳オブジェクト構造

```javascript
const translations = {
  en: {
    appName: 'Flow',
    total: 'Total',
    active: 'Active',
    done: 'Done',
    priority: 'Priority',
    searchPlaceholder: 'Search tasks...',
    all: 'All',
    completed: 'Completed',
    noTasksFound: 'No tasks found',
    tryDifferentSearch: 'Try a different search',
    addFirstTask: 'Add your first task below',
    newTask: 'New Task',
    whatToDo: 'What needs to be done?',
    lowPriority: 'Low Priority',
    mediumPriority: 'Medium Priority',
    highPriority: 'High Priority',
    addTask: 'Add Task',
    edit: 'Edit',
    delete: 'Delete',
    subtasks: 'subtasks',
    work: 'Work',
    personal: 'Personal',
    health: 'Health',
    learning: 'Learning',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    close: 'Close'
  },
  ja: {
    appName: 'Flow',
    total: '合計',
    active: '進行中',
    done: '完了',
    priority: '優先',
    searchPlaceholder: 'タスクを検索...',
    all: 'すべて',
    completed: '完了済み',
    noTasksFound: 'タスクが見つかりません',
    tryDifferentSearch: '別の検索を試してください',
    addFirstTask: '最初のタスクを追加してください',
    newTask: '新しいタスク',
    whatToDo: '何をする必要がありますか？',
    lowPriority: '低優先度',
    mediumPriority: '中優先度',
    highPriority: '高優先度',
    addTask: 'タスクを追加',
    edit: '編集',
    delete: '削除',
    subtasks: 'サブタスク',
    work: '仕事',
    personal: '個人',
    health: '健康',
    learning: '学習',
    settings: '設定',
    language: '言語',
    theme: 'テーマ',
    darkMode: 'ダークモード',
    lightMode: 'ライトモード',
    close: '閉じる'
  }
};
```

### 9.2 優先度表示の翻訳

```javascript
const getPriorityName = (priority) => {
  const priorityMap = {
    'high': language === 'ja' ? '高' : 'High',
    'medium': language === 'ja' ? '中' : 'Med',
    'low': language === 'ja' ? '低' : 'Low'
  };
  return priorityMap[priority] || priority;
};
```

-----

## 10. ストレージ仕様

### 10.1 保存データ

**キー**: `todo-tasks`  
**形式**: JSON文字列化されたタスク配列  
**スコープ**: 個人（shared: false）

**キー**: `todo-categories`  
**形式**: JSON文字列化されたカテゴリ配列  
**スコープ**: 個人（shared: false）

**キー**: `todo-darkmode`  
**形式**: JSON文字列化されたboolean  
**スコープ**: 個人（shared: false）

**キー**: `todo-language`  
**形式**: JSON文字列化された言語コード（‘en’ | ‘ja’）  
**スコープ**: 個人（shared: false）

### 10.2 読み込み処理

```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      const tasksResult = await window.storage.get('todo-tasks', false);
      const categoriesResult = await window.storage.get('todo-categories', false);
      const darkModeResult = await window.storage.get('todo-darkmode', false);
      const languageResult = await window.storage.get('todo-language', false);
      
      if (tasksResult && tasksResult.value) {
        setTasks(JSON.parse(tasksResult.value));
      }
      if (categoriesResult && categoriesResult.value) {
        setCategories(JSON.parse(categoriesResult.value));
      }
      if (darkModeResult && darkModeResult.value) {
        setDarkMode(JSON.parse(darkModeResult.value));
      }
      if (languageResult && languageResult.value) {
        setLanguage(JSON.parse(languageResult.value));
      }
    } catch (error) {
      console.log('No existing data, starting fresh');
    }
    setLoading(false);
  };
  loadData();
}, []);
```

### 10.3 保存処理

```javascript
useEffect(() => {
  if (!loading) {
    const saveData = async () => {
      try {
        await window.storage.set('todo-tasks', JSON.stringify(tasks), false);
        await window.storage.set('todo-categories', JSON.stringify(categories), false);
        await window.storage.set('todo-darkmode', JSON.stringify(darkMode), false);
        await window.storage.set('todo-language', JSON.stringify(language), false);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveData();
  }
}, [tasks, categories, darkMode, language, loading]);
```

-----

## 11. コンポーネント詳細

### 11.1 ヘッダーコンポーネント

**要素**:

- アプリ名（h1）
- 設定ボタン（Settingsアイコン）
- ダークモード切り替えボタン（Moon/Sunアイコン）
- 統計カード × 4

**統計カード構造**:

```javascript
{[
  { label: t.total, value: stats.total },
  { label: t.active, value: stats.active },
  { label: t.done, value: stats.completed },
  { label: t.priority, value: stats.highPriority }
].map((stat, i) => (
  // カード要素
))}
```

### 11.2 検索・フィルターバー

**検索入力**:

- タイプ: text
- プレースホルダー: t.searchPlaceholder
- Searchアイコン（左側）
- リアルタイム検索（onChange）

**フィルターボタン**:

- ステータスフィルター: all, active, completed
- カテゴリフィルター: all, Work, Personal, Health, Learning
- 横スクロール対応（overflowX: auto）

### 11.3 タスクカード

**レイアウト**:

- チェックボックス（28px × 28px）
- タスク内容エリア（flex: 1）
  - タイトル
  - メタデータバッジ（カテゴリ、期限、優先度）
  - サブタスク（展開可能）
- メニューボタン（32px × 32px）

**チェックボックス**:

- ボーダー: 2px solid（優先度カラー）
- 完了時: 背景が優先度カラー + Checkアイコン

**メタデータバッジ**:

- カテゴリ: Tagアイコン + カテゴリ名（翻訳対応）
- 期限: Calendarアイコン + 日付（期限切れは赤）
- 優先度: Flagアイコン + 優先度（翻訳対応）

**サブタスク**:

- 展開ボタン: 完了数/総数 + ChevronRight/Down
- サブタスクリスト: チェックボックス + テキスト

**メニュー（ドロップダウン）**:

- 編集ボタン（Edit2アイコン）
- 削除ボタン（Trash2アイコン、赤色）

### 11.4 タスク追加パネル

**入力フィールド**:

1. タスクタイトル（必須）
1. カテゴリ選択（セレクトボックス）
1. 優先度選択（セレクトボックス）
1. 期限日付（dateインプット）

**追加ボタン**:

- 無効状態: タイトルが空の場合
- 有効状態: グラデーション背景

**キーボード操作**:

- Enter: タスク追加実行

### 11.5 設定パネル

**モーダルオーバーレイ**:

- 背景: rgba(0,0,0,0.5)
- クリックで閉じる

**パネル**:

- Bottom Sheet形式
- 閉じるボタン（Xアイコン）

**設定項目**:

1. **言語設定**:
- 英語ボタン（🇺🇸 English）
- 日本語ボタン（🇯🇵 日本語）
- Grid 2列
1. **テーマ設定**:
- ライトモードボタン（Sunアイコン）
- ダークモードボタン（Moonアイコン）
- Grid 2列

-----

## 12. 実装チェックリスト

### 12.1 必須実装

- [ ] Reactコンポーネントの基本構造
- [ ] 全State変数の定義
- [ ] window.storage APIによるデータ永続化
- [ ] タスクCRUD機能（作成、読込、更新、削除）
- [ ] フィルタリング機能（ステータス、カテゴリ）
- [ ] 検索機能
- [ ] サブタスク機能
- [ ] ダークモード切り替え
- [ ] 多言語対応（英語、日本語）
- [ ] 設定パネル

### 12.2 UI/UX実装

- [ ] Space Monoフォントの読み込み
- [ ] lucide-reactアイコンの全インポート
- [ ] テーマカラーの適用（ライト/ダーク）
- [ ] カテゴリカラーの適用
- [ ] 優先度カラーの適用
- [ ] レスポンシブレイアウト
- [ ] Stickyヘッダー
- [ ] Bottom Sheetアニメーション
- [ ] カードアニメーション（slideIn）
- [ ] ホバー/アクティブ状態

### 12.3 アクセシビリティ

- [ ] ボタンのタッチターゲット（最小44px）
- [ ] キーボード操作対応（Enter）
- [ ] フォーカス状態の視覚化
- [ ] セマンティックHTML

### 12.4 テスト項目

- [ ] タスクの追加
- [ ] タスクの編集
- [ ] タスクの削除
- [ ] タスクの完了切り替え
- [ ] サブタスクの追加と完了
- [ ] フィルタリングの動作
- [ ] 検索の動作
- [ ] ダークモード切り替え
- [ ] 言語切り替え
- [ ] データの永続化（リロード後も保持）
- [ ] 期限切れ警告の表示

-----

## 13. 実装サンプルコード

### 13.1 タスク追加関数

```javascript
const addTask = () => {
  if (newTask.trim()) {
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      category: selectedCategory || categories[0],
      priority: selectedPriority,
      dueDate: selectedDate,
      createdAt: new Date().toISOString(),
      subtasks: [],
      recurring: null
    };
    setTasks([task, ...tasks]);
    setNewTask('');
    setSelectedCategory('');
    setSelectedPriority('medium');
    setSelectedDate('');
    setShowAddTask(false);
  }
};
```

### 13.2 フィルタリングロジック

```javascript
const filteredTasks = tasks.filter(task => {
  const statusMatch = filterStatus === 'all' || 
    (filterStatus === 'active' && !task.completed) ||
    (filterStatus === 'completed' && task.completed);
  
  const categoryMatch = filterCategory === 'all' || task.category === filterCategory;
  
  const searchMatch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
  
  return statusMatch && categoryMatch && searchMatch;
});
```

### 13.3 期限切れ判定

```javascript
const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date() && 
         new Date(dueDate).toDateString() !== new Date().toDateString();
};
```

-----

## 14. パフォーマンス最適化

### 14.1 推奨事項

- useCallbackでイベントハンドラーをメモ化
- useMemoでフィルタリング結果をメモ化
- 大量タスク時の仮想スクロール検討

### 14.2 ストレージ最適化

- データ変更時のみ保存（依存配列の適切な設定）
- try-catchによるエラーハンドリング

-----

## 15. 将来の拡張機能（仕様外）

以下は現バージョンには含まれていないが、将来追加可能な機能:

- 繰り返しタスク機能
- タスクのドラッグ&ドロップ並び替え
- カスタムカテゴリの追加
- タスクのエクスポート/インポート
- リマインダー通知
- タグ機能
- 複数の表示モード（リスト/カンバン）
- ダッシュボード分析

-----

## 16. 注意事項

### 16.1 ブラウザストレージAPI

本仕様書はClaude.aiのArtifacts環境を前提としており、`window.storage` APIを使用しています。他の環境で実装する場合は、以下に置き換えてください:

- **ローカルストレージ**: `localStorage.getItem()` / `localStorage.setItem()`
- **IndexedDB**: より複雑なデータ構造に対応
- **バックエンド**: REST APIやGraphQLでサーバーと同期

### 16.2 アイコンライブラリ

lucide-reactが利用できない環境では、代替として以下を検討:

- react-icons
- heroicons
- Font Awesome

### 16.3 フォント

Google Fontsが利用できない環境では、フォントファイルをローカルにホスティングするか、システムフォントにフォールバックしてください。

-----

## 17. まとめ

この仕様書に従うことで、以下が実現できます:

✅ 完全に機能するモバイル最適化TODOアプリ  
✅ 洗練されたUI/UX  
✅ ダークモード対応  
✅ 多言語対応  
✅ データ永続化  
✅ 高度なタスク管理機能

実装時は本仕様書を参照し、各セクションのチェックリストを確認しながら進めてください。

-----

**ドキュメント終了**