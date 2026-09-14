const CREAM = "#fffdf9";
const INK = "#351624";
const FADED = "#7d5e69";
const RULE = "#dfc9c5";
const RED = "#c9284f";

const W = 660;
const PAD = 48;

function wrap(ctx, text, maxWidth) {
  const lines = [];
  let line = "";

  for (const word of String(text).split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function layout(ctx, fields, paint) {
  const inner = W - PAD * 2;
  let y = PAD + 34;

  const rule = () => {
    if (paint) {
      ctx.save();
      ctx.strokeStyle = RULE;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(PAD, y);
      ctx.lineTo(W - PAD, y);
      ctx.stroke();
      ctx.restore();
    }
    y += 34;
  };

  const text = (str, font, color, lineHeight, letterSpacing = "0px") => {
    ctx.font = font;
    ctx.letterSpacing = letterSpacing;
    ctx.fillStyle = color;
    for (const line of wrap(ctx, str, inner)) {
      if (paint) ctx.fillText(line, PAD, y);
      y += lineHeight;
    }
    ctx.letterSpacing = "0px";
  };

  text(
    "GIRLFRIEND ACCEPTANCE RECEIPT",
    '700 12px "DM Sans", sans-serif',
    RED,
    20,
    "1.7px"
  );
  y += 4;
  text(fields.title, '700 34px "Bricolage Grotesque", sans-serif', INK, 40);
  y += 4;
  text(
    fields.date.toUpperCase(),
    '500 13px "JetBrains Mono", monospace',
    FADED,
    20,
    "1.5px"
  );
  y += 18;
  rule();

  for (const [label, value] of fields.rows) {
    text(
      label.toUpperCase(),
      '500 12px "JetBrains Mono", monospace',
      FADED,
      18,
      "1.8px"
    );
    y += 4;
    text(value, '400 17px "JetBrains Mono", monospace', INK, 25);
    y += 18;
  }

  y -= 4;
  rule();

  ctx.font = '700 21px "Bricolage Grotesque", sans-serif';
  ctx.fillStyle = INK;
  if (paint) {
    ctx.fillText("Total", PAD, y);
    const total = "one lucky boyfriend";
    ctx.fillText(total, W - PAD - ctx.measureText(total).width, y);
  }
  y += 30;

  text(
    "NO REFUNDS \u00b7 UNLIMITED CUDDLES \u00b7 OFFICIALLY OFFICIAL",
    '500 12px "JetBrains Mono", monospace',
    FADED,
    18,
    "1.8px"
  );

  return y + PAD - 14;
}

async function renderReceipt(fields) {
  if (document.fonts) await document.fonts.ready;

  const measure = document.createElement("canvas").getContext("2d");
  measure.textBaseline = "top";
  const height = layout(measure, fields, false);

  const canvas = document.createElement("canvas");
  const scale = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = W * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.textBaseline = "top";
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, W, height);
  layout(ctx, fields, true);

  return canvas;
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
