import WidgetKit
import SwiftUI

// MARK: - Timeline entry

struct DayEntry: TimelineEntry {
    let date: Date
    let status: String
    let current: ScheduleBlock?
    let next: ScheduleBlock?
    let progress: Double
}

private func snapshot(at date: Date, data: ScheduleData) -> DayEntry {
    let current = ScheduleEngine.current(at: date, in: data)
    let next = ScheduleEngine.next(after: date, in: data)
    var progress = 0.0
    if let current {
        let total = max(1, current.durationMinutes)
        progress = Double(total - ScheduleEngine.minutesRemaining(in: current, from: date)) / Double(total)
    }
    return DayEntry(date: date,
                    status: ScheduleEngine.statusLine(at: date, in: data),
                    current: current, next: next,
                    progress: min(1, max(0, progress)))
}

// MARK: - Provider

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> DayEntry {
        snapshot(at: Date(), data: sampleData)
    }

    func getSnapshot(in context: Context, completion: @escaping (DayEntry) -> Void) {
        let data = context.isPreview ? sampleData : SharedStore.load()
        completion(snapshot(at: Date(), data: data))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<DayEntry>) -> Void) {
        let data = SharedStore.load()
        let now = Date()
        let cal = Calendar.current

        // An entry now, then one at each remaining block boundary today so the
        // widget flips to the right task exactly on time.
        var dates: [Date] = [now]
        let nowMinute = Clock.minutes(from: now)
        for block in ScheduleEngine.blocks(for: now, in: data) {
            for boundary in [block.start, block.end] where boundary > nowMinute {
                if let d = cal.date(bySettingHour: boundary / 60, minute: boundary % 60, second: 0, of: now) {
                    dates.append(d)
                }
            }
        }
        dates = Array(Set(dates)).sorted()

        let entries = dates.map { snapshot(at: $0, data: data) }
        // Refresh again at the start of tomorrow.
        let tomorrow = cal.startOfDay(for: cal.date(byAdding: .day, value: 1, to: now) ?? now)
        completion(Timeline(entries: entries, policy: .after(tomorrow)))
    }
}

/// Shown in the gallery / previews before real data exists.
private let sampleData = ScheduleData(blocks: [
    ScheduleBlock(title: "Training", category: .fitness, start: 18 * 60, end: 19 * 60, weekday: nil),
    ScheduleBlock(title: "Cook", category: .cooking, start: 19 * 60, end: 19 * 60 + 45, weekday: nil),
], hasOnboarded: true)

// MARK: - Widget

struct DailyScheduleWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "DailyScheduleWidget", provider: Provider()) { entry in
            DailyWidgetView(entry: entry)
                .containerBackground(for: .widget) { Theme.bg }
        }
        .configurationDisplayName("Your Day")
        .description("The task you're on now, and what's next.")
        .supportedFamilies([
            .systemSmall, .systemMedium,
            .accessoryInline, .accessoryCircular, .accessoryRectangular,
        ])
    }
}

// MARK: - Views per family

struct DailyWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: DayEntry

    var body: some View {
        switch family {
        case .accessoryInline:      inline
        case .accessoryCircular:    circular
        case .accessoryRectangular: rectangular
        case .systemMedium:         medium
        default:                    small
        }
    }

    private var tint: Color { entry.current?.category.tint ?? .gray }
    private var symbol: String { entry.current?.category.symbol ?? "circle.dashed" }

    // Lock screen — inline
    private var inline: some View {
        Label(entry.status, systemImage: symbol)
    }

    // Lock screen — circular ring
    private var circular: some View {
        Gauge(value: entry.progress) {
            Image(systemName: symbol)
        }
        .gaugeStyle(.accessoryCircularCapacity)
    }

    // Lock screen — rectangular
    private var rectangular: some View {
        VStack(alignment: .leading, spacing: 2) {
            Label {
                Text(entry.current?.title ?? "Free time").fontWeight(.semibold)
            } icon: {
                Image(systemName: symbol)
            }
            .font(.headline)
            Text(entry.status).font(.caption).foregroundStyle(.secondary)
            if let next = entry.next {
                Text("Next · \(next.title) at \(Clock.label(for: next.start))")
                    .font(.caption2).foregroundStyle(.secondary)
            }
        }
    }

    // Home screen — small
    private var small: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: symbol)
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundStyle(tint)
                Spacer()
                if entry.current != nil {
                    ProgressRing(progress: entry.progress, tint: tint).frame(width: 24, height: 24)
                }
            }
            Spacer()
            Text(entry.current?.title ?? "Free time")
                .font(.system(size: 19, weight: .bold))
                .foregroundStyle(.white)
            Text(entry.status)
                .font(.caption).foregroundStyle(.white.opacity(0.6))
                .lineLimit(2)
        }
        .padding(4)
    }

    // Home screen — medium
    private var medium: some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 6) {
                Text("NOW").font(.caption2.weight(.bold)).foregroundStyle(tint).tracking(1.5)
                HStack(spacing: 8) {
                    Image(systemName: symbol).foregroundStyle(tint)
                    Text(entry.current?.title ?? "Free time")
                        .font(.system(size: 20, weight: .bold)).foregroundStyle(.white)
                }
                Text(entry.status).font(.caption).foregroundStyle(.white.opacity(0.6))
                Spacer()
                if let next = entry.next {
                    HStack(spacing: 8) {
                        Image(systemName: next.category.symbol)
                            .font(.caption).foregroundStyle(next.category.tint)
                        Text("\(next.title) · \(Clock.label(for: next.start))")
                            .font(.caption).foregroundStyle(.white.opacity(0.75))
                    }
                }
            }
            Spacer()
            if entry.current != nil {
                ProgressRing(progress: entry.progress, tint: tint).frame(width: 52, height: 52)
            }
        }
        .padding(6)
    }
}

struct ProgressRing: View {
    let progress: Double
    let tint: Color
    var body: some View {
        ZStack {
            Circle().stroke(tint.opacity(0.2), lineWidth: 5)
            Circle().trim(from: 0, to: progress)
                .stroke(tint, style: StrokeStyle(lineWidth: 5, lineCap: .round))
                .rotationEffect(.degrees(-90))
        }
    }
}
