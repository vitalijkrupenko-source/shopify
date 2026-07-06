import SwiftUI

/// The one big button used for primary actions. Full-width, soft, confident.
struct PrimaryButton: View {
    let title: String
    var systemImage: String? = nil
    var enabled: Bool = true
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let systemImage { Image(systemName: systemImage) }
                Text(title).fontWeight(.semibold)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 17)
            .background(Color.white, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
            .foregroundStyle(.black)
        }
        .opacity(enabled ? 1 : 0.35)
        .disabled(!enabled)
    }
}

/// A category glyph in a soft tinted disc — the visual anchor for every block.
struct CategoryBadge: View {
    let category: Category
    var size: CGFloat = 44

    var body: some View {
        Image(systemName: category.symbol)
            .font(.system(size: size * 0.42, weight: .semibold))
            .foregroundStyle(category.tint)
            .frame(width: size, height: size)
            .background(category.tint.opacity(0.16), in: RoundedRectangle(cornerRadius: size * 0.32, style: .continuous))
    }
}

/// Minutes-since-midnight bound to a `Date` so we can use `DatePicker`.
struct MinutesTimePicker: View {
    let label: String
    @Binding var minutes: Int

    var body: some View {
        HStack {
            Text(label)
                .foregroundStyle(Theme.textSecondary)
            Spacer()
            DatePicker("", selection: dateBinding, displayedComponents: .hourAndMinute)
                .labelsHidden()
        }
        .padding(.vertical, 14)
        .padding(.horizontal, 18)
        .cardStyle()
    }

    private var dateBinding: Binding<Date> {
        Binding(
            get: {
                var c = DateComponents()
                c.hour = minutes / 60
                c.minute = minutes % 60
                return Calendar.current.date(from: c) ?? Date()
            },
            set: { minutes = Clock.minutes(from: $0) }
        )
    }
}
