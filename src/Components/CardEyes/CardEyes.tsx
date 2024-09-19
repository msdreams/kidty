import React, { useEffect, useState } from "react";
import cn from "classnames";
import Slider from "react-input-slider";
import "./CardEyes.scss";
import { Eye } from "../../Shared/types";
import { eye, sliderWidth} from "../../Utils/kit";
import { EyesChart } from "../../Charts/EyesChart/EyesChart";

type Props = {
  data: Eye;
};

export const CardEyes: React.FC<Props> = ({ data }) => {

  const [activeParametrs, setActiveParametrs] = useState<Eye>(data);

  const [activeSlider, setActiveSlider] = useState(false);
  const [leftSliderValue, setLeftSliderValue] = useState({ x: data.left });
  const [rightSliderValue, setRightSliderValue] = useState({ x: data.right });

  useEffect(() => {
    setActiveParametrs(data);
  }, [data]);

  const saveData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }
    const newParametrs = {
      left: leftSliderValue.x,
      right: rightSliderValue.x
    };
  
    setActiveParametrs(newParametrs);
  };

  const handleEditClick = () => {
    setActiveSlider(true);
    if (activeParametrs) {
      setLeftSliderValue({ x: activeParametrs.left });
      setRightSliderValue({ x: activeParametrs.right});
    }
  };
  const handleCanсelClick = () => {
    setActiveSlider(false);
    if (activeParametrs) {
      setLeftSliderValue({ x: activeParametrs.left });
      setRightSliderValue({ x: activeParametrs.right});
    }
  };

  const handleApplyClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setActiveSlider(false);
    saveData(e);
  };

  return (
    <div className="eyes">
      <div className="eyes__top">
        <div className="eyes__top-leftBlock">
          <img src={eye} alt="eye" className="eyes__image"/>
          <p className="eyes__title">Зiр</p>
        </div>


        <div className="eyes__edit">
          {!activeSlider ? (
            <button className="card__button card__button-big edit-button" onClick={handleEditClick}>
              {" "}
              Редагувати
            </button>
          ) : (
            <div className="card__button--container">
              <button className="card__button" onClick={handleApplyClick}>
                {" "}
                Додати
              </button>

              <button
                className="card__button card__button--cansel"
                onClick={handleCanсelClick}
              >
                {" "}
                Скасувати
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="eyes__eyes">
        <div className="eyes__values">
        <p className="eyes__sign">Ліве око:</p>
        <p
          className={cn("eyes__value", {
            "eyes__value--activeLeft": activeSlider,
          })}
        >
          {activeSlider
            ? leftSliderValue.x
              : activeParametrs.left
            }
        </p>
        </div>

        {activeSlider && (
        <Slider
          axis="x"
          xmin={-10}
          xmax={10}
          x={leftSliderValue.x}
          onChange={({ x }) => setLeftSliderValue((state) => ({ ...state, x }))}
          styles={{
            track: {
              backgroundColor: "#ddd",
              height: "8px",
              width: "160px",
              borderRadius: "4px",
            },
            active: {
              backgroundColor: "#50C3F9",
            },
            thumb: {
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#50C3F9",
              boxShadow: "0px 0px 4px rgba(0,0,0,0.2)",
            },
          }}
          />
        )}
      </div>

      <div className="eyes__eyes">
        <div className="eyes__values">
          <p className="eyes__sign">Праве око:</p>
          <p
            className={cn("eyes__value", {
              "eyes__value--active": activeSlider,
            })}
          >
            {activeSlider
              ? rightSliderValue.x
              : activeParametrs.right
            }
          </p>
        </div>

        {activeSlider && (
        <Slider
          axis="x"
          xmin={-10}
          xmax={10}
          x={rightSliderValue.x}
          onChange={({ x }) => setRightSliderValue((state) => ({ ...state, x }))}
          styles={{
            track: {
              backgroundColor: "#ddd",
              height: "8px",
              width: "160px",
              borderRadius: "4px",
            },
            active: {
              backgroundColor: "#C88CF8",
            },
            thumb: {
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#C88CF8",
              boxShadow: "0px 0px 4px rgba(0,0,0,0.2)",
            },
          }}
          />
        )}
      </div>

      <div className="eyes__mobile-edit">
          {!activeSlider ? (
            <button className="eyes__button" onClick={handleEditClick}>
              {" "}
              Редагувати
            </button>
          ) : (
            <div className="eyes__button-container">
              <button className="eyes__button" onClick={handleApplyClick}>
                {" "}
                Додати
              </button>

              <button
                className="eyes__button eyes__button--cansel"
                onClick={handleCanсelClick}
              >
                {" "}
                Скасувати
              </button>
            </div>
          )}
      </div>

      <div className="eyes__chart">
        <EyesChart
          width={400}
          height={200}
          data={activeParametrs}
          sliderLeft={leftSliderValue.x}
          sliderRight={rightSliderValue.x}
        />
      </div>
    </div>
  );
};
