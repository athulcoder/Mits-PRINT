import React from 'react'

const FIleCard = ({item, update, removeFile, index}) => {
  return (
   <div
     
          className=" rounded-lg p-4 space-y-3 bg-white  min-w-[90%] h-[300px]"
        >
          <div className="font-medium truncate">
            {item.file.name}
          </div>

          <div className="flex flex-wrap gap-4 text-sm">

            {/* Copies */}
            <div className="flex items-center gap-2">
              <span>Copies</span>
                 <select className="h-8 px-2 text-sm border rounded-md" onChange= { e=> update(index, "copies",e.target.value)}>
    {[1,2,3,4,5,6,7,8,9,10].map(n => (
      <option key={n} value={n}> {n}</option>
    ))}
  </select>
            </div>

            {/* Color */}
            <label className="flex items-center gap-1">
                Color mode
              <select
              className="h-8 px-2 text-sm border rounded-md"
                onChange={e =>
                  update(index, "color", e.target.checked)
                }
              >
                <option>B&W</option>
                <option>Color</option>
              </select>
            
            </label>

            {/* Double Side */}
            <label className="flex items-center gap-1">
              <input
                className='h-5 w-6'
                type="checkbox"
                checked={item.doubleSide}
                onChange={e =>
                  update(index, "doubleSide", e.target.checked)
                }
              />
              Both sides
            </label>

          </div>

          <button
            onClick={() => removeFile(index)}
            className="text-red-500 text-xs"
          >
            Remove
          </button>
        </div>
  )
}

export default FIleCard