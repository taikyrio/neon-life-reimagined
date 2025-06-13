
# Flutter Life Simulator Setup on Fedora 42

This guide will walk you through setting up the Flutter development environment and running the Life Simulator app on Fedora 42.

## Prerequisites Installation

### 1. Update System
```bash
sudo dnf update -y
```

### 2. Install Required System Packages
```bash
sudo dnf install -y curl git unzip xz clang cmake ninja-build pkgconfig gtk3-devel
```

### 3. Install Android Studio
```bash
# Download Android Studio
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.1.1.28/android-studio-2023.1.1.28-linux.tar.gz

# Extract and install
sudo tar -xzf android-studio-*.tar.gz -C /opt/
sudo ln -sf /opt/android-studio/bin/studio.sh /usr/local/bin/android-studio

# Launch Android Studio
android-studio
```

### 4. Install Flutter SDK
```bash
# Create flutter directory
mkdir -p ~/development

# Download Flutter
cd ~/development
git clone https://github.com/flutter/flutter.git -b stable

# Add Flutter to PATH
echo 'export PATH="$PATH:$HOME/development/flutter/bin"' >> ~/.bashrc
source ~/.bashrc

# Verify Flutter installation
flutter doctor
```

### 5. Configure Android Development
```bash
# Accept Android licenses
flutter doctor --android-licenses

# Install Android SDK command line tools (if needed)
# This is usually done through Android Studio
```

### 6. Install Chrome for Web Development (Optional)
```bash
sudo dnf install -y google-chrome-stable
```

## Project Setup

### 1. Navigate to Project Directory
```bash
cd flutter_life_simulator
```

### 2. Get Flutter Dependencies
```bash
flutter pub get
```

### 3. Verify Setup
```bash
flutter doctor -v
```

Make sure all checkmarks are green for Android development.

### 4. Connect Android Device or Start Emulator

#### For Physical Device:
```bash
# Enable USB debugging on your Android device
# Connect via USB
flutter devices
```

#### For Android Emulator:
```bash
# Launch Android Studio
android-studio

# Go to Tools > AVD Manager
# Create and start a virtual device
```

### 5. Run the App
```bash
# For Android
flutter run

# For Web (if Chrome is installed)
flutter run -d chrome

# For Linux Desktop
flutter run -d linux
```

## Troubleshooting

### Common Issues:

1. **Flutter doctor shows Android toolchain issues:**
   ```bash
   flutter doctor --android-licenses
   ```

2. **Permission denied for Android SDK:**
   ```bash
   sudo chown -R $USER:$USER $HOME/Android
   ```

3. **Flutter not found in PATH:**
   ```bash
   echo 'export PATH="$PATH:$HOME/development/flutter/bin"' >> ~/.bashrc
   source ~/.bashrc
   ```

4. **Android device not detected:**
   ```bash
   # Add udev rules for Android devices
   sudo dnf install -y android-tools
   sudo usermod -aG plugdev $USER
   ```

5. **Build fails with missing dependencies:**
   ```bash
   flutter clean
   flutter pub get
   flutter pub deps
   ```

## Building for Release

### Android APK:
```bash
flutter build apk --release
```

### Android App Bundle:
```bash
flutter build appbundle --release
```

### Linux Desktop:
```bash
flutter build linux --release
```

## Project Structure

```
flutter_life_simulator/
├── lib/
│   ├── main.dart                 # App entry point
│   ├── models/
│   │   └── character.dart        # Character data model
│   ├── providers/
│   │   └── game_provider.dart    # Game state management
│   ├── screens/
│   │   ├── character_creation_screen.dart
│   │   └── game_interface_screen.dart
│   └── widgets/
│       ├── stats_panel.dart
│       ├── timeline_view.dart
│       ├── activities_panel.dart
│       ├── relationships_panel.dart
│       ├── profile_panel.dart
│       └── settings_panel.dart
├── pubspec.yaml              # Dependencies
└── README.md
```

## Next Steps

The core functionality is now implemented:
- Character creation
- Stats display
- Age progression
- Life events
- Save/load functionality
- Dark theme UI

To extend the app, you can:
1. Implement the Activities panel with different actions
2. Add relationship management
3. Create more detailed profile views
4. Add sound effects and animations
5. Implement achievements system

Happy coding! 🎉
