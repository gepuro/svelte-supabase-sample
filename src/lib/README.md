# Component Library

このプロジェクトのコンポーネントライブラリは、使いやすさと保守性を重視した構成になっています。

## ディレクトリ構造

```
src/lib/
├── components/           # UI コンポーネント
│   ├── general/         # 汎用コンポーネント
│   ├── navigation/      # ナビゲーションコンポーネント
│   ├── form/           # フォームコンポーネント
│   ├── data-display/   # データ表示コンポーネント
│   ├── feedback/       # フィードバックコンポーネント
│   └── util/           # ユーティリティコンポーネント
├── services/           # ドメインサービス
├── types.ts           # 型定義
└── database.types.ts  # データベース型定義
```

## コンポーネントカテゴリ

| フォルダ名   | 分類名         | 目的                                       | コンポーネント例                                                                                                                                            |
| ------------ | -------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| general      | General        | 全般に使うもの                             | Button, Icon, Typography                                                                                                                                    |
| navigation   | Navigation     | ナビゲーションに使う                       | Breadcrumb, Dropdown, Menu, Pagination, PageHeader, Steps, Tabs                                                                                             |
| form         | Form           | データ入力に使う（フォーム）               | TextField, Checkbox, DatePicker, Radio, Select, Toggle                                                                                                      |
| data-display | Data Display   | データ表示に使う                           | Avatar, Badge, Comment, Collapse, Carousel, Card, Calendar, Descriptions, Empty, Image, List, Popover, Statistic, Tree, Tooltip, Timeline, Tag, Tabs, Table |
| feedback     | Feedback       | ユーザーへのフィードバックに使う           | Alert, Drawer, Modal, Toast, Notification, Progress, Result, Spinner                                                                                        |
| util         | Util           | util系                                     | Portal, Transition                                                                                                                                          |
| service      | Domain Service | データの取得やビジネスロジックの実装を担当 |                                                                                                                                                             |

### 実装済みコンポーネント

#### General (汎用)

- `Button` - ボタンコンポーネント

#### Navigation (ナビゲーション)

- `Navigation` - メインナビゲーション

#### Form (フォーム)

- `Input` - テキスト入力フィールド
- `Textarea` - マルチライン入力フィールド
- `Form` - サンプルフォーム

#### Data Display (データ表示)

- `Card` - カード形式でのデータ表示
- `List` - リスト形式でのデータ表示
- `Status` - ステータス表示

#### Feedback (フィードバック)

- `Alert` - アラート・通知コンポーネント

## 使用方法

### 個別インポート

```typescript
import { Button } from '$lib/components/general';
import { Input, Form } from '$lib/components/form';
import { Alert } from '$lib/components/feedback';
```

### 全体からのインポート

```typescript
import { Button, Input, Form, Alert } from '$lib';
```

### サービスの使用

```typescript
import { SampleService } from '$lib/services';

// 使用例
const sampleService = new SampleService(supabase);
const samples = await sampleService.getSamples();
```

## 型定義

共通の型定義は以下から利用可能です：

```typescript
import type { SampleRow, SampleInsert, FormState, ValidationResult } from '$lib/types';
```

## ユーティリティ関数

共通のユーティリティ関数：

```typescript
import {
	validateSampleData,
	sanitizeSampleData,
	formatErrorMessage,
	formatDate,
	debounce
} from '$lib/components/util';
```

## コンポーネントの特徴

- **型安全性**: TypeScriptによる厳密な型チェック
- **再利用性**: 汎用的で再利用可能な設計
- **アクセシビリティ**: WAI-ARIAガイドラインに準拠
- **レスポンシブ**: モバイルファーストなレスポンシブデザイン
- **モダン**: Svelte 5の新機能（runes）を活用

## 開発ガイドライン

1. **カテゴリ分類**: 新しいコンポーネントは適切なカテゴリに配置
2. **命名規則**: PascalCaseでコンポーネント名を定義
3. **Propsインターface**: 明確なProps型定義を必須とする
4. **エクスポート**: 各カテゴリのindex.tsで適切にエクスポート
5. **ドキュメント**: コンポーネントの使用方法をコメントで明記
