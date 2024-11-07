import React from 'react'
import "./GenderCheckbox.css"

const GenderCheckBox = ({onCheckboxChange, selectedGender}) => {
  return (
    <div className='gender-container' style={{display: "flex", gap: "20px"}}>
        <div className='gender-element'>
            <label className={`${selectedGender === 'male' ? "selected" : ""}`}>
                <span className=''>Male</span>
                <input
                    type='checkbox'
                    className='checkbox border-slate-900'
                    checked={selectedGender === 'male'}
                    onChange={(e) => onCheckboxChange('male')}
                />
            </label>
        </div>
        <div className=''>
            <label className={` ${selectedGender === 'female' ? "selected" : ""}`}>
                <span className=''>Female</span>
                <input
                    type='checkbox'
                    className=''
                    checked = {selectedGender === 'female'}
                    onChange={() => onCheckboxChange('female')}
                />
            </label>
        </div>
    </div>
  )
}

export default GenderCheckBox