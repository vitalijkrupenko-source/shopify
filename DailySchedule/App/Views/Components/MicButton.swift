import SwiftUI

/// The single floating action of the whole app: tap to speak an appointment.
struct MicButton: View {
    let action: () -> Void
    @State private var pulse = false

    var body: some View {
        Button(action: action) {
            Image(systemName: "mic.fill")
                .font(.system(size: 24, weight: .semibold))
                .foregroundStyle(.black)
                .frame(width: 66, height: 66)
                .background(Color.white, in: Circle())
                .shadow(color: .black.opacity(0.4), radius: 18, y: 8)
        }
        .scaleEffect(pulse ? 1.04 : 1)
        .onAppear {
            withAnimation(.easeInOut(duration: 1.6).repeatForever(autoreverses: true)) { pulse = true }
        }
    }
}
