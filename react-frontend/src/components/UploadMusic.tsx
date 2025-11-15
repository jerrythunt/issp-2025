import React, { useState } from 'react';
import { storage, firestore, auth } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const UploadMusic: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const f = e.target.files && e.target.files[0];
    if (!f) return setFile(null);
    if (!f.name.toLowerCase().endsWith('.mp3') && f.type !== 'audio/mpeg') {
      setError('Only .mp3 files are allowed');
      return setFile(null);
    }
    if (f.size > MAX_FILE_SIZE) {
      setError('File is too large (max 50 MB)');
      return setFile(null);
    }
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      const user = auth.currentUser;
      const uid = user ? user.uid : 'anonymous';
      const filename = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `music/${uid}/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, file, { contentType: file.type });

      uploadTask.on('state_changed', (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(prog));
      }, (err) => {
        setError((err as Error).message);
      }, async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(firestore, 'tracks'), {
            title: title || file.name,
            artist: artist || null,
            storagePath: uploadTask.snapshot.ref.fullPath,
            downloadURL,
            uploadedBy: uid,
            size: file.size,
            contentType: file.type,
            createdAt: serverTimestamp(),
          });
          setSuccess('Upload completed successfully');
          setFile(null);
          setTitle('');
          setArtist('');
          setProgress(null);
        } catch (dbErr) {
          setError((dbErr as Error).message);
        }
      });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="upload-music" style={{border: '1px solid #ddd', padding: 12, borderRadius: 6, marginBottom: 20}}>
      <h3>Upload MP3</h3>
      <form onSubmit={handleUpload}>
        <div style={{marginBottom:8}}>
          <label style={{display:'block', fontSize:12}}>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%'}} />
        </div>
        <div style={{marginBottom:8}}>
          <label style={{display:'block', fontSize:12}}>Artist (optional)</label>
          <input value={artist} onChange={e=>setArtist(e.target.value)} style={{width:'100%'}} />
        </div>
        <div style={{marginBottom:8}}>
          <input type="file" accept="audio/mp3,audio/mpeg" onChange={handleFileChange} />
        </div>
        {progress !== null && (
          <div style={{marginBottom:8}}>
            <div style={{height:8, background:'#eee', borderRadius:4}}>
              <div style={{width:`${progress}%`, height:8, background:'#4caf50', borderRadius:4}} />
            </div>
            <small>{progress}%</small>
          </div>
        )}
        {error && <div style={{color:'red', marginBottom:8}}>{error}</div>}
        {success && <div style={{color:'green', marginBottom:8}}>{success}</div>}
        <button type="submit" disabled={!file} style={{padding:'8px 12px'}}>Upload</button>
      </form>
    </div>
  );
};

export default UploadMusic;
