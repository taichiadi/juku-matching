"use client";

import dynamic from "next/dynamic";

const ScoreChart = dynamic(() => import("./ScoreChart"), { ssr: false });

export default ScoreChart;
