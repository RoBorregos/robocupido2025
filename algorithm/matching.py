#import pandas as pd
import numpy as np
#from openai import OpenAI
import os
from typing import Dict, List

class User:
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
            'hobby_time': self._parse_hobby_time(data['hobbyTime']),
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
            'embeddings': {
                'description': data['textEmbeddings']['description'],
                'detailed_description': data['textEmbeddings']['detailedDescription'],
                'attractive_traits': data['textEmbeddings']['attractiveTraits']
            }
        }

    def _parse_hobby_time(self, hobby_time: str) -> int:
        mapping = {
            'menos-5': 2.5,
            '5-10': 7.5,
            '10-20': 15,
            'mas-20': 25
        }
        return mapping.get(hobby_time, 7.5)

class MatchMaker:
    def __init__(self):
        # Weights for different matching criteria
        self.weights = {
            'activities_match': 50,
            'social_compatibility': 40,
            'hobby_time_compatibility': 30,
            'values_compatibility': 100,
            'personality_traits': 80,
            'conflict_resolution': 40,
            'embedding_similarity': 100
        }

    def calculate_match_score(self, user1: User, user2: User) -> float:
        # Basic compatibility checks
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
        # Age compatibility
        if (not user1.info['date_older'] and user2.info['age'] > user1.info['age']) or \
           (not user1.info['date_younger'] and user2.info['age'] < user1.info['age']):
            return False

        # Gender preference compatibility
        # Handle 'indiferente' preference
        user1_prefs = user1.info['match_preferences']
        user2_prefs = user2.info['match_preferences']
        
        if 'indiferente' not in user1_prefs and 'indiferente' not in user2_prefs:
            if user2.info['gender'] not in user1_prefs or user1.info['gender'] not in user2_prefs:
                return False

        # Relationship type compatibility
        if user1.info['looking_for'] != user2.info['looking_for']:
            return False

        return True

    def _calculate_values_compatibility(self, user1: User, user2: User) -> float:
        total_score = 0
        for value in user1.info['values_importance']:
            importance1 = user1.info['values_importance'][value]
            importance2 = user2.info['values_importance'][value]
            # Higher score for similar high importance values
            if importance1 >= 4 and importance2 >= 4:
                total_score += 1
            # Penalty for mismatched importance
            elif abs(importance1 - importance2) > 2:
                total_score -= 0.5
        return max(total_score / len(user1.info['values_importance']), 0)

    def _calculate_personality_compatibility(self, user1: User, user2: User) -> float:
        traits = ['closeness_ease', 'attention_to_detail', 'stress_level', 'imagination']
        total_score = 0
        for trait in traits:
            diff = abs(user1.info[trait] - user2.info[trait])
            total_score += 1 - (diff / 6)
        return total_score / len(traits)

    def _calculate_embedding_similarity(self, user1: User, user2: User) -> float:
        # Compare user1's attractive traits with user2's descriptions
        if user1.info['embeddings']['attractive_traits'] and user2.info['embeddings']['detailed_description']:
            return self._cosine_similarity(
                user1.info['embeddings']['attractive_traits'], 
                user2.info['embeddings']['detailed_description']
            )
            
        return 0

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))