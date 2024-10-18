import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIpicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';


const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generateImg, setGenerateImg] = useState(false);
  const [activeEditorTab, setactiveEditorTab] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishSHirt: false
  });




  // show tab content depending on active tab

  const generateTabContent = (tab) => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />;
      case 'filepicker':
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case 'aipicker':
        return <AIpicker prompt={prompt} setPrompt={setPrompt} generatingImg={generateImg} handleSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt) return alert('Please enter a prompt');
  
    try {
      setGenerateImg(true);  // Start generating image
  
      const response = await fetch('https://node-backend-server.vercel.app/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && errorData.error?.type === 'invalid_request_error') {
          alert('Your request was rejected due to content policy violation. Please modify your prompt and try again.');
          return;
        }
        throw new Error(`Failed to generate image: ${response.statusText}`);
      }
  
      const data = await response.json();
      handleDecals(type, `data:image/png;base64,${data.photo}`);
  
    } catch (error) {
      console.error('Error generating image:', error);
      alert(error);
    } finally {
      setGenerateImg(false);  // End generating image
      setactiveEditorTab("");  // Optionally close the editor tab
    }
  };
  

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break; // Added break
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];    
        break; // Added break
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
    }
  
    setActiveFilterTab((prev) => ({
      ...prev,
      [tabName]: !prev[tabName],
    }));
  };

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setactiveEditorTab("");
      })
  }


  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div key="custom" className='absolute top-0 left-0 z-10' {...slideAnimation("left")}>
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab, i) => (
                  <Tab key={i} tab={tab} handleClick={() => setactiveEditorTab(tab.name)} />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div className='absolute z-10 top-5 right-5' {...slideAnimation('right')}>
            <CustomButton type="filled" title="Go Back" handleClick={() => state.intro = true} customStyles="w-fit px-4 py-2.5 font-bold text-sm" />
          </motion.div>
          <motion.div className='filtertabs-container' {...slideAnimation('up')}>
            {FilterTabs.map((tab, i) => (
              <Tab key={i} tab={tab} isFilterTab isActiveTab={activeFilterTab[tab.name]} handleClick={() => handleActiveFilterTab(tab.name)} />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer