import SwiftUI

/// The hero card: what you're doing right now, with a soft progress ring and
/// the time left. Only shown when viewing today and inside a block.
struct NowCard: View {
    let block: ScheduleBlock
    let now: Date

    private var remaining: Int { ScheduleEngine.minutesRemaining(in: block, from: now) }
    private var progress: Double {
        let total = max(1, block.durationMinutes)
        return min(1, max(0, Double(total - remaining) / Double(total)))
    }

    var body: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle().stroke(Color.white.opacity(0.08), lineWidth: 6)
                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(block.category.tint, style: StrokeStyle(lineWidth: 6, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                Image(systemName: block.category.symbol)
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundStyle(block.category.tint)
            }
            .frame(width: 64, height: 64)
            .animation(.easeInOut, value: progress)

            VStack(alignment: .leading, spacing: 4) {
                Text("NOW")
                    .font(.caption2.weight(.bold))
                    .foregroundStyle(block.category.tint)
                    .tracking(1.5)
                Text(block.title)
                    .font(.title2.weight(.bold))
                    .foregroundStyle(Theme.textPrimary)
                Text("\(Clock.duration(remaining)) left · until \(Clock.label(for: block.end))")
                    .font(.subheadline)
                    .foregroundStyle(Theme.textSecondary)
            }
            Spacer(minLength: 0)
        }
        .padding(18)
        .background(
            LinearGradient(colors: [block.category.tint.opacity(0.18), block.category.tint.opacity(0.04)],
                           startPoint: .topLeading, endPoint: .bottomTrailing),
            in: RoundedRectangle(cornerRadius: Theme.corner, style: .continuous)
        )
        .overlay(
            RoundedRectangle(cornerRadius: Theme.corner, style: .continuous)
                .strokeBorder(block.category.tint.opacity(0.25), lineWidth: 1)
        )
    }
}
