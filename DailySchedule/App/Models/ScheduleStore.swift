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
        data.exceptions.removeAll()
        data.hasOnboarded = true
        commit()
    }

    func add(_ block: ScheduleBlock) {
        data.blocks.append(block)
        commit()
    }

    /// Executes a parsed voice command.
    func apply(_ action: VoiceAction) {
        switch action {
        case .add(let block):
            data.blocks.append(block)

        case .addAndPush(let block, let delta, let weekday):
            shift(weekday: weekday, from: block.start, by: delta, skipping: block.id)
            data.blocks.append(block)

        case .shift(let weekday, let from, let delta):
            shift(weekday: weekday, from: from, by: delta, skipping: nil)

        case .move(let block, let newStart, let weekday, let everyDay):
            let duration = block.durationMinutes
            if block.isRecurring && !everyDay {
                // One day only: hide the template block that day, add a moved copy.
                data.exceptions.append(DayException(weekday: weekday, blockID: block.id))
                var copy = block
                copy.id = UUID()
                copy.weekday = weekday
                copy.start = newStart
                copy.end = clamp(newStart + duration)
                data.blocks.append(copy)
            } else if let idx = data.blocks.firstIndex(where: { $0.id == block.id }) {
                data.blocks[idx].start = newStart
                data.blocks[idx].end = clamp(newStart + duration)
            }

        case .cancel(let block, let weekday, let everyDay):
            if block.isRecurring && !everyDay {
                data.exceptions.append(DayException(weekday: weekday, blockID: block.id))
            } else {
                data.blocks.removeAll { $0.id == block.id }
            }
        }
        commit()
    }

    /// Moves every non-sleep block on `weekday` starting at/after `from` by
    /// `delta` minutes. Recurring blocks are hidden that day and replaced by a
    /// shifted weekday copy, so the daily template stays untouched.
    private func shift(weekday: Int, from: Int, by delta: Int, skipping skipID: UUID?) {
        let affected = ScheduleEngine.blocks(forWeekday: weekday, in: data)
            .filter { $0.category != .sleep && $0.id != skipID && $0.start >= from }
        for block in affected {
            if block.isRecurring {
                data.exceptions.append(DayException(weekday: weekday, blockID: block.id))
                var copy = block
                copy.id = UUID()
                copy.weekday = weekday
                copy.start = clamp(block.start + delta)
                copy.end = clamp(block.end + delta)
                data.blocks.append(copy)
            } else if let idx = data.blocks.firstIndex(where: { $0.id == block.id }) {
                data.blocks[idx].start = clamp(block.start + delta)
                data.blocks[idx].end = clamp(block.end + delta)
            }
        }
    }

    private func clamp(_ minutes: Int) -> Int {
        max(0, min(Clock.minutesPerDay - 1, minutes))
    }

    func update(_ block: ScheduleBlock) {
        guard let idx = data.blocks.firstIndex(where: { $0.id == block.id }) else { return }
        data.blocks[idx] = block
        commit()
    }

    func remove(_ block: ScheduleBlock) {
        data.blocks.removeAll { $0.id == block.id }
        data.exceptions.removeAll { $0.blockID == block.id }
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
