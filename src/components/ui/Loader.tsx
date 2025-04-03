import React from 'react'

function Loader({size=40}:{
    size?:number
}) {
  return (
    <div style={{
        width: `${size}px`
    }} className="loader"></div>
  )
}

export default Loader