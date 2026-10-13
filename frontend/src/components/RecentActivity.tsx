import "../Dashboard.css";

export type ActivityItem = {
  id: string;
  description: string;
  timestamp: string;
};

type RecentActivityProps = {
  items: ActivityItem[];
};

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section className="card recent-activity">
      <h2>Recent Activity</h2>

      {items && items.length > 0 ? (
        <ul className="activity-list">
          {items.map((item) => (
            <li className="activity-item" key={item.id}>
              <span className="activity-description" title={item.description}>
                {item.description}
              </span>
              <span className="activity-timestamp">{item.timestamp}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">No recent activity to show.</p>
      )}
    </section>
  );
}
