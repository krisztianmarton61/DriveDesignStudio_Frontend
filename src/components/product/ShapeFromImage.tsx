import { useEffect, useRef, useState } from "react";
import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer"; // Add this import
import Konva from "konva";
import { Shape, drawShape } from "./ImageEditorFunctions";
import style from "./ShapeFromImage.module.scss";

interface ShapeFromImageProps {
  image: string;
  shape: Shape;
  onClick: () => void;
  width: number;
  height: number;
  id: string;
}

export const ShapeFromImage: React.FC<ShapeFromImageProps> = ({
  image,
  shape,
  onClick,
  width,
  height,
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [layer, setLayer] = useState<Layer | null>(null);

  useEffect(() => {
    const stage = new Stage({
      container: id,
      width: width,
      height: height,
    });

    const layer = new Layer();

    layer.clipFunc((ctx: CanvasRenderingContext2D) => {
      drawShape(shape, ctx, width, height);
    });

    stage.add(layer);

    setStage(stage);
    setLayer(layer);
  }, [height, id, setLayer, setStage, shape, width]);

  useEffect(() => {
    if (layer && stage) {
      const imageTmp = new Image();
      imageTmp.src = image;

      const konvaImage = new Konva.Image({
        image: imageTmp,
        width: width,
        height: height,
        draggable: false,
      });

      layer.add(konvaImage);
      layer.draw();
    }
  }, [height, image, layer, stage, width]);

  return (
    <div
      className={style["image-container"]}
      id={id}
      onClick={onClick}
      ref={containerRef}
    ></div>
  );
};
