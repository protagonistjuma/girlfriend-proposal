/* Draws the receipt to a canvas so it can be shared as a real image.
   Hand-drawn rather than pulled from a library - the page has to stay
   self-contained on GitHub Pages. */

const CREAM = "#f3eae1";
const INK = "#120e1c";
const FADED = "#7a6f83";
const RULE = "#c9bcae";

const W = 660; // logical width; scaled up for retina at draw time
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

/* Both passes walk the same instructions: the first only advances y so we
   know how tall the canvas must be, the second actually paints. */
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
    const total = "one (1) night";
    ctx.fillText(total, W - PAD - ctx.measureText(total).width, y);
  }
  y += 30;

  // escaped so the file survives being served without a charset header
  text(
    "NON-REFUNDABLE \u00b7 NO RETURNS",
    '500 12px "JetBrains Mono", monospace',
    FADED,
    18,
    "1.8px"
  );

  return y + PAD - 14;
}

async function renderReceipt(fields) {
  // without this the canvas paints in a fallback face on first load
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
