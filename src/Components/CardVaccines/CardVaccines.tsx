import React, { useEffect, useState } from "react";
import { vaccine, vaccinesSelect } from "../../Utils/kit";
import { parse } from 'date-fns';
import "./CardVaccines.scss";
import { Child, VaccineData } from "../../Shared/types";
import { VaccinesChart } from "../../Charts/VaccinesChart/VaccinesChart";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseDate } from "../../Shared/hendlers/parseDate";
import { VaccinesMobile } from "../../Charts/VaccinesChartMobile/VaccinesMobile";

type Props = {
  data: VaccineData[];
  years: string[];
  age?: number;
  child: Child;
};

export const CardVaccines: React.FC<Props> = ({ data, child }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedVaccine, setSelectedVaccine] = useState(vaccinesSelect[0]);
  const [activeVaccine, setActiveVaccine] = useState<VaccineData | null>(null);
  const [newData, setNewdata] = useState<VaccineData[]>(data);
  const [activeBatton, setActiveButton] = useState(false);
  const [newParametrs, setNewParametrs] = useState<VaccineData | null>(null);

  const formattedDate = startDate.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  useEffect(() => {
    setNewdata(data)
  }, [data])

  const updateVaccines = (newVaccine: VaccineData, currentVaccines: VaccineData[]) : VaccineData[] => {
    let newSetOfVaccines;
    const clone = currentVaccines.find(d => d.date === newVaccine.date && d.type === newVaccine.type)
    if (!clone) {
      newSetOfVaccines = [...currentVaccines, newVaccine]
        .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
        .map((v, i) => ({...v, orderNumber: i + 1}));
    } else {
      newSetOfVaccines = currentVaccines;
    }
    return newSetOfVaccines;
  }

  const saveData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }
    const newParametrs: VaccineData = {
      type: selectedVaccine,
      orderNumber: 0,
      date: formattedDate,
    };
    if (activeVaccine) {
      setNewdata(currentData => 
        currentData.map(v => 
          v === activeVaccine ? {...v, date: formattedDate} : v
        )
      );
    } else {
      setNewdata((currentData: VaccineData[]) => {
        const filteredNewTypeVaccines = currentData.filter(v => v.type === newParametrs.type)
        const filteredVaccinesWithoutNewType = currentData.filter(v => v.type !== newParametrs.type)
        const newSetOfVaccines = updateVaccines(newParametrs, filteredNewTypeVaccines)
        return [...filteredVaccinesWithoutNewType, ...newSetOfVaccines]
      });
    }

      setNewParametrs(newParametrs);
      setActiveVaccine(null);
      setSelectedVaccine(vaccinesSelect[0])
      setStartDate(new Date())
  };

  const handleVaccineChenge = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVaccine(event.target.value);
  };

  const handleEditClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setActiveButton(true);
    setNewParametrs(null);
  };

  const handleApplyClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    saveData(e);
    setActiveButton(false);
  };

  const handleRemoveClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {

  setNewdata(currentData => {
    const newSetOfVaccines = currentData
      .filter(v => v.type === activeVaccine?.type)
      .filter(v => v !== activeVaccine)
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
      .map((v, i) => ({ ...v, orderNumber: i + 1 }));

      const filteredVaccinesWithoutNewType = currentData.filter(v => v.type !== activeVaccine?.type)
      return [...filteredVaccinesWithoutNewType, ...newSetOfVaccines]
    }
  )

    setActiveVaccine(null);
    setActiveButton(false);
    setSelectedVaccine(vaccinesSelect[0])
    setStartDate(new Date())
  }

  const HandleGraph = (v: VaccineData) => {
    if (v === activeVaccine ) {
      setActiveButton(false);
      setActiveVaccine(null);
    } else {
      setActiveVaccine(v);
      setActiveButton(true);
      setSelectedVaccine(v.type)
      setNewParametrs(null);
      if (v.date) {
        const parsedDate = parse(v.date, 'dd.MM.yyyy', new Date());
        setStartDate(new Date(parsedDate));
      }
    }
  };

  const handleVaccineclick = (vaccineType: string) => {
    setSelectedVaccine(vaccineType)
    setStartDate(new Date())
    setActiveButton(true)
  }

  return (
    <div className="vaccine">
      <div className="vaccine__top">
        <div className="vaccine__top-leftBlock">
          <div className="vaccine__title">
            <img src={vaccine} alt="foot" className="vaccine__image" />
            <p>Щеплення</p>
          </div>
        </div>

        <div className="vaccine__chart-mobile">
        <VaccinesMobile
            width={500}
            height={360}
            data={newData}
            activeVaccine={activeVaccine}
            selectedVaccine={selectedVaccine}
            newVaccine={newParametrs}
            birth={child.birth}
          HandleGraph={HandleGraph}
            activeBatton={activeBatton}
            handleVaccineclick={handleVaccineclick}
          />
      </div>

        <div className="vaccine__top-rightBlock">
          {!activeVaccine && !activeBatton ? (
            <button
              className="vaccine__button edit-button"
              onClick={handleEditClick}
            >
              Редагувати
            </button>
          ) : (
              <>
            <div className="vaccine__picker">
              {!activeVaccine ? (
                <select
                  className="vaccine__selectVaccine"
                  value={selectedVaccine}
                  onChange={handleVaccineChenge}
                >
                  {vaccinesSelect.map((vaccine) => (
                    <option key={vaccine} value={vaccine}>
                      {vaccine}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="vaccine__type">{selectedVaccine}</span>
                  )}
                  
                  <input
                  type="date"
                  className="vaccine__selectDate"
                  value={startDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setStartDate(newDate);
                  }}
                />
              </div>
              
              <div className="vaccine__button-container">
              <button 
                className="vaccine__button vaccine__button--add" 
                onClick={handleApplyClick}
                  >
                    {activeVaccine ? `Зберегти` : `Додати`}
              </button>
                    <button
                    className="vaccine__button vaccine__button--cancel"
                    onClick={handleRemoveClick}
                  >
                    {" "}
                   {activeVaccine ? `Видалити` : `Скасувати`}
                    </button>
                </div>
                </>
          )}
        </div>
      </div>

      <div className="vaccine__chart">
        <VaccinesChart
            width={800}
            height={360}
            data={newData}
            activeVaccine={activeVaccine}
            selectedVaccine={selectedVaccine}
            newVaccine={newParametrs}
            birth={child.birth}
          HandleGraph={HandleGraph}
          activeBatton={activeBatton}
          handleVaccineclick={handleVaccineclick}
          />
      </div>
    </div>
  )
}