'use client'

import { useEffect, useRef } from "react";

import Background from "./components/background";
import Header from "./components/header";
import MainTitle from "./sections/start";
import Sidebar from "./components/sidebar";
import Image from "next/image";
import CurrentEng from "./sections/current-eng";
import MainProjects from "./sections/main-projects";

export default function Home() {
  
  return (
    <div 
      className="w-full container-lop"
    >
      <Sidebar />
      <MainTitle />
      <CurrentEng />
      <MainProjects />
    </div>
  );
}
