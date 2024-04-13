import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import NotFound from "../pages/NotFound.jsx";
import Dashboard from "../pages/KrishnaDen/Dashboard.jsx";

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree/>}>
      <ComponentPreview path="/NotFound">
        <NotFound/>
      </ComponentPreview>
      <ComponentPreview path="/Dashboard">
        <Dashboard/>
      </ComponentPreview>
    </Previews>
  )
}

export default ComponentPreviews