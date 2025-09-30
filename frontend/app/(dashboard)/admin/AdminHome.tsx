import React, { useEffect, useState } from "react";
import DashboardHeader from "../DasboardHeader";
import ProjectOverviewCard from "@/components/dashboard/admin/ProjectOverviewCard";
import FilterBtn from "@/components/dashboard/FilterBtn";
import { VotesChart } from "@/components/dashboard/admin/VotesChart";
import { NewProjectsChart } from "@/components/dashboard/admin/NewProjectChart";
import { useQuery } from "@tanstack/react-query";
import {
  getAdmStats,
  getDashboardAnalytics,
  getProjectsEvolution,
  getVotesEvolution,
} from "@/services/statsService";
import { useUserSessionStore } from "@/stores/useUserSessionStore";

export default function AdminHome() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const [selectedVoteYear, setSelectedVoteYear] = useState<number | null>(null);
  const [selectedVoteMonth, setSelectedVoteMonth] = useState<number | null>(
    null
  );
  const [selectedVoteWeek, setSelectedVoteWeek] = useState<number | null>(null);
  const [metric, setMetric] = useState<"votes" | "revenue" | "transactions">(
    "votes"
  );
  const user = useUserSessionStore((state) => state.user);
  const {
    data: stats,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => getAdmStats(),
    enabled: user?.user_type === "user",
  });

  const { data: analytics, isLoading: isloadingAnalytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => getDashboardAnalytics(),
    enabled: user?.user_type === "user",
  });
  const { data: projetEvolution, isLoading: isloadingProjectEvolution } =
    useQuery({
      queryKey: ["projects-evolution"],
      queryFn: () => getProjectsEvolution(),
      enabled: user?.user_type === "user",
    });
  const { data: voteEvolution, isLoading: isloadingVoteEvolution } = useQuery({
    queryKey: ["votes-evolution"],
    queryFn: () => getVotesEvolution(),
    enabled: user?.user_type === "user",
  });
  const data = projetEvolution?.data;
  const yearOptions = data?.map((y: any) => ({
    value: y.year,
    text: y.year.toString(),
  }));

  const currentYear = data?.find((y: any) => y.year === selectedYear);
  const monthOptions =
    currentYear?.months.map((m: any) => ({
      value: m.month_number,
      text: m.month_name,
    })) ?? [];

  const currentMonth = currentYear?.months.find(
    (m: any) => m.month_number === selectedMonth
  );
  const weekOptions =
    currentMonth?.weeks.map((w: any) => ({
      value: w.week_number,
      text: `Semaine ${w.week_number}`,
    })) ?? [];

  const currentWeek = currentMonth?.weeks.find(
    (w: any) => w.week_number === selectedWeek
  );

  const chartData = (() => {
    if (currentWeek) {
      return currentWeek.days.map((d: any) => ({
        label: d.day_name,
        projects: d.total_projects,
      }));
    }

    if (currentMonth) {
      return currentMonth.weeks.map((w: any) => ({
        label: `S${w.week_number}`,
        projects: w.week_total_projects,
      }));
    }

    if (currentYear) {
      return currentYear.months.map((m: any) => ({
        label: m.month_name,
        projects: m.month_total_projects,
      }));
    }
    return [];
  })();
  useEffect(() => {
    if (data && data.length > 0 && !selectedYear) {
      const lastYear = data[data.length - 1];
      setSelectedYear(lastYear.year);
    }
  }, [data, selectedYear]);

  /******************************** */
  const voteData = voteEvolution?.data;
  const yearOptionsVote = voteData?.map((y: any) => ({
    value: y.year,
    text: y.year.toString(),
  }));

  const currentYearVote = voteData?.find(
    (y: any) => y.year === selectedVoteYear
  );
  const monthOptionsVote =
    currentYearVote?.months.map((m: any) => ({
      value: m.month_number,
      text: m.month_name,
    })) ?? [];

  const currentMonthVote = currentYearVote?.months.find(
    (m: any) => m.month_number === selectedVoteMonth
  );
  const weekOptionsVote =
    currentMonthVote?.weeks.map((w: any) => ({
      value: w.week_number,
      text: `Semaine ${w.week_number}`,
    })) ?? [];

  const currentWeekVote = currentMonthVote?.weeks.find(
    (w: any) => w.week_number === selectedVoteWeek
  );

  const chartDataVote = (() => {
    if (currentWeekVote) {
      return currentWeekVote.days.map((d: any) => ({
        label: d.day_name,
        votes: d.total_vote_count,
        revenue: d.total_revenue,
      }));
    }
    if (currentMonthVote) {
      return currentMonthVote.weeks.map((w: any) => ({
        label: `S${w.week_number}`,
        votes: w.week_total_vote_count,
        revenue: w.week_total_revenue,
      }));
    }
    if (currentYearVote) {
      return currentYearVote.months.map((m: any) => ({
        label: m.month_name,
        votes: m.month_total_vote_count,
        revenue: m.month_total_revenue,
      }));
    }
    return [];
  })();
  useEffect(() => {
    if (voteData && voteData.length > 0 && !selectedVoteYear) {
      const lastYear = voteData[data.length - 1];
      setSelectedVoteYear(lastYear.year);
    }
  }, [voteData, selectedVoteYear]);

  return (
    <section>
      <DashboardHeader pageTitle="Tableau de bord global" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mb-10 gap-4">
        <ProjectOverviewCard
          title="Nombre total de projets soumis"
          total={stats?.general_stats.total}
          color="text-[#CECE2C]"
        />
        <ProjectOverviewCard
          title="Nombre total de projets validés"
          total={stats?.general_stats.validated}
          color="text-[#34C759]"
        />
        <ProjectOverviewCard
          title="Nombre total de projets rejetés"
          total={stats?.general_stats.rejected}
          color="text-[#FF3B30]"
        />
        <ProjectOverviewCard
          title="Total des votes enregistrés"
          total={stats?.vote_stats.total_votes}
          color="text-[#0026B0]"
        />
        <ProjectOverviewCard
          title="Total utilisateurs"
          total={stats?.user_stats.total_users}
          color="text-[#2C2C2E]"
        />
        <ProjectOverviewCard
          title="Revenus générés(Paiment de vote) en Fcfa"
          total={stats?.vote_stats.total_revenue}
          color="text-[#FF7F00]"
        />
      </div>
      <div className="grid  grid-cols-7 gap-4">
        <div className="col-span-7 lg:col-span-4 flex flex-col space-y-3 bg-gray-200/50 px-4 py-8 rounded-xl max-w-sm md:max-w-full overflow-x-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {" "}
            <h2 className="text-xl font-medium">Évolution des votes</h2>
            <div className="space-x-2">
              <FilterBtn
                defaultText="Année"
                options={yearOptionsVote}
                onChange={(val) => {
                  setSelectedVoteYear(Number(val));
                  setSelectedVoteMonth(null);
                  setSelectedVoteWeek(null);
                }}
              />
              {selectedVoteYear && (
                <FilterBtn
                  defaultText="Mois"
                  options={monthOptionsVote}
                  onChange={(val) => {
                    setSelectedVoteMonth(Number(val));
                    setSelectedVoteWeek(null);
                  }}
                />
              )}
              {selectedVoteMonth && (
                <FilterBtn
                  defaultText="Semaine"
                  options={weekOptionsVote}
                  onChange={(val) => setSelectedVoteWeek(Number(val))}
                />
              )}
              {/* <FilterBtn
                defaultText="Métrique"
                options={[
                  { value: "votes", text: "Votes" },
                  { value: "revenue", text: "Revenus" },
                  { value: "transactions", text: "Transactions" },
                ]}
                onChange={(val) =>
                  setMetric(val as "votes" | "revenue" | "transactions")
                }
              /> */}
            </div>
          </div>
          <div className="bg-white  rounded-xl md:relative">
            <div className=" mt-10 overflow-x-auto  md:max-w-lg ">
              <VotesChart metric={metric} chartData={chartDataVote} />
            </div>
            {/*  <button className="md:absolute right-12 top-10 flex items-center text-sm space-x-3">
              <span className="block h-2 w-6  bg-[#FF7F00] rounded-full "></span>{" "}
              <span>Revenus généré</span>
            </button>
            <button className="md:absolute right-9 top-16 flex items-center text-sm space-x-3">
              <span className="block h-2 w-6  bg-[#0026B0] rounded-full "></span>{" "}
              <span>Nombres de votes</span>
            </button> */}
          </div>
        </div>
        <div className="col-span-7 lg:col-span-3 flex flex-col space-y-3 bg-gray-200/50 px-2 py-8 rounded-xl max-w-sm md:max-w-full overflow-x-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {" "}
            <h2 className="text-lg text-wrap font-medium w-[200px] ">
              Statistique des projets publiés
            </h2>
            <div className="space-x-2">
              <FilterBtn
                defaultText="Année"
                options={yearOptions}
                onChange={(val) => {
                  setSelectedYear(Number(val));
                  setSelectedMonth(null);
                  setSelectedWeek(null);
                }}
              />
              <FilterBtn
                defaultText="Mois"
                options={monthOptions}
                onChange={(val) => {
                  setSelectedMonth(Number(val));
                  setSelectedWeek(null);
                }}
              />
              <FilterBtn
                defaultText="Semaine"
                options={weekOptions}
                onChange={(val) => setSelectedWeek(Number(val))}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl">
            <div className=" mt-10 max-w-sm md:max-w-lg ">
              <NewProjectsChart chartData={chartData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
