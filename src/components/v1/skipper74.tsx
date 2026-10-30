"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineDay {
  date: string;
  items: string[];
}

const TIMELINE_DATA: TimelineDay[] = [
  {
    date: "September 30 / Tuesday",
    items: [
      "Complete project proposal for new client presentation",
      "Review and approve marketing campaign materials",
      "Team meeting with development department at 2 PM",
      "Update quarterly financial reports",
      "Call with stakeholders regarding product roadmap",
    ],
  },
  {
    date: "October 1 / Wednesday",
    items: [
      "Conduct user testing sessions for mobile app",
      "Finalize budget allocation for Q4 initiatives",
      "Review code changes in development branch",
      "Prepare presentation slides for board meeting",
      "Schedule one-on-one meetings with team members",
    ],
  },
  {
    date: "October 2 / Thursday",
    items: [
      "Launch new feature rollout to production environment",
      "Analyze customer feedback from recent survey",
      "Update documentation for API endpoints",
      "Coordinate with design team on wireframe revisions",
      "Review security audit findings and action items",
    ],
  },
  {
    date: "October 3 / Friday",
    items: [
      "Deploy hotfix for critical bug in payment system",
      "Attend cross-functional planning session",
      "Review and merge pending pull requests",
      "Prepare weekly progress report for management",
      "Organize team retrospective meeting",
    ],
  },
  {
    date: "October 4 / Saturday",
    items: [
      "Research new technologies for upcoming projects",
      "Update personal development goals and milestones",
      "Review industry trends and competitor analysis",
      "Organize project files and documentation",
    ],
  },
  {
    date: "October 5 / Sunday",
    items: [
      "Plan upcoming week priorities and deadlines",
      "Review project timelines and resource allocation",
      "Prepare for Monday morning team standup",
      "Update task management system with new assignments",
    ],
  },
];

interface TimelineDayItemProps {
  data: TimelineDay;
  setCurrentDate: (date: string) => void;
}

function TimelineDaySection({ data, setCurrentDate }: TimelineDayItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: 0,
    margin: "-70px 0px -100% 0px",
  });

  useEffect(() => {
    if (isInView) {
      setCurrentDate(data.date);
    }
  }, [isInView, data.date, setCurrentDate]);

  const dateParts = data.date.split(" ");

  return (
    <div ref={ref} className="my-20">
      <header className="mb-4 flex items-center border-b border-black/15 py-2 text-xl font-medium tracking-tight text-black/60">
        <span className="mr-1 font-semibold text-black">{dateParts[1]}</span>/{" "}
        {dateParts[3]}
      </header>
      <ul className="space-y-4">
        {data.items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-4 text-base">
            <span className="size-4 shrink-0 rounded-full bg-black/10" />
            <div className="text-black/80">{item}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Skipper74() {
  const [currentDate, setCurrentDate] = useState("September 30 / Tuesday");
  const dateParts = currentDate.split(" ");

  return (
    <div className="flex w-full justify-center bg-[#f5f4f3] text-black">
      <div className="mb-[66vh] w-full max-w-4xl px-10">
        <header className="sticky top-0 z-10 border-b border-black/15 bg-[#f5f4f3]/90 pb-4 pt-14 text-2xl tracking-tight text-black/50 backdrop-blur-sm">
          <motion.span
            key={currentDate}
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mr-2 inline-block font-semibold text-black"
          >
            {dateParts[0]} {dateParts[1]}
          </motion.span>
          {dateParts.slice(2).join(" ")}
        </header>
        <div className="-mt-16">
          {TIMELINE_DATA.map((day) => (
            <TimelineDaySection
              key={day.date}
              data={day}
              setCurrentDate={setCurrentDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { Skipper74 as DemoSkipper74 };
export default Skipper74;
