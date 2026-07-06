import Foundation

/// Pure, testable logic that turns the stored blocks into "what's happening on
/// a given day / right now". Shared verbatim between the app and the widgets so
/// they can never disagree about your schedule.
enum ScheduleEngine {

    /// The ordered list of blocks for a specific date: every recurring block
    /// (not hidden that weekday) plus any appointments pinned to that weekday.
    static func blocks(for date: Date, in data: ScheduleData) -> [ScheduleBlock] {
        blocks(forWeekday: Calendar.current.component(.weekday, from: date), in: data)
    }

    static func blocks(forWeekday weekday: Int, in data: ScheduleData) -> [ScheduleBlock] {
        data.blocks
            .filter { $0.isRecurring ? !data.isHidden($0, on: weekday) : $0.weekday == weekday }
            .sorted { $0.start < $1.start }
    }

    /// The block you're inside of at `date`, if any.
    static func current(at date: Date, in data: ScheduleData) -> ScheduleBlock? {
        let minute = Clock.minutes(from: date)
        // Prefer a same-day appointment over the recurring template on overlap.
        let today = blocks(for: date, in: data).filter { $0.contains(minute: minute) }
        return today.sorted { ($0.weekday != nil ? 0 : 1) < ($1.weekday != nil ? 0 : 1) }.first
    }

    /// The next block that starts strictly after `date` (today only).
    static func next(after date: Date, in data: ScheduleData) -> ScheduleBlock? {
        let minute = Clock.minutes(from: date)
        return blocks(for: date, in: data)
            .filter { $0.start > minute }
            .min { $0.start < $1.start }
    }

    /// Minutes until a block starts, from `date`.
    static func minutesUntilStart(of block: ScheduleBlock, from date: Date) -> Int {
        max(0, block.start - Clock.minutes(from: date))
    }

    /// Minutes left in a block you're currently inside.
    static func minutesRemaining(in block: ScheduleBlock, from date: Date) -> Int {
        let minute = Clock.minutes(from: date)
        if block.end >= block.start {
            return max(0, block.end - minute)
        }
        return minute >= block.start
            ? (Clock.minutesPerDay - minute) + block.end
            : max(0, block.end - minute)
    }

    /// A single short status line — the heart of the "always know your task"
    /// experience. Used by notifications, the widget, and the Live Activity.
    static func statusLine(at date: Date, in data: ScheduleData) -> String {
        if let now = current(at: date, in: data) {
            return "You're \(gerund(now.title))"
        }
        if let upcoming = next(after: date, in: data) {
            let mins = minutesUntilStart(of: upcoming, from: date)
            return "In \(Clock.duration(mins)): \(upcoming.title)"
        }
        return "Nothing scheduled"
    }

    /// Turns a task title into a natural "You're ___" phrase.
    private static func gerund(_ title: String) -> String {
        let lower = title.lowercased()
        return lower.hasSuffix("ing") ? lower : "at \(title)"
    }
}
