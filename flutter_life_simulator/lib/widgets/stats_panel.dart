
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/game_provider.dart';

class StatsPanel extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<GameProvider>(
      builder: (context, gameProvider, child) {
        final character = gameProvider.character;
        if (character == null) return Container();

        return Column(
          children: [
            // Character Info
            Text(
              character.name,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            SizedBox(height: 4),
            Text(
              'Age ${character.age} • \$${character.money.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
              style: TextStyle(
                fontSize: 14,
                color: Colors.white70,
              ),
            ),
            SizedBox(height: 16),
            
            // Stat Bars
            Row(
              children: [
                Expanded(child: _StatBar(label: 'Health', value: character.health, color: Color(0xFF4CAF50))),
                SizedBox(width: 8),
                Expanded(child: _StatBar(label: 'Happy', value: character.happiness, color: Color(0xFFFFEB3B))),
              ],
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Expanded(child: _StatBar(label: 'Smarts', value: character.smartness, color: Color(0xFF2196F3))),
                SizedBox(width: 8),
                Expanded(child: _StatBar(label: 'Looks', value: character.appearance, color: Color(0xFFE91E63))),
              ],
            ),
            SizedBox(height: 8),
            _StatBar(label: 'Fitness', value: character.fitness, color: Color(0xFFF44336)),
          ],
        );
      },
    );
  }
}

class _StatBar extends StatelessWidget {
  final String label;
  final int value;
  final Color color;

  const _StatBar({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: Colors.white70,
              ),
            ),
            Text(
              '$value%',
              style: TextStyle(
                fontSize: 12,
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        SizedBox(height: 4),
        Container(
          height: 6,
          decoration: BoxDecoration(
            color: Color(0xFF404040),
            borderRadius: BorderRadius.circular(3),
          ),
          child: Stack(
            children: [
              FractionallySizedBox(
                widthFactor: value / 100,
                child: Container(
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
