import React, { useContext, useState } from 'react'
import axios from 'axios'
import profileInfoContext from '../../context/profileInfo'
import '../../styles/EditProfileModal.css'

export default function EditProfileModal({ onClose }) {
  const { profileInfo, setProfileInfo } = useContext(profileInfoContext)

  const [form, setForm] = useState({
    age: profileInfo.age || '',
    height: profileInfo.height || '',
    weight: profileInfo.weight || '',
    profilePicture: profileInfo.profilePicture || null,
  })
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.put(`/api/profiles/${profileInfo.id}/info`, {
        age: form.age ? Number(form.age) : null,
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        profile_picture: form.profilePicture,
      })
      setProfileInfo(prev => ({
        ...prev,
        age: form.age ? Number(form.age) : null,
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        profilePicture: form.profilePicture,
      }))
      onClose()
    } catch (err) {
      console.error("Error saving profile:", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div id='editProfileBackdrop' onClick={onClose}>
      <div id='editProfileModal' onClick={e => e.stopPropagation()}>

        <h2>Edit Profile</h2>

        <div id='editProfilePicture'>
          <img src={profileInfo.profilePicture || '/avatar-default.jpg'} alt='Profile preview' />
          <span>Photo upload — coming soon</span>
        </div>

        <form onSubmit={handleSave} id='editProfileForm'>
          <label>
            Age
            <input
              type='number'
              name='age'
              value={form.age}
              onChange={handleChange}
              placeholder='e.g. 28'
              min='1'
              max='120'
            />
          </label>

          <label>
            Height (cm)
            <input
              type='number'
              name='height'
              value={form.height}
              onChange={handleChange}
              placeholder='e.g. 165'
              min='50'
              max='300'
            />
          </label>

          <label>
            Weight (kg)
            <input
              type='number'
              name='weight'
              value={form.weight}
              onChange={handleChange}
              placeholder='e.g. 65'
              min='20'
              max='500'
            />
          </label>

          <div id='editProfileActions'>
            <button type='button' className='textButton' onClick={onClose}>
              Cancel
            </button>
            <button type='submit' className='importantTextButton' disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
