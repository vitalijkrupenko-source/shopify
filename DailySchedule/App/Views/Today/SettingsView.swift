import SwiftUI

/// Deliberately tiny. Reminders on/off, how far ahead, and a way to rebuild.
struct SettingsView: View {
    @EnvironmentObject private var store: ScheduleStore
    @Environment(\.dismiss) private var dismiss

    @State private var showResetConfirm = false

    private let leadOptions = [10, 15, 30, 45, 60]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Settings").font(.title3.weight(.bold))
                Spacer()
                Button { dismiss() } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.title2).foregroundStyle(Theme.textTertiary)
                }
            }

            Toggle(isOn: Binding(get: { store.data.remindersEnabled },
                                 set: { store.setRemindersEnabled($0) })) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Gentle reminders").foregroundStyle(Theme.textPrimary)
                    Text("A quiet heads-up before each block").font(.caption).foregroundStyle(Theme.textSecondary)
                }
            }
            .padding(16).cardStyle()

            if store.data.remindersEnabled {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Remind me").font(.subheadline).foregroundStyle(Theme.textSecondary)
                    HStack(spacing: 8) {
                        ForEach(leadOptions, id: \.self) { minutes in
                            let selected = store.data.reminderLeadMinutes == minutes
                            Button { store.setReminderLead(minutes) } label: {
                                Text("\(minutes)m")
                                    .font(.subheadline.weight(.semibold))
                                    .frame(maxWidth: .infinity).padding(.vertical, 10)
                                    .background(selected ? Color.white : Theme.card,
                                                in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                                    .foregroundStyle(selected ? .black : Theme.textPrimary)
                            }
                        }
                    }
                    Text("before it starts").font(.caption).foregroundStyle(Theme.textTertiary)
                }
                .padding(16).cardStyle()
            }

            Spacer()

            Button(role: .destructive) { showResetConfirm = true } label: {
                Text("Rebuild my schedule")
                    .frame(maxWidth: .infinity).padding(.vertical, 15)
                    .foregroundStyle(.red)
                    .background(Color.red.opacity(0.12), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
            }
        }
        .padding(20)
        .background(Theme.bg.ignoresSafeArea())
        .confirmationDialog("Start over? This clears your current day.",
                            isPresented: $showResetConfirm, titleVisibility: .visible) {
            Button("Rebuild from scratch", role: .destructive) {
                store.reset(); dismiss()
            }
            Button("Cancel", role: .cancel) {}
        }
    }
}
