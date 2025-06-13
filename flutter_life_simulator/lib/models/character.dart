
class Character {
  final String id;
  String name;
  int age;
  String gender;
  int birthYear;
  
  // Core Stats
  int health;
  int happiness;
  int smartness;
  int appearance;
  int fitness;
  
  // Life Status
  int money;
  String education;
  String job;
  int salary;
  
  // Life Events and Relationships
  List<FamilyMember> family;
  List<Relationship> relationships;
  List<LifeEvent> lifeEvents;
  List<String> achievements;
  List<CrimeRecord> criminalRecord;
  List<Asset> assets;

  Character({
    required this.id,
    required this.name,
    required this.age,
    required this.gender,
    required this.birthYear,
    required this.health,
    required this.happiness,
    required this.smartness,
    required this.appearance,
    required this.fitness,
    this.money = 0,
    this.education = 'None',
    this.job = 'Unemployed',
    this.salary = 0,
    this.family = const [],
    this.relationships = const [],
    this.lifeEvents = const [],
    this.achievements = const [],
    this.criminalRecord = const [],
    this.assets = const [],
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'age': age,
      'gender': gender,
      'birthYear': birthYear,
      'health': health,
      'happiness': happiness,
      'smartness': smartness,
      'appearance': appearance,
      'fitness': fitness,
      'money': money,
      'education': education,
      'job': job,
      'salary': salary,
      'family': family.map((f) => f.toJson()).toList(),
      'relationships': relationships.map((r) => r.toJson()).toList(),
      'lifeEvents': lifeEvents.map((e) => e.toJson()).toList(),
      'achievements': achievements,
      'criminalRecord': criminalRecord.map((c) => c.toJson()).toList(),
      'assets': assets.map((a) => a.toJson()).toList(),
    };
  }

  factory Character.fromJson(Map<String, dynamic> json) {
    return Character(
      id: json['id'],
      name: json['name'],
      age: json['age'],
      gender: json['gender'],
      birthYear: json['birthYear'],
      health: json['health'],
      happiness: json['happiness'],
      smartness: json['smartness'],
      appearance: json['appearance'],
      fitness: json['fitness'],
      money: json['money'] ?? 0,
      education: json['education'] ?? 'None',
      job: json['job'] ?? 'Unemployed',
      salary: json['salary'] ?? 0,
      family: (json['family'] as List?)?.map((f) => FamilyMember.fromJson(f)).toList() ?? [],
      relationships: (json['relationships'] as List?)?.map((r) => Relationship.fromJson(r)).toList() ?? [],
      lifeEvents: (json['lifeEvents'] as List?)?.map((e) => LifeEvent.fromJson(e)).toList() ?? [],
      achievements: List<String>.from(json['achievements'] ?? []),
      criminalRecord: (json['criminalRecord'] as List?)?.map((c) => CrimeRecord.fromJson(c)).toList() ?? [],
      assets: (json['assets'] as List?)?.map((a) => Asset.fromJson(a)).toList() ?? [],
    );
  }
}

class FamilyMember {
  final String id;
  final String name;
  final String relationship;
  int age;
  bool alive;
  int relationshipLevel;

  FamilyMember({
    required this.id,
    required this.name,
    required this.relationship,
    required this.age,
    this.alive = true,
    required this.relationshipLevel,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'relationship': relationship,
    'age': age,
    'alive': alive,
    'relationshipLevel': relationshipLevel,
  };

  factory FamilyMember.fromJson(Map<String, dynamic> json) => FamilyMember(
    id: json['id'],
    name: json['name'],
    relationship: json['relationship'],
    age: json['age'],
    alive: json['alive'] ?? true,
    relationshipLevel: json['relationshipLevel'],
  );
}

class Relationship {
  final String id;
  final String name;
  final String type;
  int relationshipLevel;
  final int age;

  Relationship({
    required this.id,
    required this.name,
    required this.type,
    required this.relationshipLevel,
    required this.age,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'type': type,
    'relationshipLevel': relationshipLevel,
    'age': age,
  };

  factory Relationship.fromJson(Map<String, dynamic> json) => Relationship(
    id: json['id'],
    name: json['name'],
    type: json['type'],
    relationshipLevel: json['relationshipLevel'],
    age: json['age'],
  );
}

class LifeEvent {
  final String id;
  final int year;
  final int age;
  final String event;
  final String type;

  LifeEvent({
    required this.id,
    required this.year,
    required this.age,
    required this.event,
    required this.type,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'year': year,
    'age': age,
    'event': event,
    'type': type,
  };

  factory LifeEvent.fromJson(Map<String, dynamic> json) => LifeEvent(
    id: json['id'],
    year: json['year'],
    age: json['age'],
    event: json['event'],
    type: json['type'],
  );
}

class CrimeRecord {
  final String id;
  final String crime;
  final int year;
  final int age;
  final bool caught;
  final String? punishment;

  CrimeRecord({
    required this.id,
    required this.crime,
    required this.year,
    required this.age,
    required this.caught,
    this.punishment,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'crime': crime,
    'year': year,
    'age': age,
    'caught': caught,
    'punishment': punishment,
  };

  factory CrimeRecord.fromJson(Map<String, dynamic> json) => CrimeRecord(
    id: json['id'],
    crime: json['crime'],
    year: json['year'],
    age: json['age'],
    caught: json['caught'],
    punishment: json['punishment'],
  );
}

class Asset {
  final String id;
  final String name;
  final String type;
  final int value;
  final int purchaseYear;

  Asset({
    required this.id,
    required this.name,
    required this.type,
    required this.value,
    required this.purchaseYear,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'type': type,
    'value': value,
    'purchaseYear': purchaseYear,
  };

  factory Asset.fromJson(Map<String, dynamic> json) => Asset(
    id: json['id'],
    name: json['name'],
    type: json['type'],
    value: json['value'],
    purchaseYear: json['purchaseYear'],
  );
}
