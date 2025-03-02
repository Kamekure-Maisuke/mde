function isControlChar(charCode: number): boolean {
  // ASCII 制御文字: 0-31 および 127 (DEL)
  return (charCode < 32) || (charCode === 127);
}

function editorRefreshScreen() {
  // 画面クリア&カーソル左上
  Deno.stdout.writeSync(new TextEncoder().encode("\x1b[2J"));
  Deno.stdout.writeSync(new TextEncoder().encode("\x1b[H"));
  // チルダ描画
  editorDraw();
  // カーソル左上
  Deno.stdout.writeSync(new TextEncoder().encode("\x1b[H"));
}

function editorDraw() {
  const { rows } = Deno.consoleSize();
  const encoder = new TextEncoder();
  for (let i = 0; i < rows; i++) {
    Deno.stdout.writeSync(encoder.encode("~"));
    if (i < rows - 1) {
      Deno.stdout.writeSync(encoder.encode("\r\n"));
    }
  }
}

async function main(): Promise<number> {
  try {
    // 出力や文字列処理を無効化。
    Deno.stdin.setRaw(true);

    // 画面クリア
    editorRefreshScreen();

    const buffer = new Uint8Array(1);

    keyLoop: while (await Deno.stdin.read(buffer) !== null) {
      const charCode = buffer[0];

      // プログラム終了。
      switch (charCode) {
        case 27: // ESC
        case 17: // CTRL-Q
          break keyLoop;
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
    editorRefreshScreen();
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
