import WidgetKit
import SwiftUI

@main
struct DailyWidgetBundle: WidgetBundle {
    var body: some Widget {
        DailyScheduleWidget()
        #if canImport(ActivityKit)
        DailyLiveActivityWidget()
        #endif
    }
}
