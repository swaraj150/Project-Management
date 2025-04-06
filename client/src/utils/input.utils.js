export const setInputType = ({ e, newType }) => {
  e.target.type = newType
  if (newType === 'date') e.target.showPicker()
}