import Foundation

/// The goals the onboarding asks about. You don't tell the app *what* to do —
/// you tell it *who you want to be*, and it fills the day accordingly.
enum Goal: String, CaseIterable, Identifiable {
    case lookGood, eatWell, beProductive, timeForFamily, restWell, keepLearning, getOutside

    var id: String { rawValue }

    var title: String {
        switch self {
        case .lookGood: return "Look good"
        case .eatWell: return "Eat well"
        case .beProductive: return "Get things done"
        case .timeForFamily: return "Time for family"
        case .restWell: return "Rest & recharge"
        case .keepLearning: return "Keep learning"
        case .getOutside: return "Get outside"
        }
    }

    var subtitle: String {
        switch self {
        case .lookGood: return "so I train"
        case .eatWell: return "so I cook"
        case .beProductive: return "so I make deep-focus time"
        case .timeForFamily: return "so I protect an evening block"
        case .restWell: return "so I wind down properly"
        case .keepLearning: return "so I study a little each day"
        case .getOutside: return "so I take a daily walk"
        }
    }

    var symbol: String {
        switch self {
        case .lookGood: return "figure.run"
        case .eatWell: return "frying.pan.fill"
        case .beProductive: return "brain.head.profile"
        case .timeForFamily: return "figure.2.and.child.holdinghands"
        case .restWell: return "moon.stars.fill"
        case .keepLearning: return "book.fill"
        case .getOutside: return "leaf.fill"
        }
    }
}

/// The handful of facts we ask up front. Everything else is inferred.
struct Basics {
    var wake: Int = 7 * 60          // 07:00
    var sleep: Int = 23 * 60        // 23:00
    var hasJob: Bool = true
    var workStart: Int = 9 * 60     // 09:00
    var workEnd: Int = 17 * 60      // 17:00
}

/// Turns `Basics` + chosen `Goal`s into a clean, non-overlapping daily
/// template. Uses a tiny greedy interval placer so blocks never collide.
enum DayBuilder {

    private struct Activity {
        var title: String
        var category: Category
        var duration: Int
        /// Preferred start (minutes). The placer honors it when the slot is free.
        var preferredStart: Int
    }

    static func build(basics b: Basics, goals: Set<Goal>) -> [ScheduleBlock] {
        var blocks: [ScheduleBlock] = []

        // Anchors that always exist.
        blocks.append(ScheduleBlock(title: "Sleep", category: .sleep,
                                    start: b.sleep, end: b.wake, weekday: nil))

        // Free time is everything between waking and going to sleep,
        // minus the workday. We carve activities out of these windows.
        var free: [(Int, Int)] = [(b.wake, b.sleep)]

        if b.hasJob {
            blocks.append(ScheduleBlock(title: "Work", category: .work,
                                        start: b.workStart, end: b.workEnd, weekday: nil))
            free = subtract(free, remove: (b.workStart, b.workEnd))
        }

        // Priority order: the essentials first, then the goals. Earlier items
        // win the good slots.
        var wishlist: [Activity] = [
            Activity(title: "Morning routine", category: .selfCare, duration: 30, preferredStart: b.wake),
            Activity(title: "Breakfast", category: .eating, duration: 30, preferredStart: b.wake + 45),
            Activity(title: "Lunch", category: .eating, duration: 45, preferredStart: 13 * 60),
            Activity(title: "Dinner", category: .eating, duration: 45, preferredStart: 19 * 60),
        ]

        // Fitness lands in the morning if the job owns the evening, else after work.
        if goals.contains(.lookGood) {
            let start = (b.hasJob && b.workEnd >= 18 * 60) ? b.wake + 90 : 18 * 60
            wishlist.append(Activity(title: "Training", category: .fitness, duration: 60, preferredStart: start))
        }
        if goals.contains(.eatWell) {
            wishlist.append(Activity(title: "Cook", category: .cooking, duration: 45, preferredStart: 18 * 60 + 10))
        }
        if goals.contains(.beProductive) {
            let start = b.hasJob ? b.workEnd + 30 : 9 * 60
            wishlist.append(Activity(title: "Deep focus", category: .focus, duration: 90, preferredStart: start))
        }
        if goals.contains(.timeForFamily) {
            wishlist.append(Activity(title: "Family time", category: .family, duration: 60, preferredStart: 20 * 60))
        }
        if goals.contains(.keepLearning) {
            wishlist.append(Activity(title: "Learn", category: .focus, duration: 45, preferredStart: 20 * 60 + 30))
        }
        if goals.contains(.getOutside) {
            wishlist.append(Activity(title: "Walk", category: .leisure, duration: 30, preferredStart: 17 * 60))
        }
        if goals.contains(.restWell) {
            wishlist.append(Activity(title: "Wind down", category: .selfCare, duration: 30, preferredStart: b.sleep - 40))
        }

        for activity in wishlist {
            if let placed = place(activity, in: &free) {
                blocks.append(placed)
            }
        }

        return blocks.sorted { $0.start < $1.start }
    }

    // MARK: Interval helpers

    /// Removes `remove` from a set of free intervals, splitting where needed.
    private static func subtract(_ free: [(Int, Int)], remove: (Int, Int)) -> [(Int, Int)] {
        var out: [(Int, Int)] = []
        for (a, b) in free {
            if remove.1 <= a || remove.0 >= b {
                out.append((a, b))            // no overlap
            } else {
                if a < remove.0 { out.append((a, remove.0)) }
                if remove.1 < b { out.append((remove.1, b)) }
            }
        }
        return out.filter { $0.1 > $0.0 }
    }

    /// Places an activity in the best free slot and carves it out.
    private static func place(_ activity: Activity, in free: inout [(Int, Int)]) -> ScheduleBlock? {
        let dur = activity.duration
        let pref = activity.preferredStart

        // 1) Honor the preferred start if that exact spot is free.
        if let i = free.firstIndex(where: { pref >= $0.0 && pref + dur <= $0.1 }) {
            return carve(at: pref, dur: dur, intervalIndex: i, free: &free, activity: activity)
        }
        // 2) Otherwise the closest free interval that can hold it.
        let candidates = free.enumerated()
            .filter { $0.element.1 - $0.element.0 >= dur }
            .sorted { abs($0.element.0 - pref) < abs($1.element.0 - pref) }
        if let first = candidates.first {
            let start = max(first.element.0, min(pref, first.element.1 - dur))
            return carve(at: start, dur: dur, intervalIndex: first.offset, free: &free, activity: activity)
        }
        return nil  // Day is full — better to drop than to double-book.
    }

    private static func carve(at start: Int, dur: Int, intervalIndex i: Int,
                              free: inout [(Int, Int)], activity: Activity) -> ScheduleBlock {
        let (a, b) = free[i]
        var replacement: [(Int, Int)] = []
        if a < start { replacement.append((a, start)) }
        if start + dur < b { replacement.append((start + dur, b)) }
        free.replaceSubrange(i...i, with: replacement)
        return ScheduleBlock(title: activity.title, category: activity.category,
                             start: start, end: start + dur, weekday: nil)
    }
}
