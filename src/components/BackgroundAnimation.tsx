'use client';

import { Category } from '../Types';

interface BackgroundAnimationProps {
  category: Category;
}

export default function BackgroundAnimation({ category }: BackgroundAnimationProps) {
  const renderAnimation = () => {
    switch (category.animation) {
      case 'waves':
        return <WavesAnimation />;
      case 'forest':
        return <ForestAnimation />;
      case 'wildlife':
        return <WildlifeAnimation />;
      case 'heritage':
        return <HeritageAnimation />;
      case 'mountains':
        return <MountainsAnimation />;
      case 'spiritual':
        return <SpiritualAnimation />;
      case 'urban':
        return <UrbanAnimation />;
      case 'waterfalls':
        return <WaterfallsAnimation />;
      case 'adventure':
        return <AdventureAnimation />;
      case 'village':
        return <VillageAnimation />;
      case 'fortresses':
        return <FortressesAnimation />;
      default:
        return <WavesAnimation />;
    }
  };

  return (
    <div className="background-animation">
      <div 
        className="animated-bg"
        style={{ background: category.bgColor }}
      >
        {renderAnimation()}
      </div>
      
      <style jsx>{`
        .background-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
        }

        .animated-bg {
          width: 100%;
          height: 100%;
          position: relative;
          transition: background 1.5s ease-in-out;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animated-bg * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Mobile performance optimizations */
        @media (max-width: 768px) {
          .background-animation {
            transform: translateZ(0);
            backface-visibility: hidden;
            perspective: 1000;
          }
        }
      `}</style>
    </div>
  );
}

// Individual Animation Components with responsive improvements
const WavesAnimation = () => (
  <div className="waves-animation">
    <div className="wave wave-1"></div>
    <div className="wave wave-2"></div>
    <div className="wave wave-3"></div>
    <div className="floating-boat"></div>
    <div className="seagull seagull-1">➚</div>
    <div className="seagull seagull-2">➚</div>
    
    <style jsx>{`
      .waves-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .wave {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 200%;
        height: clamp(60px, 15vh, 160px);
        background: rgba(255, 255, 255, 0.1);
        border-radius: 40% 45% 40% 45%;
        animation: waveMove 8s linear infinite;
      }

      .wave-1 {
        animation-duration: 10s;
        opacity: 0.6;
        height: clamp(80px, 18vh, 180px);
      }

      .wave-2 {
        animation-duration: 12s;
        opacity: 0.4;
        animation-delay: -2s;
        height: clamp(100px, 20vh, 200px);
      }

      .wave-3 {
        animation-duration: 14s;
        opacity: 0.2;
        animation-delay: -4s;
        height: clamp(120px, 22vh, 220px);
      }

      .floating-boat {
        position: absolute;
        bottom: clamp(120px, 25vh, 200px);
        right: -100px;
        width: clamp(80px, 10vw, 120px);
        height: clamp(40px, 6vh, 60px);
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50% 50% 0 0;
        animation: floatBoat 25s linear infinite;
      }

      .floating-boat::after {
        content: '';
        position: absolute;
        top: -20px;
        left: 50%;
        width: 2px;
        height: clamp(25px, 4vh, 40px);
        background: rgba(255, 255, 255, 0.6);
      }

      .floating-boat::before {
        content: '';
        position: absolute;
        top: -18px;
        left: 40%;
        width: clamp(20px, 3vw, 30px);
        height: clamp(20px, 3vh, 30px);
        background: rgba(255, 255, 255, 0.4);
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      }

      .seagull {
        position: absolute;
        font-size: clamp(1.5rem, 4vw, 2rem);
        color: rgba(255, 255, 255, 0.7);
        animation: fly 15s linear infinite;
      }

      .seagull-1 {
        top: 20%;
        left: -50px;
        animation-delay: 0s;
        animation-duration: 20s;
      }

      .seagull-2 {
        top: 30%;
        left: -80px;
        animation-delay: 5s;
        animation-duration: 25s;
      }

      @keyframes waveMove {
        0% {
          transform: translateX(0) rotate(0deg);
        }
        50% {
          transform: translateX(-25%) rotate(180deg);
        }
        100% {
          transform: translateX(-50%) rotate(360deg);
        }
      }

      @keyframes floatBoat {
        0% {
          transform: translateX(0) translateY(0) rotate(0deg);
        }
        25% {
          transform: translateX(-20vw) translateY(-10px) rotate(2deg);
        }
        50% {
          transform: translateX(-40vw) translateY(0) rotate(0deg);
        }
        75% {
          transform: translateX(-60vw) translateY(-10px) rotate(-2deg);
        }
        100% {
          transform: translateX(-100vw) translateY(0) rotate(0deg);
        }
      }

      @keyframes fly {
        0% {
          transform: translateX(0) translateY(0);
        }
        25% {
          transform: translateX(25vw) translateY(-20px);
        }
        50% {
          transform: translateX(50vw) translateY(0);
        }
        75% {
          transform: translateX(75vw) translateY(-20px);
        }
        100% {
          transform: translateX(100vw) translateY(0);
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .wave {
          height: clamp(40px, 12vh, 120px);
        }

        .wave-1 {
          height: clamp(50px, 14vh, 140px);
        }

        .wave-2 {
          height: clamp(60px, 16vh, 160px);
        }

        .wave-3 {
          height: clamp(70px, 18vh, 180px);
        }

        .floating-boat {
          bottom: clamp(100px, 20vh, 160px);
          width: clamp(60px, 8vw, 100px);
        }

        .seagull {
          font-size: clamp(1.25rem, 3vw, 1.75rem);
        }
      }

      @media (max-width: 480px) {
        .seagull-2 {
          display: none; /* Reduce elements on very small screens */
        }
      }
    `}</style>
  </div>
);

const WildlifeAnimation = () => (
  <div className="wildlife-animation">
    <div className="elephant elephant-1">🐘</div>
    <div className="elephant elephant-2">🐘</div>
    <div className="bird bird-1">🦅</div>
    <div className="bird bird-2">🦜</div>
    <div className="tree tree-1">🌴</div>
    <div className="tree tree-2">🌳</div>
    <div className="grass grass-1"></div>
    <div className="grass grass-2"></div>
    
    <style jsx>{`
      .wildlife-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .elephant {
        position: absolute;
        font-size: clamp(2.5rem, 8vw, 4rem);
        animation: walkElephant 40s linear infinite;
        filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
      }

      .elephant-1 {
        bottom: clamp(80px, 15vh, 120px);
        left: -100px;
        animation-delay: 0s;
        animation-duration: 45s;
      }

      .elephant-2 {
        bottom: clamp(120px, 20vh, 160px);
        left: -200px;
        animation-delay: 10s;
        animation-duration: 50s;
      }

      .bird {
        position: absolute;
        font-size: clamp(1.5rem, 4vw, 2rem);
        animation: flyBird 25s linear infinite;
      }

      .bird-1 {
        top: 20%;
        left: -50px;
        animation-delay: 0s;
      }

      .bird-2 {
        top: 40%;
        left: -80px;
        animation-delay: 7s;
      }

      .tree {
        position: absolute;
        font-size: clamp(4rem, 12vw, 6rem);
        bottom: 0;
        opacity: 0.3;
      }

      .tree-1 {
        left: 10%;
        animation: swayTree 8s ease-in-out infinite;
      }

      .tree-2 {
        right: 15%;
        animation: swayTree 10s ease-in-out infinite;
        animation-delay: -2s;
      }

      .grass {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: clamp(40px, 10vh, 80px);
        background: rgba(0, 0, 0, 0.1);
        animation: grassWave 6s ease-in-out infinite;
      }

      .grass-1 {
        animation-delay: 0s;
      }

      .grass-2 {
        height: clamp(30px, 8vh, 60px);
        animation-delay: -1s;
      }

      @keyframes walkElephant {
        0% {
          transform: translateX(0) translateY(0);
        }
        25% {
          transform: translateX(25vw) translateY(-5px);
        }
        50% {
          transform: translateX(50vw) translateY(0);
        }
        75% {
          transform: translateX(75vw) translateY(-5px);
        }
        100% {
          transform: translateX(100vw) translateY(0);
        }
      }

      @keyframes flyBird {
        0% {
          transform: translateX(0) translateY(0) scaleX(1);
        }
        25% {
          transform: translateX(25vw) translateY(-30px) scaleX(1);
        }
        50% {
          transform: translateX(50vw) translateY(0) scaleX(-1);
        }
        75% {
          transform: translateX(75vw) translateY(-30px) scaleX(-1);
        }
        100% {
          transform: translateX(100vw) translateY(0) scaleX(-1);
        }
      }

      @keyframes swayTree {
        0%, 100% {
          transform: rotate(-2deg);
        }
        50% {
          transform: rotate(2deg);
        }
      }

      @keyframes grassWave {
        0%, 100% {
          transform: skewX(0deg);
        }
        50% {
          transform: skewX(5deg);
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .elephant {
          font-size: clamp(2rem, 6vw, 3rem);
        }

        .tree {
          font-size: clamp(3rem, 8vw, 5rem);
        }

        .elephant-2 {
          display: none; /* Reduce elements on mobile */
        }
      }

      @media (max-width: 480px) {
        .bird-2 {
          display: none; /* Further reduce on small screens */
        }
      }
    `}</style>
  </div>
);

const ForestAnimation = () => (
  <div className="forest-animation">
    <div className="leaf leaf-1">🍃</div>
    <div className="leaf leaf-2">🍂</div>
    <div className="leaf leaf-3">🌿</div>
    <div className="leaf leaf-4">🍃</div>
    <div className="leaf leaf-5">🍂</div>
    <div className="tree tree-1">🌳</div>
    <div className="tree tree-2">🌲</div>
    <div className="tree tree-3">🎄</div>
    
    <style jsx>{`
      .forest-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .leaf {
        position: absolute;
        font-size: clamp(1.5rem, 4vw, 2rem);
        animation: fallLeaf 20s linear infinite;
        opacity: 0.6;
      }

      .leaf-1 {
        left: 10%;
        animation-delay: 0s;
        animation-duration: 25s;
      }

      .leaf-2 {
        left: 30%;
        animation-delay: 5s;
        animation-duration: 20s;
      }

      .leaf-3 {
        left: 50%;
        animation-delay: 10s;
        animation-duration: 22s;
      }

      .leaf-4 {
        left: 70%;
        animation-delay: 15s;
        animation-duration: 18s;
      }

      .leaf-5 {
        left: 90%;
        animation-delay: 2s;
        animation-duration: 24s;
      }

      .tree {
        position: absolute;
        font-size: clamp(5rem, 15vw, 8rem);
        bottom: 0;
        opacity: 0.2;
        animation: swayTree 15s ease-in-out infinite;
      }

      .tree-1 {
        left: 5%;
        animation-delay: 0s;
      }

      .tree-2 {
        left: 50%;
        animation-delay: -5s;
      }

      .tree-3 {
        right: 5%;
        animation-delay: -8s;
      }

      @keyframes fallLeaf {
        0% {
          transform: translateY(-100px) translateX(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 0.6;
        }
        90% {
          opacity: 0.6;
        }
        100% {
          transform: translateY(100vh) translateX(100px) rotate(360deg);
          opacity: 0;
        }
      }

      @keyframes swayTree {
        0%, 100% {
          transform: rotate(-3deg);
        }
        50% {
          transform: rotate(3deg);
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .leaf {
          font-size: clamp(1.25rem, 3vw, 1.75rem);
        }

        .tree {
          font-size: clamp(3rem, 10vw, 6rem);
        }

        .leaf-4,
        .leaf-5 {
          display: none; /* Reduce leaf count on mobile */
        }
      }

      @media (max-width: 480px) {
        .tree-3 {
          display: none; /* Reduce tree count on small screens */
        }
      }
    `}</style>
  </div>
);

const MountainsAnimation = () => (
  <div className="mountains-animation">
    <div className="mountain mountain-1"></div>
    <div className="mountain mountain-2"></div>
    <div className="mountain mountain-3"></div>
    <div className="cloud cloud-1">☁️</div>
    <div className="cloud cloud-2">☁️</div>
    <div className="cloud cloud-3">☁️</div>
    
    <style jsx>{`
      .mountains-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .mountain {
        position: absolute;
        bottom: 0;
        width: 0;
        height: 0;
        border-left: clamp(150px, 20vw, 200px) solid transparent;
        border-right: clamp(150px, 20vw, 200px) solid transparent;
        border-bottom: clamp(200px, 30vh, 300px) solid rgba(0, 0, 0, 0.1);
        animation: mountainGlow 10s ease-in-out infinite;
      }

      .mountain-1 {
        left: -100px;
        animation-delay: 0s;
      }

      .mountain-2 {
        left: 150px;
        border-bottom: clamp(250px, 35vh, 400px) solid rgba(0, 0, 0, 0.08);
        animation-delay: -2s;
      }

      .mountain-3 {
        right: -100px;
        border-bottom: clamp(220px, 32vh, 350px) solid rgba(0, 0, 0, 0.12);
        animation-delay: -4s;
      }

      .cloud {
        position: absolute;
        font-size: clamp(2.5rem, 8vw, 4rem);
        opacity: 0.3;
        animation: floatCloud 30s linear infinite;
      }

      .cloud-1 {
        top: 20%;
        left: -100px;
        animation-delay: 0s;
      }

      .cloud-2 {
        top: 40%;
        left: -150px;
        animation-delay: 10s;
      }

      .cloud-3 {
        top: 60%;
        left: -200px;
        animation-delay: 20s;
      }

      @keyframes mountainGlow {
        0%, 100% {
          opacity: 0.1;
        }
        50% {
          opacity: 0.15;
        }
      }

      @keyframes floatCloud {
        0% {
          transform: translateX(0) translateY(0);
        }
        50% {
          transform: translateX(50vw) translateY(-10px);
        }
        100% {
          transform: translateX(100vw) translateY(0);
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .mountain {
          border-left: clamp(100px, 15vw, 180px) solid transparent;
          border-right: clamp(100px, 15vw, 180px) solid transparent;
          border-bottom: clamp(150px, 25vh, 250px) solid rgba(0, 0, 0, 0.1);
        }

        .cloud {
          font-size: clamp(2rem, 6vw, 3rem);
        }

        .cloud-3 {
          display: none; /* Reduce cloud count on mobile */
        }
      }
    `}</style>
  </div>
);

// Add the remaining animation components with similar responsive improvements
const SpiritualAnimation = () => (
  <div className="spiritual-animation">
    <div className="lotus lotus-1">🪷</div>
    <div className="lotus lotus-2">🪷</div>
    <div className="prayer prayer-1">🙏</div>
    <div className="prayer prayer-2">🙏</div>
    <div className="temple">🛕</div>
    <div className="light light-1"></div>
    <div className="light light-2"></div>
    
    <style jsx>{`
      .spiritual-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .lotus {
        position: absolute;
        font-size: clamp(2rem, 6vw, 3rem);
        opacity: 0.4;
        animation: float 8s ease-in-out infinite;
      }

      .lotus-1 {
        top: 20%;
        left: 10%;
        animation-delay: 0s;
      }

      .lotus-2 {
        bottom: 30%;
        right: 15%;
        animation-delay: -4s;
      }

      .prayer {
        position: absolute;
        font-size: clamp(1.5rem, 4vw, 2rem);
        opacity: 0.3;
        animation: float 12s ease-in-out infinite;
      }

      .prayer-1 {
        top: 40%;
        left: 20%;
        animation-delay: -2s;
      }

      .prayer-2 {
        bottom: 40%;
        right: 20%;
        animation-delay: -6s;
      }

      .temple {
        position: absolute;
        font-size: clamp(5rem, 15vw, 8rem);
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0.1;
        animation: pulse 6s ease-in-out infinite;
      }

      .light {
        position: absolute;
        width: clamp(60px, 10vw, 100px);
        height: clamp(60px, 10vw, 100px);
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        border-radius: 50%;
        animation: lightPulse 4s ease-in-out infinite;
        opacity: 0.2;
      }

      .light-1 {
        top: 30%;
        left: 30%;
        animation-delay: 0s;
      }

      .light-2 {
        bottom: 40%;
        right: 30%;
        animation-delay: -2s;
      }

      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 0.1;
        }
        50% {
          opacity: 0.15;
        }
      }

      @keyframes lightPulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.1;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.2;
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .temple {
          font-size: clamp(3rem, 10vw, 6rem);
        }

        .prayer-2 {
          display: none;
        }
      }
    `}</style>
  </div>
);

const UrbanAnimation = () => (
  <div className="urban-animation">
    <div className="building building-1">🏢</div>
    <div className="building building-2">🏬</div>
    <div className="building building-3">🏨</div>
    <div className="car car-1">🚗</div>
    <div className="car car-2">🚙</div>
    <div className="light light-1"></div>
    <div className="light light-2"></div>
    
    <style jsx>{`
      .urban-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .building {
        position: absolute;
        font-size: clamp(4rem, 12vw, 6rem);
        bottom: 0;
        opacity: 0.15;
        animation: buildingGlow 8s ease-in-out infinite;
      }

      .building-1 {
        left: 10%;
        animation-delay: 0s;
      }

      .building-2 {
        left: 40%;
        animation-delay: -2s;
      }

      .building-3 {
        right: 10%;
        animation-delay: -4s;
      }

      .car {
        position: absolute;
        font-size: clamp(1.5rem, 4vw, 2rem);
        bottom: clamp(80px, 15vh, 130px);
        animation: driveCar 20s linear infinite;
        opacity: 0.4;
      }

      .car-1 {
        left: -50px;
        animation-delay: 0s;
        animation-duration: 25s;
      }

      .car-2 {
        left: -80px;
        bottom: clamp(100px, 18vh, 150px);
        animation-delay: 5s;
        animation-duration: 30s;
      }

      .light {
        position: absolute;
        width: clamp(50px, 8vw, 80px);
        height: clamp(50px, 8vw, 80px);
        background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
        border-radius: 50%;
        animation: urbanLight 3s ease-in-out infinite;
        opacity: 0.1;
      }

      .light-1 {
        top: 20%;
        left: 30%;
        animation-delay: 0s;
      }

      .light-2 {
        bottom: 40%;
        right: 25%;
        animation-delay: -1.5s;
      }

      @keyframes buildingGlow {
        0%, 100% {
          opacity: 0.15;
        }
        50% {
          opacity: 0.2;
        }
      }

      @keyframes driveCar {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(100vw);
        }
      }

      @keyframes urbanLight {
        0%, 100% {
          opacity: 0.1;
        }
        50% {
          opacity: 0.2;
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .building {
          font-size: clamp(3rem, 8vw, 5rem);
        }

        .car-2 {
          display: none;
        }
      }
    `}</style>
  </div>
);

const WaterfallsAnimation = () => (
  <div className="waterfalls-animation">
    <div className="waterfall waterfall-1"></div>
    <div className="waterfall waterfall-2"></div>
    <div className="splash splash-1">💧</div>
    <div className="splash splash-2">💧</div>
    <div className="splash splash-3">💧</div>
    <div className="ripple ripple-1"></div>
    <div className="ripple ripple-2"></div>
    
    <style jsx>{`
      .waterfalls-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .waterfall {
        position: absolute;
        top: 0;
        width: clamp(40px, 6vw, 60px);
        height: 100%;
        background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent);
        animation: fallWater 3s linear infinite;
        opacity: 0.4;
      }

      .waterfall-1 {
        left: 30%;
        animation-delay: 0s;
      }

      .waterfall-2 {
        right: 35%;
        animation-delay: -1.5s;
      }

      .splash {
        position: absolute;
        font-size: clamp(1rem, 3vw, 1.5rem);
        opacity: 0.5;
        animation: splash 2s ease-in infinite;
      }

      .splash-1 {
        bottom: 20%;
        left: 32%;
        animation-delay: 0s;
      }

      .splash-2 {
        bottom: 25%;
        right: 37%;
        animation-delay: -0.7s;
      }

      .splash-3 {
        bottom: 30%;
        left: 29%;
        animation-delay: -1.3s;
      }

      .ripple {
        position: absolute;
        width: clamp(60px, 10vw, 100px);
        height: clamp(60px, 10vw, 100px);
        border: 2px solid rgba(255,255,255,0.2);
        border-radius: 50%;
        animation: rippleEffect 4s linear infinite;
        opacity: 0;
      }

      .ripple-1 {
        bottom: 15%;
        left: 28%;
        animation-delay: 0s;
      }

      .ripple-2 {
        bottom: 18%;
        right: 33%;
        animation-delay: -2s;
      }

      @keyframes fallWater {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(100%);
        }
      }

      @keyframes splash {
        0% {
          transform: translateY(0) scale(1);
          opacity: 0.5;
        }
        100% {
          transform: translateY(20px) scale(1.5);
          opacity: 0;
        }
      }

      @keyframes rippleEffect {
        0% {
          transform: scale(0.5);
          opacity: 0.5;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .waterfall {
          width: clamp(30px, 4vw, 50px);
        }

        .splash-3 {
          display: none;
        }
      }
    `}</style>
  </div>
);

const AdventureAnimation = () => (
  <div className="adventure-animation">
    <div className="hiker hiker-1">🚶</div>
    <div className="mountain mountain-1">⛰️</div>
    <div className="mountain mountain-2">🏔️</div>
    <div className="flag flag-1">🚩</div>
    <div className="cloud cloud-1">☁️</div>
    <div className="cloud cloud-2">☁️</div>
    
    <style jsx>{`
      .adventure-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .hiker {
        position: absolute;
        font-size: clamp(2rem, 6vw, 3rem);
        bottom: clamp(80px, 15vh, 120px);
        animation: hike 30s linear infinite;
        opacity: 0.6;
      }

      .hiker-1 {
        left: -50px;
        animation-delay: 0s;
      }

      .mountain {
        position: absolute;
        font-size: clamp(5rem, 15vw, 8rem);
        bottom: 0;
        opacity: 0.2;
        animation: mountainFloat 20s ease-in-out infinite;
      }

      .mountain-1 {
        left: 10%;
        animation-delay: 0s;
      }

      .mountain-2 {
        right: 15%;
        animation-delay: -10s;
      }

      .flag {
        position: absolute;
        font-size: clamp(1.5rem, 4vw, 2rem);
        animation: waveFlag 3s ease-in-out infinite;
        opacity: 0.5;
      }

      .flag-1 {
        top: 30%;
        right: 20%;
        animation-delay: 0s;
      }

      .cloud {
        position: absolute;
        font-size: clamp(2.5rem, 8vw, 4rem);
        opacity: 0.3;
        animation: floatCloud 40s linear infinite;
      }

      .cloud-1 {
        top: 20%;
        left: -100px;
        animation-delay: 0s;
      }

      .cloud-2 {
        top: 40%;
        left: -150px;
        animation-delay: 20s;
      }

      @keyframes hike {
        0% {
          transform: translateX(0) translateY(0);
        }
        25% {
          transform: translateX(25vw) translateY(-20px);
        }
        50% {
          transform: translateX(50vw) translateY(0);
        }
        75% {
          transform: translateX(75vw) translateY(-20px);
        }
        100% {
          transform: translateX(100vw) translateY(0);
        }
      }

      @keyframes mountainFloat {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes waveFlag {
        0%, 100% {
          transform: rotate(-5deg);
        }
        50% {
          transform: rotate(5deg);
        }
      }

      @keyframes floatCloud {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(100vw);
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .mountain {
          font-size: clamp(3rem, 10vw, 6rem);
        }

        .cloud-2 {
          display: none;
        }
      }
    `}</style>
  </div>
);

const VillageAnimation = () => (
  <div className="village-animation">
    <div className="hut hut-1">🏠</div>
    <div className="hut hut-2">🏡</div>
    <div className="tree tree-1">🌳</div>
    <div className="tree tree-2">🌴</div>
    <div className="smoke smoke-1"></div>
    <div className="smoke smoke-2"></div>
    <div className="farmer">👨‍🌾</div>
    
    <style jsx>{`
      .village-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .hut {
        position: absolute;
        font-size: clamp(3rem, 10vw, 5rem);
        bottom: 0;
        opacity: 0.2;
        animation: hutGlow 10s ease-in-out infinite;
      }

      .hut-1 {
        left: 15%;
        animation-delay: 0s;
      }

      .hut-2 {
        right: 20%;
        animation-delay: -5s;
      }

      .tree {
        position: absolute;
        font-size: clamp(4rem, 12vw, 6rem);
        bottom: 0;
        opacity: 0.15;
        animation: swayTree 8s ease-in-out infinite;
      }

      .tree-1 {
        left: 5%;
        animation-delay: 0s;
      }

      .tree-2 {
        right: 10%;
        animation-delay: -4s;
      }

      .smoke {
        position: absolute;
        width: clamp(25px, 5vw, 40px);
        height: clamp(25px, 5vw, 40px);
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        animation: riseSmoke 6s ease-in infinite;
        opacity: 0;
      }

      .smoke-1 {
        bottom: clamp(60px, 12vh, 90px);
        left: 18%;
        animation-delay: 0s;
      }

      .smoke-2 {
        bottom: clamp(60px, 12vh, 90px);
        right: 23%;
        animation-delay: -3s;
      }

      .farmer {
        position: absolute;
        font-size: clamp(1.5rem, 4vw, 2rem);
        bottom: clamp(80px, 15vh, 120px);
        left: -50px;
        animation: walkFarmer 40s linear infinite;
        opacity: 0.5;
      }

      @keyframes hutGlow {
        0%, 100% {
          opacity: 0.2;
        }
        50% {
          opacity: 0.25;
        }
      }

      @keyframes swayTree {
        0%, 100% {
          transform: rotate(-2deg);
        }
        50% {
          transform: rotate(2deg);
        }
      }

      @keyframes riseSmoke {
        0% {
          transform: translateY(0) scale(1);
          opacity: 0.3;
        }
        100% {
          transform: translateY(-100px) scale(2);
          opacity: 0;
        }
      }

      @keyframes walkFarmer {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(100vw);
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .hut {
          font-size: clamp(2.5rem, 8vw, 4rem);
        }

        .tree {
          font-size: clamp(3rem, 8vw, 5rem);
        }

        .hut-2 {
          display: none;
        }
      }
    `}</style>
  </div>
);

const FortressesAnimation = () => (
  <div className="fortresses-animation">
    <div className="fortress fortress-1">🏰</div>
    <div className="fortress fortress-2">🏯</div>
    <div className="flag flag-1">🚩</div>
    <div className="flag flag-2">🎌</div>
    <div className="wall wall-1"></div>
    <div className="wall wall-2"></div>
    
    <style jsx>{`
      .fortresses-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .fortress {
        position: absolute;
        font-size: clamp(5rem, 15vw, 8rem);
        bottom: 0;
        opacity: 0.15;
        animation: fortressGlow 12s ease-in-out infinite;
      }

      .fortress-1 {
        left: 10%;
        animation-delay: 0s;
      }

      .fortress-2 {
        right: 10%;
        animation-delay: -6s;
      }

      .flag {
        position: absolute;
        font-size: clamp(1.5rem, 4vw, 2rem);
        animation: waveFlag 4s ease-in-out infinite;
        opacity: 0.4;
      }

      .flag-1 {
        top: 25%;
        left: 12%;
        animation-delay: 0s;
      }

      .flag-2 {
        top: 30%;
        right: 12%;
        animation-delay: -2s;
      }

      .wall {
        position: absolute;
        bottom: 0;
        width: clamp(200px, 30vw, 300px);
        height: clamp(50px, 8vh, 80px);
        background: rgba(0,0,0,0.1);
        animation: wallPulse 8s ease-in-out infinite;
      }

      .wall-1 {
        left: 5%;
        animation-delay: 0s;
      }

      .wall-2 {
        right: 5%;
        animation-delay: -4s;
      }

      @keyframes fortressGlow {
        0%, 100% {
          opacity: 0.15;
        }
        50% {
          opacity: 0.2;
        }
      }

      @keyframes waveFlag {
        0%, 100% {
          transform: rotate(-8deg);
        }
        50% {
          transform: rotate(8deg);
        }
      }

      @keyframes wallPulse {
        0%, 100% {
          opacity: 0.1;
        }
        50% {
          opacity: 0.15;
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .fortress {
          font-size: clamp(3rem, 10vw, 6rem);
        }

        .flag-2 {
          display: none;
        }
      }
    `}</style>
  </div>
);

const HeritageAnimation = () => (
  <div className="heritage-animation">
    <div className="temple">🛕</div>
    <div className="ancient ancient-1">🏛️</div>
    <div className="ancient ancient-2">🗿</div>
    <div className="scroll">📜</div>
    <div className="artifact">🏺</div>
    
    <style jsx>{`
      .heritage-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .temple, .ancient, .scroll, .artifact {
        position: absolute;
        font-size: clamp(4rem, 12vw, 6rem);
        opacity: 0.1;
        animation: float 20s ease-in-out infinite;
      }

      .temple {
        top: 20%;
        left: 10%;
        animation-delay: 0s;
      }

      .ancient-1 {
        top: 40%;
        right: 15%;
        animation-delay: -10s;
      }

      .ancient-2 {
        bottom: 20%;
        left: 20%;
        animation-delay: -5s;
      }

      .scroll {
        top: 60%;
        right: 25%;
        font-size: clamp(2.5rem, 8vw, 4rem);
        animation-delay: -15s;
      }

      .artifact {
        bottom: 30%;
        right: 30%;
        font-size: clamp(3rem, 10vw, 5rem);
        animation-delay: -7s;
      }

      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .temple, .ancient, .scroll, .artifact {
          font-size: clamp(2.5rem, 8vw, 5rem);
        }

        .ancient-2 {
          display: none;
        }
      }
    `}</style>
  </div>
);

export {
  WavesAnimation,
  WildlifeAnimation,
  ForestAnimation,
  MountainsAnimation,
  SpiritualAnimation,
  UrbanAnimation,
  WaterfallsAnimation,
  AdventureAnimation,
  VillageAnimation,
  FortressesAnimation,
  HeritageAnimation
};