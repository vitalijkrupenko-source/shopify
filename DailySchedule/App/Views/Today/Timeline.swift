import SwiftUI

/// The full day as a vertical timeline. Past blocks recede, the live block
/// glows, upcoming blocks sit calmly ahead.
struct DayTimelineView: View {
    let date: Date
    let now: Date
    let blocks: [ScheduleBlock]
    let onEdit: (ScheduleBlock) -> Void
    let onDelete: (ScheduleBlock) -> Void

    private var isToday: Bool { Calendar.current.isDateInToday(date) }
    private var nowMinute: Int { Clock.minutes(from: now) }

    var body: some View {
        VStack(spacing: 0) {
            if blocks.isEmpty {
                EmptyDay()
            } else {
                ForEach(Array(blocks.enumerated()), id: \.element.id) { index, block in
                    BlockRow(block: block, state: state(for: block), isLast: index == blocks.count - 1)
                        .contentShape(Rectangle())
                        .onTapGesture { onEdit(block) }
                        .contextMenu {
                            Button(role: .destructive) { onDelete(block) } label: {
                                Label("Remove", systemImage: "trash")
                            }
                        }
                }
            }
        }
    }

    private func state(for block: ScheduleBlock) -> BlockRow.State {
        guard isToday else { return .upcoming }
        if block.contains(minute: nowMinute) { return .current }
        return block.end <= nowMinute ? .past : .upcoming
    }
}

struct BlockRow: View {
    enum State { case past, current, upcoming }

    let block: ScheduleBlock
    let state: State
    let isLast: Bool

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            // Time rail
            VStack(spacing: 0) {
                Text(Clock.label(for: block.start))
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(state == .past ? Theme.textTertiary : Theme.textSecondary)
                    .monospacedDigit()
                Rectangle()
                    .fill(Color.white.opacity(0.06))
                    .frame(width: 1.5)
                    .frame(maxHeight: .infinity)
                    .opacity(isLast ? 0 : 1)
            }
            .frame(width: 58)

            // Card
            HStack(spacing: 13) {
                CategoryBadge(category: block.category, size: 42)
                VStack(alignment: .leading, spacing: 3) {
                    Text(block.title)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundStyle(Theme.textPrimary)
                    HStack(spacing: 6) {
                        Text(Clock.duration(block.durationMinutes))
                        if block.weekday != nil {
                            Text("·").foregroundStyle(Theme.textTertiary)
                            Label("added", systemImage: "mic.fill")
                                .labelStyle(.titleAndIcon)
                                .imageScale(.small)
                        }
                    }
                    .font(.caption)
                    .foregroundStyle(Theme.textSecondary)
                }
                Spacer(minLength: 0)
                if state == .current {
                    Circle().fill(block.category.tint).frame(width: 8, height: 8)
                }
            }
            .padding(13)
            .background(background)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.cardCorner, style: .continuous)
                    .strokeBorder(state == .current ? block.category.tint.opacity(0.35) : Theme.stroke, lineWidth: 1)
            )
            .padding(.bottom, 12)
        }
        .opacity(state == .past ? 0.45 : 1)
    }

    @ViewBuilder private var background: some View {
        if state == .current {
            RoundedRectangle(cornerRadius: Theme.cardCorner, style: .continuous)
                .fill(block.category.tint.opacity(0.12))
        } else {
            RoundedRectangle(cornerRadius: Theme.cardCorner, style: .continuous)
                .fill(Theme.card)
        }
    }
}

private struct EmptyDay: View {
    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: "moon.zzz.fill")
                .font(.system(size: 34))
                .foregroundStyle(Theme.textTertiary)
            Text("Nothing here yet")
                .font(.headline).foregroundStyle(Theme.textSecondary)
            Text("Tap the mic to add something to this day.")
                .font(.subheadline).foregroundStyle(Theme.textTertiary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 50)
    }
}
