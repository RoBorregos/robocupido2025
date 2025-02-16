"""Matching weighted algorithm for finding a compatibility score between users 
based on their profiles."""
from typing import Dict, List
import numpy as np

class User:
    """Data object to store user profile information."""
    def __init__(self, data: Dict):
        self.info = {
            'id': data['profileId'],
            'age': data['age'],
            'gender': data['gender'],
            'match_preferences': data['matchPreferences'],
            'looking_for': data['lookingFor'],
            'date_older': data['dateOlder'] == 'si',
            'date_younger': data['dateYounger'] == 'si',
            'activities': data['activities'],
            'social_preference': data['socialPreference'],
            'hobby_time': self.parse_hobby_time(data['hobbyTime']),
            # Importance scores (0-6)
            'values_importance': {
                'honesty': data['honestyImportance'],
                'loyalty': data['loyaltyImportance'],
                'kindness': data['kindnessImportance'],
                'respect': data['respectImportance'],
                'open_mindedness': data['openMindednessImportance'],
                'independence': data['independenceImportance'],
                'ambition': data['ambitionImportance'],
                'creativity': data['creativityImportance'],
                'humor': data['humorImportance'],
                'authenticity': data['authenticityImportance'],
                'empathy': data['empathyImportance']
            },
            'closeness_ease': data['closenessEase'],
            'conflict_resolution': data['conflictResolution'],
            'attention_to_detail': data['attentionToDetail'],
            'stress_level': data['stressLevel'],
            'imagination': data['imagination'],
            # Text embeddings
            'self_description': data['selfDescription'],
            'attracted_to': data['attractedTo']
        }

    def parse_hobby_time(self, hobby_time: str) -> int:
        """Parse hobby time string to integer value."""
        mapping = {
            'menos-5': 2.5,
            '5-10': 7.5,
            '10-20': 15,
            'mas-20': 25
        }
        return mapping.get(hobby_time, 7.5)

class MatchMaker:
    """Collection of methods to calculate compatibility score between two users."""
    def __init__(self):
        # Weights for different matching criteria
        self.weights = {
            'activities_match': 60,
            'social_compatibility': 30,
            'hobby_time_compatibility': 5,
            'values_compatibility': 180,
            'personality_traits': 90,
            'conflict_resolution': 30,
            'embedding_similarity': 100
        }

    def calculate_match_score(self, user1: User, user2: User) -> float:
        """Main method to calculate the score."""
        if not self._check_basic_compatibility(user1, user2):
            return 0

        score = 0
        
        # Activities match
        common_activities = len(set(user1.info['activities']) & set(user2.info['activities']))
        score += (common_activities / max(len(user1.info['activities']), 1)) * self.weights['activities_match']

        # Social preference compatibility
        social_diff = abs(user1.info['social_preference'] - user2.info['social_preference'])
        score += (1 - social_diff/6) * self.weights['social_compatibility']

        # Hobby time compatibility
        hobby_time_diff = abs(user1.info['hobby_time'] - user2.info['hobby_time'])
        score += (1 - min(hobby_time_diff/20, 1)) * self.weights['hobby_time_compatibility']

        # Values compatibility
        values_score = self._calculate_values_compatibility(user1, user2)
        score += values_score * self.weights['values_compatibility']

        # Personality traits compatibility
        personality_score = self._calculate_personality_compatibility(user1, user2)
        score += personality_score * self.weights['personality_traits']

        # Conflict resolution compatibility
        if user1.info['conflict_resolution'] == user2.info['conflict_resolution']:
            score += self.weights['conflict_resolution']

        # Embedding similarity
        embedding_score = self._calculate_embedding_similarity(user1, user2)
        score += embedding_score * self.weights['embedding_similarity']

        return score

    def _check_basic_compatibility(self, user1: User, user2: User) -> bool:
        """Check age, gender and relationship type compatibility."""
        if (not user1.info['date_older'] and user2.info['age'] > user1.info['age']) or \
           (not user1.info['date_younger'] and user2.info['age'] < user1.info['age']):
            return False
        
        if (not user2.info['date_older'] and user1.info['age'] > user2.info['age']) or \
           (not user2.info['date_younger'] and user1.info['age'] < user2.info['age']):
            return False

        # Gender preference compatibility
        gender_map = {
            'hombres': 'M',
            'mujeres': 'W',
            'no-binarias': 'NB',
            'masculino': 'M',
            'femenino': 'W',
            'no-binario': 'NB',
            'prefiero-no-decirlo': 'ND'
        }
        user1_prefs = []
        if 'indiferente' in user1.info['match_preferences']:
            user1_prefs = ['M', 'W', 'NB', 'ND']
        else:
            for pref in user1.info['match_preferences']:
                user1_prefs.append(gender_map[pref])
        user2_prefs = []
        if 'indiferente' in user2.info['match_preferences']:
            user2_prefs = ['M', 'W', 'NB', 'ND']
        else:
            for pref in user2.info['match_preferences']:
                user2_prefs.append(gender_map[pref])

        if gender_map[user2.info['gender']] not in user1_prefs or \
           gender_map[user1.info['gender']] not in user2_prefs:
            return False

        # Relationship type compatibility
        if user1.info['looking_for'] != user2.info['looking_for']:
            return False

        return True

    def _calculate_values_compatibility(self, user1: User, user2: User) -> float:
        """Calculate compatibility based on values importance."""
        total_score = 0
        for value in user1.info['values_importance']:
            importance1 = user1.info['values_importance'][value]
            importance2 = user2.info['values_importance'][value]
            # Higher score for similar high importance values
            if importance1 >= 4 and importance2 >= 4:
                total_score += 1
        return max(total_score / len(user1.info['values_importance']), 0)

    def _calculate_personality_compatibility(self, user1: User, user2: User) -> float:
        """Calculate compatibility based on personality traits."""
        traits = ['closeness_ease', 'attention_to_detail', 'stress_level', 'imagination']
        total_score = 0
        for trait in traits:
            diff = abs(user1.info[trait] - user2.info[trait])
            total_score += 1 - (diff / 6)
        return total_score / len(traits)

    def _calculate_embedding_similarity(self, user1: User, user2: User) -> float:
        """Calculate compatibility based on open-ended questions."""
        if user1.info['attracted_to'] is not None and user2.info['self_description'] is not None:
            return self._cosine_similarity(
                user1.info['attracted_to'],
                user2.info['self_description']
            )
        return 0

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
