import "../../styles/HomePage.css";
import Header from "../../components/Layout/Header";
import React from "react";
import heroImage from "../../assets/hero.png";

const HomePage = () => {
  return (
    <section className="hero-section">
      <Header />
      <div className="container relative">
        <div className="w-5/6 h-full flex justify-center flex-col items-start">
          <h1 className="text-2xl leading-tight text-white font-light">
            <span className="text-8xl font-black">Your Journey</span> Into{" "}
            <span className="font-semibold text-purple-400">Arinova Studio</span>{" "}
            <span className="text-6xl uppercase tracking-tight mt-4 font-bold">
              Starts Here<span className="text-purple-400">.</span>
            </span>
          </h1>
          <p className="text-lg w-5/6 opacity-80">
            Take the first step with a simple coding challenge designed to test
            creativity, logic, and problem-solving. Ready when you are.
          </p>
          <button
            class="button px-8 py-2.5 mt-4 bg-white text-purple-500 font-semibold rounded-full shadow-sm transition duration-200"
          >
            Let's Start Challenge
          </button>
        </div>
        <div className="w-2/3 h-full ">
          <img 
          src={heroImage}
          className="w-full h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
