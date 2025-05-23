import { Context } from "konva/lib/Context";

export enum Shape {
  Circle = "circle",
  Square = "square",
  Triangle = "triangle",
  Heart = "heart",
  Free = "free",
}

const drawTriangle = (
  ctx: Context,
  canvasHeight: number,
  canvasWidth: number
) => {
  const cornerRadius = canvasWidth / 12;

  ctx.beginPath();
  ctx.moveTo(canvasWidth / 4, (canvasHeight - canvasHeight / 10) / 2);
  ctx.arcTo(
    canvasWidth / 2,
    0,
    canvasWidth - cornerRadius / 2,
    canvasHeight - canvasHeight / 10,
    cornerRadius
  );
  ctx.arcTo(
    canvasWidth,
    canvasHeight - canvasHeight / 10,
    0,
    canvasHeight - canvasHeight / 10,
    cornerRadius
  );
  ctx.arcTo(
    0,
    canvasHeight - canvasHeight / 10,
    canvasWidth / 4,
    canvasHeight / 2,
    cornerRadius
  );
  ctx.closePath();
};

const drawSquare = (
  ctx: Context,
  canvasHeight: number,
  canvasWidth: number
) => {
  const cornerRadius = canvasWidth / 12;
  const paddingX = canvasWidth / 10;
  const paddingY = canvasHeight / 10;

  ctx.beginPath();
  ctx.moveTo(paddingX, canvasHeight / 2);
  ctx.arcTo(paddingX, paddingY, canvasWidth / 2, paddingY, cornerRadius);
  ctx.arcTo(
    canvasWidth - paddingX,
    paddingY,
    canvasWidth - paddingX,
    canvasHeight / 2,
    cornerRadius
  );
  ctx.arcTo(
    canvasWidth - paddingX,
    canvasHeight - paddingY,
    canvasWidth / 2,
    canvasHeight - paddingY,
    cornerRadius
  );
  ctx.arcTo(
    paddingX,
    canvasHeight - paddingY,
    paddingX,
    canvasHeight / 2,
    cornerRadius
  );
  ctx.closePath();
};

const drawCircle = (
  ctx: Context,
  canvasHeight: number,
  canvasWidth: number
) => {
  ctx.beginPath();
  ctx.arc(
    canvasWidth / 2,
    canvasHeight / 2,
    (canvasWidth + canvasHeight) / 5,
    0,
    Math.PI * 2,
    true
  );
  ctx.closePath();
};

const drawHeart = (ctx: Context, canvasHeight: number, canvasWidth: number) => {
  const centerX = canvasWidth / 2;
  const heartCenter = canvasHeight / 4;
  const radius = heartCenter;

  ctx.beginPath();
  ctx.arc(
    centerX - (heartCenter - heartCenter / 4),
    heartCenter + canvasHeight / 10,
    radius,
    Math.PI,
    0
  );
  ctx.arc(
    centerX + (heartCenter - heartCenter / 4),
    heartCenter + canvasHeight / 10,
    radius,
    Math.PI,
    0
  );
  ctx.moveTo(canvasWidth / 16, heartCenter + canvasHeight / 10);
  ctx.quadraticCurveTo(
    canvasWidth / 20,
    heartCenter + canvasHeight / 3,
    canvasWidth / 2,
    canvasHeight - canvasHeight / 10
  );
  ctx.quadraticCurveTo(
    canvasWidth - canvasWidth / 20,
    heartCenter + canvasHeight / 3,
    canvasWidth - canvasWidth / 16,
    heartCenter + canvasHeight / 10
  );
  ctx.closePath();
};

export const drawShape = (
  shape: Shape,
  ctx: Context,
  canvasHeight: number,
  canvasWidth: number
) => {
  switch (shape) {
    case Shape.Triangle:
      return drawTriangle(ctx, canvasHeight, canvasWidth);
    case Shape.Square:
      return drawSquare(ctx, canvasHeight, canvasWidth);
    case Shape.Circle:
      return drawCircle(ctx, canvasHeight, canvasWidth);
    case Shape.Heart:
      return drawHeart(ctx, canvasHeight, canvasWidth);
  }
};
