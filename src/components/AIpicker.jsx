import React from 'react'
import CustomButton from './CustomButton'

const AIpicker = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
  return (
    <div className='aipicker-container'>
      <textarea
        placeholder='Dear Users,

I want to inform you that I have temporarily disabled the AI feature on this project. Due to an overwhelming number of requests, the associated costs became significantly high.

Best regards,
Giorgi Lomaia'
        className='aipicker-textarea'
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      {/* <div className="flex flex-wrap gap-3">
        {
          generatingImg ? (
            <CustomButton type={'outline'} title={'Asking AI...'} customStyles='text-xs'  />
          ) :
            (
              <>
                <CustomButton type={'outline'} title={'AI LOGO'} customStyles='text-xs' handleClick={() => handleSubmit('logo')} />
                <CustomButton type={'filled'} title={'AI FULL'} customStyles='text-xs' handleClick={() => handleSubmit('full')} />
              </>
          )
        }
       </div> */}
    </div>
  )
}

export default AIpicker