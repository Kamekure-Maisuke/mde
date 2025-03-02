function isControlChar(charCode: number): boolean {
  // ASCII 制御文字: 0-31 および 127 (DEL)
  return (charCode < 32) || (charCode === 127);
}

async function main(): Promise<number> {
  try {
    // 出力や文字列処理を無効化。
    Deno.stdin.setRaw(true);

    // 案内
    console.log("rawモード有効化");
    console.log("キーを入力して。qで終了。。");

    const stdin = Deno.stdin;
    const buffer = new Uint8Array(1);

    while (await stdin.read(buffer) !== null) {
      const charCode = buffer[0];

      // qを押したらプログラム終了。
      if (charCode === 113) {
        break;
      }

      if (isControlChar(charCode)) {
        console.log(`${charCode}`);
      } else {
        console.log(`${charCode} ('${String.fromCharCode(charCode)}')`);
      }
    }

    return 0;
  } catch (e) {
    console.error(e);
    return 1;
  } finally {
    // プログラム終了時はrawモードを解除。
    Deno.stdin.setRaw(false);
  }
}

if (import.meta.main) {
  try {
    const exitCode = await main();
    Deno.exit(exitCode);
  } catch (error) {
    console.error("致命的なエラー:", error);
    Deno.stdin.setRaw(false);
    Deno.exit(1);
  }
}
