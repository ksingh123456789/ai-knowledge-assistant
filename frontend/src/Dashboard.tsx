import { useEffect, useState } from "react";
import Cards, { CardData } from "./components/Cards";
import RecentActivity, { ActivityItem } from "./components/RecentActivity";
import "./Dashboard.css";

function getMockCards(): CardData[] {
  return [
    { title: "Documents Uploaded", value: 12 },
    { title: "Questions Asked", value: 48 },
    { title: "Open Jira Tickets", value: 7 },
    { title: "Active Users", value: 5 },
  ];
}

function getMockActivity(): ActivityItem[] {
  return [
    {
      id: "1",
      description: "Uploaded document 'Refund Policy.pdf'",
      timestamp: "2024-05-01 09:15",
    },
    {
      id: "2",
      description: "Asked a question about annual plan refunds",
      timestamp: "2024-05-01 09:20",
    },
    {
      id: "3",
      description: "Created Jira ticket JIRA-123",
      timestamp: "2024-05-01 10:05",
    },
  ];
}

export default function Dashboard() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setLoading(true);
      setError("");

      try {
        // Using mock/static data for now. Replace with real API calls
        // once a dashboard endpoint is available in the backend.
        const mockCards = getMockCards();
        const mockActivity = getMockActivity();

        if (isMounted) {
          setCards(mockCards);
          setActivity(mockActivity);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load dashboard data"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="page">
      <section className="container dashboard">
        <header>
          <h1 className="dashboard-heading">Dashboard</h1>
          <p className="subtitle">
            Overview of recent activity and key stats.
          </p>
        </header>

        {error && <p className="dashboard-error">{error}</p>}

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            <Cards cards={cards} />
            <RecentActivity items={activity} />
          </>
        )}
      </section>
    </main>
  );
}
