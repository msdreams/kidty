import { Dashboard } from "../../Components/Dashboard/Dashboard";
import { avatars } from "../../Utils/kit";
import "./AccountPage.scss";
import Children from "../../api/Children.json";
import { useEffect, useState } from "react";
import { Child, Data, Eye, EyesData, VaccineData, VaccinesData, YearlyMeasurementData } from "../../Shared/types";
import { calculateFullChildAge } from "../../Shared/hendlers/generateYearArray";
import ChildCard_1 from './../../api/ChildData_1.json';
import ChildCard_2 from './../../api/ChildData_2.json';
import { AddModal } from "../../Components/AddModal/AddModal";
import { AdditModal } from "../../Components/AdditModal/AdditModal";
import GenerativeBG from "../../Components/GenerativeBg/GenerativeBG";


const colors = ['#cdbdda','#adb0d9', '#9bc7dc', '#d5b99c', '#e2a1bb'];

export const AccountPage: React.FC = () => {
  const [child, setChild] = useState(Children[0]);
  const [activeIndex, setActiveIndex] = useState<number>(child.id - 1);
  const [heightData, setHeightData] = useState<Data[] | null>(null);
  const [weightData, setWeightData] = useState<Data[] | null>(null);
  const [footData, setFootData] = useState<Data[] | null>(null);
  const [vaccinesData, setVaccinesData] = useState<VaccineData[] | null>(null);
  const [eyesData, setEyesData] = useState<Eye | null>(null);
  const [modal, setModal] = useState(false);
  const [additingModal, setAdditingModal] = useState(false);

  const ChildsDataArray = [ChildCard_1, ChildCard_2]

  useEffect(() => {
    if (additingModal || modal) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [additingModal, modal]);

  useEffect(() => {
      const heightCard = ChildsDataArray[child.id - 1].find(item => item.type === "height") as YearlyMeasurementData;
      const weightCard = ChildsDataArray[child.id - 1].find(item => item.type === "weight") as YearlyMeasurementData;
      const footCard = ChildsDataArray[child.id - 1].find(item => item.type === "foot") as YearlyMeasurementData;
      const eyeCard = ChildsDataArray[child.id - 1].find(item => item.type === "eyes") as EyesData;
    const vaccinesCard = ChildsDataArray[child.id - 1].find(item => item.type === "vaccines") as VaccinesData;


      setHeightData(heightCard.data);
      setWeightData(weightCard.data);
      setFootData(footCard.data);
      setEyesData(eyeCard.data);
      setVaccinesData(vaccinesCard.data);

  }, [child.id]);

  const handleChildChange = (index: number,selectedChild: Child) => {
    setActiveIndex(index);
    setChild(selectedChild)
  }

  const handleAddChild = () => {
    document.body.classList.add('no-scroll');
    setModal(true)
  }

  const fullAge = calculateFullChildAge(child.birth);

  return (
    <div className="account">
      <GenerativeBG />
      <div className="account__top top">
        <div className="top__person">
          <img
            src={avatars[child.image]}
            alt="avatar"
            className="top__person-image"
            onClick={() => {
              console.log('Image clicked');
              setAdditingModal(true);
            }}
            />
          <div  className="top__person-info">
            <header className="top__person-name">
            {child.name}
            </header>
            <p className="top__person-txt">Вік: {fullAge.years}p. {fullAge.months}м.</p>
            <p className="top__person-txt">Pік народження: {child.birth}</p>
            <p className="top__person-txt">Стать: дівчинка</p>
          </div>
        </div>

        <div className="top__avatars avatars">
          {Children.map((childItem, index) => (
            <div key={index} className="avatars__card-container">
              <button
                className={`avatars__card ${activeIndex === index ? 'active' : ''}`}
                onClick={() => handleChildChange(index, childItem)}
              >
                <img src={avatars[childItem.image]} alt="avatar" className="avatars__card avatars__card--image" />
              </button>
        </div>
      ))}

      <button className="avatars__add" onClick={handleAddChild}>
        <div className="avatars__add avatars__add--plus"> + </div>
        <div className="avatars__add avatars__add--text">Додати<br />дитину</div>
      </button>
    </div>
      </div>

      <div className="account__container" style={{ backgroundColor: colors[activeIndex] }}>
        {heightData && weightData && footData && vaccinesData && eyesData &&
          <Dashboard
          child={child}
          heightData={heightData}
          weightData={weightData}
          footData={footData}
          vaccinesData={vaccinesData}
          eyesData={eyesData}
        />
        }
      </div>
      {modal && ChildsDataArray.length > 0 &&
        <div className="account__modalContainer">
          <AddModal setModal= {setModal} />
        </div>
      }

      {additingModal && (
        <div className="account__modalContainer">
        <AdditModal
          setModal={setAdditingModal}
          name={child.name}
          surname={child.surname}
          birth={child.birth}
          gender={child.gender}
          avatar={avatars[child.image]}
          />
        </div>
      )}
    </div>
  );
};
