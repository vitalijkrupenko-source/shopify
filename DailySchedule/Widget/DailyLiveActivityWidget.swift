#if canImport(ActivityKit)
import ActivityKit
import WidgetKit
import SwiftUI

/// The always-visible "status bar" on the lock screen and in the Dynamic
/// Island. Calm and glanceable — never a pop-up.
struct DailyLiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: DailyActivityAttributes.self) { context in
            lockScreen(context.state)
                .padding(16)
                .activityBackgroundTint(Color(hex: 0x14151B))
                .activitySystemActionForegroundColor(.white)
        } dynamicIsland: { context in
            let tint = Color(hex: context.state.currentTintHex)
            return DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Label {
                        Text(context.state.currentTitle).fontWeight(.semibold)
                    } icon: {
                        Image(systemName: context.state.currentSymbol).foregroundStyle(tint)
                    }
                    .padding(.leading, 4)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    if !context.state.nextTitle.isEmpty {
                        VStack(alignment: .trailing, spacing: 1) {
                            Text("Next").font(.caption2).foregroundStyle(.secondary)
                            Text(context.state.nextTitle).font(.caption).fontWeight(.medium)
                            Text(context.state.nextTimeLabel).font(.caption2).foregroundStyle(.secondary)
                        }
                        .padding(.trailing, 4)
                    }
                }
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(spacing: 6) {
                        ProgressView(value: context.state.progress).tint(tint)
                        Text(context.state.status).font(.caption).foregroundStyle(.secondary)
                    }
                }
            } compactLeading: {
                Image(systemName: context.state.currentSymbol).foregroundStyle(tint)
            } compactTrailing: {
                ProgressView(value: context.state.progress).tint(tint)
                    .progressViewStyle(.circular)
            } minimal: {
                Image(systemName: context.state.currentSymbol).foregroundStyle(tint)
            }
            .keylineTint(tint)
        }
    }

    private func lockScreen(_ state: DailyActivityAttributes.ContentState) -> some View {
        let tint = Color(hex: state.currentTintHex)
        return HStack(spacing: 14) {
            ZStack {
                Circle().stroke(tint.opacity(0.2), lineWidth: 5)
                Circle().trim(from: 0, to: state.progress)
                    .stroke(tint, style: StrokeStyle(lineWidth: 5, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                Image(systemName: state.currentSymbol).font(.system(size: 18, weight: .semibold)).foregroundStyle(tint)
            }
            .frame(width: 46, height: 46)

            VStack(alignment: .leading, spacing: 2) {
                Text(state.status).font(.headline).foregroundStyle(.white)
                if !state.nextTitle.isEmpty {
                    Text("Next · \(state.nextTitle) at \(state.nextTimeLabel)")
                        .font(.caption).foregroundStyle(.white.opacity(0.6))
                }
            }
            Spacer(minLength: 0)
        }
    }
}
#endif
