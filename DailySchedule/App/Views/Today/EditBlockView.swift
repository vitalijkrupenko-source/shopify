import SwiftUI

/// Fine-tune a block: rename, recategorize, retime, or remove. Tapping any
/// block on the timeline opens this.
struct EditBlockView: View {
    @EnvironmentObject private var store: ScheduleStore
    @Environment(\.dismiss) private var dismiss

    @State private var draft: ScheduleBlock

    init(block: ScheduleBlock) {
        _draft = State(initialValue: block)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text(draft.isRecurring ? "Daily block" : "Appointment")
                    .font(.title3.weight(.bold))
                Spacer()
                Button { dismiss() } label: {
                    Image(systemName: "xmark.circle.fill").font(.title2).foregroundStyle(Theme.textTertiary)
                }
            }

            TextField("Title", text: $draft.title)
                .font(.title3.weight(.semibold))
                .padding(16).cardStyle()

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 10) {
                    ForEach(Category.allCases) { category in
                        Button { draft.category = category } label: {
                            CategoryBadge(category: category, size: 46)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 15, style: .continuous)
                                        .strokeBorder(draft.category == category ? category.tint : .clear, lineWidth: 2)
                                )
                        }
                    }
                }
                .padding(.horizontal, 2)
            }

            VStack(spacing: 12) {
                MinutesTimePicker(label: "Starts", minutes: $draft.start)
                MinutesTimePicker(label: "Ends", minutes: $draft.end)
            }

            Spacer()

            HStack(spacing: 12) {
                Button(role: .destructive) {
                    store.remove(draft); dismiss()
                } label: {
                    Image(systemName: "trash").frame(width: 54, height: 54)
                        .foregroundStyle(.red)
                        .background(Color.red.opacity(0.12), in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                }
                PrimaryButton(title: "Save") {
                    store.update(draft); dismiss()
                }
            }
        }
        .padding(20)
        .background(Theme.bg.ignoresSafeArea())
    }
}
