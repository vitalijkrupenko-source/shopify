import SwiftUI

/// Your day, at a glance. A live status line up top, the block you're in right
/// now, and a clean timeline. One button — the mic — adds anything else.
struct TodayView: View {
    @EnvironmentObject private var store: ScheduleStore

    @State private var selectedDate = Date()
    @State private var showVoice = false
    @State private var showSettings = false
    @State private var editingBlock: ScheduleBlock?

    private var isToday: Bool {
        Calendar.current.isDateInToday(selectedDate)
    }

    var body: some View {
        // Re-renders each minute so "now" and progress stay live.
        TimelineView(.periodic(from: .now, by: 60)) { context in
            let now = context.date
            ZStack(alignment: .bottom) {
                ScrollView {
                    VStack(spacing: 18) {
                        DayHeader(date: selectedDate, now: now,
                                  status: statusText(now),
                                  onSettings: { showSettings = true })
                        WeekStrip(selected: $selectedDate)

                        if isToday, let current = store.current(at: now) {
                            NowCard(block: current, now: now)
                        }

                        DayTimelineView(date: selectedDate, now: now,
                                        blocks: store.blocks(for: selectedDate),
                                        onEdit: { editingBlock = $0 },
                                        onDelete: { store.remove($0) })
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 120)
                }
                .scrollIndicators(.hidden)

                MicButton { showVoice = true }
                    .padding(.bottom, 28)
            }
        }
        .sheet(isPresented: $showVoice) {
            VoiceAddView(defaultDate: selectedDate)
                .environmentObject(store)
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
        }
        .sheet(isPresented: $showSettings) {
            SettingsView().environmentObject(store)
                .presentationDetents([.medium])
        }
        .sheet(item: $editingBlock) { block in
            EditBlockView(block: block).environmentObject(store)
                .presentationDetents([.medium])
        }
    }

    private func statusText(_ now: Date) -> String {
        isToday ? ScheduleEngine.statusLine(at: now, in: store.data)
                : selectedDate.formatted(.dateTime.weekday(.wide))
    }
}

// MARK: - Header

private struct DayHeader: View {
    let date: Date
    let now: Date
    let status: String
    let onSettings: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(date, format: .dateTime.weekday(.wide).day().month(.wide))
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(Theme.textSecondary)
                Spacer()
                Button(action: onSettings) {
                    Image(systemName: "slider.horizontal.3")
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundStyle(Theme.textSecondary)
                        .frame(width: 40, height: 40)
                        .background(Theme.card, in: Circle())
                }
            }
            Text(status)
                .font(.system(size: 30, weight: .bold))
                .foregroundStyle(Theme.textPrimary)
                .contentTransition(.opacity)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(.top, 8)
    }
}

// MARK: - Week strip

private struct WeekStrip: View {
    @Binding var selected: Date
    private let cal = Calendar.current

    private var days: [Date] {
        let today = cal.startOfDay(for: Date())
        return (0..<7).compactMap { cal.date(byAdding: .day, value: $0, to: today) }
    }

    var body: some View {
        HStack(spacing: 8) {
            ForEach(days, id: \.self) { day in
                let isSelected = cal.isDate(day, inSameDayAs: selected)
                Button {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) { selected = day }
                } label: {
                    VStack(spacing: 5) {
                        Text(day, format: .dateTime.weekday(.narrow))
                            .font(.caption2.weight(.medium))
                            .foregroundStyle(isSelected ? .black.opacity(0.6) : Theme.textTertiary)
                        Text(day, format: .dateTime.day())
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundStyle(isSelected ? .black : Theme.textPrimary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(isSelected ? Color.white : Theme.card,
                                in: RoundedRectangle(cornerRadius: 14, style: .continuous))
                }
                .buttonStyle(.plain)
            }
        }
    }
}
