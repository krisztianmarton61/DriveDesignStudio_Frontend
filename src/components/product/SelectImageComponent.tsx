import React, { useRef } from "react";
import style from "./SelectImageComponent.module.scss";
import {
  setAlert,
  AlertType,
  IStyle,
  setImageStyle,
  imageStyle,
} from "../../states";
import { Buffer } from "buffer";
import { Explore } from "./Explore";
import { generateImage } from "../../services";
import {
  image,
  setImage,
  prompt,
  setPrompt,
  setLoadingOpen,
} from "../../states";
import { useSignals } from "@preact/signals-react/runtime";

enum Tab {
  Generate,
  Upload,
  Explore,
}

export const SelectImageComponent: React.FC = () => {
  useSignals();
  const [tab, setTab] = React.useState<Tab>(Tab.Generate);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitGenerate = async () => {
    if (!prompt) {
      setAlert({
        type: AlertType.Error,
        message: "Please enter text instructions",
      });
      return;
    }
    generateImage(
      {
        prompt: prompt.value,
        style: imageStyle.value,
      },
      setLoadingOpen,
      setImage,
      setAlert
    );
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const buffer = await file.arrayBuffer();
      const imageStr = Buffer.from(buffer).toString("base64");

      image.value = `data:image/jpeg;base64,${imageStr}`;
    }
  };

  return (
    <div className={style["designer-container"]}>
      <div className={style["settings"]}>
        <div className={style["tab-container"]}>
          <div
            className={`${style["tab"]} ${
              tab === Tab.Generate ? style["active"] : ""
            }`}
            onClick={() => setTab(Tab.Generate)}
          >
            Generate
          </div>
          <div
            className={`${style["tab"]} ${
              tab === Tab.Upload ? style["active"] : ""
            }`}
            onClick={() => setTab(Tab.Upload)}
          >
            Upload
          </div>
          <div
            className={`${style["tab"]} ${
              tab === Tab.Explore ? style["active"] : ""
            }`}
            onClick={() => setTab(Tab.Explore)}
          >
            Explore
          </div>
        </div>
        {tab === Tab.Generate && (
          <>
            <div className={style["title"]}>Describe the air freshener</div>
            <div>
              <div className={style["subtitle"]}>1. Choose style</div>
              <div className={style["choose-style-container"]}>
                <div
                  className={`${style["choose-style-item"]} ${imageStyle.value === undefined ? style["selected-style"] : ""}`}
                  onClick={() => setImageStyle(undefined)}
                >
                  <img src="/default.png" alt="style" />
                  <div className={style["style-name"]}>Default</div>
                </div>
                <div
                  className={`${style["choose-style-item"]} ${imageStyle.value === IStyle.Charcoal ? style["selected-style"] : ""}`}
                  onClick={() => setImageStyle(IStyle.Charcoal)}
                >
                  <img src="/charcoal.png" alt="style" />
                  <div className={style["style-name"]}>Charcoal</div>
                </div>
                <div
                  className={`${style["choose-style-item"]} ${imageStyle.value === IStyle.Acrylic ? style["selected-style"] : ""}`}
                  onClick={() => setImageStyle(IStyle.Acrylic)}
                >
                  <img src="/acrylic.png" alt="style" />
                  <div className={style["style-name"]}>Acrylic</div>
                </div>
                <div
                  className={`${style["choose-style-item"]} ${imageStyle.value === IStyle.OilPainting ? style["selected-style"] : ""}`}
                  onClick={() => setImageStyle(IStyle.OilPainting)}
                >
                  <img src="/oil.png" alt="style" />
                  <div className={style["style-name"]}>Oil Painting</div>
                </div>
                <div
                  className={`${style["choose-style-item"]} ${imageStyle.value === IStyle.Watercolor ? style["selected-style"] : ""}`}
                  onClick={() => setImageStyle(IStyle.Watercolor)}
                >
                  <img src="/watercolor.png" alt="style" />
                  <div className={style["style-name"]}>Watercolor</div>
                </div>

                <div
                  className={`${style["choose-style-item"]} ${imageStyle.value === IStyle.Pointillism ? style["selected-style"] : ""}`}
                  onClick={() => setImageStyle(IStyle.Pointillism)}
                >
                  <img src="/pointillism.png" alt="style" />
                  <div className={style["style-name"]}>Pointillism</div>
                </div>
              </div>
            </div>

            <div>
              <div className={style["subtitle"]}>2. Describe your thoughts</div>
              <textarea
                className={style["input"]}
                placeholder="Enter text instructions"
                value={prompt.value}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <button className={style["primary"]} onClick={handleSubmitGenerate}>
              Apply
            </button>
          </>
        )}
        {tab === Tab.Upload && (
          <>
            <div className={style["title"]}>Upload photo</div>
            <button
              className={style["primary"]}
              onClick={handleUploadButtonClick}
            >
              Choose file
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {/* {image.value && (
              <div className={style["uploaded-image-preview-container"]}>
                <img
                  className={style["uploaded-image"]}
                  src={image.value}
                  alt="uploaded"
                />
                <button
                  className={style["edit-image-button"]}
                  onClick={() => setEditorOpen(true)}
                >
                  Edit image
                </button>
              </div>
            )} */}
          </>
        )}
        {tab === Tab.Explore && (
          <div>
            <Explore />
          </div>
        )}
      </div>
    </div>
  );
};
