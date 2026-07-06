import Foundation

/// The result of understanding a spoken (or typed) command.
struct ParsedCommand {
    var block: ScheduleBlock?
    /// A short, friendly echo of what we understood.
    var summary: String
    var understood: Bool { block != nil }
}

/// Turns natural phrases like "add training on Wednesday from 7pm till 9pm"
/// into a `ScheduleBlock`. Fully on-device — no network, no API keys.
enum CommandParser {

    static func parse(_ raw: String, now: Date = Date()) -> ParsedCommand {
        let text = raw.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return ParsedCommand(block: nil, summary: "I didn't catch that") }

        let weekday = parseWeekday(text, now: now)
        guard let (start, end) = parseTimes(text) else {
            return ParsedCommand(block: nil, summary: "Try: \u{201C}add gym on Wednesday from 7 to 9pm\u{201D}")
        }

        let title = parseTitle(text)
        let category = parseCategory(title.isEmpty ? text : title)
        let finalTitle = title.isEmpty ? category.title : title.capitalizedFirst

        let block = ScheduleBlock(title: finalTitle, category: category,
                                  start: start, end: end, weekday: weekday.value)

        let when = weekday.label
        let summary = "\(finalTitle) · \(when) \(Clock.label(for: start))\u{2013}\(Clock.label(for: end))"
        return ParsedCommand(block: block, summary: summary)
    }

    // MARK: Weekday

    private static let weekdayNames: [(String, Int)] = [
        ("sunday", 1), ("monday", 2), ("tuesday", 3), ("wednesday", 4),
        ("thursday", 5), ("friday", 6), ("saturday", 7),
        ("sun", 1), ("mon", 2), ("tue", 3), ("wed", 4), ("thu", 5), ("fri", 6), ("sat", 7),
    ]

    private static func parseWeekday(_ text: String, now: Date) -> (value: Int?, label: String) {
        let cal = Calendar.current
        if text.contains("everyday") || text.contains("every day") || text.contains("daily") {
            return (nil, "every day")
        }
        if text.contains("tomorrow") {
            let d = cal.date(byAdding: .day, value: 1, to: now) ?? now
            return (cal.component(.weekday, from: d), "tomorrow")
        }
        if text.contains("today") {
            return (cal.component(.weekday, from: now), "today")
        }
        for (name, value) in weekdayNames where text.contains(name) {
            let full = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][value - 1]
            return (value, full)
        }
        // No day mentioned → treat as today.
        return (cal.component(.weekday, from: now), "today")
    }

    // MARK: Times

    /// Returns (startMinutes, endMinutes).
    private static func parseTimes(_ text: String) -> (Int, Int)? {
        // Pattern A: "from X to/till/until/- Y"
        if let match = firstMatch(in: text,
            pattern: #"(?:from\s+)?(\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)?)\s*(?:to|till|until|through|[-–])\s*(\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)?)"#),
           let startStr = match[1], let endStr = match[2],
           let s = clockToMinutes(startStr), var e = clockToMinutes(endStr) {
            // "7 to 9" with no am/pm on the end → keep the range on the same
            // side of the clock as the start.
            if e <= s && e < 12 * 60 { e += 12 * 60 }
            return (s, e % Clock.minutesPerDay)
        }

        // Pattern B: "at X for N hours/minutes" (or just "at X")
        if let match = firstMatch(in: text,
            pattern: #"at\s+(\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)?)(?:\s+for\s+(\d+)\s*(hours?|hrs?|minutes?|mins?))?"#),
           let startStr = match[1], let start = clockToMinutes(startStr) {
            let duration = durationMinutes(count: match[2], unit: match[3]) ?? 60
            return (start, (start + duration) % Clock.minutesPerDay)
        }

        // Pattern C: a lone explicit time anywhere ("gym at 6pm").
        if let match = firstMatch(in: text,
            pattern: #"(\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?))"#),
           let startStr = match[1], let start = clockToMinutes(startStr) {
            return (start, (start + 60) % Clock.minutesPerDay)
        }
        return nil
    }

    private static func durationMinutes(count: String?, unit: String?) -> Int? {
        guard let count, let n = Int(count) else { return nil }
        let isHours = unit?.hasPrefix("h") ?? false
        return isHours ? n * 60 : n
    }

    /// Converts a clock fragment like "7", "7pm", "7:30 am", "19:00" to minutes.
    private static func clockToMinutes(_ fragment: String) -> Int? {
        let s = fragment.replacingOccurrences(of: " ", with: "")
            .replacingOccurrences(of: ".", with: "")
        guard let m = firstMatch(in: s, pattern: #"(\d{1,2})(?::(\d{2}))?(am|pm)?"#) else { return nil }
        guard var hour = Int(m[1]) else { return nil }
        let minute = Int(m[2] ?? "0") ?? 0
        let meridiem = m[3]

        if meridiem == "pm" {
            if hour < 12 { hour += 12 }
        } else if meridiem == "am" {
            if hour == 12 { hour = 0 }
        } else {
            // No am/pm: assume 24h if >= 13, otherwise a friendly daytime guess.
            if hour <= 7 { hour += 12 }        // "meet at 6" → 6 PM
        }
        guard hour < 24, minute < 60 else { return nil }
        return hour * 60 + minute
    }

    // MARK: Title & category

    private static let noiseWords: Set<String> = [
        "add", "me", "a", "an", "the", "please", "schedule", "put", "book",
        "on", "at", "from", "to", "till", "until", "through", "for", "of",
        "everyday", "every", "day", "daily", "today", "tomorrow",
        "am", "pm", "a.m.", "p.m.", "hour", "hours", "hr", "hrs", "minute",
        "minutes", "min", "mins",
    ]

    private static func parseTitle(_ text: String) -> String {
        var cleaned = text
        // Strip time expressions first.
        for pattern in [
            #"(?:from\s+)?\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)?\s*(?:to|till|until|through|[-–])\s*\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)?"#,
            #"at\s+\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)?(?:\s+for\s+\d+\s*\w+)?"#,
            #"\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)"#,
        ] {
            cleaned = replace(in: cleaned, pattern: pattern, with: " ")
        }
        for (name, _) in weekdayNames { cleaned = cleaned.replacingOccurrences(of: name, with: " ") }

        let words = cleaned
            .components(separatedBy: CharacterSet.alphanumerics.inverted)
            .filter { !$0.isEmpty && !noiseWords.contains($0) }
        return words.joined(separator: " ").trimmingCharacters(in: .whitespaces)
    }

    private static let categoryKeywords: [(Category, [String])] = [
        (.fitness, ["gym", "train", "training", "workout", "work out", "run", "running", "exercise", "fitness", "yoga", "lift"]),
        (.cooking, ["cook", "cooking", "meal prep", "bake", "kitchen"]),
        (.eating, ["breakfast", "lunch", "dinner", "eat", "brunch", "snack", "coffee"]),
        (.work, ["work", "meeting", "call", "standup", "email", "office", "client", "interview"]),
        (.family, ["baby", "kids", "family", "child", "children", "school run", "partner", "date"]),
        (.selfCare, ["shower", "meditate", "meditation", "skincare", "relax", "wind down", "bath"]),
        (.focus, ["study", "read", "reading", "learn", "focus", "write", "writing", "practice", "code"]),
        (.errands, ["shop", "shopping", "groceries", "grocery", "errand", "clean", "laundry", "chores", "bank"]),
        (.commute, ["drive", "commute", "travel", "flight", "train ride"]),
        (.leisure, ["walk", "game", "movie", "tv", "hobby", "guitar", "music", "park"]),
    ]

    private static func parseCategory(_ text: String) -> Category {
        let lower = text.lowercased()
        for (category, keys) in categoryKeywords where keys.contains(where: { lower.contains($0) }) {
            return category
        }
        return .other
    }

    // MARK: Regex plumbing

    /// Returns capture groups (index 0 = full match) for the first match, with
    /// empty optional groups as nil.
    private static func firstMatch(in text: String, pattern: String) -> [String?]? {
        guard let regex = try? NSRegularExpression(pattern: pattern, options: [.caseInsensitive]) else { return nil }
        let range = NSRange(text.startIndex..., in: text)
        guard let match = regex.firstMatch(in: text, options: [], range: range) else { return nil }
        return (0..<match.numberOfRanges).map { i in
            let r = match.range(at: i)
            guard r.location != NSNotFound, let sr = Range(r, in: text) else { return nil }
            return String(text[sr])
        }
    }

    private static func replace(in text: String, pattern: String, with replacement: String) -> String {
        guard let regex = try? NSRegularExpression(pattern: pattern, options: [.caseInsensitive]) else { return text }
        let range = NSRange(text.startIndex..., in: text)
        return regex.stringByReplacingMatches(in: text, options: [], range: range, withTemplate: replacement)
    }
}

extension String {
    var capitalizedFirst: String {
        guard let first else { return self }
        return first.uppercased() + dropFirst()
    }
}
