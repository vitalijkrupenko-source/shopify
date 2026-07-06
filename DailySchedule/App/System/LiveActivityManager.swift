import Foundation
#if canImport(ActivityKit)
import ActivityKit
#endif

/// Starts and keeps the Live Activity (lock-screen status + Dynamic Island) in
/// sync with what you're doing now. This is the "always know your task" surface:
/// a quiet status, never a nagging alert.
@MainActor
final class LiveActivityManager {
    static let shared = LiveActivityManager()
    private init() {}

    #if canImport(ActivityKit)
    private var activity: Activity<DailyActivityAttributes>?

    /// Recomputes the current/next state and pushes it to the Live Activity,
    /// starting one if needed. Safe to call as often as you like.
    func refresh(from data: ScheduleData, now: Date = Date()) {
        guard ActivityAuthorizationInfo().areActivitiesEnabled else { return }
        // Nothing to show before onboarding — don't start an empty activity.
        guard !data.blocks.isEmpty else { end(); return }

        let state = makeState(from: data, now: now)

        if let activity {
            Task { await activity.update(ActivityContent(state: state, staleDate: nil)) }
        } else {
            do {
                activity = try Activity.request(
                    attributes: DailyActivityAttributes(),
                    content: ActivityContent(state: state, staleDate: nil),
                    pushType: nil
                )
            } catch {
                // Activities may be disabled or over the system limit — no-op.
            }
        }
    }

    func end() {
        guard let activity else { return }
        Task { await activity.end(nil, dismissalPolicy: .immediate) }
        self.activity = nil
    }

    private func makeState(from data: ScheduleData, now: Date) -> DailyActivityAttributes.ContentState {
        let current = ScheduleEngine.current(at: now, in: data)
        let next = ScheduleEngine.next(after: now, in: data)

        var progress = 0.0
        if let current {
            let total = max(1, current.durationMinutes)
            let done = total - ScheduleEngine.minutesRemaining(in: current, from: now)
            progress = min(1, max(0, Double(done) / Double(total)))
        }

        return DailyActivityAttributes.ContentState(
            status: ScheduleEngine.statusLine(at: now, in: data),
            currentTitle: current?.title ?? "Free time",
            currentSymbol: current?.category.symbol ?? "circle.dashed",
            currentTintHex: hex(for: current?.category ?? .other),
            nextTitle: next?.title ?? "",
            nextTimeLabel: next.map { Clock.label(for: $0.start) } ?? "",
            progress: progress
        )
    }

    /// Mirror of `Category.tint`, as a hex the widget can rebuild without importing SwiftUI colors.
    private func hex(for category: Category) -> UInt32 {
        switch category {
        case .sleep: return 0x6C7AE0
        case .work: return 0x5B8DEF
        case .fitness: return 0xEF6F6C
        case .cooking: return 0xE8974A
        case .eating: return 0xE0A94A
        case .family: return 0xE07AA9
        case .selfCare: return 0x8E7AE0
        case .focus: return 0x4FB0AE
        case .errands: return 0x7AAE5B
        case .commute: return 0x8A94A6
        case .leisure: return 0x4FA3D1
        case .other: return 0x9AA0A6
        }
    }
    #else
    func refresh(from data: ScheduleData, now: Date = Date()) {}
    func end() {}
    #endif
}
