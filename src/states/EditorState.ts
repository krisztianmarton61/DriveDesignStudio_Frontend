import Konva from "konva";
import { RefObject, useState } from "react";
import { createContainer } from "unstated-next";
import { Shape } from "../components";

const Editor = () => {
  const [stage, setStage] = useState<Konva.Stage | null>(null);
  const [layer, setLayer] = useState<Konva.Layer | null>(null);

  const [selectedTextNode, setSelectedTextNode] = useState<
    Konva.Text | undefined
  >();
  const [selectedFont, setSelectedFont] = useState<string>("Arial");
  const [fontWeight, setFontWeight] = useState<number>(400);
  const [fontSize, setFontSize] = useState<number>(32);
  const [fontColor, setFontColor] = useState<string>("#000000");
  const [selectedShape, setSelectedShape] = useState<Shape>(Shape.Square);

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
    if (layer && stage) {
      /*const dataURL = stage.toDataURL();
      setEditedImage(dataURL);*/
    }
  };

  const createTextNodeFromTextArea = (
    textarea: HTMLTextAreaElement,
    containerRef: RefObject<HTMLDivElement>
  ) => {
    if (layer && stage) {
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

        layer.add(textNode);

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

  return {
    fontOptions,
    colorOptions,
    stage,
    setStage,
    layer,
    setLayer,
    selectedTextNode,
    setSelectedTextNode,
    selectedFont,
    setSelectedFont,
    fontWeight,
    setFontWeight,
    fontSize,
    setFontSize,
    fontColor,
    setFontColor,
    selectedShape,
    setSelectedShape,
    createTextArea,
    createTextNodeFromTextArea,
    createTextAreaFromTextNode,
    handleFontChange,
    handleFontWeightChange,
    handleFontSizeChange,
    handleSelectedShapeChange,
    saveImage,
  };
};

export const EditorState = createContainer(Editor);
