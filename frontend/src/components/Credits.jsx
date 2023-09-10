import LINKS from "../constants/links";
import '../../public/stylesheets/Credits.css';


const Credits = () => {
  const { HASSAN, JACKSON, CONOR } = LINKS.CVs;

  return (
    <section className="credits-container">
      <div>
        <a className="link" href={HASSAN}>Hassan Issak</a>
        <a className="link" href={JACKSON}>Jackson Lionheart</a>
        <a className="link" href={CONOR}>Conor Meldrum</a>
      </div>
      <div>
        <a className="link" href={LINKS.REPO}>Check out the project on Github!</a>
      </div>
    </section>
  );
};

export default Credits;
