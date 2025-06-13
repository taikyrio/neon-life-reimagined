
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/character.dart';

class GameProvider extends ChangeNotifier {
  Character? _character;
  Character? get character => _character;

  void createCharacter(String name, String gender) {
    final stats = _generateRandomStats();
    final birthYear = DateTime.now().year;
    
    _character = Character(
      id: _generateId(),
      name: name,
      age: 0,
      gender: gender,
      birthYear: birthYear,
      health: stats['health']!,
      happiness: stats['happiness']!,
      smartness: stats['smartness']!,
      appearance: stats['appearance']!,
      fitness: stats['fitness']!,
      family: [
        FamilyMember(
          id: '1',
          name: gender == 'male' ? 'John Martin' : 'Jane Martin',
          relationship: 'father',
          age: Random().nextInt(20) + 25,
          relationshipLevel: Random().nextInt(50) + 50,
        ),
        FamilyMember(
          id: '2',
          name: gender == 'male' ? 'Mary Martin' : 'Maria Martin',
          relationship: 'mother',
          age: Random().nextInt(20) + 25,
          relationshipLevel: Random().nextInt(50) + 50,
        ),
      ],
      lifeEvents: [
        LifeEvent(
          id: '1',
          year: birthYear,
          age: 0,
          event: '$name was born!',
          type: 'positive',
        ),
      ],
    );
    
    _saveGame();
    notifyListeners();
  }

  void ageUp() {
    if (_character == null) return;

    _character!.age += 1;
    
    // Apply random stat changes
    final statChanges = {
      'health': Random().nextInt(11) - 5,
      'happiness': Random().nextInt(11) - 5,
      'smartness': Random().nextInt(6) - 2,
      'appearance': Random().nextInt(7) - 3,
      'fitness': Random().nextInt(9) - 4,
    };

    _character!.health = (_character!.health + statChanges['health']!).clamp(0, 100);
    _character!.happiness = (_character!.happiness + statChanges['happiness']!).clamp(0, 100);
    _character!.smartness = (_character!.smartness + statChanges['smartness']!).clamp(0, 100);
    _character!.appearance = (_character!.appearance + statChanges['appearance']!).clamp(0, 100);
    _character!.fitness = (_character!.fitness + statChanges['fitness']!).clamp(0, 100);

    // Random life events
    if (Random().nextDouble() < 0.4) {
      _addRandomLifeEvent();
    }

    // Age family members
    for (var member in _character!.family) {
      member.age += 1;
    }

    _saveGame();
    notifyListeners();
  }

  void performAction(String action, Map<String, int> effects) {
    if (_character == null) return;

    effects.forEach((stat, change) {
      switch (stat) {
        case 'health':
          _character!.health = (_character!.health + change).clamp(0, 100);
          break;
        case 'happiness':
          _character!.happiness = (_character!.happiness + change).clamp(0, 100);
          break;
        case 'smartness':
          _character!.smartness = (_character!.smartness + change).clamp(0, 100);
          break;
        case 'appearance':
          _character!.appearance = (_character!.appearance + change).clamp(0, 100);
          break;
        case 'fitness':
          _character!.fitness = (_character!.fitness + change).clamp(0, 100);
          break;
        case 'money':
          _character!.money = (_character!.money + change).clamp(0, 999999999);
          break;
      }
    });

    _character!.lifeEvents.add(LifeEvent(
      id: _generateId(),
      year: _character!.birthYear + _character!.age,
      age: _character!.age,
      event: action,
      type: effects['happiness'] != null && effects['happiness']! > 0 ? 'positive' : 
            effects['happiness'] != null && effects['happiness']! < 0 ? 'negative' : 'neutral',
    ));

    _saveGame();
    notifyListeners();
  }

  void resetGame() {
    _character = null;
    _clearSavedGame();
    notifyListeners();
  }

  Map<String, int> _generateRandomStats() {
    return {
      'health': Random().nextInt(50) + 50,
      'happiness': Random().nextInt(50) + 50,
      'smartness': Random().nextInt(50) + 50,
      'appearance': Random().nextInt(50) + 50,
      'fitness': Random().nextInt(50) + 50,
    };
  }

  void _addRandomLifeEvent() {
    final events = [
      'Had a great day at school',
      'Made a new friend',
      'Learned something new',
      'Had a peaceful day',
      'Enjoyed time with family',
      'Got sick and stayed home',
      'Had an argument with a friend',
      'Received a compliment',
      'Failed a test',
      'Won a small prize',
    ];

    final event = events[Random().nextInt(events.length)];
    final eventType = event.contains('sick') || event.contains('argument') || event.contains('Failed') 
        ? 'negative' 
        : event.contains('great') || event.contains('Won') || event.contains('compliment') 
            ? 'positive' 
            : 'neutral';

    _character!.lifeEvents.add(LifeEvent(
      id: _generateId(),
      year: _character!.birthYear + _character!.age,
      age: _character!.age,
      event: event,
      type: eventType,
    ));
  }

  String _generateId() {
    return DateTime.now().millisecondsSinceEpoch.toString() + Random().nextInt(1000).toString();
  }

  Future<void> _saveGame() async {
    if (_character == null) return;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('character_data', jsonEncode(_character!.toJson()));
  }

  Future<void> loadGame() async {
    final prefs = await SharedPreferences.getInstance();
    final characterData = prefs.getString('character_data');
    if (characterData != null) {
      _character = Character.fromJson(jsonDecode(characterData));
      notifyListeners();
    }
  }

  Future<void> _clearSavedGame() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('character_data');
  }
}
