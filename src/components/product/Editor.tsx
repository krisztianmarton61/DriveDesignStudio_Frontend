import React, { RefObject, useEffect, useRef, useState } from "react";
import Konva from "konva";
import style from "./Editor.module.scss";
import { Slider } from "@mui/material";
import { Shape, drawShape } from "./ImageEditorFunctions";
import { KonvaEventListener, KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import MarchingSquaresOpt from "./MarchingSquares";
import { Context } from "konva/lib/Context";
import { useSignals } from "@preact/signals-react/runtime";
import { Signal } from "@preact/signals-react";
import { removeBackground } from "../../services";
import { setImage } from "../../states";

type EditorProps = {
  image: Signal<string>;
  onSave: (image: string) => void;
  step: "shape selection" | "text selection" | "remove background";
  onCLose: () => void;
};

const fontOptions = [
  "Arial",
  "Courier New",
  "Garamond",
  "Comic Sans MS",
  "Arial Black",
  "Impact",
  "Geneva",
  "Papyrus",
  "Brush Script MT",
  "Roboto",
];

const colorOptions = [
  "#ffffff",
  "#000000",
  "#4782c2",
  "#79e8cc",
  "#1e8003",
  "#f2e444",
  "#b00000",
  "#ed7a4c",
];

export const Editor: React.FC<EditorProps> = ({
  image,
  onSave,
  step,
  onCLose,
}) => {
  useSignals();

  const [removeBackgroundLoading, setRemoveBackgroundLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isTransparentBackgroundSelected, setIsTransparentBackgroundSelected] =
    useState(false);
  const [workImage, setWorkImage] = useState<string | null>(null);
  const [imageWithTransparentBackground, setImageWithTransparentBackground] =
    useState<string | null>(null);

  const [stage, setStage] = useState<Konva.Stage | null>(null);
  const [workLayer, setWorkLayer] = useState<Konva.Layer | null>(null);
  const [topLayer, setTopLayer] = useState<Konva.Layer | null>(null);

  const [topShape, setTopShape] = useState<Konva.Shape>();
  const [topLine, setTopLine] = useState<Konva.Line>();
  const [workShape, setWorkShape] = useState<Konva.Shape>();
  const [workLine, setWorkLine] = useState<Konva.Line | null>();

  const [selectedTextNode, setSelectedTextNode] = useState<
    Konva.Text | undefined
  >();
  const [konvaImage, setKonvaImage] = useState<Konva.Image | null>(null);
  const [selectedKonvaImage, setSelectedKonvaImage] = useState<
    Konva.Image | undefined
  >();
  const [selectedFont, setSelectedFont] = useState<string>("Arial");
  const [fontWeight, setFontWeight] = useState<number>(400);
  const [fontSize, setFontSize] = useState<number>(32);
  const [fontColor, setFontColor] = useState<string>("#000000");
  const [selectedShape, setSelectedShape] = useState<Shape>(Shape.Square);

  const resetStates = () => {
    setSelectedTextNode(undefined);
    setSelectedKonvaImage(undefined);
    setSelectedFont("Arial");
    setFontWeight(400);
    setFontSize(32);
    setFontColor("#000000");
    setSelectedShape(Shape.Square);
    setImage("");
    setImageWithTransparentBackground(null);
    setWorkImage(null);
    setKonvaImage(null);
    setWorkLayer(null);
    setTopLayer(null);
    setTopShape(undefined);
    setTopLine(undefined);
    setWorkShape(undefined);
    setWorkLine(null);
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFont(e.target.value);
  };

  const handleFontWeightChange = (_e: Event, value: number | number[]) => {
    setFontWeight(value as number);
  };

  const handleFontSizeChange = (_e: Event, value: number | number[]) => {
    setFontSize(value as number);
  };

  const handleSelectedShapeChange = (shape: Shape) => {
    setSelectedShape(shape);
  };

  const saveImage = () => {
    if (workLayer && stage && workShape) {
      if (selectedShape !== Shape.Free) {
        workLayer.clipFunc(function (ctx) {
          ctx.beginPath();
          workShape.sceneFunc()(ctx as unknown as Context, workShape);
          ctx.clip("evenodd");
        });
      }

      const dataURL = workLayer.toDataURL({ pixelRatio: 2 });
      onSave(dataURL);
    }
  };

  const createTextNodeFromTextArea = (
    textarea: HTMLTextAreaElement,
    containerRef: RefObject<HTMLDivElement>
  ) => {
    if (workLayer && stage) {
      const rotationRegex = /rotateZ\((-?\d+(\.\d+)?)deg\)/;
      const rotationMatch = textarea.style
        .getPropertyValue("transform")
        .match(rotationRegex);
      const rotation = rotationMatch ? parseFloat(rotationMatch[1]) : 0;
      if (textarea.value !== "") {
        const textNode = new Konva.Text({
          text: textarea.value,
          width: textarea.offsetWidth,
          align: textarea.style.textAlign,
          y: textarea.offsetTop,
          x: textarea.offsetLeft,
          fontSize: parseInt(textarea.style.fontSize),
          fontStyle: textarea.style.fontStyle,
          fontFamily: textarea.style.fontFamily,
          fill: textarea.style.color,
          draggable: true,
          rotation: rotation,
        });

        workLayer.add(textNode);

        textNode.on("click tap", () => {
          setSelectedTextNode(textNode);
        });

        textNode.on("dblclick dbltap", () => {
          textNode.hide();

          const textarea = createTextAreaFromTextNode(
            textNode,
            stage,
            containerRef
          );

          const textareaEnterPress = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
              if (/\S/.test(textarea.value)) {
                textNode.text(textarea.value);
                removeTextarea();
              }

              textarea.parentNode?.parentNode?.removeChild(textarea.parentNode);
              window.removeEventListener("click", handleOutsideClick);
            }
          };

          const removeTextarea = () => {
            textarea.parentNode?.parentNode?.removeChild(textarea.parentNode);
            window.removeEventListener("click", handleOutsideClick);
            textNode.show();
          };

          const handleOutsideClick = (e: MouseEvent) => {
            if (e.target !== textarea) {
              if (/\S/.test(textarea.value)) {
                textNode.text(textarea.value);
              } else {
                textNode.remove();
              }
              removeTextarea();
            }
          };
          setTimeout(() => {
            window.addEventListener("click", handleOutsideClick);
            textarea.addEventListener("keydown", textareaEnterPress);
          });
        });
      }
    }
  };

  const createTextAreaFromTextNode = (
    textNode: Konva.Text,
    stage: Konva.Stage,
    containerRef: RefObject<HTMLDivElement>
  ) => {
    const areaPosition = {
      x: textNode.x(),
      y: textNode.y(),
    };

    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = stage.width() + "px";
    div.style.height = stage.height() + "px";
    div.style.transform = "translateY(-100%)";
    div.style.display = "flex";

    containerRef.current?.appendChild(div);

    const textarea = document.createElement("textarea");
    div.appendChild(textarea);

    function textAreaAdjust(element: HTMLTextAreaElement) {
      element.style.height = "1px";
      element.style.height = 25 + element.scrollHeight + "px";
    }

    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.width = textNode.width() * textNode.scaleX() + "px";
    textarea.style.height = textNode.height() * textNode.scaleY() + "px";
    textarea.style.fontSize = textNode.fontSize() + "px";
    textarea.style.lineHeight = textNode.lineHeight().toString();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.transformOrigin = "left top";
    textarea.style.minWidth = "100px";
    textarea.style.maxWidth = "500px";
    textarea.style.overflowY = "hidden";
    textarea.rows = 1;
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    textarea.onkeydown = () => textAreaAdjust(textarea);

    textarea.style.border = 1 + "px dashed #76abae";
    const rotation = textNode.rotation();

    let transform = "";
    if (rotation) {
      transform += "rotateZ(" + rotation + "deg)";
    }
    let px = 0;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += "translateY(-" + px + "px)";

    textarea.style.transform = transform;

    textarea.focus();

    return textarea;
  };

  const createTextArea = (
    stage: Konva.Stage,
    containerRef: RefObject<HTMLDivElement>
  ) => {
    setSelectedTextNode(undefined);
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = stage.width() + "px";
    div.style.height = stage.height() + "px";
    div.style.transform = "translateY(-100%)";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";

    containerRef.current?.appendChild(div);

    const textarea = document.createElement("textarea");
    div.appendChild(textarea);

    function textAreaAdjust(element: HTMLTextAreaElement) {
      element.style.height = "1px";
      element.style.height = 25 + element.scrollHeight + "px";
    }

    textarea.style.position = "absolute";
    textarea.style.fontSize = "32px";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.lineHeight = "32px";
    textarea.style.fontFamily = 'Arial, "sans-serif"';
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = "center";
    textarea.style.color = "black";
    textarea.style.minWidth = "100px";
    textarea.style.maxWidth = "500px";
    textarea.style.overflowY = "hidden";
    textarea.rows = 1;
    textarea.onkeydown = () => textAreaAdjust(textarea);

    textarea.style.border = 1 + "px dashed #76abae";

    textarea.focus();

    return textarea;
  };

  useEffect(() => {
    if (workLayer && topLayer && selectedShape) {
      if (workShape) workShape.destroy();
      if (workLine) workLine.destroy();
      if (topShape) topShape.destroy();
      if (topLine) topLine.destroy();
      workLayer.batchDraw();

      const handleShapeDraw = () => {
        if (selectedShape === Shape.Free) {
          konvaImage?.listening(false);
          workLayer.batchDraw();
          const width = workLayer.width();
          const height = workLayer.height();
          const pixelRatio = workLayer.canvas.getPixelRatio();
          const data = workLayer
            .getContext()
            .getImageData(0, 0, width * pixelRatio, height * pixelRatio).data;

          const outlinePoints = MarchingSquaresOpt.getBlobOutlinePoints(
            data,
            width,
            height,
            pixelRatio
          );

          const shape = new Konva.Shape({
            sceneFunc: function (context) {
              context.beginPath();
              context.moveTo(outlinePoints[0], outlinePoints[1]);
              for (let i = 2; i < outlinePoints.length; i += 2) {
                context.lineTo(outlinePoints[i], outlinePoints[i + 1]);
              }
              context.closePath();
              context.fillStyle = "white";
              context.fill();
            },
          });

          const line = new Konva.Line({
            points: outlinePoints,
            stroke: "white",
            strokeWidth: 30,
            tension: 0.05,
            closed: true,
            shadowBlur: 10,
            shadowColor: "black",
            shadowOpacity: 1,
          });

          const lineFilled = line.clone();
          const shapeFilled = shape.clone();

          setWorkLine(lineFilled);

          line.globalCompositeOperation("destination-out");
          shape.globalCompositeOperation("destination-out");

          workLayer.add(shapeFilled);
          workLayer.add(lineFilled);
          shapeFilled.zIndex(0);
          lineFilled.zIndex(0);

          topLayer.add(line);
          topLayer.add(shape);
          setTopShape(shape);
          setWorkShape(shapeFilled);
          setTopLine(line);

          workLayer.batchDraw();
        } else {
          const shape = new Konva.Shape({
            sceneFunc: (context) => {
              context.beginPath();
              drawShape(selectedShape, context, 500, 500);
              context.closePath();
              context.fillStyle = "white";
              context.fill();
              context.strokeStyle = "white";
              context.lineWidth = 20;
              context.stroke();
            },
          });

          konvaImage?.listening(true);

          const line = new Konva.Line({
            sceneFunc: (context) => {
              context.beginPath();
              drawShape(selectedShape, context, 500, 500);
              context.closePath();
              context.strokeStyle = "white";
              context.lineWidth = 20;
              context.stroke();
            },
          });
          const lineFilled = line.clone();
          const shapeFilled = shape.clone();

          setWorkLine(lineFilled);
          setWorkShape(shapeFilled);

          line.globalCompositeOperation("destination-out");
          shape.globalCompositeOperation("destination-out");

          workLayer.add(shapeFilled);
          workLayer.add(lineFilled);
          shapeFilled.zIndex(0);
          lineFilled.zIndex(2);

          topLayer.add(line);
          topLayer.add(shape);
          setTopShape(shape);
          setTopLine(line);
          workLayer.batchDraw();
        }
      };

      setTimeout(handleShapeDraw, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workLayer, selectedShape, topLayer, workImage]);

  useEffect(() => {
    if (selectedTextNode) {
      setSelectedFont(selectedTextNode.fontFamily());
      setFontSize(selectedTextNode.fontSize());
      setFontColor(selectedTextNode.fill());
    }
  }, [selectedTextNode, setFontColor, setFontSize, setSelectedFont]);

  useEffect(() => {
    if (selectedTextNode) {
      selectedTextNode.fontFamily(selectedFont);
      workLayer?.batchDraw();
    }
  }, [selectedFont, selectedTextNode, workLayer]);

  useEffect(() => {
    if (selectedTextNode) {
      selectedTextNode.fontStyle(fontWeight.toString());
      workLayer?.batchDraw();
    }
  }, [fontWeight, selectedTextNode, workLayer]);

  useEffect(() => {
    if (selectedTextNode) {
      selectedTextNode.fontSize(fontSize);
      workLayer?.batchDraw();
    }
  }, [fontSize, selectedTextNode, workLayer]);

  useEffect(() => {
    if (selectedTextNode) {
      selectedTextNode.fill(fontColor);
      workLayer?.batchDraw();
    }
  }, [fontColor, selectedTextNode, workLayer]);

  useEffect(() => {
    if (selectedTextNode && stage) {
      selectedTextNode.off("click tap");
      return () => {
        selectedTextNode.on("click tap", () => {
          setSelectedTextNode(selectedTextNode);
        });
      };
    }
  }, [selectedTextNode, workLayer, stage, setSelectedTextNode]);

  useEffect(() => {
    if (selectedTextNode && workLayer && stage) {
      const tr = new Konva.Transformer({
        nodes: [selectedTextNode],
        borderStroke: "#76abae",
        anchorStroke: "#76abae",
        anchorFill: "white",
        anchorCornerRadius: 3,
        anchorSize: 10,
        keepRatio: true,
        rotationSnaps: [0, 90, 180, 270],
        borderDash: [3, 2],
      });

      workLayer.add(tr);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          (e.key === "Delete" || e.key === "Backspace") &&
          selectedTextNode.isVisible()
        ) {
          selectedTextNode.remove();
          tr.destroy();
          setSelectedTextNode(undefined);
        }
      };

      const stageOutsideClick: KonvaEventListener<Stage, MouseEvent> = (e) => {
        const konvaEvent = e as KonvaEventObject<MouseEvent>;
        if (konvaEvent.target !== selectedTextNode) {
          setSelectedTextNode(undefined);
        }
      };

      stage.on("click", stageOutsideClick);

      const updateTransformerVisibility = () => {
        tr.visible(selectedTextNode.isVisible());
        workLayer.batchDraw();
      };

      selectedTextNode.on("visibleChange", updateTransformerVisibility);
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        selectedTextNode.off("visibleChange", updateTransformerVisibility);
        stage.off("click", stageOutsideClick);
        tr.destroy();
      };
    }
  }, [selectedTextNode, workLayer, stage, setSelectedTextNode]);

  useEffect(() => {
    if (selectedKonvaImage && workLayer && stage) {
      const tr = new Konva.Transformer({
        nodes: [selectedKonvaImage],
        borderStroke: "#76abae",
        anchorStroke: "#76abae",
        anchorFill: "white",
        anchorCornerRadius: 3,
        anchorSize: 10,
        keepRatio: true,
        rotationSnaps: [0, 90, 180, 270],
        borderDash: [3, 2],
        enabledAnchors: [
          "top-left",
          "top-right",
          "bottom-left",
          "bottom-right",
        ],
      });

      workLayer.add(tr);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Delete" || e.key === "Backspace") {
          selectedKonvaImage.remove();
          tr.destroy();
          setSelectedKonvaImage(undefined);
        } else if (e.key === "Escape") {
          tr.destroy();
          setSelectedKonvaImage(undefined);
        }
      };

      const stageOutsideClick: KonvaEventListener<Stage, MouseEvent> = (e) => {
        const konvaEvent = e as KonvaEventObject<MouseEvent>;
        if (konvaEvent.target !== selectedKonvaImage) {
          setSelectedKonvaImage(undefined);
        }
      };

      const windowOutsideClick = (e: MouseEvent) => {
        if (!stage.container().contains(e.target as Node)) {
          setSelectedKonvaImage(undefined);
        }
      };

      stage.on("click", stageOutsideClick);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("click", windowOutsideClick);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("click", windowOutsideClick);
        stage.off("click", stageOutsideClick);
        tr.destroy();
      };
    }
  }, [selectedKonvaImage, workLayer, stage, setSelectedKonvaImage]);

  useEffect(() => {
    const stage = new Konva.Stage({
      container: "container",
      width: 500,
      height: 500,
    });

    const layer = new Konva.Layer({});

    const shapeLayer = new Konva.Layer({
      listening: false,
    });

    const patternRect = new Konva.Rect({
      width: 10,
      height: 10,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 10, y: 10 },
      fillLinearGradientColorStops: [
        0,
        "rgba(0,0,0,0.2)",
        0.5,
        "rgba(255,255,255,0.5)",
        1,
        "rgba(0,0,0,0.2)",
      ],
    });

    patternRect.toImage({
      width: 10,
      height: 10,
      callback: function (img) {
        const rectange = new Konva.Rect({
          width: 500,
          height: 500,
          fillPatternImage: img,
          fillPatternRepeat: "repeat",
        });

        shapeLayer.add(rectange);
      },
    });

    stage.add(layer);
    stage.add(shapeLayer);

    setTopLayer(shapeLayer);
    setStage(stage);
    setWorkLayer(layer);
  }, [setWorkLayer, setStage]);

  useEffect(() => {
    if (workLayer && stage && workImage) {
      const imageTmp = new Image();
      imageTmp.src = workImage;
      imageTmp.onload = function () {
        const originalWidth = imageTmp.width;
        const originalHeight = imageTmp.height;

        const newWidth = 400;
        const newHeight = (originalHeight * newWidth) / originalWidth;

        const newKonvaImage = new Konva.Image({
          image: imageTmp,
          width: 400,
          height: newHeight,
          draggable: true,
          x: 50,
          y: 50,
        });

        if (konvaImage) {
          konvaImage.destroy();
        }

        newKonvaImage.on("click tap", () => {
          setSelectedKonvaImage(newKonvaImage);
        });

        workLayer.add(newKonvaImage);
        newKonvaImage.setZIndex(1);
        workLayer.batchDraw();
        setKonvaImage(newKonvaImage);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workImage, workLayer, stage]);

  useEffect(() => {
    if (imageWithTransparentBackground) {
      setWorkImage(imageWithTransparentBackground);
    }
  }, [imageWithTransparentBackground]);

  useEffect(() => {
    if (image.value) {
      setWorkImage(image.value);
      setImageWithTransparentBackground(null);
    }
  }, [image.value]);

  const addText = () => {
    if (workLayer && stage) {
      const textarea = createTextArea(stage, containerRef);

      const textareaEnterPress = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          if (/\S/.test(textarea.value))
            createTextNodeFromTextArea(textarea, containerRef);
          textarea.parentNode?.parentNode?.removeChild(textarea.parentNode);
          window.removeEventListener("click", textareaOutsideClick);
        }
      };

      const textareaOutsideClick = (e: MouseEvent) => {
        if (e.target !== textarea) {
          if (/\S/.test(textarea.value))
            createTextNodeFromTextArea(textarea, containerRef);
          textarea.parentNode?.parentNode?.removeChild(textarea.parentNode);
          window.removeEventListener("click", textareaOutsideClick);
        }
      };

      setTimeout(() => {
        window.addEventListener("click", textareaOutsideClick);
      });

      textarea.addEventListener("keydown", textareaEnterPress);
    }
  };

  const removeImageBackground = async () => {
    const newImage = await removeBackground(
      image.value,
      setRemoveBackgroundLoading,
      () => {}
    );

    if (newImage) {
      setImageWithTransparentBackground(newImage);
    }
  };

  return (
    <div className={style["editor-outside-container"]}>
      <div className={style["editor-container"]}>
        <div className={style["editor-canvas-container"]}>
          <div
            id="container"
            className={style["editor"]}
            ref={containerRef}
          ></div>
          {removeBackgroundLoading && (
            <div className={style["loading-container"]}>
              <div className={style["loading-dots"]}>
                <span className={style["dot"]}></span>
                <span className={style["dot"]}></span>
                <span className={style["dot"]}></span>
                <span className={style["dot"]}></span>
              </div>
              <p>
                Removing background, it usually takes between 10 and 25 seconds!
              </p>
            </div>
          )}
        </div>
        {step === "text selection" && (
          <div className={style["text-settings"]}>
            <button className={style["secondary"]} onClick={addText}>
              Add Text
            </button>

            {selectedTextNode && (
              <>
                <select
                  onChange={handleFontChange}
                  value={selectedFont}
                  className={style["select-input"]}
                >
                  {fontOptions.map((font, index) => (
                    <option
                      key={index}
                      value={font}
                      style={{ fontFamily: font }}
                      className={style["select-input-option"]}
                    >
                      {font}
                    </option>
                  ))}
                </select>
                <div className={style["color-select-container"]}>
                  <div className={style["color-select-top"]}>
                    {colorOptions.map((color, index) => (
                      <div
                        key={index}
                        style={{ display: "inline-block", marginRight: "5px" }}
                      >
                        <div
                          style={{
                            backgroundColor: color,
                            width: fontColor === color ? "8px" : "14px",
                            height: fontColor === color ? "8px" : "14px",
                            border: `${color === fontColor ? 5 : 2}px solid ${color === "#ffffff" ? "#919190" : "#ffffff"}`,
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setFontColor(color);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className={style["color-select-bottom"]}>
                    <input
                      style={{
                        width: "100%",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      type="color"
                      value={fontColor}
                      onChange={(e) => setFontColor(e.target.value)}
                    />
                  </div>
                </div>
                <Slider
                  size="small"
                  defaultValue={400}
                  min={100}
                  max={900}
                  step={100}
                  aria-label="Small"
                  valueLabelDisplay="off"
                  color="success"
                  onChange={handleFontWeightChange}
                />
                <Slider
                  size="small"
                  defaultValue={32}
                  min={16}
                  max={112}
                  step={2}
                  aria-label="Small"
                  valueLabelDisplay="off"
                  color="success"
                  onChange={handleFontSizeChange}
                />
              </>
            )}
          </div>
        )}
        {step === "remove background" && (
          <div className={style["shape-select-container"]}>
            <div
              className={`${style["select"]} ${
                !isTransparentBackgroundSelected ? style["selected"] : ""
              }`}
              onClick={() => {
                setWorkImage(image.value);
                setIsTransparentBackgroundSelected(false);
              }}
            >
              <img
                className={style["image"]}
                src="/car.png"
                alt="dont remove background"
                onClick={() => {}}
              />
              <div className={style["overlay"]}></div>
            </div>
            <div
              className={`${style["select"]} ${
                isTransparentBackgroundSelected ? style["selected"] : ""
              }`}
              onClick={() => {
                if (imageWithTransparentBackground) {
                  setWorkImage(imageWithTransparentBackground);
                } else {
                  removeImageBackground();
                }
                setIsTransparentBackgroundSelected(true);
              }}
            >
              <img
                className={style["image"]}
                src="/car-nobg.png"
                alt="remove background"
                onClick={() => {}}
              />
              <div className={style["overlay"]}></div>
            </div>
          </div>
        )}
        {step === "shape selection" && (
          <div className={style["shape-select-container"]}>
            <div className={style["shape-select"]}>
              <div>
                <img
                  className={style["shape-select-item"]}
                  src="/circle.png"
                  alt="circle"
                  onClick={() => handleSelectedShapeChange(Shape.Circle)}
                />
              </div>
            </div>
            <div className={style["shape-select"]}>
              <div>
                <img
                  className={style["shape-select-item"]}
                  src="/square.png"
                  alt="square"
                  onClick={() => handleSelectedShapeChange(Shape.Square)}
                />
              </div>
            </div>
            <div className={style["shape-select"]}>
              <div>
                <img
                  className={style["shape-select-item"]}
                  src="/triangle.png"
                  alt="triangle"
                  onClick={() => handleSelectedShapeChange(Shape.Triangle)}
                />
              </div>
            </div>
            <div className={style["shape-select"]}>
              <div>
                <img
                  className={style["shape-select-item"]}
                  src="/custom.png"
                  alt="star"
                  onClick={() => {
                    handleSelectedShapeChange(Shape.Free);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {step === "text selection" && (
        <div className={style["button-container"]}>
          <button
            className={style["primary"]}
            onClick={() => {
              resetStates();
              saveImage();
            }}
          >
            Accept
          </button>
          <button
            onClick={() => {
              resetStates();
              onCLose();
            }}
            className={style["secondary"]}
          >
            Discard
          </button>
        </div>
      )}
    </div>
  );
};
