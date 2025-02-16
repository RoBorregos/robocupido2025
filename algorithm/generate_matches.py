"""File to generate matches from MongoDB user data and inject them back into the database."""
import os
from typing import Dict, Any
from pymongo import MongoClient
from matching import User, MatchMaker
from dotenv import load_dotenv
from bson import ObjectId

def prepare_user_data(profile_data: Dict[str, Any], preferences_data: Dict[str, Any],
                        embeddings_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transform MongoDB data into the format expected by the User class"""
    return {
        'profileId': str(profile_data['_id']),
        'age': profile_data['age'],
        'gender': profile_data['gender'],
        'matchPreferences': preferences_data['matchPreferences'],
        'lookingFor': preferences_data['lookingFor'] if preferences_data['lookingFor'] else 'casual',
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
        'selfDescription': embeddings_data['textEmbeddings']['detailedDescription'],
        'attractedTo': embeddings_data['textEmbeddings']['attractiveTraits']
    }

def calculate_max_possible_score(matchmaker: MatchMaker) -> float:
    """Calculate the maximum possible score based on weights"""
    return sum(matchmaker.weights.values())

def generate_matches():
    """Generate matches for all users with complete data and store them in MongoDB"""
    load_dotenv()

    # Connect to MongoDB
    client = MongoClient(os.getenv('MONGODB_URI'))
    db = client['robocupido']
    profiles_collection = db.profiles
    preferences_collection = db.preferences
    embeddings_collection = db.text_embeddings

    # First get all profiles with complete data
    complete_profiles = list(profiles_collection.find({
        "age": {"$exists": True},
        "gender": {"$exists": True}
    }))   
    print(f"Number of complete profiles: {len(complete_profiles)}")

    # Get all required preferences for these profiles
    complete_users = []
    for profile in complete_profiles:
        preferences = preferences_collection.find_one({"profileId": profile["_id"]})
        embeddings = embeddings_collection.find_one({"profileId": profile["_id"]})
        if preferences:
            try:
                user_data = prepare_user_data(profile, preferences, embeddings)
                complete_users.append(user_data)
            except KeyError as e:
                print(f"Missing required field for profile {profile['_id']}: {e}")
                continue

    if not complete_users:
        print("No complete user data found!")
        return []

    # Initialize MatchMaker
    matchmaker = MatchMaker()
    max_score = calculate_max_possible_score(matchmaker)
    print(f"Max possible score: {max_score}")

    # Process each user
    matches_collection = []
    max_actual_score = 0
    percentage_statistics = []

    for current_user_data in complete_users:
        current_user = User(current_user_data)

        # Initialize match categories
        matches = []
        match_type = current_user_data["lookingFor"]

        # Find matches with other users
        for potential_match_data in complete_users:
            if current_user_data["profileId"] == potential_match_data["profileId"]:
                continue
                
            potential_match = User(potential_match_data)
            score = matchmaker.calculate_match_score(current_user, potential_match)
            
            if score > 0:
                # Convert score to percentage
                max_actual_score = max(max_actual_score, score)
                score_percentage = int((score / max_score) * 100) * 1.08
                score_percentage = max(50, min(100, score_percentage))

                matches.append({
                    "id": potential_match_data["profileId"],
                    "score": score_percentage
                })

        # Sort matches by score
        matches = sorted(
            matches,
            key=lambda x: x["score"],
            reverse=True
        )[:4]

        # Format matches for MongoDB
        mongodb_matches = {
            "profileId": ObjectId(current_user_data["profileId"]),
            "pareja": None,
            "casual": None,
            "amistad": None
        }
        # Convert matches to MongoDB format
        mongodb_matches[match_type] = [
            {
                "id": ObjectId(match["id"]),
                "score": int(match["score"])
            }
            for match in matches[match_type]
        ]
        matches_collection.append(mongodb_matches)

    # Store matches in MongoDB
    try:
        matches_collection_db = db.matches
        matches_collection_db.delete_many({})
        if matches_collection:
            matches_collection_db.insert_many(matches_collection)
            print(f"\nSuccessfully stored {len(matches_collection)} match documents in MongoDB")
    except Exception as e:
        print(f"Error storing matches in MongoDB: {e}")

    if percentage_statistics:
        avg_score = sum(percentage_statistics) / len(percentage_statistics)
        print(f"Average match score: {avg_score}")
        median_score = sorted(percentage_statistics)[len(percentage_statistics) // 2]
        print(f"Median match score: {median_score}")
        lowest_score = min(percentage_statistics)
        print(f"Lowest match score: {lowest_score}")
        interquartile_range = percentage_statistics[int(0.75*len(percentage_statistics))] - percentage_statistics[int(0.25*len(percentage_statistics))]
        print(f"Interquartile range: {interquartile_range}")
        highest_score = max(percentage_statistics)
        print(f"Highest match score: {highest_score}")
    return matches_collection

if __name__ == "__main__":
    generate_matches()

