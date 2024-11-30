import "./App.css";
import studentJson from "./assets/lottie/student.json";
import Lottie from "lottie-react";
import { Button } from "./components/ui/button";
// import paper from "./assets/paper.png";
// import textLogo from "./assets/textlogo.png";
// import { motion } from "motion/react";

function Hero() {
  return (
    <div className="h-screen  gap-6 items-center grid grid-cols-2 ">
      <div className="flex flex-col items-center justify-center">
        <div className="m-10">
          <h1 className="text-4xl font-bold">Analyse your success with us!</h1>
          <p className="text-xl text-zinc-800">
            Analyse your student outcome with your habbits and get the best
            results. We provide you with the best tools to analyse your success
            and improve your learning. Powered by Machine Learning.
          </p>
          <div className="flex items-center gap-4 mt-5">
            <Button>Get Started</Button>
            <Button className="bg-white text-slate-800 hover:bg-zinc-200">
              Learn more
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Lottie
          animationData={studentJson}
          style={{ width: 500, height: 500 }}
        />
      </div>
    </div>
  );
}

function Home() {
  return (
    <div>
      <Hero />
    </div>
  );
}

export default Home;
