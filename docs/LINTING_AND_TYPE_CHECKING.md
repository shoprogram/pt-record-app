# Linting と型チェック

このプロジェクトでは、コード品質を保つために ESLint と TypeScript による型チェックを統合しています。

## 概要

- **ESLint**: コードスタイルと基本的な型エラーを検出
- **TypeScript**: 厳密な型チェックを実行
- 両方を組み合わせることで、import エラー、型の不一致、その他の潜在的なバグを早期に発見できます

## コマンド

### すべてのチェックを実行

```bash
npm run lint
```

このコマンドは以下を順次実行します：

1. ESLint による静的解析
2. TypeScript による型チェック

### 個別実行

```bash
# ESLint のみ実行
npm run lint:check

# ESLint で自動修正
npm run lint:fix

# TypeScript 型チェックのみ実行
npm run type-check
```

## 設定ファイル

### ESLint 設定 (`eslint.config.mjs`)

- **Nuxt ESLint Config**: Nuxt プロジェクト用の推奨設定
- **TypeScript ESLint**: TypeScript の型情報を使った lint
- **Prettier**: コードフォーマットとの統合

有効なルール：

- `@typescript-eslint/no-unused-vars`: 未使用変数の検出
- `@typescript-eslint/no-explicit-any`: `any` 型の使用に警告
- `@typescript-eslint/no-misused-promises`: Promise の誤用を検出
- `@typescript-eslint/await-thenable`: await 可能な値のみを await
- `@typescript-eslint/no-floating-promises`: 浮遊 Promise の検出
- `@typescript-eslint/restrict-template-expressions`: テンプレート文字列の型安全性

### TypeScript 設定

- `tsconfig.json`: Nuxt プロジェクト参照の設定
- `tsconfig.eslint.json`: ESLint 用の TypeScript 設定（`.nuxt/tsconfig.json` を継承）
- `.nuxt/tsconfig.json`: Nuxt が生成する実際の TypeScript 設定

厳密な型チェックが有効：

- `strict: true`
- `noUncheckedIndexedAccess: true`: 配列アクセスで `undefined` を考慮
- `strictNullChecks: true`: null/undefined の厳密なチェック

## 検出されるエラーの例

### 型の不一致

```typescript
// ❌ エラー: undefined を null に割り当てられない
const data: Ref<Data | null> = ref<Data | undefined>(undefined)

// ✅ 修正: computed で変換
const data = computed<Data | null>(() => rawData.value ?? null)
```

### 配列アクセス

```typescript
// ❌ エラー: array[0] は undefined の可能性がある
const first = array[0]
const name = first.name

// ✅ 修正: オプショナルチェーンまたはガード
const first = array[0]
if (!first) throw new Error('Not found')
const name = first.name
```

### Import エラー

TypeScript の型チェックにより、存在しないモジュールや型のインポートエラーも検出されます。

## CI/CD での利用

本番環境にデプロイする前に、必ず lint と型チェックを実行してください：

```bash
npm run lint
npm run test:unit
npm run test:e2e
```

## トラブルシューティング

### ESLint が型情報を見つけられない

```bash
# Nuxt のプロジェクトを再生成
npm run postinstall
```

### 型チェックが遅い

TypeScript の型チェックは大規模プロジェクトで時間がかかる場合があります。
開発中は `lint:check` のみを実行し、コミット前に完全な `lint` を実行することを推奨します。

## 参考リンク

- [Nuxt ESLint](https://eslint.nuxt.com/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Nuxt TypeScript](https://nuxt.com/docs/guide/concepts/typescript)
