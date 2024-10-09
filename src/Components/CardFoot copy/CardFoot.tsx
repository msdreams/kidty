import React, { useEffect, useState } from "react";
import cn from "classnames";
import Slider from "react-input-slider";
import "./CardFoot.scss";
import { Data } from "../../Shared/types";
import { foot, months, sliderWidth} from "../../Utils/kit";
import { FootChart } from "../../Charts/FootLineChart/FootChart";

type Props = {
  data: Data[];
  years: string[];
  age?: number;
};

export const CardFoot: React.FC<Props> = ({ data, years }) => {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("ukr-GB", {
    year: "numeric",
    month: "long",
  });
  const todayMonth = formattedDate.split(" ")[0];

  const monthIndex = months.findIndex(
    (month) => month.toLowerCase() === todayMonth.toLowerCase()
  );

  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedMonth, setSelectedMonth] = useState(months[monthIndex]);
  const [newData, setNewdata] = useState<Data[]>(data);

  const currentData = newData.find(
    (d) => d.month === selectedMonth && d.year === selectedYear
  );

  const [activeParametrs, setActiveParametrs] = useState<Data | undefined>(
    currentData
  );

  useEffect(() => {
    setNewdata(data)
  }, [data])

  const currentIndex = newData.findIndex(d => d === activeParametrs)
  const maxValue = Math.max(...newData.slice(0, currentIndex).filter(d => d.value > 0).map(d => d.value));

  const [activeSlider, setActiveSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState({ x: maxValue });
  
  const reset = () => {
    setSliderValue({ x: 0 });
  };

  const saveData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }

    const newParametr: Data = {
      id: newData.length,
      year: selectedYear,
      month: selectedMonth,
      value: sliderValue.x,
    };

    if (currentData) {
      const updatedData = newData.map((d, i) => (
        d.id === currentData.id
          ? { ...d, value: sliderValue.x }
          : d
      ))
      setNewdata(updatedData)
    } else {
      setNewdata([...newData, newParametr]);
      setActiveParametrs(newParametr);
    }
    reset();
  };

  const handleEditClick = () => {
    setActiveSlider(true);
    if (activeParametrs) {
      setSliderValue({ x: activeParametrs.value === 0 ? maxValue : activeParametrs.value});
    }
  };
  const handleCanсelClick = () => {
    setActiveSlider(false);
    if (activeParametrs) {
      setSliderValue({ x: activeParametrs.value });
    }
  };

  const handleApplyClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setActiveSlider(false);
    saveData(e);
  };

  const handleMonthChenge = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
    const newParametr = newData.find(
      (d) => d.month === event.target.value && d.year === selectedYear
    );
    setActiveParametrs(newParametr);
    setActiveSlider(false);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
    const newParametr = newData.find(
      (d) => d.month === selectedMonth && d.year === event.target.value
    );
    setActiveParametrs(newParametr);
    setActiveSlider(false);
  };

  const HandleGraph = (d: Data) => {
    setActiveSlider(true);
    setSelectedMonth(d.month);
    setActiveParametrs(d);
    if (d.value !== 0) {
      setSliderValue({ x: d.value });
    } else {
      setSliderValue({ x: maxValue });
    }
  };


  const filteredData = newData.filter((d) => d.year === selectedYear);

  return (
    <div className="foot">
      <div className="foot__top">
        <div className="foot__top-leftBlock">
          <img src={foot} alt="foot" className="foot__image"/>
          <div className="foot__selectors">            
            <div className="foot__values">
              <p className="foot__title">Cтопa:</p>
              <p
                className={cn("foot__value", {
                  "foot__value--active": activeSlider,
                })}
              >
                {activeSlider
                  ? `${sliderValue.x}см`
                  : !activeParametrs ? `${maxValue}см` :`${activeParametrs?.value}см`}
              </p>
            </div>

            <select
              className="foot__select"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              className="foot__select"
              value={selectedMonth}
              onChange={handleMonthChenge}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={cn("foot__edit", {
          "foot__edit--active": activeSlider,
        })}>
          {activeSlider && (
            <Slider
              axis="x"
              xmin={4}
              xmax={40}
              x={sliderValue.x}
              onChange={({ x }) => setSliderValue((state) => ({ ...state, x }))}
              styles={{
                track: {
                  backgroundColor: "#ddd",
                  height: "8px",
                  width: sliderWidth,
                  borderRadius: "4px",
                },
                active: {
                  backgroundColor: "#FF5C9D",
                },
                thumb: {
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#FF5C9D",
                  boxShadow: "0px 0px 4px rgba(0,0,0,0.2)",
                },
              }}
              />
          )}
          {!activeSlider ? (
            <button className="card__button card__button-big edit-button" onClick={handleEditClick}>
              {" "}
              Редагувати
            </button>
          ) : (
            <div className="card__button--container">
              <button className="card__button" onClick={handleApplyClick}>
                Додати
              </button>

              <button
                className="card__button card__button--cansel"
                onClick={handleCanсelClick}
              >
                Скасувати
              </button>
            </div>
          )}
        </div>
      </div>

        <div className="foot__chart">        
          <FootChart
            width={400}
            height={200}
            data={filteredData}
            selectedMonth={selectedMonth}
            slider={sliderValue.x}
            HandleGraph={HandleGraph}
          />
        </div>
    </div>
  );
};
