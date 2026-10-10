import { DeliveredSentIcon, CheckmarkCircleIcon } from './AccountIcons.jsx';

// Status pill used by My Orders ("Shipped", blue) and Order Details ("Completed", green)
const KINDS = {
  shipped: { label: 'Shipped', tone: 'blue', Icon: DeliveredSentIcon },
  completed: { label: 'Completed', tone: 'green', Icon: CheckmarkCircleIcon },
};

export default function StatusBadge({ status }) {
  const { label, tone, Icon } = KINDS[status];
  return (
    <span className={`status status--${tone}`}>
      <span className="status__in"><Icon /> {label}</span>
    </span>
  );
}
