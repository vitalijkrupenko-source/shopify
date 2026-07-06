import SwiftUI

/// Small, consistent design tokens. Premium means restrained: one soft
/// background, generous spacing, rounded corners, quiet type.
enum Theme {
    static let corner: CGFloat = 22
    static let cardCorner: CGFloat = 18

    static let bg = Color(hex: 0x0E0F13)
    static let card = Color(hex: 0x1A1C22)
    static let cardHi = Color(hex: 0x22242C)
    static let stroke = Color.white.opacity(0.06)
    static let textPrimary = Color.white
    static let textSecondary = Color.white.opacity(0.55)
    static let textTertiary = Color.white.opacity(0.35)

    /// The page background: a very subtle top-lit gradient.
    static var background: some View {
        LinearGradient(
            colors: [Color(hex: 0x15161C), Color(hex: 0x0C0D11)],
            startPoint: .top,
            endPoint: .bottom
        )
        .ignoresSafeArea()
    }
}

extension Color {
    /// Hex initializer, e.g. `Color(hex: 0x5B8DEF)`.
    init(hex: UInt32, alpha: Double = 1) {
        let r = Double((hex >> 16) & 0xFF) / 255
        let g = Double((hex >> 8) & 0xFF) / 255
        let b = Double(hex & 0xFF) / 255
        self.init(.sRGB, red: r, green: g, blue: b, opacity: alpha)
    }
}

extension View {
    /// Standard card treatment used across the app.
    func cardStyle(_ fill: Color = Theme.card) -> some View {
        self
            .background(fill, in: RoundedRectangle(cornerRadius: Theme.cardCorner, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: Theme.cardCorner, style: .continuous)
                    .strokeBorder(Theme.stroke, lineWidth: 1)
            )
    }
}
