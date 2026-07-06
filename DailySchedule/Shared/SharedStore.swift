import Foundation

/// Reads and writes the single schedule document to the App Group container so
/// the app and every widget see exactly the same data. Deliberately tiny:
/// one JSON file, no database, no server.
enum SharedStore {
    /// Must match the App Group capability configured on both targets.
    static let appGroupID = "group.com.daily.schedule"
    private static let fileName = "schedule.json"

    private static var fileURL: URL? {
        FileManager.default
            .containerURL(forSecurityApplicationGroupIdentifier: appGroupID)?
            .appendingPathComponent(fileName)
    }

    static func load() -> ScheduleData {
        guard let url = fileURL,
              let raw = try? Data(contentsOf: url),
              let decoded = try? JSONDecoder().decode(ScheduleData.self, from: raw)
        else { return .empty }
        return decoded
    }

    static func save(_ data: ScheduleData) {
        guard let url = fileURL else { return }
        guard let encoded = try? JSONEncoder().encode(data) else { return }
        try? encoded.write(to: url, options: [.atomic])
    }
}
