import SwiftUI

/// Sends you to onboarding until the schedule exists, then to your day.
struct RootView: View {
    @EnvironmentObject private var store: ScheduleStore

    var body: some View {
        ZStack {
            Theme.background
            if store.hasOnboarded {
                TodayView()
                    .transition(.opacity)
            } else {
                OnboardingView()
                    .transition(.opacity)
            }
        }
        .animation(.easeInOut(duration: 0.4), value: store.hasOnboarded)
    }
}
