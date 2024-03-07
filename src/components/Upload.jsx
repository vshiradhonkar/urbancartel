import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import "../components/Styles/HeroGoGreen.css";

function Upload() {
    const [image, setImage] = useState(null);
    const auth = getAuth();
    const [uploadMessage, setUploadMessage] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const selectedImage = e.target.files[0];

            // Check if the image size and format are acceptable
            if (selectedImage.size <= 500 * 1024 && (selectedImage.type === 'image/jpeg' || selectedImage.type === 'image/png')) {
                setImage(selectedImage);
                setUploadMessage('');
                setSelectedFileName(selectedImage.name);
            } else {
                setUploadMessage('Please upload an image in JPG or PNG format and below 500KB.');
            }
        }
    };

    const handleImageUpload = async () => {
        if (image) {
            try {
                const storage = getStorage();
                const storageRef = ref(storage, `images/${image.name}`);
                await uploadBytes(storageRef, image);
    
                const downloadUrl = await getDownloadURL(storageRef);
    
                const user = auth.currentUser;
                if (user) {
                    const { uid, email, displayName } = user; // Get user information
                    const db = getFirestore();
                    const imagesCollectionRef = collection(db, 'gogreen'); // Update collection name
    
                    await addDoc(imagesCollectionRef, {
                        userId: uid,
                        userEmail: email,
                        userName: displayName, // Add username
                        imageUrl: downloadUrl,
                        timestamp: serverTimestamp(),
                    });
    
                    setImage(null);
                    setUploadMessage('Image uploaded successfully!');
                }
            } catch (error) {
                console.error('Error uploading image and storing user details:', error);
                setUploadMessage('Error uploading image. Please try again.');
            }
        } else {
            console.warn('No image selected.');
        }
    };

    return (
        <div className='upload-component'>
            <p className="upload-label">Please upload images of fashion products (shoes, clothing, etc.) in good condition.</p>
            <div className="upload-container">
                <label htmlFor="imageInput" className="custom-file-label">
                    <span className="custom-file-text">{selectedFileName || 'Choose File'}</span>
                    <input
                        type="file"
                        id="imageInput"
                        accept="image/jpeg, image/png"
                        className="custom-file-input"
                        onChange={handleImageChange}
                    />
                </label>
                <br/>
                <button type="button" className="upload-button" onClick={handleImageUpload}>
                    Upload
                </button>
            </div>
            <p>{uploadMessage}</p>
            <p>On uploading your image, our executive will look into your product and contact you soon.</p>
        </div>
    );
}

export default Upload;