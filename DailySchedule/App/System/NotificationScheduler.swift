import Foundation
import UserNotifications

/// Schedules the calm "coming up" heads-up. Deliberately minimal: one *passive*
/// notification per block, a lead time before it starts — no chimes, no badges,
/// no "now" spam (the Live Activity covers what's happening right now).
enum NotificationScheduler {

    static func requestAuthorization() {
        UNUserNotificationCenter.current()
            .requestAuthorization(options: [.alert, .sound]) { _, _ in }
    }

    /// Clears everything and re-schedules from the current schedule.
    static func reschedule(from data: ScheduleData) {
        let center = UNUserNotificationCenter.current()
        center.removeAllPendingNotificationRequests()
        guard data.remindersEnabled else { return }

        let lead = max(0, data.reminderLeadMinutes)

        for block in data.blocks where block.category != .sleep {
            let fireMinute = block.start - lead
            guard fireMinute >= 0 else { continue }   // skip pre-dawn wrap-arounds

            var components = DateComponents()
            components.hour = fireMinute / 60
            components.minute = fireMinute % 60
            // Recurring blocks fire daily; appointments fire on their weekday.
            if let weekday = block.weekday { components.weekday = weekday }

            let content = UNMutableNotificationContent()
            content.title = block.title
            content.body = lead == 0 ? "Starting now." : "In \(lead) minutes."
            if #available(iOS 15.0, *) { content.interruptionLevel = .passive }
            content.sound = nil   // silent by design

            let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: true)
            let request = UNNotificationRequest(identifier: block.id.uuidString,
                                                content: content, trigger: trigger)
            center.add(request)
        }
    }
}
