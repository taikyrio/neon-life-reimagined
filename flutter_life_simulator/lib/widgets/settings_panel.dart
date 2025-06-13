
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/game_provider.dart';

class SettingsPanel extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        children: [
          Card(
            color: Color(0xFF2C2C2E),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(color: Color(0xFF404040)),
            ),
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Settings',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 16),
                  
                  _SettingItem(
                    label: 'Sound Effects',
                    value: 'On',
                    onTap: () {},
                  ),
                  _SettingItem(
                    label: 'Music',
                    value: 'Off',
                    onTap: () {},
                  ),
                  _SettingItem(
                    label: 'Notifications',
                    value: 'On',
                    onTap: () {},
                  ),
                  
                  SizedBox(height: 16),
                  Divider(color: Color(0xFF404040)),
                  SizedBox(height: 16),
                  
                  Text(
                    'Game Data',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 12),
                  
                  _ActionButton(
                    label: 'Export Save Data',
                    onTap: () {},
                    color: Color(0xFF404040),
                  ),
                  SizedBox(height: 8),
                  _ActionButton(
                    label: 'Import Save Data',
                    onTap: () {},
                    color: Color(0xFF404040),
                  ),
                  SizedBox(height: 8),
                  _ActionButton(
                    label: 'Reset Game',
                    onTap: () => _showResetDialog(context),
                    color: Color(0xFFD32F2F),
                  ),
                  
                  SizedBox(height: 24),
                  Divider(color: Color(0xFF404040)),
                  SizedBox(height: 16),
                  
                  Center(
                    child: Column(
                      children: [
                        Text(
                          'Life Simulator v1.0',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.white54,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Made with Flutter',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.white38,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showResetDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Color(0xFF2C2C2E),
          title: Text(
            'Reset Game',
            style: TextStyle(color: Colors.white),
          ),
          content: Text(
            'Are you sure you want to reset your game? This cannot be undone.',
            style: TextStyle(color: Colors.white70),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                'Cancel',
                style: TextStyle(color: Colors.white70),
              ),
            ),
            TextButton(
              onPressed: () {
                context.read<GameProvider>().resetGame();
                Navigator.of(context).pop();
              },
              child: Text(
                'Reset',
                style: TextStyle(color: Color(0xFFD32F2F)),
              ),
            ),
          ],
        );
      },
    );
  }
}

class _SettingItem extends StatelessWidget {
  final String label;
  final String value;
  final VoidCallback onTap;

  const _SettingItem({
    required this.label,
    required this.value,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              color: Colors.white70,
            ),
          ),
          GestureDetector(
            onTap: onTap,
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Color(0xFF404040),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: Color(0xFF606060)),
              ),
              child: Text(
                value,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final Color color;

  const _ActionButton({
    required this.label,
    required this.onTap,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          padding: EdgeInsets.symmetric(vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}
