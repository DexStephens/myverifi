import "./Home.scss";
import HomeSection from "../components/HomeSection";
import HomeHeader from "../components/HomeHeader";

export default function Home() {
  return (
    <div className="home-wrapper">
      <HomeHeader />
      {/* call to action and link*/}
      <HomeSection>
        <div>
          <h1>myverifi</h1>
          <p>Instant verification. Secure transactions. Controlled data.</p>
        </div>
        <div>
          <button>Get Verified</button>
        </div>
      </HomeSection>
      {/* card section for more info */}
      <HomeSection>
        <div>card 1</div>
        <div>card 2</div>
        <div>card 3</div>
      </HomeSection>
      {/* Learn about the team */}
      <HomeSection>
        <div>Tanner Greenwood</div>
        <div>Jacob Sargent</div>
        <div>Dexter Stephens</div>
        <div>Drew Wilson</div>
      </HomeSection>
    </div>
  );
}
