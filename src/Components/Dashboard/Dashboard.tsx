import { Child, Data, Eye,VaccineData} from '../../Shared/types';
import './Dashboard.scss';
import { CardWeight } from "../../Components/CardWeight/CardWeight";
import { CardHeight } from "../../Components/CardHeight/CardHeight";
import { CardFoot } from '../CardFoot copy/CardFoot';
import { CardEyes } from '../CardEyes/CardEyes';
import { calculateChildAge, generateYearArray } from '../../Shared/hendlers/generateYearArray';
import { CardVaccines } from '../CardVaccines/CardVaccines';

type Props = {
  child: Child;
  heightData: Data[];
  weightData: Data[];
  footData: Data[];
  vaccinesData: VaccineData[];
  eyesData: Eye;
}

export const Dashboard: React.FC<Props> = ({ child, heightData, weightData, footData, vaccinesData, eyesData}) => {

  const birthYear = child.birth.split(".")[2];

  const years = generateYearArray(birthYear).reverse();
  const age = calculateChildAge(birthYear);

  return (
    <div className="dashboard">
      <div className="dashboard__item">
        <CardHeight data={heightData} years={years} />
      </div>
      <div className="dashboard__item">
        <CardWeight data={weightData} years={years} />
      </div>
      <div className="dashboard__item">
      <CardFoot data={footData} years={years} />
      </div>
      <div className="dashboard__item">
      <CardEyes data={eyesData}/>
      </div>
      <div className="dashboard__item dashboard__item--big">
        <CardVaccines
          data={vaccinesData}
          years={years}
          age={age}
          child={child}
        />
      </div>
    </div>
  )
}