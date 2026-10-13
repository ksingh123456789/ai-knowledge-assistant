import "../Dashboard.css";

export type CardData = {
  title: string;
  value: string | number;
};

type CardsProps = {
  cards: CardData[];
};

export default function Cards({ cards }: CardsProps) {
  if (!cards || cards.length === 0) {
    return <p className="empty-state">No summary data available.</p>;
  }

  return (
    <div className="cards-grid">
      {cards.map((card, index) => (
        <div className="stat-card" key={`${card.title}-${index}`}>
          <p className="stat-card-title" title={card.title}>
            {card.title}
          </p>
          <p className="stat-card-value" title={String(card.value)}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
