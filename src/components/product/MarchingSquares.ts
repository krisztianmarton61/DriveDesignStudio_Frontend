interface Point {
  w: number;
  h: number;
}

interface MarchingSquaresOpt {
  next_step: number;
  getBlobOutlinePoints(
    source_array: Uint8ClampedArray | HTMLCanvasElement,
    width: number,
    height: number,
    pixelRatio: number
  ): number[];
  getFirstNonTransparentPixelTopDown(
    source_array: Uint8ClampedArray,
    width: number,
    height: number
  ): Point | null;
  walkPerimeter(
    source_array: Uint8ClampedArray,
    width: number,
    height: number,
    start_w: number,
    start_h: number,
    next_step: number,
    pixelRatio: number
  ): number[];
  step: (
    idx: number,
    source_array: Uint8ClampedArray,
    width: number,
    next_step: number
  ) => number;
}

const MarchingSquaresOpt: MarchingSquaresOpt = {
  next_step: 0,
  getBlobOutlinePoints(
    source_array: Uint8ClampedArray | HTMLCanvasElement,
    width: number,
    height: number,
    pixelRatio: number
  ): number[] {
    width = width * pixelRatio;
    height = height * pixelRatio;
    if (source_array instanceof HTMLCanvasElement) {
      width = source_array.width;
      height = source_array.height;
      const data4 = source_array
          .getContext("2d")
          ?.getImageData(0, 0, width, height).data,
        len = width * height,
        data = new Uint8ClampedArray(len);
      if (!data4) {
        return [];
      }
      for (let i = 0; i < len; ++i) {
        data[i] = data4[i << 2];
      }
      source_array = data;
    } else if (0 === height) {
      height = (source_array.length / width / 4) | 0;
    }

    const startingPoint = this.getFirstNonTransparentPixelTopDown(
      source_array,
      width,
      height
    );
    if (null === startingPoint) {
      console.log(
        "[Warning] Marching Squares could not find an object in the given array"
      );
      return [];
    }

    return this.walkPerimeter(
      source_array,
      width,
      height,
      startingPoint.w,
      startingPoint.h,
      this.next_step || 0,
      pixelRatio
    );
  },

  getFirstNonTransparentPixelTopDown(
    source_array: Uint8ClampedArray,
    width: number,
    height: number
  ): Point | null {
    let idx;
    for (let h = 0; h < height; ++h) {
      idx = (4 * h * width) | 0;
      for (let w = 0 | 0; w < width; ++w) {
        if (source_array[idx] > 0) {
          return { w: w, h: h };
        }
        idx += 4;
      }
    }
    return null;
  },

  walkPerimeter(
    source_array: Uint8ClampedArray,
    width: number,
    height: number,
    start_w: number,
    start_h: number,
    next_step: number,
    pixelRatio: number
  ): number[] {
    width = width | 0;
    height = height | 0;

    const point_list: number[] = [],
      up = 1,
      left = 2,
      down = 3,
      right = 4;

    let idx = 0,
      w = start_w,
      h = start_h;

    do {
      idx = (h - 1) * 4 * width + (w - 1) * 4;
      next_step = this.step(idx, source_array, width, next_step);

      if (w >= 0 && w < width && h >= 0 && h < height) {
        point_list.push((w - 1) / pixelRatio, h / pixelRatio);
      }

      switch (next_step) {
        case up:
          --h;
          break;
        case left:
          --w;
          break;
        case down:
          ++h;
          break;
        case right:
          ++w;
          break;
        default:
          break;
      }
    } while (w !== start_w || h !== start_h);

    point_list.push(w / pixelRatio, h / pixelRatio);

    return point_list;
  },

  step(
    idx: number,
    source_array: Uint8ClampedArray,
    width: number,
    next_step: number
  ): number {
    const up_left = 0 < source_array[idx + 4],
      up_right = 0 < source_array[idx + 8],
      down_left = 0 < source_array[idx + (width + 1) * 4],
      down_right = 0 < source_array[idx + (width + 2) * 4],
      none = 0,
      up = 1,
      left = 2,
      down = 3,
      right = 4;

    let state = 0;

    if (up_left) {
      state |= 1;
    }
    if (up_right) {
      state |= 2;
    }
    if (down_left) {
      state |= 4;
    }
    if (down_right) {
      state |= 8;
    }

    switch (state) {
      case 1:
        next_step = up;
        break;
      case 2:
        next_step = right;
        break;
      case 3:
        next_step = right;
        break;
      case 4:
        next_step = left;
        break;
      case 5:
        next_step = up;
        break;
      case 6:
        if (next_step == up) {
          next_step = left;
        } else {
          next_step = right;
        }
        break;
      case 7:
        next_step = right;
        break;
      case 8:
        next_step = down;
        break;
      case 9:
        if (next_step == right) {
          next_step = up;
        } else {
          next_step = down;
        }
        break;
      case 10:
        next_step = down;
        break;
      case 11:
        next_step = down;
        break;
      case 12:
        next_step = left;
        break;
      case 13:
        next_step = up;
        break;
      case 14:
        next_step = left;
        break;
      default:
        next_step = none;
        break;
    }
    return next_step;
  },
};

export default MarchingSquaresOpt;
