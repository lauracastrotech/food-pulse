import { useContext, useEffect, useState } from 'react'
import "../styles/Profile.css"

import profileInfoContext from '../context/profileInfo';
import LogOutButton from './profile/LogOutButton';
import EditProfileButton from './profile/EditProfileButton';
import NutrientsForms from './profile/NutrientsForms';
import ProfilePicture from './profile/ProfilePicture';
import EditProfileModal from './profile/EditProfileModal';

export default function Profile() {

    const { profileInfo } = useContext(profileInfoContext);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (profileInfo?.id && !profileInfo.age && !profileInfo.height && !profileInfo.weight) {
            setIsEditing(true);
        }
    }, [profileInfo?.id]);

    return (
        <div id="profile">

            {profileInfo && (
                <>
                    <div id="profileHeader">
                        <ProfilePicture />
                        <div id="profileMeta">
                            <h1>{profileInfo.username}</h1>

                            {(profileInfo.age || profileInfo.height || profileInfo.weight) && (
                                <div id="profileStats">
                                    {profileInfo.age && <span><strong>Age</strong> {profileInfo.age} yrs</span>}
                                    {profileInfo.height && <span><strong>Height</strong> {profileInfo.height} cm</span>}
                                    {profileInfo.weight && <span><strong>Weight</strong> {profileInfo.weight} kg</span>}
                                </div>
                            )}

                            <div id="profileActions">
                                <LogOutButton />
                                <EditProfileButton onEdit={() => setIsEditing(true)} />
                            </div>
                        </div>
                    </div>

                    <div id="nutrientsSection">
                        <NutrientsForms />
                    </div>

                    {isEditing && <EditProfileModal onClose={() => setIsEditing(false)} />}
                </>
            )}

        </div>
    )
}
