const { createCanvas } = require('canvas');
const {
  CANVAS_SIZE,
  BORDER_RADIUS,
  DIGIT_WIDTH,
  SPACING,
  LINE_HEIGHT,
  LINE_GAP,
  BACKGROUND_COLOR,
  TEXT_COLOR,
} = require('./constants');

const createSegment = (x, y, width, height) => (ctx, baseX, baseY, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(baseX + x, baseY + y, width, height);
};

const segmentDrawersByKey = {
  A: createSegment(0, 0, 6, 2),
  B: createSegment(4, 0, 2, 6),
  C: createSegment(4, 4, 2, 6),
  D: createSegment(0, 8, 6, 2),
  E: createSegment(0, 4, 2, 6),
  F: createSegment(0, 0, 2, 6),
  G: createSegment(0, 4, 6, 2),
};

const DIGIT_SEGMENTS = [
  ['A', 'B', 'C', 'D', 'E', 'F'],
  ['B', 'C'],
  ['A', 'B', 'G', 'E', 'D'],
  ['A', 'B', 'C', 'D', 'G'],
  ['F', 'G', 'B', 'C'],
  ['A', 'F', 'G', 'C', 'D'],
  ['A', 'F', 'E', 'D', 'C', 'G'],
  ['A', 'B', 'C'],
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  ['A', 'B', 'C', 'D', 'F', 'G'],
];

const drawRoundedBackground = (ctx, width, height, radius, color) => {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(width - radius, 0);
  ctx.quadraticCurveTo(width, 0, width, radius);
  ctx.lineTo(width, height - radius);
  ctx.quadraticCurveTo(width, height, width - radius, height);
  ctx.lineTo(radius, height);
  ctx.quadraticCurveTo(0, height, 0, height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

const drawDigit = (ctx, digit, x, y, color) => {
  const preparedDigit = Number(digit);

  if (isNaN(preparedDigit) || preparedDigit < 0 || preparedDigit > 9) {
    return;
  }

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  DIGIT_SEGMENTS[preparedDigit].forEach((segmentKey) => {
    segmentDrawersByKey[segmentKey](ctx, x, y, color);
  });

  ctx.restore();
};

const drawTime = (ctx, line1, line2, width, height) => {
  const lineWidth = 2 * DIGIT_WIDTH + SPACING;
  const startX = Math.floor((width - lineWidth) / 2);
  const firstLineY = Math.floor((height - 2 * LINE_HEIGHT - LINE_GAP) / 2);
  const secondLineY = firstLineY + LINE_HEIGHT + LINE_GAP;

  drawDigit(ctx, line1[0], startX, firstLineY, TEXT_COLOR);
  drawDigit(ctx, line1[1], startX + DIGIT_WIDTH + SPACING, firstLineY, TEXT_COLOR);
  drawDigit(ctx, line2[0], startX, secondLineY, TEXT_COLOR);
  drawDigit(ctx, line2[1], startX + DIGIT_WIDTH + SPACING, secondLineY, TEXT_COLOR);
};

const createOverlayIcon = (text) => {
  const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  const ctx = canvas.getContext('2d');
  const timeParts = text.split(':');

  drawRoundedBackground(ctx, CANVAS_SIZE, CANVAS_SIZE, BORDER_RADIUS, BACKGROUND_COLOR);

  if (timeParts.length === 3) {
    const hours = String(parseInt(timeParts[0], 10))
      .padStart(2, '0');

    drawTime(ctx, hours, timeParts[1], CANVAS_SIZE, CANVAS_SIZE);
  } else {
    const minutes = parseInt(timeParts[0], 10);
    const seconds = timeParts[1] || '00';
    const minutesText = String(minutes)
      .padStart(2, '0');
    const secondsText = seconds.padStart(2, '0');

    drawTime(ctx, minutesText, secondsText, CANVAS_SIZE, CANVAS_SIZE);
  }

  return canvas.toBuffer('image/png');
};

module.exports = { createOverlayIcon };
