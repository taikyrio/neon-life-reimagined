
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/game_provider.dart';
import '../widgets/stats_panel.dart';
import '../widgets/timeline_view.dart';
import '../widgets/activities_panel.dart';
import '../widgets/relationships_panel.dart';
import '../widgets/profile_panel.dart';
import '../widgets/settings_panel.dart';

class GameInterfaceScreen extends StatefulWidget {
  @override
  _GameInterfaceScreenState createState() => _GameInterfaceScreenState();
}

class _GameInterfaceScreenState extends State<GameInterfaceScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    TimelineView(),
    ActivitiesPanel(),
    RelationshipsPanel(),
    ProfilePanel(),
    SettingsPanel(),
  ];

  final List<IconData> _icons = [
    Icons.timeline,
    Icons.work,
    Icons.favorite,
    Icons.person,
    Icons.settings,
  ];

  final List<String> _labels = [
    'Timeline',
    'Activities',
    'Relations',
    'Profile',
    'Settings',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Stats Header
          Container(
            color: Color(0xFF2C2C2E),
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 16,
              left: 16,
              right: 16,
              bottom: 16,
            ),
            child: StatsPanel(),
          ),
          
          // Content Area
          Expanded(
            child: Container(
              color: Color(0xFF1C1C1E),
              child: _screens[_currentIndex],
            ),
          ),
        ],
      ),
      
      // Bottom Navigation
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Color(0xFF2C2C2E),
          border: Border(
            top: BorderSide(color: Color(0xFF404040), width: 1),
          ),
        ),
        child: SafeArea(
          child: Container(
            height: 80,
            child: Row(
              children: List.generate(_screens.length, (index) {
                final isSelected = _currentIndex == index;
                return Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _currentIndex = index),
                    child: Container(
                      decoration: BoxDecoration(
                        color: isSelected ? Color(0xFF3366CC) : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      margin: EdgeInsets.all(8),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            _icons[index],
                            color: isSelected ? Colors.white : Colors.white54,
                            size: 24,
                          ),
                          SizedBox(height: 4),
                          Text(
                            _labels[index],
                            style: TextStyle(
                              color: isSelected ? Colors.white : Colors.white54,
                              fontSize: 10,
                              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ),
          ),
        ),
      ),
    );
  }
}
