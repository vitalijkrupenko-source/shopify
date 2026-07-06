import SwiftUI

/// Speak it, see it, confirm it. "Add training on Wednesday from 7 to 9pm."
struct VoiceAddView: View {
    let defaultDate: Date

    @EnvironmentObject private var store: ScheduleStore
    @StateObject private var speech = SpeechRecognizer()
    @Environment(\.dismiss) private var dismiss

    @State private var typed = ""
    @State private var parsed: ParsedCommand?

    var body: some View {
        VStack(spacing: 22) {
            Capsule().fill(Color.white.opacity(0.15)).frame(width: 40, height: 5).padding(.top, 8)

            Text("Add to your day")
                .font(.title3.weight(.bold))
                .frame(maxWidth: .infinity, alignment: .leading)

            transcriptArea

            if let parsed, parsed.understood {
                confirmCard(parsed)
            } else if let parsed {
                Text(parsed.summary)
                    .font(.subheadline)
                    .foregroundStyle(Theme.textSecondary)
                    .multilineTextAlignment(.center)
            } else {
                hint
            }

            Spacer(minLength: 0)
            micControl
        }
        .padding(20)
        .background(Theme.bg.ignoresSafeArea())
        .onChange(of: speech.transcript) { _, text in
            typed = text
            reparse(text)
        }
    }

    // MARK: Pieces

    private var transcriptArea: some View {
        VStack(spacing: 10) {
            TextField("or type it here…", text: $typed, axis: .vertical)
                .font(.system(size: 22, weight: .semibold))
                .foregroundStyle(Theme.textPrimary)
                .multilineTextAlignment(.center)
                .lineLimit(1...3)
                .onSubmitOrChange(text: typed) { reparse(typed) }
        }
        .frame(maxWidth: .infinity, minHeight: 90)
        .padding(18)
        .cardStyle()
    }

    private var hint: some View {
        VStack(spacing: 6) {
            ForEach(["“Gym tomorrow from 7 to 8am”",
                     "“Dinner with mum on Friday at 7pm”",
                     "“Deep work today at 2pm for 2 hours”"], id: \.self) { example in
                Text(example)
                    .font(.subheadline)
                    .foregroundStyle(Theme.textTertiary)
            }
        }
    }

    private func confirmCard(_ command: ParsedCommand) -> some View {
        VStack(spacing: 14) {
            if let block = command.block {
                HStack(spacing: 13) {
                    CategoryBadge(category: block.category)
                    VStack(alignment: .leading, spacing: 3) {
                        Text(block.title).font(.headline).foregroundStyle(Theme.textPrimary)
                        Text(command.summary.replacingOccurrences(of: "\(block.title) · ", with: ""))
                            .font(.subheadline).foregroundStyle(Theme.textSecondary)
                    }
                    Spacer()
                }
                .padding(14)
                .cardStyle(Theme.cardHi)

                PrimaryButton(title: "Add to schedule", systemImage: "checkmark") {
                    speech.stop()
                    store.add(block)
                    dismiss()
                }
            }
        }
    }

    private var micControl: some View {
        Button {
            if speech.isRecording { speech.stop() } else { speech.start() }
        } label: {
            ZStack {
                Circle()
                    .fill(speech.isRecording ? Color.red : Color.white)
                    .frame(width: 74, height: 74)
                Image(systemName: speech.isRecording ? "stop.fill" : "mic.fill")
                    .font(.system(size: 26, weight: .bold))
                    .foregroundStyle(speech.isRecording ? .white : .black)
            }
            .overlay(
                Circle().stroke(Color.red.opacity(speech.isRecording ? 0.4 : 0), lineWidth: 8)
                    .scaleEffect(speech.isRecording ? 1.4 : 1)
                    .animation(.easeOut(duration: 1).repeatForever(autoreverses: false), value: speech.isRecording)
            )
        }
        .overlay(alignment: .bottom) {
            if let error = speech.errorMessage {
                Text(error).font(.caption).foregroundStyle(.orange).offset(y: 26)
            }
        }
        .padding(.bottom, 8)
    }

    private func reparse(_ text: String) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        parsed = trimmed.isEmpty ? nil : CommandParser.parse(trimmed, now: referenceNow)
    }

    /// Anchor parsing to the day the user is viewing (so "at 7pm" with no day
    /// lands on the selected date's weekday).
    private var referenceNow: Date {
        Calendar.current.isDateInToday(defaultDate) ? Date() : defaultDate
    }
}

private extension View {
    /// Re-run `action` whenever the text changes (cheap debounce-free reparse).
    func onSubmitOrChange(text: String, action: @escaping () -> Void) -> some View {
        self.onChange(of: text) { _, _ in action() }
    }
}
