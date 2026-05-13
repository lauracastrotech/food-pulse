import React from 'react'

export default function EditProfileButton({ onEdit }) {
  return (
    <button
      className='importantTextButton'
      onClick={onEdit}
    >
      Edit profile
    </button>
  )
}
