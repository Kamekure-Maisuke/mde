## rawモード
- Deno.stdin.setRaw()でttyのrawモードの有効化・無効化。
- Denoのrawモードは、ECHO、行バッファリング、その他の標準モード機能を1回の呼び出しで無効にします。
    - c言語では各種フラグでの設定が必要。

## 画面クリア
- 以下のようにエスケープシーケンスを利用する。

```javascript
Deno.stdout.writeSync(new TextEncoder().encode("\x1b[2J"));
```

## コンソールサイズ
- Deno.consoleSize()で取れる。
