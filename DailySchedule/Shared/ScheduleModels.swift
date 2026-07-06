import SwiftUI

// MARK: - Time helpers

/// A time of day stored as minutes since midnight (0...1439).
/// Simple, comparable, and trivially Codable — perfect for a schedule that
/// repeats every day.
enum Clock {
    static let minutesPerDay = 24 * 60

    /// Formats minutes-since-midnight as a short, locale-aware time ("7:30 AM").
    static func label(for minutes: Int) -> String {
        let m = ((minutes % minutesPerDay) + minutesPerDay) % minutesPerDay
        var components = DateComponents()
        components.hour = m / 60
        components.minute = m % 60
        let date = Calendar.current.date(from: components) ?? Date()
        let formatter = DateFormatter()
        formatter.setLocalizedDateFormatFromTemplate("jmm")
        return formatter.string(from: date)
    }

    /// Minutes since midnight for a given date.
    static func minutes(from date: Date) -> Int {
        let c = Calendar.current.dateComponents([.hour, .minute], from: date)
        return (c.hour ?? 0) * 60 + (c.minute ?? 0)
    }

    /// A compact duration label ("1h 30m", "45m").
    static func duration(_ minutes: Int) -> String {
        let h = minutes / 60
        let m = minutes % 60
        if h > 0 && m > 0 { return "\(h)h \(m)m" }
        if h > 0 { return "\(h)h" }
        return "\(m)m"
    }
}

// MARK: - Category

/// The kind of thing a block represents. Drives the icon and color so the
/// whole day reads at a glance.
enum Category: String, Codable, CaseIterable, Identifiable {
    case sleep, work, fitness, cooking, eating, family
    case selfCare, focus, errands, commute, leisure, other

    var id: String { rawValue }

    var title: String {
        switch self {
        case .sleep: return "Sleep"
        case .work: return "Work"
        case .fitness: return "Fitness"
        case .cooking: return "Cooking"
        case .eating: return "Eating"
        case .family: return "Family"
        case .selfCare: return "Self-care"
        case .focus: return "Focus"
        case .errands: return "Errands"
        case .commute: return "Commute"
        case .leisure: return "Leisure"
        case .other: return "Other"
        }
    }

    /// SF Symbol used everywhere this category appears.
    var symbol: String {
        switch self {
        case .sleep: return "moon.stars.fill"
        case .work: return "laptopcomputer"
        case .fitness: return "figure.run"
        case .cooking: return "frying.pan.fill"
        case .eating: return "fork.knife"
        case .family: return "figure.2.and.child.holdinghands"
        case .selfCare: return "sparkles"
        case .focus: return "brain.head.profile"
        case .errands: return "bag.fill"
        case .commute: return "car.fill"
        case .leisure: return "cup.and.saucer.fill"
        case .other: return "circle.fill"
        }
    }

    /// Accent color. Kept muted and premium — no neon.
    var tint: Color {
        switch self {
        case .sleep: return Color(hex: 0x6C7AE0)
        case .work: return Color(hex: 0x5B8DEF)
        case .fitness: return Color(hex: 0xEF6F6C)
        case .cooking: return Color(hex: 0xE8974A)
        case .eating: return Color(hex: 0xE0A94A)
        case .family: return Color(hex: 0xE07AA9)
        case .selfCare: return Color(hex: 0x8E7AE0)
        case .focus: return Color(hex: 0x4FB0AE)
        case .errands: return Color(hex: 0x7AAE5B)
        case .commute: return Color(hex: 0x8A94A6)
        case .leisure: return Color(hex: 0x4FA3D1)
        case .other: return Color(hex: 0x9AA0A6)
        }
    }
}

// MARK: - Blocks

/// One entry on the daily timeline. A block is either part of the recurring
/// daily template (`weekday == nil`, happens every day) or an appointment
/// pinned to a single weekday added by voice.
struct ScheduleBlock: Codable, Identifiable, Equatable {
    var id: UUID = UUID()
    var title: String
    var category: Category
    /// Minutes since midnight.
    var start: Int
    /// Minutes since midnight. May be < start only for the wrap-around sleep block.
    var end: Int
    /// nil = recurring every day. 1 (Sunday) ... 7 (Saturday) = only that weekday.
    var weekday: Int?

    var isRecurring: Bool { weekday == nil }

    var durationMinutes: Int {
        let raw = end - start
        return raw >= 0 ? raw : (Clock.minutesPerDay - start) + end
    }

    var timeRangeLabel: String {
        "\(Clock.label(for: start)) – \(Clock.label(for: end))"
    }

    /// True when `minute` (since midnight) falls inside this block.
    func contains(minute: Int) -> Bool {
        if end >= start {
            return minute >= start && minute < end
        }
        // Wrap-around (e.g. sleep 23:00 → 07:00).
        return minute >= start || minute < end
    }
}

// MARK: - Root document

/// Everything the app persists. One small JSON file, shared with the widgets
/// through the App Group container.
struct ScheduleData: Codable, Equatable {
    var blocks: [ScheduleBlock] = []
    var hasOnboarded: Bool = false
    /// Lead time (minutes) for the gentle "coming up" heads-up.
    var reminderLeadMinutes: Int = 45
    var remindersEnabled: Bool = true

    static let empty = ScheduleData()

    init(blocks: [ScheduleBlock] = [], hasOnboarded: Bool = false,
         reminderLeadMinutes: Int = 45, remindersEnabled: Bool = true) {
        self.blocks = blocks
        self.hasOnboarded = hasOnboarded
        self.reminderLeadMinutes = reminderLeadMinutes
        self.remindersEnabled = remindersEnabled
    }

    // Tolerant decoding: missing keys fall back to defaults so an app update
    // that adds a field never discards a user's saved schedule.
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        blocks = try c.decodeIfPresent([ScheduleBlock].self, forKey: .blocks) ?? []
        hasOnboarded = try c.decodeIfPresent(Bool.self, forKey: .hasOnboarded) ?? false
        reminderLeadMinutes = try c.decodeIfPresent(Int.self, forKey: .reminderLeadMinutes) ?? 45
        remindersEnabled = try c.decodeIfPresent(Bool.self, forKey: .remindersEnabled) ?? true
    }
}
