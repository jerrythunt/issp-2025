from flask import Blueprint, jsonify, request
from config import db
<<<<<<< HEAD

bp = Blueprint('music', __name__)

=======
from datetime import datetime

bp = Blueprint('music', __name__)

# Get user profile
@bp.route('/user/<uid>', methods=['GET'])
def get_user_profile(uid):
    try:
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            return jsonify(user_doc.to_dict()), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update user profile
@bp.route('/user/<uid>', methods=['PUT'])
def update_user_profile(uid):
    try:
        data = request.json
        user_ref = db.collection('users').document(uid)
        user_ref.update(data)
        return jsonify({'message': 'User profile updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get user playlists
@bp.route('/user/<uid>/playlists', methods=['GET'])
def get_user_playlists(uid):
    try:
        playlists_ref = db.collection('users').document(uid).collection('playlists')
        playlists = []
        
        for doc in playlists_ref.stream():
            playlist = doc.to_dict()
            playlist['id'] = doc.id
            playlists.append(playlist)
        
        return jsonify(playlists), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get specific playlist
@bp.route('/user/<uid>/playlists/<playlist_name>', methods=['GET'])
def get_playlist(uid, playlist_name):
    try:
        playlists_ref = db.collection('users').document(uid).collection('playlists')
        
        # Query by name
        query = playlists_ref.where('name', '==', playlist_name).limit(1)
        results = list(query.stream())
        
        if results:
            playlist = results[0].to_dict()
            playlist['id'] = results[0].id
            return jsonify(playlist), 200
        else:
            return jsonify({'error': 'Playlist not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Create playlist
@bp.route('/user/<uid>/playlists', methods=['POST'])
def create_playlist(uid):
    try:
        data = request.json
        playlists_ref = db.collection('users').document(uid).collection('playlists')
        
        playlist_data = {
            'name': data.get('name'),
            'songs': data.get('songs', []),
            'createdAt': datetime.now()
        }
        
        doc_ref = playlists_ref.add(playlist_data)
        return jsonify({'id': doc_ref[1].id, 'message': 'Playlist created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete playlist
@bp.route('/user/<uid>/playlists/<playlist_id>', methods=['DELETE'])
def delete_playlist(uid, playlist_id):
    try:
        playlist_ref = db.collection('users').document(uid).collection('playlists').document(playlist_id)
        playlist_ref.delete()
        return jsonify({'message': 'Playlist deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update playlist (add/remove songs)
@bp.route('/user/<uid>/playlists/<playlist_id>', methods=['PUT'])
def update_playlist(uid, playlist_id):
    try:
        data = request.json
        playlist_ref = db.collection('users').document(uid).collection('playlists').document(playlist_id)
        playlist_ref.update(data)
        return jsonify({'message': 'Playlist updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

>>>>>>> feature/frontend-dashboard
@bp.route('/', methods=['GET'])
def get_songs():
    pass

<<<<<<< HEAD
@bp.route('/playlist', methods=['POST'])
def create_playlist():
    pass

@bp.route('/playlist/<id>', methods=['DELETE'])
def delete_playlist(id):
    pass

=======
>>>>>>> feature/frontend-dashboard
@bp.route('/', methods=['POST'])
def create_or_update_song():
    pass