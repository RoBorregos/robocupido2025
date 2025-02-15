from pymongo import MongoClient
from matching import User, MatchMaker
from typing import List, Dict, Any
import os
from dotenv import load_dotenv

def prepare_user_data(mongo_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transform MongoDB data into the format expected by the User class"""
    return {
        'profileId': str(mongo_data['_id']),
        'age': mongo_data['age'],
        'gender': mongo_data['gender'],
        'matchPreferences': mongo_data['matchPreferences'],
        'lookingFor': mongo_data['lookingFor'],
        'dateOlder': mongo_data['dateOlder'],
        'dateYounger': mongo_data['dateYounger'],
        'activities': mongo_data['activities'],
        'socialPreference': mongo_data['socialPreference'],
        'hobbyTime': mongo_data['hobbyTime'],
        'honestyImportance': mongo_data['honestyImportance'],
        'loyaltyImportance': mongo_data['loyaltyImportance'],
        'kindnessImportance': mongo_data['kindnessImportance'],
        'respectImportance': mongo_data['respectImportance'],
        'openMindednessImportance': mongo_data['openMindednessImportance'],
        'independenceImportance': mongo_data['independenceImportance'],
        'ambitionImportance': mongo_data['ambitionImportance'],
        'creativityImportance': mongo_data['creativityImportance'],
        'humorImportance': mongo_data['humorImportance'],
        'authenticityImportance': mongo_data['authenticityImportance'],
        'empathyImportance': mongo_data['empathyImportance'],
        'closenessEase': mongo_data['closenessEase'],
        'conflictResolution': mongo_data['conflictResolution'],
        'attentionToDetail': mongo_data['attentionToDetail'],
        'stressLevel': mongo_data['stressLevel'],
        'imagination': mongo_data['imagination'],
        'textEmbeddings': mongo_data['textEmbeddings']
    }

def calculate_max_possible_score(matchmaker: MatchMaker) -> float:
    """Calculate the maximum possible score based on weights"""
    return sum(matchmaker.weights.values())

def generate_matches():
    # Load environment variables
    load_dotenv()
    
    # Connect to MongoDB
    client = MongoClient(os.getenv('MONGODB_URI'))
    print(client.list_database_names())
    db = client['robocupido']
    
    # Get collections
    profiles = db['profiles']
    preferences = db['preferences']
    embeddings = db['textEmbeddings']

    # Get the number of users
    num_users = profiles.count_documents({})
    print(f'Number of users: {num_users}')

    # Get a sample of 20 users with their complete data
    pipeline = [
        { "$sample": { "size": 20 } },
        {
            "$lookup": {
                "from": "preferences",
                "localField": "_id",
                "foreignField": "profileId",
                "as": "preferences"
            }
        },
        {
            "$lookup": {
                "from": "textEmbeddings",
                "localField": "_id",
                "foreignField": "profileId",
                "as": "embeddings"
            }
        },
        { "$unwind": "$preferences" },
        { "$unwind": "$embeddings" },
        {
            "$addFields": {
                "matchPreferences": "$preferences.matchPreferences",
                "lookingFor": "$preferences.lookingFor",
                "dateOlder": "$preferences.dateOlder",
                "dateYounger": "$preferences.dateYounger",
                "activities": "$preferences.activities",
                "socialPreference": "$preferences.socialPreference",
                "hobbyTime": "$preferences.hobbyTime",
                "honestyImportance": "$preferences.honestyImportance",
                "loyaltyImportance": "$preferences.loyaltyImportance",
                "kindnessImportance": "$preferences.kindnessImportance",
                "respectImportance": "$preferences.respectImportance",
                "openMindednessImportance": "$preferences.openMindednessImportance",
                "independenceImportance": "$preferences.independenceImportance",
                "ambitionImportance": "$preferences.ambitionImportance",
                "creativityImportance": "$preferences.creativityImportance",
                "humorImportance": "$preferences.humorImportance",
                "authenticityImportance": "$preferences.authenticityImportance",
                "empathyImportance": "$preferences.empathyImportance",
                "closenessEase": "$preferences.closenessEase",
                "conflictResolution": "$preferences.conflictResolution",
                "attentionToDetail": "$preferences.attentionToDetail",
                "stressLevel": "$preferences.stressLevel",
                "imagination": "$preferences.imagination",
                "textEmbeddings": "$embeddings.embeddings"
            }
        }
    ]

    users_data = list(profiles.aggregate(pipeline))
    print(f'Users {users_data}')
    
    # Initialize MatchMaker
    matchmaker = MatchMaker()
    max_score = calculate_max_possible_score(matchmaker)
    
    # Process each user
    matches_collection = []
    
    for user_data in users_data:
        # Prepare user data
        current_user = User(prepare_user_data(user_data))
        
        # Initialize match categories
        matches = {
            "profileId": user_data["_id"],
            "pareja": [],
            "casual": [],
            "amigos": []
        }
        
        # Find matches with other users
        for potential_match_data in users_data:
            # Skip self-matching
            if str(user_data["_id"]) == str(potential_match_data["_id"]):
                continue
                
            potential_match = User(prepare_user_data(potential_match_data))
            
            # Calculate match score
            score = matchmaker.calculate_match_score(current_user, potential_match)
            
            if score > 0:
                # Convert score to percentage
                score_percentage = int((score / max_score) * 100)
                
                # Add to appropriate category based on lookingFor
                match_type = potential_match_data["preferences"]["lookingFor"]
                if match_type in matches:
                    matches[match_type].append({
                        "id": potential_match_data["_id"],
                        "score": score_percentage
                    })
        
        # Sort matches by score and keep top matches for each category
        for category in ["pareja", "casual", "amigos"]:
            if matches[category]:
                matches[category] = sorted(
                    matches[category],
                    key=lambda x: x["score"],
                    reverse=True
                )[:3]  # Keep top 3 matches
            else:
                matches[category] = None
        
        matches_collection.append(matches)
        
        # Debug print
        print(f"\nMatches for user {user_data['_id']}:")
        for category in ["pareja", "casual", "amigos"]:
            if matches[category]:
                print(f"\n{category.upper()} matches:")
                for match in matches[category]:
                    print(f"Match ID: {match['id']}, Compatibility: {match['score']}%")
    
    return matches_collection

if __name__ == "__main__":
    matches = generate_matches()
    
    # Example of how the data would be stored in MongoDB
    example_match = matches
    print("\nExample MongoDB document structure:")
    print(example_match) 