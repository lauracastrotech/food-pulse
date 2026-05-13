import React, { useContext } from 'react'
import profileInfoContext from '../../context/profileInfo'

export default function ProfilePicture() {
  const { profileInfo } = useContext(profileInfoContext);

  return (
    <div id='profileImage'>
      <img
        src={profileInfo.profilePicture || '/avatar-default.jpg'}
        alt='Profile picture'
      />
    </div>
  )
}
