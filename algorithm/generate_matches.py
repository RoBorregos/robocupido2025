from pymongo import MongoClient
from matching import User, MatchMaker
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
import pprint

def prepare_user_data(profile_data: Dict[str, Any], preferences_data: Dict[str, Any],
                        embeddings_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transform MongoDB data into the format expected by the User class"""
    return {
        'profileId': str(profile_data['_id']),
        'age': profile_data['age'],
        'gender': profile_data['gender'],
        'matchPreferences': preferences_data['matchPreferences'],
        'lookingFor': preferences_data['lookingFor'],
        'dateOlder': preferences_data['dateOlder'],
        'dateYounger': preferences_data['dateYounger'],
        'activities': preferences_data['activities'],
        'socialPreference': preferences_data['socialPreference'],
        'hobbyTime': preferences_data['hobbyTime'],
        'honestyImportance': preferences_data['honestyImportance'],
        'loyaltyImportance': preferences_data['loyaltyImportance'],
        'kindnessImportance': preferences_data['kindnessImportance'],
        'respectImportance': preferences_data['respectImportance'],
        'openMindednessImportance': preferences_data['openMindednessImportance'],
        'independenceImportance': preferences_data['independenceImportance'],
        'ambitionImportance': preferences_data['ambitionImportance'],
        'creativityImportance': preferences_data['creativityImportance'],
        'humorImportance': preferences_data['humorImportance'],
        'authenticityImportance': preferences_data['authenticityImportance'],
        'empathyImportance': preferences_data['empathyImportance'],
        'closenessEase': preferences_data['closenessEase'],
        'conflictResolution': preferences_data['conflictResolution'],
        'attentionToDetail': preferences_data['attentionToDetail'],
        'stressLevel': preferences_data['stressLevel'],
        'imagination': preferences_data['imagination'],
        'textEmbeddings': {
            'description': "",
            'detailedDescription': embeddings_data['textEmbeddings']['detailedDescription'],
            'attractiveTraits': embeddings_data['textEmbeddings']['attractiveTraits']
        }
    }

def calculate_max_possible_score(matchmaker: MatchMaker) -> float:
    """Calculate the maximum possible score based on weights"""
    return 300
    return sum(matchmaker.weights.values())

def generate_matches():
    # Load environment variables
    load_dotenv()
    
    # Connect to MongoDB
    client = MongoClient(os.getenv('MONGODB_URI'))
    db = client['robocupido']
    
    print(f"Available databases: {client.list_database_names()}")
    print(f"Available collections: {db.list_collection_names()}")
    
    # Get collections
    profiles_collection = db.profiles
    preferences_collection = db.preferences
    embeddings_collection = db.text_embeddings
    
    # First get all profiles with complete data
    complete_profiles = list(profiles_collection.find({
        "age": {"$exists": True},
        "gender": {"$exists": True}
    }))
    
    print(f"Number of complete profiles: {len(complete_profiles)}")
    
    # Get preferences for these profiles
    complete_users = []
    for profile in complete_profiles:  # Limit to 20 profiles
        preferences = preferences_collection.find_one({"profileId": profile["_id"]})
        embeddings = embeddings_collection.find_one({"profileId": profile["_id"]})
        #print(f'embeddings: {embeddings}')
        #user_data = prepare_user_data(profile, preferences, embeddings)
        #complete_users.append(user_data)
        if preferences:
            try:
                user_data = prepare_user_data(profile, preferences, embeddings)
                complete_users.append(user_data)
            except KeyError as e:
                print(f"Missing required field for profile {profile['_id']}: {e}")
                continue
        
    
    print(f"Number of users with complete data: {len(complete_users)}")
    
    if not complete_users:
        print("No complete user data found!")
        return []
    
    # Initialize MatchMaker
    matchmaker = MatchMaker()
    max_score = calculate_max_possible_score(matchmaker)
    print(f"Max possible score: {max_score}")
    
    # Process each user
    matches_collection = []
    
    for current_user_data in complete_users:
        current_user = User(current_user_data)
        
        # Initialize match categories
        matches = {
            "profileId": current_user_data["profileId"],
            "pareja": [],
            "casual": [],
            "amigos": []
        }
        
        # Find matches with other users
        for potential_match_data in complete_users:
            # Skip self-matching
            if current_user_data["profileId"] == potential_match_data["profileId"]:
                continue
                
            potential_match = User(potential_match_data)
            
            # Calculate match score
            score = matchmaker.calculate_match_score(current_user, potential_match)
            
            if score > 0:
                # Convert score to percentage
                score_percentage = int((score / max_score) * 100)
                
                # Add to appropriate category based on lookingFor
                match_type = potential_match_data["lookingFor"]
                if match_type in matches:
                    matches[match_type].append({
                        "id": potential_match_data["profileId"],
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
        
        # Format matches for MongoDB
        mongodb_matches = {
            "profileId": {"$oid": current_user_data["profileId"]},
            "pareja": None,
            "casual": None,
            "amigos": None
        }
        
        # Convert matches to MongoDB format
        for category in ["pareja", "casual", "amigos"]:
            if matches[category]:
                mongodb_matches[category] = [
                    {
                        "id": {"$oid": match["id"]},
                        "score": {"$numberInt": str(match["score"])}
                    }
                    for match in matches[category]
                ]
        
        matches_collection.append(mongodb_matches)
        
        # Debug print
        print(f"\nMatches for user {current_user_data['profileId']}:")
        print(f"Gender: {current_user_data['gender']}")
        print(f"Looking for: {current_user_data['matchPreferences']}")
        for category in ["pareja", "casual", "amigos"]:
            if matches[category]:
                print(f"\n{category.upper()} matches:")
                for match in matches[category]:
                    match_data = next(u for u in complete_users if u["profileId"] == match["id"])
                    print(f"Match ID: {match['id']}")
                    print(f"Gender: {match_data['gender']}")
                    print(f"Compatibility: {match['score']}%")
    
    # Store matches in MongoDB
    try:
        matches_collection_db = db.matches
        # Clear existing matches
        matches_collection_db.delete_many({})
        # Insert new matches
        if matches_collection:
            matches_collection_db.insert_many(matches_collection)
            print(f"\nSuccessfully stored {len(matches_collection)} match documents in MongoDB")
    except Exception as e:
        print(f"Error storing matches in MongoDB: {e}")
    
    return matches_collection

if __name__ == "__main__":
    matches = generate_matches()
    
    # Example of how the data would be stored in MongoDB
    if matches:
        print("\nExample MongoDB document structure:")
        pprint.pprint(matches[0])
    else:
        print("\nNo matches generated!")