import SwiftUI

/// A short, guided setup. We don't ask what you want to *do* — we ask who you
/// want to *be*, plus the few fixed points of your day, then build the schedule.
struct OnboardingView: View {
    @EnvironmentObject private var store: ScheduleStore

    @State private var step = 0
    @State private var basics = Basics()
    @State private var goals: Set<Goal> = []

    private let lastStep = 3

    var body: some View {
        VStack(spacing: 0) {
            ProgressDots(count: lastStep + 1, index: step)
                .padding(.top, 24)

            Group {
                switch step {
                case 0: welcome
                case 1: rhythm
                case 2: work
                default: goalStep
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .transition(.asymmetric(insertion: .move(edge: .trailing).combined(with: .opacity),
                                    removal: .move(edge: .leading).combined(with: .opacity)))

            footer
        }
        .padding(.horizontal, 22)
        .padding(.bottom, 12)
        .animation(.spring(response: 0.45, dampingFraction: 0.85), value: step)
    }

    // MARK: Steps

    private var welcome: some View {
        VStack(alignment: .leading, spacing: 18) {
            Spacer()
            Image(systemName: "sun.max.fill")
                .font(.system(size: 46, weight: .semibold))
                .foregroundStyle(.orange)
            Text("Design one great day.")
                .font(.system(size: 34, weight: .bold))
            Text("Daily builds a schedule around the life you want — then quietly keeps you on it, every day.")
                .font(.title3)
                .foregroundStyle(Theme.textSecondary)
            Spacer()
            Spacer()
        }
    }

    private var rhythm: some View {
        stepScaffold(title: "Your rhythm", subtitle: "The two fixed points every day turns around.") {
            VStack(spacing: 14) {
                MinutesTimePicker(label: "I wake up at", minutes: $basics.wake)
                MinutesTimePicker(label: "I go to sleep at", minutes: $basics.sleep)
            }
        }
    }

    private var work: some View {
        stepScaffold(title: "Work", subtitle: "We'll protect this block so nothing lands on it.") {
            VStack(spacing: 14) {
                Toggle(isOn: $basics.hasJob.animation()) {
                    Text("I have set working hours").foregroundStyle(Theme.textPrimary)
                }
                .padding(.vertical, 14).padding(.horizontal, 18)
                .cardStyle()

                if basics.hasJob {
                    MinutesTimePicker(label: "Starts at", minutes: $basics.workStart)
                    MinutesTimePicker(label: "Ends at", minutes: $basics.workEnd)
                }
            }
        }
    }

    private var goalStep: some View {
        stepScaffold(title: "What matters to you?", subtitle: "Pick a few. Daily turns each into time on your calendar.") {
            VStack(spacing: 10) {
                ForEach(Goal.allCases) { goal in
                    GoalRow(goal: goal, selected: goals.contains(goal)) {
                        if goals.contains(goal) { goals.remove(goal) } else { goals.insert(goal) }
                    }
                }
            }
        }
    }

    // MARK: Scaffolding

    private func stepScaffold<Content: View>(title: String, subtitle: String,
                                             @ViewBuilder content: () -> Content) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 8) {
                Text(title).font(.system(size: 30, weight: .bold))
                Text(subtitle).font(.body).foregroundStyle(Theme.textSecondary)
                    .padding(.bottom, 10)
                content()
            }
            .padding(.top, 28)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .scrollIndicators(.hidden)
    }

    private var footer: some View {
        VStack(spacing: 12) {
            PrimaryButton(title: step == lastStep ? "Build my day" : "Continue",
                          systemImage: step == lastStep ? "wand.and.stars" : nil,
                          enabled: canAdvance) {
                if step == lastStep {
                    store.setTemplate(DayBuilder.build(basics: basics, goals: goals))
                } else {
                    step += 1
                }
            }
            if step > 0 {
                Button("Back") { step -= 1 }
                    .foregroundStyle(Theme.textTertiary)
                    .font(.subheadline)
            }
        }
    }

    private var canAdvance: Bool {
        step != lastStep || !goals.isEmpty
    }
}

// MARK: - Small pieces

private struct ProgressDots: View {
    let count: Int
    let index: Int
    var body: some View {
        HStack(spacing: 7) {
            ForEach(0..<count, id: \.self) { i in
                Capsule()
                    .fill(i == index ? Color.white : Color.white.opacity(0.18))
                    .frame(width: i == index ? 22 : 7, height: 7)
            }
        }
        .animation(.spring(response: 0.4, dampingFraction: 0.8), value: index)
    }
}

private struct GoalRow: View {
    let goal: Goal
    let selected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: goal.symbol)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(selected ? .black : .white)
                    .frame(width: 40, height: 40)
                    .background(selected ? Color.white : Color.white.opacity(0.08),
                                in: RoundedRectangle(cornerRadius: 13, style: .continuous))
                VStack(alignment: .leading, spacing: 2) {
                    Text(goal.title).font(.headline).foregroundStyle(Theme.textPrimary)
                    Text(goal.subtitle).font(.subheadline).foregroundStyle(Theme.textSecondary)
                }
                Spacer()
                Image(systemName: selected ? "checkmark.circle.fill" : "circle")
                    .font(.title3)
                    .foregroundStyle(selected ? .white : Theme.textTertiary)
            }
            .padding(14)
            .cardStyle(selected ? Theme.cardHi : Theme.card)
        }
        .buttonStyle(.plain)
    }
}
