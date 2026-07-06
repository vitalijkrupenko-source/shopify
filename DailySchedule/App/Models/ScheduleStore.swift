import SwiftUI
import WidgetKit

/// The single source of truth for the running app. Wraps `ScheduleData`,
/// persists every change to the shared App Group file, and nudges the widgets,
/// notifications, and Live Activity to stay in sync.
@MainActor
final class ScheduleStore: ObservableObject {
    @Published private(set) var data: ScheduleData

    init() {
        self.data = SharedStore.load()
    }

    // MARK: Derived

    var hasOnboarded: Bool { data.hasOnboarded }

    func blocks(for date: Date) -> [ScheduleBlock] {
        ScheduleEngine.blocks(for: date, in: data)
    }

    func current(at date: Date) -> ScheduleBlock? {
        ScheduleEngine.current(at: date, in: data)
    }

    func next(after date: Date) -> ScheduleBlock? {
        ScheduleEngine.next(after: date, in: data)
    }

    // MARK: Mutations

    /// Replaces the recurring template (used at the end of onboarding).
    func setTemplate(_ blocks: [ScheduleBlock]) {
        data.blocks.removeAll { $0.isRecurring }
        data.blocks.append(contentsOf: blocks)
        data.hasOnboarded = true
        commit()
    }

    func add(_ block: ScheduleBlock) {
        data.blocks.append(block)
        commit()
    }

    func update(_ block: ScheduleBlock) {
        guard let idx = data.blocks.firstIndex(where: { $0.id == block.id }) else { return }
        data.blocks[idx] = block
        commit()
    }

    func remove(_ block: ScheduleBlock) {
        data.blocks.removeAll { $0.id == block.id }
        commit()
    }

    func setRemindersEnabled(_ on: Bool) {
        data.remindersEnabled = on
        commit()
    }

    func setReminderLead(_ minutes: Int) {
        data.reminderLeadMinutes = minutes
        commit()
    }

    /// Wipes everything and returns to onboarding.
    func reset() {
        data = .empty
        commit()
    }

    // MARK: Sync

    /// Persist + fan out to everything that mirrors the schedule.
    private func commit() {
        SharedStore.save(data)
        WidgetCenter.shared.reloadAllTimelines()
        NotificationScheduler.reschedule(from: data)
        LiveActivityManager.shared.refresh(from: data)
    }

    /// Called from the scene's active/foreground transitions so the "now"
    /// state (Live Activity, badge-free status) is fresh without a mutation.
    func refreshLiveState() {
        LiveActivityManager.shared.refresh(from: data)
    }
}
