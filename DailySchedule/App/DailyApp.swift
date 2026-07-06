import SwiftUI

@main
struct DailyApp: App {
    @StateObject private var store = ScheduleStore()
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(store)
                .preferredColorScheme(.dark)
                .tint(.white)
                .onAppear { NotificationScheduler.requestAuthorization() }
        }
        .onChange(of: scenePhase) { _, phase in
            if phase == .active { store.refreshLiveState() }
        }
    }
}
