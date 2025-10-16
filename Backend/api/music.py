from flask import Blueprint, jsonify, request
from config import db

bp = Blueprint('music', __name__)

@bp.route('/', methods=['GET'])
def get_songs():
    pass

@bp.route('/playlist', methods=['POST'])
def create_playlist():
    pass

@bp.route('/playlist/<id>', methods=['DELETE'])
def delete_playlist(id):
    pass

@bp.route('/', methods=['POST'])
def create_or_update_song():
    pass