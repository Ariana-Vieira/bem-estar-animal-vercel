"use client";

import "./home.css";

import Layout from "@/app/Admin/components/Layout/Layout";


import DashboardCards from "@/app/Admin/components/DashboardCards/DashboardCards";
import QuickActions from "@/app/Admin/components/QuickActions/QuickActions";
import AlertsPanel from "@/app/Admin/components/AlertsPanel/AlertsPanel";
import RecentAnimals from "@/app/Admin/components/RecentAnimals/RecentAnimals";





export default function Home() {
  return (
    <main className="home-container">

    <Layout>





      <section className="home-content">

        <div className="home-header">

          <h1>
            Dashboard do Sistema
          </h1>

          <p>
            Gerencie animais, adoções, vacinas e
            solicitações do Departamento de Proteção e Bem-Estar Animal.
          </p>

        </div>

        <DashboardCards />

        <QuickActions />

        <div className="home-grid">

          <AlertsPanel />

          <RecentAnimals />

        </div>

      </section>
    </Layout>
    </main>
  );
}