import { ApprovalEvent } from "../lib/studio-api";
import {
  EmptyState,
  EventBadge,
  StatusBadge,
  formatDate,
} from "./studio-ui";

export function ApprovalTimeline({
  events,
}: {
  events: ApprovalEvent[];
}) {
  if (!events.length) {
    return (
      <EmptyState
        title="Nenhum evento operacional"
        description="Nenhum evento operacional registrado ainda."
      />
    );
  }

  const orderedEvents = [...events].sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );

  return (
    <div className="space-y-4">
      {orderedEvents.map((event) => (
        <div
          key={event.id}
          className="rounded-[1.5rem] border border-[color:var(--border)] bg-white/90 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <EventBadge value={event.event_type} />
                {event.to_status ? <StatusBadge value={event.to_status} /> : null}
              </div>
              <p className="mt-3 text-sm font-semibold text-[color:var(--foreground)]">
                {event.actor_name || "Sistema"} · {event.actor_type}
              </p>
            </div>
            <p className="text-sm text-[color:var(--muted)]">
              {formatDate(event.created_at)}
            </p>
          </div>

          {event.from_status || event.to_status ? (
            <p className="mt-3 text-sm text-[color:var(--ink-soft)]">
              {event.from_status ? event.from_status : "—"} →{" "}
              {event.to_status ? event.to_status : "—"}
            </p>
          ) : null}

          {event.comment ? (
            <p className="mt-3 rounded-xl bg-[color:var(--background)] px-3 py-2 text-sm leading-6 text-[color:var(--ink-soft)]">
              {event.comment}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
