from config import db

#Add patient named Heathcliff
patient_data = {
    "preferences": {"genre": "classical"},
    "details": {"name": "Heathcliff", "dob": "1764-05-26"}
}
db.collection("patients").document("heathcliff").set(patient_data)
print("Patient Heathcliff added!")

#Add a song library
song_data = {
    "title": "Wuthering Heights",
    "artist": "Kate Bush",
    "album": "The Kick Inside",
    "genre": "art pop",
    "description": "A classic song inspired by the novel."
}
db.collection("music_library").document("wuthering_heights").set(song_data)
print("Song Wuthering Heights added!")

#Add play history with mood timecodes
play_history_data = {
    "songId": "wuthering_heights",
    "played_at": "2025-10-28T10:00:00Z",
    "mood_timecodes": [
        {"second": 0, "mood": "melancholic"},
        {"second": 41, "mood": "nostalgic"},
        {"second": 67, "mood": "happy"}
    ]
}
db.collection("patients").document("heathcliff").collection("play_history").document("test_history").set(play_history_data)
print("Play history with mood added!")


#Check if data was added correctly
doc = db.collection("patients").document("heathcliff").get()
if doc.exists:
    print("Patient data:", doc.to_dict())
else:
    print("No such patient!")


song_doc = db.collection("music_library").document("wuthering_heights").get()
if song_doc.exists:
    print("Song data:", song_doc.to_dict())
else:
    print("No such song!")


history_doc = db.collection("patients").document("heathcliff").collection("play_history").document("test_history").get()
if history_doc.exists:
    print("Play history data:", history_doc.to_dict())
else:
    print("No such play history!")