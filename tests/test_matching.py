import unittest
import numpy as np
from algorithm.matching import User, MatchMaker

class TestMatching(unittest.TestCase):
    def setUp(self):
        # Sample user data for testing
        self.user1_data = {
            'profileId': '1',
            'age': 25,
            'gender': 'femenino',
            'matchPreferences': ['hombres'],  # Changed to match with user3
            'lookingFor': 'casual',  # Changed to match with user3
            'dateOlder': 'si',
            'dateYounger': 'si',
            'activities': ['leer', 'deportes', 'musica'],
            'socialPreference': 4,
            'hobbyTime': '5-10',
            'honestyImportance': 6,
            'loyaltyImportance': 5,
            'kindnessImportance': 6,
            'respectImportance': 5,
            'openMindednessImportance': 4,
            'independenceImportance': 3,
            'ambitionImportance': 4,
            'creativityImportance': 3,
            'humorImportance': 5,
            'authenticityImportance': 6,
            'empathyImportance': 5,
            'closenessEase': 4,
            'conflictResolution': 'understanding',
            'attentionToDetail': 5,
            'stressLevel': 3,
            'imagination': 4,
            'selfDescription': [0.2, 0.3, 0.4],
            'attractedTo': [0.3, 0.4, 0.5]
        }

        self.user2_data = {
            'profileId': '2',
            'age': 26,
            'gender': 'femenino',
            'matchPreferences': ['hombres'],  # Looking for men only
            'lookingFor': 'casual',  # Changed to match with user3
            'dateOlder': 'si',
            'dateYounger': 'si',
            'activities': ['deportes', 'videojuegos', 'musica'],
            'socialPreference': 3,
            'hobbyTime': '5-10',
            'honestyImportance': 5,
            'loyaltyImportance': 6,
            'kindnessImportance': 5,
            'respectImportance': 5,
            'openMindednessImportance': 4,
            'independenceImportance': 4,
            'ambitionImportance': 5,
            'creativityImportance': 3,
            'humorImportance': 6,
            'authenticityImportance': 5,
            'empathyImportance': 4,
            'closenessEase': 5,
            'conflictResolution': 'compromising',
            'attentionToDetail': 4,
            'stressLevel': 4,
            'imagination': 3,
            'selfDescription': [0.25, 0.35, 0.45],
            'attractedTo': [0.35, 0.45, 0.55]
        }

        # Additional test users
        self.user3_data = {
            'profileId': '3',
            'age': 28,
            'gender': 'masculino',
            'matchPreferences': ['mujeres'],  # Changed to only women for simpler testing
            'lookingFor': 'casual',
            'dateOlder': 'si',
            'dateYounger': 'si',  # Changed to allow younger matches
            'activities': ['viajar', 'cocinar', 'peliculas', 'musica'],
            'socialPreference': 5,
            'hobbyTime': '10-20',
            'honestyImportance': 4,
            'loyaltyImportance': 3,
            'kindnessImportance': 5,
            'respectImportance': 6,
            'openMindednessImportance': 5,
            'independenceImportance': 4,
            'ambitionImportance': 3,
            'creativityImportance': 4,
            'humorImportance': 6,
            'authenticityImportance': 4,
            'empathyImportance': 5,
            'closenessEase': 3,
            'conflictResolution': 'assertive',
            'attentionToDetail': 3,
            'stressLevel': 2,
            'imagination': 5,
            'selfDescription': [0.5, 0.6, 0.7],
            'attractedTo': [0.6, 0.7, 0.8]
        }

        self.user4_data = {
            'profileId': '4',
            'age': 22,
            'gender': 'no-binario',
            'matchPreferences': ['indiferente'],  # Open to all genders
            'lookingFor': 'amistad',
            'dateOlder': 'si',
            'dateYounger': 'si',
            'activities': ['arte', 'musica', 'leer', 'peliculas'],
            'socialPreference': 2,
            'hobbyTime': 'menos-5',
            'honestyImportance': 6,
            'loyaltyImportance': 6,
            'kindnessImportance': 6,
            'respectImportance': 6,
            'openMindednessImportance': 6,
            'independenceImportance': 5,
            'ambitionImportance': 3,
            'creativityImportance': 6,
            'humorImportance': 4,
            'authenticityImportance': 6,
            'empathyImportance': 6,
            'closenessEase': 2,
            'conflictResolution': 'avoiding',
            'attentionToDetail': 6,
            'stressLevel': 5,
            'imagination': 6,
            'selfDescription': [0.3, 0.4, 0.5],
            'attractedTo': [0.4, 0.5, 0.6]
        }

        self.user5_data = {
            'profileId': '3',
            'age': 18,
            'gender': 'masculino',
            'matchPreferences': ['indiferente'],  # Changed to only women for simpler testing
            'lookingFor': 'casual',
            'dateOlder': 'si',
            'dateYounger': 'si',  # Changed to allow younger matches
            'activities': ['viajar', 'cocinar', 'peliculas', 'musica'],
            'socialPreference': 5,
            'hobbyTime': '10-20',
            'honestyImportance': 4,
            'loyaltyImportance': 3,
            'kindnessImportance': 5,
            'respectImportance': 6,
            'openMindednessImportance': 5,
            'independenceImportance': 4,
            'ambitionImportance': 3,
            'creativityImportance': 4,
            'humorImportance': 6,
            'authenticityImportance': 4,
            'empathyImportance': 5,
            'closenessEase': 3,
            'conflictResolution': 'assertive',
            'attentionToDetail': 3,
            'stressLevel': 2,
            'imagination': 5,
            'selfDescription': [0.5, 0.6, 0.7],
            'attractedTo': [0.6, 0.7, 0.8]
        }


        # Initialize users and matchmaker
        self.user1 = User(self.user1_data)
        self.user2 = User(self.user2_data)
        self.user3 = User(self.user3_data)
        self.user4 = User(self.user4_data)
        self.user5 = User(self.user5_data)
        self.matchmaker = MatchMaker()

    def test_user_initialization(self):
        """Test User class initialization and data parsing"""
        self.assertEqual(self.user1.info['id'], '1')
        self.assertEqual(self.user1.info['age'], 25)
        self.assertEqual(self.user1.info['hobby_time'], 7.5)  # Test hobby time parsing
        self.assertIsInstance(self.user1.info['values_importance'], dict)
        self.assertEqual(len(self.user1.info['values_importance']), 11)  # Test all values are present

    def test_hobby_time_parsing(self):
        """Test the hobby time parsing method"""
        test_cases = {
            'menos-5': 2.5,
            '5-10': 7.5,
            '10-20': 15,
            'mas-20': 25,
            'invalid': 7.5  # Default value
        }
        
        for input_val, expected in test_cases.items():
            result = self.user1._parse_hobby_time(input_val)
            self.assertEqual(result, expected)

    def test_gender_preference_compatibility(self):
        """Test that gender preferences are respected in matching"""
        # User1 (woman looking for men) should match with User3 (man looking for women)
        self.assertTrue(self.matchmaker._check_basic_compatibility(self.user1, self.user3))
        
        # User2 (woman looking for men) should match with User3 (man looking for women)
        self.assertTrue(self.matchmaker._check_basic_compatibility(self.user3, self.user2))

        # User3 (man looking for woman) should not match with User5 (man looking for anyone)
        self.assertFalse(self.matchmaker._check_basic_compatibility(self.user3, self.user5))

    def test_relationship_type_compatibility(self):
        """Test that relationship type preferences are respected"""
        # User1 wants casual, User3 wants casual
        self.assertTrue(self.matchmaker._check_basic_compatibility(self.user1, self.user3))
        
        # User4 wants friendship, User1 wants relationship
        self.assertFalse(self.matchmaker._check_basic_compatibility(self.user4, self.user1))

    def test_activities_matching(self):
        """Test activity matching scores"""
        # User1 and User3 should be compatible (gender and relationship type match)
        score = self.matchmaker.calculate_match_score(self.user1, self.user3)
        self.assertGreater(score, 0)
        
        # User3 and User2 should be compatible
        score = self.matchmaker.calculate_match_score(self.user3, self.user2)
        self.assertGreater(score, 0)

    def test_values_compatibility(self):
        """Test values compatibility calculation"""
        score = self.matchmaker._calculate_values_compatibility(self.user1, self.user2)
        self.assertGreaterEqual(score, 0)
        self.assertLessEqual(score, 1)

    def test_personality_compatibility(self):
        """Test personality traits compatibility calculation"""
        score = self.matchmaker._calculate_personality_compatibility(self.user1, self.user2)
        self.assertGreaterEqual(score, 0)
        self.assertLessEqual(score, 1)

    def test_embedding_similarity(self):
        """Test embedding similarity calculation"""
        score = self.matchmaker._calculate_embedding_similarity(self.user1, self.user2)
        self.assertGreaterEqual(score, 0)
        self.assertLessEqual(score, 1)

    def test_cosine_similarity(self):
        """Test cosine similarity calculation"""
        vec1 = [1, 0, 0]
        vec2 = [1, 0, 0]
        self.assertAlmostEqual(self.matchmaker._cosine_similarity(vec1, vec2), 1.0)

        vec2 = [0, 1, 0]
        self.assertAlmostEqual(self.matchmaker._cosine_similarity(vec1, vec2), 0.0)

    def test_match_score_calculation(self):
        """Test overall match score calculation"""
        # Test compatible users (User3 and User2)
        score1 = self.matchmaker.calculate_match_score(self.user3, self.user2)
        self.assertGreater(score1, 0)
        
        # Test incompatible users (User1 and User4 - different relationship goals)
        score2 = self.matchmaker.calculate_match_score(self.user1, self.user4)
        self.assertEqual(score2, 0)

    def test_match_score_symmetry(self):
        """Test that match scores are symmetric"""
        score1 = self.matchmaker.calculate_match_score(self.user1, self.user2)
        score2 = self.matchmaker.calculate_match_score(self.user2, self.user1)
        self.assertAlmostEqual(score1, score2)

    def test_weight_sensitivity(self):
        """Test that changing weights affects the final score"""
        # Use User3 and User2 who should be compatible
        original_score = self.matchmaker.calculate_match_score(self.user3, self.user2)
        
        # Modify a weight
        original_weight = self.matchmaker.weights['activities_match']
        self.matchmaker.weights['activities_match'] = original_weight * 2
        
        modified_score = self.matchmaker.calculate_match_score(self.user3, self.user2)
        self.assertNotEqual(original_score, modified_score)

        # Restore original weight
        self.matchmaker.weights['activities_match'] = original_weight

if __name__ == '__main__':
    unittest.main() 






"""
,"profileId":{"$oid":"67b1a0829451a7998d5bfbbd"},"description":"Ya me voy a graduar :D me gusta viajar, platicar, salir, hacer ejercicio.","matchPreferences":["mujeres","hombres"],"lookingFor":"amistad","dateOlder":"si","dateYounger":"si","activities":["deportes","viajar","leer"],"socialPreference":{"$numberInt":"5"},"hobbyTime":"5-10","honestyImportance":{"$numberInt":"5"},"loyaltyImportance":{"$numberInt":"4"},"kindnessImportance":{"$numberInt":"6"},"respectImportance":{"$numberInt":"6"},"openMindednessImportance":{"$numberInt":"3"},"independenceImportance":{"$numberInt":"5"},"ambitionImportance":{"$numberInt":"4"},"creativityImportance":{"$numberInt":"4"},"humorImportance":{"$numberInt":"3"},"authenticityImportance":{"$numberInt":"5"},"empathyImportance":{"$numberInt":"6"},"closenessEase":{"$numberInt":"5"},"conflictResolution":"compromising","attentionToDetail":{"$numberInt":"5"},"stressLevel":{"$numberInt":"2"},"imagination":{"$numberInt":"4"},"shareDetailedInfo":"no","detailedDescription":"","attractiveTraits":".","createdAt":{"$date":{"$numberLong":"1739162052720"}},"lastUpdated":{"$date":{"$numberLong":"1739162052720"}}}
{"_id":{"$oid":"67aa07e1aac9a482aaf3f8a0"},"profileId":{"$oid":"67b1a0829451a7998d5bfbbd"},"textEmbeddings":{"description":null,"detailedDescription":null,"attractiveTraits":null},"createdAt":{"$date":{"$numberLong":"1739196385229"}},"lastUpdated":{"$date":{"$numberLong":"1739196385229"}}}
{_id:ObjectId('67b1a0829451a7998d5bfbbd')}
67a981c4448aae0366059321
"""