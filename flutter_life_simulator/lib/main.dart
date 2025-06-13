
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/character_creation_screen.dart';
import 'screens/game_interface_screen.dart';
import 'providers/game_provider.dart';
import 'models/character.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => GameProvider(),
      child: MaterialApp(
        title: 'Life Simulator',
        theme: ThemeData.dark().copyWith(
          scaffoldBackgroundColor: Color(0xFF1C1C1E),
          cardColor: Color(0xFF2C2C2E),
          primaryColor: Color(0xFF3366CC),
          textTheme: TextTheme(
            bodyLarge: TextStyle(color: Colors.white),
            bodyMedium: TextStyle(color: Colors.white70),
          ),
        ),
        home: Consumer<GameProvider>(
          builder: (context, gameProvider, child) {
            return gameProvider.character == null
                ? CharacterCreationScreen()
                : GameInterfaceScreen();
          },
        ),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
