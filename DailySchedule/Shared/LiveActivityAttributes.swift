import Foundation
#if canImport(ActivityKit)
import ActivityKit

/// Drives the Live Activity — the calm, always-visible "status bar" on the lock
/// screen and in the Dynamic Island that tells you what you're doing now and
/// what's next. This is the non-annoying notification the app is built around.
struct DailyActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        /// e.g. "You're training" or "In 45m: shopping".
        var status: String
        /// Current task title, empty when between tasks.
        var currentTitle: String
        var currentSymbol: String
        /// SwiftUI Color can't cross the boundary — store the hex.
        var currentTintHex: UInt32
        /// What's next, for the trailing/expanded views.
        var nextTitle: String
        var nextTimeLabel: String
        /// 0...1 progress through the current block, for the ring/bar.
        var progress: Double
    }

    /// Nothing static needed — every day is the same activity.
    var name: String = "Daily"
}
#endif
