import Foundation

/// What a spoken (or typed) command asks the app to do.
enum VoiceAction {
    case add(ScheduleBlock)
    /// "I have a meeting at 3, push everything else later" — add the block and
    /// shift every later block on that weekday by `delta` minutes.
    case addAndPush(ScheduleBlock, delta: Int, weekday: Int)
    /// "Push everything back an hour" — shift blocks starting at/after `from`.
    case shift(weekday: Int, from: Int, delta: Int)
    /// "Move dinner to 8pm."
    case move(ScheduleBlock, newStart: Int, weekday: Int, everyDay: Bool)
    /// "Cancel gym today."
    case cancel(ScheduleBlock, weekday: Int, everyDay: Bool)
}

/// The result of understanding a command.
struct ParsedCommand {
    var action: VoiceAction?
    /// A short, friendly echo of what we understood (or a hint on failure).
    var summary: String
    /// Second line of the confirm card, e.g. "today 3 PM–4 PM".
    var detail: String = ""
    /// Category for the confirm card badge.
    var category: Category = .other
    var understood: Bool { action != nil }
}

/// Turns natural phrases into schedule actions. Plain pattern matching, fully
/// on-device — no AI, no network, no API keys.
enum CommandParser {

    /// `data` is needed so "move dinner…" / "cancel gym…" can find their target.
    static func parse(_ raw: String, in data: ScheduleData, now: Date = Date()) -> ParsedCommand {
        var text = raw.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        text = replace(in: text, pattern: #"\bnoon\b|\bmidday\b"#, with: "12pm")
        text = replace(in: text, pattern: #"\bmidnight\b"#, with: "12am")
        guard !text.isEmpty else { return ParsedCommand(action: nil, summary: "I didn't catch that") }

        let day = parseWeekday(text, now: now)
        let cal = Calendar.current
        let weekday = day.value ?? cal.component(.weekday, from: now)

        // --- cancel ---------------------------------------------------------
        if matches(text, pattern: #"\b(cancel|delete|remove)\b"#) {
            let query = parseTitle(replace(in: text, pattern: #"\b(cancel|delete|remove)\b"#, with: " "))
            guard !query.isEmpty else {
                return ParsedCommand(action: nil, summary: "What should I cancel? Try \u{201C}cancel gym today\u{201D}.")
            }
            guard let hit = findBlock(query, weekday: weekday, in: data) else {
                return ParsedCommand(action: nil, summary: "Couldn't find \u{201C}\(query)\u{201D} \(day.label == "every day" ? "" : day.label).")
            }
            return ParsedCommand(action: .cancel(hit, weekday: weekday, everyDay: day.value == nil),
                                 summary: "Remove \(hit.title)",
                                 detail: "\(day.label) · \(hit.timeRangeLabel)",
                                 category: hit.category)
        }

        // --- push everything later -------------------------------------------
        if let pushRange = range(of: #"\b(?:push|shift|move|bump)\b\s+(?:back\s+)?(?:everything(?:\s+else)?|all\s+(?:my\s+)?(?:tasks?|blocks?)|the\s+rest(?:\s+of\s+(?:the|my)\s+day)?)"#, in: text) {
            let before = String(text[..<pushRange.lowerBound])
            let amount = shiftAmount(text)
            let earlier = matches(text, pattern: #"\bearlier\b"#)

            if let (start, end) = parseTimes(before) {
                // Composite: add the event, push what follows it.
                let title = parseTitle(before)
                let category = parseCategory(title.isEmpty ? before : title)
                let block = ScheduleBlock(title: title.isEmpty ? category.title : title.capitalizedFirst,
                                          category: category, start: start, end: end,
                                          weekday: day.value ?? weekday)
                let delta = (amount ?? block.durationMinutes) * (earlier ? -1 : 1)
                let count = affectedCount(weekday: weekday, from: block.start, in: data)
                return ParsedCommand(action: .addAndPush(block, delta: delta, weekday: weekday),
                                     summary: block.title,
                                     detail: "\(day.label) \(block.timeRangeLabel) · moves the next \(count) block\(count == 1 ? "" : "s") \(Clock.duration(abs(delta))) \(earlier ? "earlier" : "later")",
                                     category: block.category)
            }
            // Pure shift.
            let delta = (amount ?? 60) * (earlier ? -1 : 1)
            let from = (day.label == "today") ? Clock.minutes(from: now) : 0
            let count = affectedCount(weekday: weekday, from: from, in: data)
            guard count > 0 else {
                return ParsedCommand(action: nil, summary: "Nothing left to move \(day.label).")
            }
            return ParsedCommand(action: .shift(weekday: weekday, from: from, delta: delta),
                                 summary: "Push \(count) block\(count == 1 ? "" : "s") \(earlier ? "earlier" : "later")",
                                 detail: "\(day.label) · everything after \(Clock.label(for: from)) moves \(Clock.duration(abs(delta))) \(earlier ? "earlier" : "later")")
        }

        // --- move one thing ---------------------------------------------------
        if matches(text, pattern: #"\b(move|reschedule)\b"#) {
            guard let (newStart, _) = parseTimes(text) else {
                return ParsedCommand(action: nil, summary: "Say the new time — \u{201C}move dinner to 8pm\u{201D}.")
            }
            let query = parseTitle(replace(in: text, pattern: #"\b(move|reschedule)\b"#, with: " "))
            guard !query.isEmpty, let hit = findBlock(query, weekday: weekday, in: data) else {
                return ParsedCommand(action: nil, summary: "Couldn't find \u{201C}\(query.isEmpty ? "that" : query)\u{201D} \(day.label == "every day" ? "" : day.label).")
            }
            return ParsedCommand(action: .move(hit, newStart: newStart, weekday: weekday, everyDay: day.value == nil),
                                 summary: "Move \(hit.title)",
                                 detail: "\(day.label) · \(Clock.label(for: hit.start)) → \(Clock.label(for: newStart))",
                                 category: hit.category)
        }

        // --- plain add ---------------------------------------------------------
        guard let (start, end) = parseTimes(text) else {
            return ParsedCommand(action: nil, summary: "Try: \u{201C}add gym on Wednesday from 7 to 9pm\u{201D}")
        }
        let title = parseTitle(text)
        let category = parseCategory(title.isEmpty ? text : title)
        let block = ScheduleBlock(title: title.isEmpty ? category.title : title.capitalizedFirst,
                                  category: category, start: start, end: end, weekday: day.value)
        return ParsedCommand(action: .add(block),
                             summary: block.title,
                             detail: "\(day.label) · \(block.timeRangeLabel)",
                             category: block.category)
    }

    // MARK: Target lookup

    private static func findBlock(_ query: String, weekday: Int, in data: ScheduleData) -> ScheduleBlock? {
        let tokens = query.lowercased().split(separator: " ").map(String.init)
        var best: ScheduleBlock?
        var bestScore = 0
        for block in ScheduleEngine.blocks(forWeekday: weekday, in: data) {
            let title = block.title.lowercased()
            var score = tokens.filter { title.contains($0) }.count
            if title == query.lowercased() { score += 2 }
            if score > bestScore { bestScore = score; best = block }
        }
        return bestScore > 0 ? best : nil
    }

    private static func affectedCount(weekday: Int, from: Int, in data: ScheduleData) -> Int {
        ScheduleEngine.blocks(forWeekday: weekday, in: data)
            .filter { $0.category != .sleep && $0.start >= from }
            .count
    }

    // MARK: Weekday

    private static let weekdayNames: [(String, Int)] = [
        ("sunday", 1), ("monday", 2), ("tuesday", 3), ("wednesday", 4),
        ("thursday", 5), ("friday", 6), ("saturday", 7),
        ("sun", 1), ("mon", 2), ("tue", 3), ("wed", 4), ("thu", 5), ("fri", 6), ("sat", 7),
    ]
    private static let dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    private static func parseWeekday(_ text: String, now: Date) -> (value: Int?, label: String) {
        let cal = Calendar.current
        if matches(text, pattern: #"\bevery ?day\b|\bdaily\b"#) {
            return (nil, "every day")
        }
        if text.contains("tomorrow") {
            let d = cal.date(byAdding: .day, value: 1, to: now) ?? now
            return (cal.component(.weekday, from: d), "tomorrow")
        }
        if text.contains("today") {
            return (cal.component(.weekday, from: now), "today")
        }
        for (name, value) in weekdayNames where matches(text, pattern: "\\b\(name)\\b") {
            return (value, dayLabels[value - 1])
        }
        // No day mentioned → treat as today.
        return (cal.component(.weekday, from: now), "today")
    }

    // MARK: Times

    private static let timeOpt = #"(\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)?)"#
    private static let timeExp = #"(\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?))"#

    /// Returns (startMinutes, endMinutes).
    private static func parseTimes(_ text: String) -> (Int, Int)? {
        // Pattern A: "from X to/till/until/- Y"
        if let match = firstMatch(in: text,
            pattern: "(?:from\\s+)?\(timeOpt)\\s*(?:to|till|until|through|[-–])\\s*\(timeOpt)"),
           let startStr = match[1], let endStr = match[2],
           var s = clockToMinutes(startStr), var e = clockToMinutes(endStr) {
            let hasMer: (String) -> Bool = { matches($0, pattern: #"a\.?m|p\.?m"#) }
            if !hasMer(startStr), hasMer(endStr),
               let bare = firstMatch(in: startStr.replacingOccurrences(of: " ", with: ""),
                                     pattern: #"^(\d{1,2})(?::(\d{2}))?$"#),
               let hStr = bare[1], var h = Int(hStr) {
                // "7 to 8am" — the bare start inherits the end's am/pm.
                let pm = endStr.lowercased().contains("p")
                if pm { if h < 12 { h += 12 } } else if h == 12 { h = 0 }
                s = h * 60 + (bare[2].flatMap(Int.init) ?? 0)
                if s >= e { s -= 720; if s < 0 { s += Clock.minutesPerDay } }  // "11 to 1pm" → 11 am
            }
            if e <= s && e < 720 { e += 720 }   // "7 to 9" stays on the same side
            return (s, e % Clock.minutesPerDay)
        }

        // Pattern B: "at X for N hours/minutes" (or just "at X")
        if let match = firstMatch(in: text,
            pattern: "at\\s+\(timeOpt)(?:\\s+for\\s+(\\d+)\\s*(hours?|hrs?|minutes?|mins?))?"),
           let startStr = match[1], let start = clockToMinutes(startStr) {
            let duration = durationMinutes(count: match[2], unit: match[3]) ?? 60
            return (start, (start + duration) % Clock.minutesPerDay)
        }

        // Pattern C: a lone explicit time anywhere ("gym at 6pm").
        if let match = firstMatch(in: text, pattern: timeExp),
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

    /// "by 30 minutes", "one hour later", "half an hour" → minutes, else nil.
    private static func shiftAmount(_ text: String) -> Int? {
        if let m = firstMatch(in: text, pattern: #"\bby\s+(\d+)\s*(hours?|hrs?|minutes?|mins?)"#)
                ?? firstMatch(in: text, pattern: #"\b(\d+)\s*(hours?|hrs?|minutes?|mins?)\s*(?:later|earlier|back)\b"#),
           let n = m[1].flatMap(Int.init), let unit = m[2] {
            return unit.hasPrefix("h") ? n * 60 : n
        }
        if matches(text, pattern: #"\bhalf\s+an?\s+hour\b"#) { return 30 }
        if matches(text, pattern: #"\b(?:an?|one)\s+hour\b"#) { return 60 }
        return nil
    }

    /// Converts a clock fragment like "7", "7pm", "7:30 am", "19:00" to minutes.
    private static func clockToMinutes(_ fragment: String) -> Int? {
        let s = fragment.replacingOccurrences(of: " ", with: "")
            .replacingOccurrences(of: ".", with: "")
        guard let m = firstMatch(in: s, pattern: #"^(\d{1,2})(?::(\d{2}))?(am|pm)?$"#) else { return nil }
        guard var hour = m[1].flatMap(Int.init) else { return nil }
        let minute = m[2].flatMap(Int.init) ?? 0
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
        "add", "me", "a", "an", "the", "please", "schedule", "put", "book", "set",
        "i", "have", "ive", "got", "need", "also", "then", "my", "and",
        "on", "at", "from", "to", "till", "until", "through", "for", "of",
        "everyday", "every", "day", "daily", "today", "tomorrow",
        "am", "pm", "hour", "hours", "hr", "hrs", "minute", "minutes", "min", "mins",
        "oclock", "later", "earlier", "back",
    ]

    private static func parseTitle(_ text: String) -> String {
        var cleaned = text
        // Strip time expressions first.
        for pattern in [
            "(?:from\\s+)?\(timeOpt)\\s*(?:to|till|until|through|[-–])\\s*\(timeOpt)",
            "at\\s+\(timeOpt)(?:\\s+for\\s+\\d+\\s*\\w+)?",
            timeExp,
        ] {
            cleaned = replace(in: cleaned, pattern: pattern, with: " ")
        }
        for (name, _) in weekdayNames {
            cleaned = replace(in: cleaned, pattern: "\\b\(name)\\b", with: " ")
        }

        let words = cleaned
            .components(separatedBy: CharacterSet.alphanumerics.inverted)
            .filter { !$0.isEmpty && !noiseWords.contains($0) }
        return words.joined(separator: " ").trimmingCharacters(in: .whitespaces)
    }

    private static let categoryKeywords: [(Category, [String])] = [
        (.fitness, ["gym", "train", "workout", "work out", "running", "exercise", "fitness", "yoga", "lift", "swim"]),
        (.cooking, ["cook", "meal prep", "bake", "kitchen"]),
        (.eating, ["breakfast", "lunch", "dinner", "eat", "brunch", "snack", "coffee"]),
        (.work, ["work", "meeting", "call", "standup", "email", "office", "client", "interview"]),
        (.family, ["baby", "kids", "family", "child", "school run", "partner", "date", "mum", "mom", "dad"]),
        (.selfCare, ["shower", "meditat", "skincare", "relax", "wind down", "bath", "haircut"]),
        (.focus, ["study", "read", "learn", "focus", "writ", "practice", "code", "homework"]),
        (.errands, ["shop", "grocer", "errand", "clean", "laundry", "chore", "bank", "doctor", "dentist", "appointment"]),
        (.commute, ["drive", "commute", "travel", "flight", "airport"]),
        (.leisure, ["walk", "game", "movie", "tv", "hobby", "guitar", "music", "park", "friends", "party"]),
    ]

    private static func parseCategory(_ text: String) -> Category {
        let lower = text.lowercased()
        for (category, keys) in categoryKeywords where keys.contains(where: { lower.contains($0) }) {
            return category
        }
        return .other
    }

    // MARK: Regex plumbing

    private static func matches(_ text: String, pattern: String) -> Bool {
        firstMatch(in: text, pattern: pattern) != nil
    }

    private static func range(of pattern: String, in text: String) -> Range<String.Index>? {
        guard let regex = try? NSRegularExpression(pattern: pattern, options: [.caseInsensitive]) else { return nil }
        let range = NSRange(text.startIndex..., in: text)
        guard let match = regex.firstMatch(in: text, options: [], range: range) else { return nil }
        return Range(match.range, in: text)
    }

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
